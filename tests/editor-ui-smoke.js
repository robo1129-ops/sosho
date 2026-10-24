const assert = require('node:assert/strict');
const fs = require('node:fs');

const html = fs.readFileSync('index.html', 'utf8');
const css = fs.readFileSync('ui-overrides.css', 'utf8');

for (const group of ['BASIC', 'FUNCTIONS', 'LAYER', 'DEVICE', 'SPECIAL', 'ASCII', 'JIS']) {
  assert.match(html, new RegExp(group));
}
assert.match(html, /remap-palette-tabs/);
assert.match(html, /remap-palette-search/);
assert.match(html, /bottom-row/);
assert.match(html, /USB \/ COM 専用/);
assert.match(html, /MO 3/);
assert.match(html, /save-current-as-default/);
assert.match(html, /restore-firmware-defaults/);
assert.match(html, /connect-usb-authorized/);
assert.match(html, /connection-error/);
assert.match(html, /language-select/);
assert.match(fs.readFileSync('ui-enhancements.js', 'utf8'), /简体中文/);
assert.match(fs.readFileSync('ui-enhancements.js', 'utf8'), /한국어/);
assert.match(fs.readFileSync('ui-enhancements.js', 'utf8'), /ไทย/);
assert.match(fs.readFileSync('ui-enhancements.js', 'utf8'), /Español/);
assert.match(fs.readFileSync('ui-enhancements.js', 'utf8'), /Deutsch/);
assert.match(fs.readFileSync('ui-enhancements.js', 'utf8'), /mapTransferDescription/);
assert.match(html, /右側Central/);
assert.doesNotMatch(html, /id="connect-ble"/);
assert.doesNotMatch(html, /BLE診断/);
assert.match(html, /USB専用の反映範囲/);
assert.match(fs.readFileSync('ui-enhancements.js', 'utf8'), /defaultKeymap/);
assert.match(css, /\.remap-palette-tab\[aria-selected=/);
assert.match(css, /\.keyboard-frame \.bottom-row \.key:nth-child\(4\)/);
assert.match(css, /\.connection-error-banner/);
assert.match(css, /\.studio-language-picker/);
assert.match(fs.readFileSync('sosho-rpc-ui.js', 'utf8'), /soshoConnectionError/);
assert.match(fs.readFileSync('sosho-macro-transport.js', 'utf8'), /MAX_MACROS = 16/);
assert.match(html, /Web Serial/);
assert.doesNotMatch(html, /ZmkBleTransport/);
assert.doesNotMatch(html, /sosho-macro-transport/);

console.log('SO-SHO Remap-like editor UI smoke test passed');
