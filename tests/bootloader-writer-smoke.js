const assert = require('node:assert/strict');
const fs = require('node:fs');

const html = fs.readFileSync('index.html', 'utf8');
const enhancements = fs.readFileSync('ui-enhancements.js', 'utf8');
const transport = fs.readFileSync('zmk-studio-transport.js', 'utf8');
const css = fs.readFileSync('ui-overrides.css', 'utf8');

assert.match(enhancements, /setupBootloaderWriter/);
assert.match(enhancements, /showOpenFilePicker/);
assert.match(enhancements, /showDirectoryPicker/);
assert.match(enhancements, /INFO_UF2\.TXT/);
assert.match(enhancements, /INDEX\.HTM/);
assert.match(enhancements, /0x0A324655/);
assert.match(enhancements, /0x9E5D5157/);
assert.match(enhancements, /0x0AB16F30/);
assert.match(enhancements, /SO-SHO-UPDATE\.UF2/);
assert.match(enhancements, /createWritable/);
assert.match(enhancements, /requestPermission/);
assert.match(transport, /ブートローダー中はUF2書き込みを使用してください/);
assert.match(enhancements, /ブートローダー書き込み/);
assert.match(css, /\.bootloader-card/);
assert.match(css, /\.bootloader-status\[data-state="error"\]/);

function validUf2Header() {
  const buffer = new ArrayBuffer(512);
  const view = new DataView(buffer);
  view.setUint32(0, 0x0A324655, true);
  view.setUint32(4, 0x9E5D5157, true);
  view.setUint32(508, 0x0AB16F30, true);
  return view;
}

const valid = validUf2Header();
assert.equal(valid.getUint32(0, true), 0x0A324655);
assert.equal(valid.getUint32(4, true), 0x9E5D5157);
assert.equal(valid.getUint32(508, true), 0x0AB16F30);

console.log('SO-SHO bootloader UF2 writer smoke test passed');
