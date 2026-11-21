const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const context = { window: {}, TextEncoder, Uint8Array, Blob, atob, setTimeout };
vm.runInNewContext(fs.readFileSync('keymap-pdf-renderer.js', 'utf8'), context);
function canvas() {
  return {
    getContext() { return { scale() {}, fillRect() {}, strokeRect() {}, fillText() {}, measureText(text) { return { width: text.length * 6 }; } }; },
    // Minimal bytes for checking binary PDF lengths and offsets, not a rendering fixture.
    toDataURL() { return 'data:image/jpeg;base64,/9j/2Q=='; },
  };
}
(async () => {
  const layer = { name: 'Layer 0', left: Array.from({ length: 22 }, () => ({ tap: '半角/全角', hold: 'Layer 1' })), right: Array.from({ length: 22 }, () => ({ tap: 'GUI+LEFT' })), encoders: {} };
  const blob = await context.window.soshoRenderKeymapPdf({ createdAt: 'test', layers: [layer, layer] }, canvas);
  assert.equal(blob.type, 'application/pdf');
  const bytes = Buffer.from(await blob.arrayBuffer());
  const raw = bytes.toString('latin1');
  assert.ok(raw.startsWith('%PDF-1.3'));
  assert.match(raw, /\/Count 2/);
  assert.equal((raw.match(/\/Subtype \/Image/g) || []).length, 2);
  const start = Number(/startxref\n(\d+)/.exec(raw)[1]);
  assert.equal(raw.slice(start, start + 4), 'xref');
  const entries = raw.slice(start).split('\n');
  const count = Number(entries[1].split(' ')[1]);
  for (let id = 1; id < count; id++) {
    const offset = Number(entries[id + 2].slice(0, 10));
    assert.ok(raw.slice(offset).startsWith(id + ' 0 obj\n'), 'xref offset ' + id);
  }
  await assert.rejects(() => context.window.soshoRenderKeymapPdf({ layers: [] }, canvas));
  console.log('Local PDF page count, binary streams and xref offsets passed');
})().catch(error => { console.error(error); process.exitCode = 1; });
