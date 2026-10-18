const assert = require('assert');
const fs = require('fs');
const vm = require('vm');

const source = fs.readFileSync(require('path').join(__dirname, '..', 'zmk-studio-transport.js'), 'utf8');
const context = { window: {}, TextEncoder, TextDecoder, Uint8Array, setTimeout, clearTimeout, Promise, console };
vm.runInNewContext(source, context);

const protocol = context.window.ZmkStudioProtocol;
const Rpc = context.window.ZmkStudioRpc;

assert.deepStrictEqual(Array.from(protocol.encodeFrame(new Uint8Array([0xAB, 0xAC, 0xAD, 1]))), [
  0xAB, 0xAC, 0xAB, 0xAC, 0xAC, 0xAC, 0xAD, 1, 0xAD,
]);

const fakeTransport = {
  resolver: null,
  _waitForFrame(timeout) {
    return new Promise((resolve, reject) => {
      this.resolver = resolve;
      setTimeout(() => reject(new Error('test timeout')), timeout);
    });
  },
  async sendFramedPayload(request) {
    assert.deepStrictEqual(Array.from(request.slice(0, 3)), [0x08, 0x00, 0x1A]);
    setTimeout(() => {
      const name = new Uint8Array([0x0A, 5, 115, 111, 115, 104, 111]);
      const core = new Uint8Array([0x0A, name.length, ...name]);
      const requestResponse = new Uint8Array([0x08, 1, 0x1A, core.length, ...core]);
      this.resolver(new Uint8Array([0x0A, requestResponse.length, ...requestResponse]));
    }, 0);
  },
};

(async () => {
  const rpc = new Rpc(fakeTransport);
  const info = await rpc.getDeviceInfo();
  assert.strictEqual(info.name, 'sosho');
  console.log('ZMK Studio RPC smoke test passed');
})().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
