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
