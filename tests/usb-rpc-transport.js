const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const source = fs.readFileSync(path.resolve(__dirname, '..', 'zmk-studio-transport.js'), 'utf8');
const writes = [];
let requestOptions = null;
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
    assert.equal(options.baudRate, 9600);
    this.opened = true;
  },
  async close() { this.opened = false; },
};

let retryOpenAttempts = 0;
let retryCloseCalls = 0;
const retryReader = {
  async read() { return { done: true, value: undefined }; },
  async cancel() {},
  releaseLock() {},
};
const retryPort = {
  readable: { getReader() { return retryReader; } },
  writable: {
    getWriter() {
      return { async write() {}, releaseLock() {} };
    },
  },
  opened: false,
  getInfo() { return { usbVendorId: 0x1d50, usbProductId: 0x615e }; },
  async open() {
    retryOpenAttempts += 1;
    if (retryOpenAttempts === 1) {
      const error = new Error('Failed to open serial port.');
      error.name = 'NetworkError';
      throw error;
    }
    this.opened = true;
  },
  async close() {
    retryCloseCalls += 1;
    this.opened = false;
  },
};

const context = {
  window: {},
  navigator: {
    serial: {
      async getPorts() { return [port]; },
      async requestPort(options) { requestOptions = options; return port; },
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
  assert.ok(statuses.some((value) => value.includes('USB接続済み')));

  const firstRetry = await transport.connectAuthorized(retryPort);
  assert.equal(firstRetry, false);
  assert.equal(retryPort.opened, false);
  assert.equal(retryCloseCalls, 1);
  assert.ok(statuses.some((value) => value.includes('USBシリアルポートを開けませんでした')));

  const secondRetry = await transport.connectAuthorized(retryPort);
  assert.equal(secondRetry, true);
  assert.equal(transport.isConnected, true);
  assert.equal(retryPort.opened, true);
  await transport.disconnect();

  let lockHeld = false;
  context.navigator.locks = {
    request(name, options, callback) {
      if (lockHeld) return Promise.resolve(callback(null));
      lockHeld = true;
      let result;
      try {
        result = callback({ name });
      } catch (error) {
        lockHeld = false;
        throw error;
      }
      return Promise.resolve(result).finally(() => { lockHeld = false; });
    },
  };
  const firstTab = new context.window.ZmkSerialTransport();
  const secondTab = new context.window.ZmkSerialTransport();
  assert.equal(await firstTab.connectAuthorized(port), true);
  assert.equal(await secondTab.connectAuthorized(port), false);
  await firstTab.disconnect();
  assert.equal(await secondTab.connectAuthorized(port), true);
  await secondTab.disconnect();

  await transport.connect();
  assert.deepEqual(requestOptions, undefined);
  await transport.disconnect();
  console.log('USB/COM RPC fallback test passed');
})().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
