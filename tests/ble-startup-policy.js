const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const transport = fs.readFileSync(path.join(root, 'zmk-studio-transport.js'), 'utf8');
const bridge = fs.readFileSync(path.join(root, 'zmk-windows-ble-bridge.js'), 'utf8');
const rpcUi = fs.readFileSync(path.join(root, 'sosho-rpc-ui.js'), 'utf8');
const page = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
const pythonBridge = fs.readFileSync(path.join(root, 'windows-ble-bridge', 'windows_ble_bridge.py'), 'utf8');

assert.match(transport, /this\.rpcTimeoutMs = 8000/);
assert.match(transport, /this\.startupSettleMs = 400/);
assert.match(bridge, /this\.isWindowsBleBridge = true/);
assert.match(bridge, /this\.rpcTimeoutMs = Math\.max\(8000/);
assert.match(rpcUi, /readDeviceState\(\{ skipBehaviorDetails: !!transport\.isWindowsBleBridge \}\)/);
assert.match(page, /接続直後のRPCを安定させるため待機しています/);
assert.match(page, /接続直後のマクロ・スリープ設定の自動読み取りは行いません/);
assert.match(pythonBridge, /_notification_queue/);
assert.match(pythonBridge, /queue\.put_nowait\(payload\)/);

console.log('Windows BLE / USB startup ordering policy test passed');
