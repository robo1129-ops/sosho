const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const elements = {
  '[data-pdf-token]': { value: 'test-only-token' },
  '[data-pdf-consent]': { checked: true },
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
const calls = [];
const context = {
  window: { soshoEditor: editor }, TextEncoder, Blob, setTimeout,
  crypto: { randomUUID: () => 'test-request' },
  URL: { createObjectURL(blob) { assert.equal(blob.type, 'application/pdf'); downloads++; return 'blob:test'; }, revokeObjectURL() {} },
  document: { querySelector: () => ({ appendChild() {} }), createElement: () => section },
  async fetch(url, options = {}) {
    calls.push({ url, options });
    if (url.endsWith('/dispatches')) return { ok: true, status: 204 };
    if (url.includes('/runs?')) return { ok: true, status: 200, json: async () => ({ workflow_runs: [{ display_title: 'SO-SHO PDF test-request', status: 'completed', conclusion: 'success', id: 123 }] }) };
    assert.ok(url.endsWith('/contents/downloads/keymaps/123.pdf'));
    assert.equal(options.headers.Authorization, undefined);
    return { ok: true, blob: async () => new Blob(['%PDF-test']) };
  },
};
vm.runInNewContext(fs.readFileSync('keymap-pdf.js', 'utf8'), context);
(async () => {
  const data = context.window.soshoPdfSnapshot(editor);
  assert.equal(data.layers[0].left[0].tap, '半角/全角');
  assert.equal(data.layers[0].left[0].hold, '2');
  assert.equal(data.layers[0].encoders['left-cw'], '音量＋');
  assert.throws(() => context.window.soshoPdfSnapshot({ isKeymapLoaded: () => false }));
  await elements['[data-pdf-generate]'].clickHandler();
  const dispatched = JSON.parse(calls[0].options.body);
  assert.equal(dispatched.inputs.request_id, 'test-request');
  assert.equal(JSON.parse(dispatched.inputs.keymap_snapshot).layers[0].left[0].hold, '2');
  assert.equal(elements['[data-pdf-token]'].value, '');
  assert.equal(elements['[data-pdf-link]'].clicked, true);
  assert.equal(downloads, 1);
  assert.equal(elements['[data-pdf-generate]'].disabled, false);
  console.log('Keymap snapshot, Actions dispatch and automatic PDF download passed');
})().catch(error => { console.error(error); process.exitCode = 1; });
