# SO-SHO BLE diagnostics extension

This is a small Manifest V3 Chrome extension for isolating Web Bluetooth and ZMK Studio GATT connection problems from the public editor page.

It does not change Windows Bluetooth settings, pairing state, firmware, or the keyboard. The user must explicitly choose a device in Chrome's Device Picker.

## Load locally

1. Open `chrome://extensions` in Chrome.
2. Enable Developer mode.
3. Choose **Load unpacked** and select this directory.
4. Open the extension popup and run **ブラウザー診断**.
5. Choose **soshoへ接続** and select only an SO-SHO/ZMK device if it appears.

## What it checks

- Secure context and Web Bluetooth API availability
- `requestDevice()` and `getAvailability()` support
- Windows Chrome's `getDevices()` support, when available
- Official ZMK Studio service and characteristic discovery
- GATT notifications and disconnect events

The official ZMK Studio UUIDs are used:

- Service: `00000000-0196-6107-c967-c5cfb1c2482a`
- Characteristic: `00000001-0196-6107-c967-c5cfb1c2482a`

Chrome's `chrome.bluetoothLowEnergy` API is ChromeOS-only. Therefore this extension is a diagnostic path through Web Bluetooth, not a replacement for the Windows Bluetooth stack.
