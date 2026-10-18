const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const source = fs.readFileSync(path.resolve(__dirname, '..', 'zmk-studio-transport.js'), 'utf8');
const writes = [];
let readerCancelled = false;
const reader = {
  async read() { return { done: true, value: undefined }; },
  async cancel() { readerCancelled = true; },
  releaseLock() {},
};
const port = {
  readable: { getReader() { return reader; } },
  writable: {
    getWriter() {
      return {
        async write(value) { writes.push(new Uint8Array(value)); },
        releaseLock() {},
      };
    },
  },
  opened: false,
  async open(options) {
    assert.equal(options.baudRate, 12500);
    this.opened = true;
  },
  async close() { this.opened = false; },
};

const context = {
  window: {},
  navigator: {
    serial: {
      async getPorts() { return [port]; },
      async requestPort() { return port; },
    },
  },
  TextEncoder,
  TextDecoder,
  Uint8Array,
  setTimeout,
  clearTimeout,
  Promise,
  console,
};
vm.runInNewContext(source, context);

(async () => {
  const statuses = [];
  const transport = new context.window.ZmkSerialTransport({ onStatus: (value) => statuses.push(value) });
  assert.equal(transport.isSupported, true);
  assert.equal(await transport.connectAuthorized(), true);
  assert.equal(transport.isConnected, true);
  assert.equal(port.opened, true);

  await transport.sendFramedPayload(new Uint8Array([1, 2, 3]));
  assert.deepEqual(Array.from(writes[0]), [0xAB, 1, 2, 3, 0xAD]);

  await transport.disconnect();
  assert.equal(transport.isConnected, false);
  assert.equal(readerCancelled, true);
  assert.ok(statuses.some((value) => value.includes('右側Central')));
  console.log('USB/COM RPC fallback test passed');
})().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
