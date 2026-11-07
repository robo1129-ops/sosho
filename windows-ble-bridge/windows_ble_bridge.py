"""SO-SHO Windows BLE GATT bridge.

The public editor cannot rely on Web Bluetooth BLE editing on Windows.  This
small localhost service owns the Windows BLE GATT connection and exposes only
the framed ZMK Studio byte stream to the browser over a loopback WebSocket.
"""

from __future__ import annotations

import argparse
import asyncio
import base64
import json
import logging
import os
import re
import subprocess
from typing import Any

from bleak import BleakClient, BleakScanner
import websockets


SERVICE_UUID = "00000000-0196-6107-c967-c5cfb1c2482a"
CHARACTERISTIC_UUID = "00000001-0196-6107-c967-c5cfb1c2482a"
WRITE_CHUNK_SIZE = 20
DEFAULT_PREFIXES = ("sosho", "soho", "SO-SHO", "SOHO", "ZMK")
ALLOWED_ORIGINS = {
    "https://robo1129-ops.github.io",
    "http://localhost",
    "http://127.0.0.1",
    None,
}


class Bridge:
    def __init__(self, websocket: Any, prefixes: tuple[str, ...]) -> None:
        self.websocket = websocket
        self.prefixes = prefixes
        self.client: BleakClient | None = None
        self.characteristic: Any = None
        self.device_name = ""

    async def send(self, payload: dict[str, Any]) -> None:
        await self.websocket.send(json.dumps(payload, ensure_ascii=False))

    async def status(self, message: str, **extra: Any) -> None:
        await self.send({"type": "status", "message": message, **extra})

    async def paired_devices(self) -> list[dict[str, Any]]:
        """Return paired Windows BLE devices even when HID suppresses adverts."""
        if os.name != "nt":
            return []
        script = (
            "Get-PnpDevice -PresentOnly -Class Bluetooth | "
            "Where-Object { $_.FriendlyName -and $_.InstanceId -match 'BTHLE\\\\DEV_' } | "
            "Select-Object FriendlyName,InstanceId | ConvertTo-Json -Compress"
        )
        try:
            result = await asyncio.to_thread(
                subprocess.run,
                ["powershell.exe", "-NoProfile", "-NonInteractive", "-Command", script],
                capture_output=True,
                text=True,
                timeout=15,
                check=False,
            )
            payload = json.loads(result.stdout or "[]")
        except Exception:
            return []
        if isinstance(payload, dict):
            payload = [payload]
        devices: list[dict[str, Any]] = []
        for item in payload if isinstance(payload, list) else []:
            name = str(item.get("FriendlyName") or "")
            match = re.search(r"DEV_([0-9A-F]{12})", str(item.get("InstanceId") or ""), re.IGNORECASE)
            if not match or not any(name.lower().startswith(prefix.lower()) for prefix in self.prefixes):
                continue
            raw = match.group(1).upper()
            address = ":".join(raw[index : index + 2] for index in range(0, 12, 2))
            devices.append(
                {
                    "id": address,
                    "name": name,
                    "rssi": None,
                    "matchesPrefix": True,
                    "serviceUuids": [SERVICE_UUID],
                    "matchesOfficialService": True,
                    "paired": True,
                    "advertising": False,
                }
            )
        return devices

    async def scan(self) -> list[dict[str, Any]]:
        await self.status("Windows BLEデバイスを検索中…")
        try:
            discovered = await BleakScanner.discover(timeout=8.0, return_adv=True)
        except TypeError:
            discovered = {
                device.address: (device, None)
                for device in await BleakScanner.discover(timeout=8.0)
            }
        devices: list[dict[str, Any]] = []
        for address, value in discovered.items():
            device, advertisement = value if isinstance(value, tuple) else (value, None)
            name = getattr(device, "name", None) or getattr(advertisement, "local_name", None) or ""
            if not name:
                continue
            devices.append(
                {
                    "id": getattr(device, "address", None) or address,
                    "name": name,
                    "rssi": getattr(advertisement, "rssi", None),
                    "matchesPrefix": any(name.startswith(prefix) for prefix in self.prefixes),
                    "serviceUuids": [str(uuid).lower() for uuid in (getattr(advertisement, "service_uuids", None) or [])],
                    "matchesOfficialService": SERVICE_UUID in [str(uuid).lower() for uuid in (getattr(advertisement, "service_uuids", None) or [])],
                    "paired": False,
                    "advertising": True,
                }
            )
        known_ids = {str(item["id"]).upper() for item in devices}
        for item in await self.paired_devices():
            if str(item["id"]).upper() not in known_ids:
                devices.append(item)
        return devices

    @staticmethod
    def make_client(device_id: str) -> BleakClient:
        client = BleakClient(device_id)
        # Bleak's Windows backend normally insists on a fresh advertisement.
        # For a paired HID keyboard Windows can suppress that advertisement,
        # while WinRT can still resolve the paired address directly.
        if os.name == "nt" and re.fullmatch(r"[0-9A-Fa-f:]{17}", device_id):
            try:
                client._backend._device_info = int(device_id.replace(":", ""), 16)  # type: ignore[attr-defined]
            except Exception:
                pass
        return client

    async def connect(self, device_id: str | None = None, name_prefix: str | None = None) -> None:
        devices = await self.scan()
        prefix = name_prefix or ""
        candidates = [
            item for item in devices
            if (not device_id or item["id"] == device_id)
            and (not prefix or item["name"].lower().startswith(prefix.lower()))
        ]
        if not device_id:
            preferred = [item for item in candidates if item["matchesPrefix"]]
            if preferred:
                candidates = preferred
        if not candidates:
            await self.send({"type": "error", "code": "not_found", "message": "SO-SHOのBLE広告が見つかりません。WindowsのBluetooth接続を一時的に切断し、キーボードを広告状態にしてください。", "devices": devices})
            return
        if len(candidates) > 1 and not device_id:
            candidates.sort(
                key=lambda item: (
                    bool(item.get("matchesOfficialService")),
                    bool(item.get("matchesPrefix")),
                    item.get("rssi") if isinstance(item.get("rssi"), int) else -999,
                ),
                reverse=True,
            )
            await self.status(f"複数候補から公式ZMK Studioサービスを優先: {candidates[0]['name']}")

        selected = candidates[0]
        await self.status(f"{selected['name']}へGATT接続中…")
        self.client = self.make_client(selected["id"])
        try:
            await self.client.connect()
            service = self.client.services.get_service(SERVICE_UUID)
            if service is None:
                raise RuntimeError("公式ZMK Studio Serviceが見つかりません")
            self.characteristic = service.get_characteristic(CHARACTERISTIC_UUID)
            if self.characteristic is None:
                raise RuntimeError("公式ZMK Studio Characteristicが見つかりません")

            def on_notification(_: Any, data: bytearray) -> None:
                asyncio.create_task(
                    self.send(
                        {
                            "type": "frame",
                            "data": base64.b64encode(bytes(data)).decode("ascii"),
                        }
                    )
                )

            await self.client.start_notify(self.characteristic, on_notification)
            self.device_name = selected["name"]
            await self.send({"type": "connected", "name": self.device_name, "service": SERVICE_UUID, "characteristic": CHARACTERISTIC_UUID})
            await self.status("Windows BLE接続済み（公式ZMK Studio GATT / RPC準備完了）")
        except Exception:
            await self.disconnect()
            raise

    async def write(self, encoded: str) -> None:
        if not self.client or not self.client.is_connected or not self.characteristic:
            raise RuntimeError("Windows BLEブリッジが接続されていません")
        data = base64.b64decode(encoded)
        properties = set(getattr(self.characteristic, "properties", []))
        response = "write" in properties and "write-without-response" not in properties
        for offset in range(0, len(data), WRITE_CHUNK_SIZE):
            await self.client.write_gatt_char(
                self.characteristic,
                data[offset : offset + WRITE_CHUNK_SIZE],
                response=response,
            )
            await asyncio.sleep(0.004)

    async def disconnect(self) -> None:
        if self.client:
            try:
                if self.characteristic:
                    await self.client.stop_notify(self.characteristic)
            except Exception:
                pass
            try:
                await self.client.disconnect()
            except Exception:
                pass
        self.client = None
        self.characteristic = None
        self.device_name = ""


async def handler(websocket: Any) -> None:
    origin = websocket.request.headers.get("Origin") if getattr(websocket, "request", None) else None
    if origin and not any(origin.startswith(allowed) for allowed in ALLOWED_ORIGINS if allowed):
        await websocket.close(code=1008, reason="origin not allowed")
        return
    bridge = Bridge(websocket, DEFAULT_PREFIXES)
    logging.info("browser connected: %s", origin or "no-origin")
    try:
        async for raw in websocket:
            request = json.loads(raw)
            operation = request.get("op")
            if operation == "ping":
                await bridge.send({"type": "pong"})
            elif operation == "connect":
                try:
                    await bridge.connect(request.get("deviceId"), request.get("namePrefix"))
                except Exception as error:
                    logging.exception("BLE connect failed")
                    await bridge.send({"type": "error", "code": "connect_failed", "message": str(error)})
            elif operation == "select":
                try:
                    await bridge.connect(request.get("deviceId"))
                except Exception as error:
                    logging.exception("BLE select failed")
                    await bridge.send({"type": "error", "code": "connect_failed", "message": str(error)})
            elif operation == "write":
                try:
                    await bridge.write(request["data"])
                except Exception as error:
                    await bridge.send({"type": "error", "code": "write_failed", "message": str(error)})
            elif operation == "disconnect":
                await bridge.disconnect()
                await bridge.send({"type": "disconnected"})
            elif operation == "scan":
                await bridge.send({"type": "devices", "devices": await bridge.scan()})
            else:
                await bridge.send({"type": "error", "code": "unknown_operation", "message": f"unknown operation: {operation}"})
    finally:
        await bridge.disconnect()
        logging.info("browser disconnected")


async def main(host: str, port: int) -> None:
    logging.basicConfig(level=logging.INFO, format="%(asctime)s %(levelname)s %(message)s")
    logging.info("SO-SHO Windows BLE bridge listening on ws://%s:%s", host, port)
    async with websockets.serve(handler, host, port, max_size=1024 * 1024):
        await asyncio.Future()


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="SO-SHO Windows BLE GATT bridge")
    parser.add_argument("--host", default="127.0.0.1")
    parser.add_argument("--port", type=int, default=8765)
    args = parser.parse_args()
    try:
        asyncio.run(main(args.host, args.port))
    except KeyboardInterrupt:
        pass
