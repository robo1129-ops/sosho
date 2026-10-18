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
assert.match(html, /USB COM \+ BLE GATT/);
assert.match(html, /MO 3/);
assert.match(html, /save-current-as-default/);
assert.match(html, /restore-firmware-defaults/);
assert.match(html, /connect-usb-authorized/);
assert.match(html, /右側Central/);
assert.match(fs.readFileSync('ui-enhancements.js', 'utf8'), /defaultKeymap/);
assert.match(css, /\.remap-palette-tab\[aria-selected=/);
assert.match(css, /\.keyboard-frame \.bottom-row \.key:nth-child\(4\)/);
assert.match(fs.readFileSync('sosho-macro-transport.js', 'utf8'), /MAX_MACROS = 16/);
assert.match(html, /USBはWeb Serial/);

console.log('SO-SHO Remap-like editor UI smoke test passed');
