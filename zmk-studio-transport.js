const START_OF_FRAME = 0xAB;
const ESCAPE_BYTE = 0xAC;
const END_OF_FRAME = 0xAD;
const DEFAULT_TIMEOUT = 3000;
const UNSUPPORTED_REASON = '公式 protobuf エンコーダーと unlock/keymap RPC の実装は未検証です。推測したペイロードは送信しません。';

class ZmkSerialTransport {
  constructor({ onFrame = () => {}, onStatus = () => {} } = {}) {
    this.onFrame = onFrame;
    this.onStatus = onStatus;
    this.port = null;
    this.reader = null;
    this.writer = null;
    this.reading = false;
    this.buffer = [];
    this.escaped = false;
    this.waiters = new Set();
  }

  get isConnected() { return !!this.port && !!this.writer; }
  get canWriteKeymap() { return false; }
  get capabilities() {
    return { framing: true, responseWait: true, rpc: false, unlock: false, keymapWrite: false, reason: UNSUPPORTED_REASON };
  }

  async connect() {
    if (!('serial' in navigator)) throw new Error('Web Serial is not supported');
    if (this.isConnected) return true;
    this.onStatus('USB接続を選択中…');
    this.port = await navigator.serial.requestPort();
    await this.port.open({ baudRate: 115200, dataBits: 8, stopBits: 1, parity: 'none', flowControl: 'none' });
    this.writer = this.port.writable.getWriter();
    this.reading = true;
    this.onStatus('USB connected');
    this._readLoop();
    return true;
  }

  async disconnect() {
    this.reading = false;
    if (this.reader) { try { await this.reader.cancel(); } catch (_) {} try { this.reader.releaseLock(); } catch (_) {} this.reader = null; }
    if (this.writer) { try { this.writer.releaseLock(); } catch (_) {} this.writer = null; }
    if (this.port) { try { await this.port.close(); } catch (_) {} this.port = null; }
    this.buffer = [];
    this.escaped = false;
    this._rejectWaiters(new Error('USB disconnected'));
    this.onStatus('USB disconnected');
  }

  async _readLoop() {
    while (this.reading && this.port && this.port.readable) {
      this.reader = this.port.readable.getReader();
      try {
        while (this.reading) {
          const { value, done } = await this.reader.read();
          if (done) break;
          if (value) this._consume(value);
        }
      } catch (error) {
        if (this.reading) this.onStatus('USB受信エラー: ' + error.message);
      } finally {
        try { this.reader.releaseLock(); } catch (_) {}
        this.reader = null;
      }
    }
  }

  _consume(bytes) {
    for (const byte of bytes) {
      if (byte === START_OF_FRAME) { this.buffer = []; this.escaped = false; continue; }
      if (byte === END_OF_FRAME) {
        if (this.buffer.length) { const frame = new Uint8Array(this.buffer); this.onFrame(frame); this._resolveFrame(frame); }
        this.buffer = []; this.escaped = false; continue;
      }
      if (this.escaped) { this.buffer.push(byte); this.escaped = false; continue; }
      if (byte === ESCAPE_BYTE) { this.escaped = true; continue; }
      this.buffer.push(byte);
    }
  }

  encodeFrame(payload) {
    const bytes = payload instanceof Uint8Array ? payload : new Uint8Array(payload || []);
    const framed = [START_OF_FRAME];
    for (const byte of bytes) { if (byte === START_OF_FRAME || byte === ESCAPE_BYTE || byte === END_OF_FRAME) framed.push(ESCAPE_BYTE); framed.push(byte); }
    framed.push(END_OF_FRAME);
    return new Uint8Array(framed);
  }

  async sendFrame(payload) {
    if (!this.writer) throw new Error('USB is not connected');
    const frame = this.encodeFrame(payload);
    this.onStatus('USB送信中…');
    await this.writer.write(frame);
    this.onStatus('USBフレーム送信済み（応答待ち）');
    return frame;
  }

  waitForFrame(predicate = () => true, timeoutMs = DEFAULT_TIMEOUT) {
    return new Promise((resolve, reject) => {
      const waiter = { predicate, resolve, reject, timer: setTimeout(() => { this.waiters.delete(waiter); reject(new Error('USB response timeout')); }, timeoutMs) };
      this.waiters.add(waiter);
    });
  }

  async sendFrameAndWait(payload, predicate = () => true, timeoutMs = DEFAULT_TIMEOUT) {
    await this.sendFrame(payload);
    return this.waitForFrame(predicate, timeoutMs);
  }

  _resolveFrame(frame) {
    for (const waiter of [...this.waiters]) {
      let matches = false;
      try { matches = waiter.predicate(frame); } catch (_) {}
      if (matches) { clearTimeout(waiter.timer); this.waiters.delete(waiter); waiter.resolve(frame); }
    }
  }

  _rejectWaiters(error) { for (const waiter of this.waiters) { clearTimeout(waiter.timer); waiter.reject(error); } this.waiters.clear(); }

  async writeKeymap() { return { ok: false, status: 'unsupported', reason: UNSUPPORTED_REASON }; }
  async unlockAndWriteKeymap() { return this.writeKeymap(); }
}

window.ZmkSerialTransport = ZmkSerialTransport;
window.ZmkSerialTransportConstants = { START_OF_FRAME, ESCAPE_BYTE, END_OF_FRAME, DEFAULT_TIMEOUT };
