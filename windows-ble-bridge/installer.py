"""Per-user SO-SHO Windows BLE Bridge installer.

This launcher is intentionally built without PyInstaller's --uac-admin option.
It keeps installation under %LOCALAPPDATA% and therefore does not require an
administrator prompt, even though the published file name contains "setup".
"""

from __future__ import annotations

import ctypes
import os
from pathlib import Path
import subprocess
import sys


def message(title: str, body: str, flags: int = 0x40) -> None:
    ctypes.windll.user32.MessageBoxW(None, body, title, flags)


def main() -> int:
    silent = "--silent" in sys.argv[1:]
    payload_root = Path(getattr(sys, "_MEIPASS", Path(__file__).resolve().parent))
    script = payload_root / "install-embedded.ps1"
    if not script.exists():
        if not silent:
            message("SO-SHO Windows BLE Bridge Setup", "The installer payload is incomplete.", 0x10)
        return 2

    startupinfo = None
    creationflags = getattr(subprocess, "CREATE_NO_WINDOW", 0)
    try:
        result = subprocess.run(
            [
                "powershell.exe",
                "-NoLogo",
                "-NoProfile",
                "-NonInteractive",
                "-ExecutionPolicy",
                "Bypass",
                "-File",
                str(script),
            ],
            cwd=str(payload_root),
            startupinfo=startupinfo,
            creationflags=creationflags,
            check=False,
        )
    except OSError as exc:
        if not silent:
            message("SO-SHO Windows BLE Bridge Setup", f"Setup failed to start PowerShell.\n\n{exc}", 0x10)
        return 3

    if result.returncode != 0:
        log_path = Path(os.environ.get("TEMP", ".")) / "sosho-windows-ble-bridge-install.log"
        if not silent:
            message(
                "SO-SHO Windows BLE Bridge Setup",
                "Setup failed.\n\nSee the install log:\n" + str(log_path),
                0x10,
            )
        return result.returncode or 1

    if not silent:
        message(
            "SO-SHO Windows BLE Bridge Setup",
            "SO-SHO Windows BLE Bridge setup completed.\n\nThe bridge is installed for this Windows user and will start automatically when Windows starts.",
        )
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
