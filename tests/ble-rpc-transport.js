const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const source = fs.readFileSync(path.resolve(__dirname, '..', 'zmk-studio-transport.js'), 'utf8');
const context = {
  window: {},
  TextEncoder,
  TextDecoder,
  Uint8Array,
  setTimeout,
  clearTimeout,
  Promise,
  console,
};
vm.runInNewContext(source, context);

const { ZmkBleTransport, ZmkStudioProtocol } = context.window;
assert.match(source, /acceptAllDevices:\s*true/, 'BLE picker must allow diagnostic selection');
assert.match(source, /Windowsの既存Bluetooth接続中はZMKがアクティブプロファイルの広告を停止/, 'BLE picker failure must explain the Windows advertising condition');
assert.match(source, /officialBleWebAppSupport/, 'BLE diagnostics must expose platform support status');

(async () => {
  const chunks = [];
  const characteristic = {
    async writeValueWithResponse(chunk) {
      chunks.push(new Uint8Array(chunk));
    },
  };
  const transport = new ZmkBleTransport({ writeChunkSize: 20, writeDelayMs: 0 });
  transport.device = { name: 'sosho' };
  transport.server = { connected: true };
  transport.characteristic = characteristic;
  transport.reading = true;
  transport.studioAvailable = true;

  const payload = new Uint8Array(Array.from({ length: 47 }, (_, index) => index));
  await transport.sendFramedPayload(payload);
  assert.ok(chunks.length >= 3, 'a keymap-sized frame must be split into multiple ATT writes');
  assert.ok(chunks.every((chunk) => chunk.length <= 20), 'no BLE write may exceed the safe ATT payload');
  const combined = new Uint8Array(chunks.reduce((total, chunk) => total + chunk.length, 0));
  let offset = 0;
  chunks.forEach((chunk) => { combined.set(chunk, offset); offset += chunk.length; });
  assert.deepEqual(Array.from(combined), Array.from(ZmkStudioProtocol.encodeFrame(payload)));

  const immediate = new ZmkBleTransport();
  immediate.sendFramedPayload = async function sendAndRespond() {
    this._resolvePending(new Uint8Array([0x42]));
  };
  const response = await immediate.requestFramedPayload(new Uint8Array([1]), { timeoutMs: 50 });
  assert.deepEqual(Array.from(response), [0x42], 'a response arriving during the write must not be missed');

  console.log('BLE RPC chunking and response-order test passed');
})().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
