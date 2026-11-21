const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const elements = {
  '[data-pdf-generate]': { addEventListener(_, handler) { this.clickHandler = handler; } },
  '[data-pdf-status]': {},
  '[data-pdf-link]': { click() { this.clicked = true; } },
};
const section = { style: {}, querySelector(selector) { return elements[selector]; } };
const editor = {
  isKeymapLoaded: () => true,
  getAssignments: () => ({ 'l0-left-0': '半角/全角', 'l0-left-encoder-cw': '音量＋' }),
  getDeviceHoldAssignments: () => ({ 'l0-left-0': '1' }),
  getHoldAssignments: () => ({ 'l0-left-0': '2' }),
  getLayers: () => [{ name: 'Layer 0', left: Array(22).fill('A'), right: Array(22).fill('B') }],
  keyId: (layer, side, index) => `l${layer}-${side}-${index}`,
};
let downloads = 0;
const context = {
  window: { soshoEditor: editor, async soshoRenderKeymapPdf(data) { assert.equal(data.layers[0].left[0].tap, '半角/全角'); return new Blob(['%PDF-test'], { type: 'application/pdf' }); } }, TextEncoder, Blob, setTimeout,
  URL: { createObjectURL(blob) { assert.equal(blob.type, 'application/pdf'); downloads++; return 'blob:test'; }, revokeObjectURL() {} },
  document: { querySelector: () => ({ appendChild() {} }), createElement: () => section },
  async fetch() { throw new Error('PDF generation must not use network'); },
};
vm.runInNewContext(fs.readFileSync('keymap-pdf.js', 'utf8'), context);
assert.doesNotMatch(section.innerHTML, /data-pdf-token|data-pdf-consent|GitHub Actions/);
(async () => {
  const data = context.window.soshoPdfSnapshot(editor);
  assert.equal(data.layers[0].left[0].tap, '半角/全角');
  assert.equal(data.layers[0].left[0].hold, '2');
  assert.equal(data.layers[0].encoders['left-cw'], '音量＋');
  assert.throws(() => context.window.soshoPdfSnapshot({ isKeymapLoaded: () => false }));
  await elements['[data-pdf-generate]'].clickHandler();
  assert.equal(elements['[data-pdf-link]'].clicked, true);
  assert.equal(downloads, 1);
  assert.equal(elements['[data-pdf-generate]'].disabled, false);
  console.log('Token-free offline keymap PDF download passed');
})().catch(error => { console.error(error); process.exitCode = 1; });
