"""Explicit real-device test: preserve map, save, and compare BLE readback."""
import asyncio
import argparse
import base64
import hashlib
import json
import websockets


def varint(n):
    out = bytearray()
    while n > 127:
        out.append((n & 127) | 128)
        n >>= 7
    out.append(n)
    return bytes(out)


def field(n, value):
    if isinstance(value, int):
        return varint(n << 3) + varint(value)
    return varint((n << 3) | 2) + varint(len(value)) + value


def fields(data):
    pos = 0
    def read():
        nonlocal pos
        n = shift = 0
        while True:
            b = data[pos]
            pos += 1
            n |= (b & 127) << shift
            if b < 128:
                return n
            shift += 7
    result = []
    while pos < len(data):
        tag = read()
        wire = tag & 7
        if wire == 0:
            value = read()
        elif wire == 2:
            length = read()
            value = data[pos:pos + length]
            pos += length
        else:
            raise ValueError(f'Unsupported wire type {wire}')
        result.append((tag >> 3, value))
    return result


def encode_frame(data):
    out = bytearray([171])
    for b in data:
        if b in (171, 172, 173):
            out.append(172)
        out.append(b)
    out.append(173)
    return bytes(out)


async def main(url):
    async with websockets.connect(url, origin='https://robo1129-ops.github.io') as ws:
        await ws.send(json.dumps({'op': 'connect', 'namePrefix': 'sosho'}))
        async with asyncio.timeout(60):
            while True:
                message = json.loads(await ws.recv())
                if message['type'] == 'error':
                    raise RuntimeError(message)
                if message['type'] == 'devices':
                    devices = [d for d in message['devices'] if d.get('matchesPrefix')]
                    if not devices:
                        raise RuntimeError('No SO-SHO candidate')
                    await ws.send(json.dumps({'op': 'select', 'deviceId': devices[0]['id']}))
                if message['type'] == 'connected':
                    print('CONNECTED', message.get('name'), flush=True)
                    break
                if message.get('message'):
                    print('STATUS', message['message'], flush=True)
        await asyncio.sleep(1.4)
        request_id = 0
        async def rpc(subsystem, body):
            nonlocal request_id
            identity = request_id
            request_id += 1
            frame = encode_frame(field(1, identity) + field(subsystem, body))
            await ws.send(json.dumps({'op': 'write', 'data': base64.b64encode(frame).decode()}))
            active = escaped = False
            data = bytearray()
            async with asyncio.timeout(20):
                while True:
                    message = json.loads(await ws.recv())
                    if message['type'] == 'error':
                        raise RuntimeError(message)
                    if message['type'] != 'frame':
                        continue
                    for b in base64.b64decode(message['data']):
                        if escaped:
                            data.append(b)
                            escaped = False
                        elif b == 172:
                            escaped = True
                        elif b == 171:
                            active = True
                            data.clear()
                        elif b == 173 and active:
                            active = False
                            outer = dict(fields(bytes(data)))
                            if 1 not in outer:
                                continue
                            response = dict(fields(outer[1]))
                            if response.get(1, 0) == identity:
                                return response
                        elif active:
                            data.append(b)
        info = await rpc(3, field(1, 1))
        print('DEVICE_RESPONSE', len(str(info)), flush=True)
        before = await rpc(5, field(1, 1))
        if 5 not in before:
            raise RuntimeError(f'Keymap error: {before}')
        keymap = dict(fields(before[5]))[1]
        layers = [v for n, v in fields(keymap) if n == 1]
        if not layers:
            raise RuntimeError('Empty keymap')
        print('KEYMAP_READ', len(layers), 'layers', len(keymap), 'bytes', flush=True)
        layer = dict(fields(layers[-1]))
        binding = next(v for n, v in fields(layers[-1]) if n == 3)
        same_binding = field(1, layer.get(1, 0)) + field(2, 0) + field(3, binding)
        written = await rpc(5, field(2, same_binding))
        if dict(fields(written.get(5, b''))).get(2, 0) != 0 or 5 not in written:
            raise RuntimeError(f'Binding error: {written}')
        saved = await rpc(5, field(4, 1))
        save_body = dict(fields(saved.get(5, b''))).get(4, b'')
        if dict(fields(save_body)).get(1) != 1:
            raise RuntimeError(f'Save not acknowledged: {saved}')
        print('SAVE_ACKNOWLEDGED', True, flush=True)
        after = await rpc(5, field(1, 1))
        current = dict(fields(after.get(5, b''))).get(1)
        if current != keymap:
            raise RuntimeError('Keymap changed during test')
        print('READBACK_MATCH', hashlib.sha256(keymap).hexdigest(), flush=True)
        await ws.send(json.dumps({'op': 'disconnect'}))


if __name__ == '__main__':
    parser = argparse.ArgumentParser()
    parser.add_argument('--url', default='ws://127.0.0.1:8765')
    asyncio.run(main(parser.parse_args().url))
