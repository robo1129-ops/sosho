const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const source = fs.readFileSync(path.resolve(__dirname, '..', 'sosho-macro-transport.js'), 'utf8');
const listeners = [];
const store = new Map();
let pending = null;

function read16(bytes, index) { return bytes[index] | (bytes[index + 1] << 8); }
function write16(bytes, index, value) { bytes[index] = value & 0xff; bytes[index + 1] = (value >>> 8) & 0xff; }
function crc16(bytes, length) {
  let crc = 0xffff;
  for (let i = 0; i < length; i += 1) {
    crc ^= bytes[i];
    for (let bit = 0; bit < 8; bit += 1) crc = (crc & 1) ? ((crc >>> 1) ^ 0xa001) : (crc >>> 1);
  }
  return crc;
}
function reply(request, payload = new Uint8Array(0), status = 0) {
  const frame = new Uint8Array(12 + payload.length);
  frame.set([0x53, 0x53, 0x48, 0x4f, 1, request[5], request[6], status]);
  write16(frame, 8, payload.length);
  frame.set(payload, 10);
  write16(frame, 10 + payload.length, crc16(frame, 10 + payload.length));
  return frame;
}
function emit(frame) {
  const value = new DataView(frame.buffer, frame.byteOffset, frame.byteLength);
  listeners.forEach((listener) => listener({ target: { value } }));
}

const response = {
  async startNotifications() { return this; },
  addEventListener(type, listener) { if (type === 'characteristicvaluechanged') listeners.push(listener); },
};
const command = {
  async writeValueWithResponse(value) {
    const request = new Uint8Array(value);
    const op = request[5];
    const payloadLength = read16(request, 8);
    const payload = request.slice(10, 10 + payloadLength);
    if (op === 1 || op === 2) {
      emit(reply(request, op === 1 ? new Uint8Array([1, 16, 0, 0, 96, 234]) : undefined));
    } else if (op === 7) {
      pending = { id: payload[0], total: read16(payload, 1), bytes: new Uint8Array(read16(payload, 1)) };
      emit(reply(request));
    } else if (op === 8) {
      const offset = read16(payload, 1);
      pending.bytes.set(payload.slice(3), offset);
      emit(reply(request));
    } else if (op === 9) {
      store.set(pending.id, pending.bytes.slice());
      pending = null;
      emit(reply(request));
    } else if (op === 5) {
      store.delete(payload[0]);
      emit(reply(request));
    } else if (op === 3) {
      const id = payload[0];
      const offset = payload.length === 3 ? read16(payload, 1) : 0;
      const blob = store.get(id) || new Uint8Array(0);
      const chunk = blob.slice(offset, offset + 3);
      const out = new Uint8Array(5 + chunk.length);
      out[0] = id;
      write16(out, 1, offset);
      write16(out, 3, blob.length);
      out.set(chunk, 5);
      emit(reply(request, out));
    } else {
      emit(reply(request));
    }
  },
};
const service = { async getCharacteristic(uuid) { return String(uuid).includes('0002') ? response : command; } };
const context = {
  window: {}, TextEncoder, TextDecoder, Uint8Array, DataView, setTimeout, clearTimeout, Promise, console,
};
vm.runInNewContext(source, context);

(async () => {
  const ble = { server: { connected: true, async getPrimaryService() { return service; } } };
  const protocol = new context.window.SoshoMacroProtocol(ble);
  await protocol.writeAll([{
    name: 'Shift S',
    target: 'l0-left-0',
    steps: 'LSHFT|press|1\nS|tap|1\nLSHFT|release|1',
  }]);
  const readBack = await protocol.readAll();
  assert.equal(readBack.length, 1);
  assert.equal(readBack[0].name, 'Shift S');
  assert.equal(readBack[0].target, 'l0-left-0');
  assert.match(readBack[0].steps, /LSHFT\|press\|1/);
  assert.match(readBack[0].steps, /S\|tap\|1/);
  assert.match(readBack[0].steps, /LSHFT\|release\|1/);

  await protocol.writeAll([{
    name: 'punctuation',
    target: 'l0-left-0',
    steps: '/|tap|1\n!|tap|1\nLALT+/|tap|1',
  }]);
  const punctuationReadBack = await protocol.readAll();
  assert.equal(punctuationReadBack[0].steps, '/|tap|1\n!|tap|1\nLALT+/|tap|1');

  const longSteps = Array.from({ length: 64 }, (_, index) => `A|tap|${index + 1}`).join('\n');
  await protocol.writeAll([{
    name: '64-step macro',
    target: 'l0-left-0',
    steps: longSteps,
  }]);
  const longReadBack = await protocol.readAll();
  assert.equal(longReadBack.length, 1);
  assert.equal(longReadBack[0].name, '64-step macro');
  assert.equal(longReadBack[0].steps.split('\n').length, 64);
  assert.match(longReadBack[0].steps, /A\|tap\|64/);
  console.log('BLE macro write/read-back simulation passed');
})().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
