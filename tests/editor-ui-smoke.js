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
assert.match(css, /\.remap-palette-tab\[aria-selected=/);
assert.match(css, /\.keyboard-frame \.bottom-row \.key:nth-child\(4\)/);

console.log('SO-SHO Remap-like editor UI smoke test passed');
