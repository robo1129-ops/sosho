const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
let source = fs.readFileSync('sosho-rpc-ui.js', 'utf8');
// Exercise the actual resolver with firmware-advertised metadata.
source = source.replace("  if (!editor || !readButton", `
  global.testResolve = function(label, details) {
    behaviorById = Object.fromEntries(details.map(d => [String(d.id), d]));
    behaviorIds = details.map(d => d.id);
    return resolveBinding(label, {});
  };
  if (!editor || !readButton`);
const context = {window: {}, document: {getElementById() {return null;}, querySelector() {return null;}}, setInterval() {}};
vm.runInNewContext(source, context);
const detail = {id: 1234, metadata: [{param1: [{type: 'constant', name: 'Left Bootloader', constant: 6}]}]};
for (const label of ['BOOTLOADER_LEFT', 'Left Bootloader']) {
  const result = context.window.testResolve(label, [detail]);
  assert.equal(result.behaviorId, 1234);
  assert.equal(result.param1, 6);
  assert.equal(result.param2, 0);
}
assert.equal(context.window.testResolve('BOOTLOADER_LEFT', []), null);
console.log('Left bootloader resolves advertised metadata and rejects unsupported firmware');

const controls = {
  id: 1235,
  metadata: [{param1: [
    {type: 'constant', name: 'CPI -', constant: 0},
    {type: 'constant', name: 'CPI +', constant: 1},
    {type: 'constant', name: 'Trackpad -', constant: 2},
    {type: 'constant', name: 'Trackpad +', constant: 3},
    {type: 'constant', name: 'Scroll -', constant: 5},
    {type: 'constant', name: 'Scroll +', constant: 6}
  ]}]
};
for (const [label, value] of [
  ['CPI_UP', 1], ['CPI_DOWN', 0], ['TP_SCALE_UP', 3],
  ['TP_SCALE_DOWN', 2], ['SCROLL_UP', 6], ['SCROLL_DOWN', 5]
]) {
  const result = context.window.testResolve(label, [controls]);
  assert.equal(result.behaviorId, controls.id);
  assert.equal(result.param1, value);
}

const momentary = {id: 2001, displayName: 'Momentary Layer', metadata: [{param1: [{type: 'layer_id'}]}]};
const toggle = {id: 2002, displayName: 'Toggle Layer', metadata: [{param1: [{type: 'layer_id'}]}]};
for (const [label, id] of [['SCROLL_HOLD', 2001], ['SCROLL_TOGGLE', 2002]]) {
  const result = context.window.testResolve(label, label === 'SCROLL_HOLD' ? [momentary] : [toggle]);
  assert.equal(result.behaviorId, id);
  assert.equal(result.param1, 4);
  assert.equal(result.param2, 0);
}
// ZMK builds without a native TT behavior still accept the requested layer
// through the official TG behavior rather than failing the complete save.
{
  const result = context.window.testResolve('TT 1', [toggle]);
  assert.equal(result.behaviorId, 2002);
  assert.equal(result.param1, 1);
  assert.equal(result.param2, 0);
}
console.log('Special action IDs, scroll mode and TT layer fallback resolve to writable bindings');
