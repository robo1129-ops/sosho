const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '..', 'chrome-extension');
const manifest = JSON.parse(fs.readFileSync(path.join(root, 'manifest.json'), 'utf8'));
const html = fs.readFileSync(path.join(root, 'popup.html'), 'utf8');
const script = fs.readFileSync(path.join(root, 'popup.js'), 'utf8');

assert.equal(manifest.manifest_version, 3);
assert.equal(manifest.action.default_popup, 'popup.html');
assert.ok(manifest.permissions.includes('storage'));
assert.match(html, /id="check"/);
assert.match(html, /id="connect"/);
assert.match(html, /popup\.js/);
assert.match(script, /navigator\.bluetooth\.requestDevice/);
assert.match(script, /acceptAllDevices:\s*true/);
assert.match(script, /optionalServices:\s*\[BLE_SERVICE_UUID, MACRO_SERVICE_UUID\]/);
assert.match(script, /getPrimaryService\(BLE_SERVICE_UUID\)/);
assert.match(script, /getCharacteristic\(BLE_CHARACTERISTIC_UUID\)/);
assert.match(script, /startNotifications\(\)/);
assert.match(script, /gattserverdisconnected/);
assert.match(script, /chrome\.bluetoothLowEnergy/);

console.log('SO-SHO Chrome extension smoke test passed');
