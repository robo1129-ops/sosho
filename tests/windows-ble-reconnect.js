const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
let nextTimer = 0;
const timers = new Map();
class Socket {
  static OPEN = 1;
  constructor() { this.readyState = 0; this.listeners = {}; }
  addEventListener(name, handler) { (this.listeners[name] ||= []).push(handler); }
  emit(name, value = {}) { for (const fn of this.listeners[name] || []) fn(value); }
  send() {}
  close() { this.readyState = 3; }
}
const context = {
  window: {}, WebSocket: Socket, TextEncoder, TextDecoder, Uint8Array,
  document: { querySelector() { return null; }, getElementById() { return null; } },
  setTimeout(fn) { timers.set(++nextTimer, fn); return nextTimer; },
  clearTimeout(id) { timers.delete(id); },
};
for (const file of ['zmk-studio-transport.js', 'zmk-windows-ble-bridge.js']) {
  vm.runInNewContext(fs.readFileSync(file, 'utf8'), context, { filename: file });
  Object.assign(context, context.window);
}
function ready(socket) {
  socket.readyState = Socket.OPEN;
  socket.emit('open');
  socket.emit('message', { data: JSON.stringify({ type: 'connected', name: 'sosho' }) });
}
(async () => {
  const transport = new context.window.ZmkWindowsBleBridgeTransport({});
  const first = transport.connect();
  const oldSocket = transport.socket;
  const oldTimer = [...timers.values()][0];
  ready(oldSocket);
  assert.equal(await first, true);
  assert.equal(timers.size, 0, 'successful connection must cancel its timer');
  await transport.disconnect();
  const second = transport.connect();
  ready(transport.socket);
  assert.equal(await second, true);
  oldTimer();
  oldSocket.emit('close');
  assert.equal(transport.isConnected, true, 'stale timer/close must not disconnect the new session');
  await transport.disconnect();
  const failed = transport.connect();
  const failedSocket = transport.socket;
  failedSocket.emit('message', { data: JSON.stringify({ type: 'error', message: 'GATT failed' }) });
  assert.equal(await failed, false);
  assert.equal(failedSocket.readyState, 3, 'failed connection must release its socket');
  assert.equal(timers.size, 0);
  assert.equal(transport._connecting, false);
  const cancelled = transport.connect();
  await transport.disconnect();
  assert.equal(await cancelled, false);
  assert.equal(timers.size, 0, 'cancelled connection must clear its timer');
  console.log('Windows BLE reconnect lifecycle passed');
})().catch(error => { console.error(error); process.exitCode = 1; });
