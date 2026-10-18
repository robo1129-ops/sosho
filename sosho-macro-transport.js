(function (global) {
  'use strict';

  var SERVICE_UUID = '7f5e0000-8a2a-4c2f-b93e-55f4b5d30001';
  var COMMAND_UUID = '7f5e0001-8a2a-4c2f-b93e-55f4b5d30001';
  var RESPONSE_UUID = '7f5e0002-8a2a-4c2f-b93e-55f4b5d30001';
  var VERSION = 1;
  var OP = { HELLO: 1, UNLOCK: 2, GET: 3, SET: 4, DELETE: 5, RUN: 6, SET_BEGIN: 7, SET_CHUNK: 8, SET_COMMIT: 9 };
  var STATUS = { OK: 0, BAD_FRAME: 1, BAD_CRC: 2, AUTH_REQUIRED: 3, TOO_LARGE: 4, BAD_VALUE: 5 };
  var MAX_MACROS = 8;
  var MAX_STEPS = 8;
  var MAX_WAIT_MS = 60000;

  var encoder = typeof TextEncoder === 'function' ? new TextEncoder() : null;
  var decoder = typeof TextDecoder === 'function' ? new TextDecoder() : null;

  function utf8(text) {
    if (encoder) return encoder.encode(String(text || ''));
    var out = [];
    unescape(encodeURIComponent(String(text || ''))).split('').forEach(function (ch) { out.push(ch.charCodeAt(0)); });
    return new Uint8Array(out);
  }

  function text(bytes) {
    if (decoder) return decoder.decode(bytes);
    var s = '';
    for (var i = 0; i < bytes.length; i++) s += String.fromCharCode(bytes[i]);
    return decodeURIComponent(escape(s));
  }

  function crc16(bytes, length) {
    var crc = 0xffff;
    for (var i = 0; i < length; i++) {
      crc ^= bytes[i];
      for (var bit = 0; bit < 8; bit++) crc = (crc & 1) ? ((crc >>> 1) ^ 0xa001) : (crc >>> 1);
    }
    return crc;
  }

  function put16(out, index, value) {
    out[index] = value & 0xff;
    out[index + 1] = (value >>> 8) & 0xff;
  }

  function put32(out, index, value) {
    out[index] = value & 0xff;
    out[index + 1] = (value >>> 8) & 0xff;
    out[index + 2] = (value >>> 16) & 0xff;
    out[index + 3] = (value >>> 24) & 0xff;
  }

  function get16(bytes, index) { return bytes[index] | (bytes[index + 1] << 8); }
  function get32(bytes, index) { return (bytes[index] | (bytes[index + 1] << 8) | (bytes[index + 2] << 16) | (bytes[index + 3] << 24)) >>> 0; }

  function packet(op, txid, payload) {
    payload = payload || new Uint8Array(0);
    var out = new Uint8Array(12 + payload.length);
    out[0] = 0x53; out[1] = 0x53; out[2] = 0x48; out[3] = 0x4f;
    out[4] = VERSION; out[5] = op; out[6] = txid; out[7] = 0;
    put16(out, 8, payload.length);
    out.set(payload, 10);
    put16(out, 10 + payload.length, crc16(out, 10 + payload.length));
    return out;
  }

  function parsePacket(bytes) {
    if (!bytes || bytes.length < 12 || bytes[0] !== 0x53 || bytes[1] !== 0x53 || bytes[2] !== 0x48 || bytes[3] !== 0x4f || bytes[4] !== VERSION) throw new Error('SO-SHOマクロ応答の形式が不正です');
    var length = get16(bytes, 8);
    if (bytes.length !== 12 + length || get16(bytes, 10 + length) !== crc16(bytes, 10 + length)) throw new Error('SO-SHOマクロ応答のCRCが不正です');
    return { op: bytes[5], txid: bytes[6], status: bytes[7], payload: bytes.slice(10, 10 + length) };
  }

  var keyIds = {
    BACKSPACE: 0x2a, BSPC: 0x2a, ENTER: 0x28, RET: 0x28, ESCAPE: 0x29, ESC: 0x29, TAB: 0x2b, SPACE: 0x2c,
    MINUS: 0x2d, EQUAL: 0x2e, LBKT: 0x2f, RBKT: 0x30, BSLH: 0x31, SEMI: 0x33, SQT: 0x34, COMMA: 0x36,
    LEFT: 0x50, RIGHT: 0x4f, UP: 0x52, DOWN: 0x51,
    DOT: 0x37, SLASH: 0x38, LCTRL: 0xe0, LSHFT: 0xe1, LALT: 0xe2, LGUI: 0xe3,
    RCTRL: 0xe4, RSHFT: 0xe5, RALT: 0xe6, RGUI: 0xe7
  };
  Object.assign(keyIds, {
    INT1: 0x87, INT_RO: 0x87,
    INT2: 0x88, INT_KATAKANAHIRAGANA: 0x88, INT_KANA: 0x88,
    INT3: 0x89, INT_YEN: 0x89,
    INT4: 0x8a, INT_HENKAN: 0x8a,
    INT5: 0x8b, INT_MUHENKAN: 0x8b,
    LANG1: 0x90, LANG2: 0x91, LANG3: 0x92, LANG4: 0x93, LANG5: 0x94,
    LANG_KATAKANA: 0x92, LANG_HIRAGANA: 0x93, LANG_ZENKAKUHANKAKU: 0x94
  });
  for (var letter = 0; letter < 26; letter++) keyIds[String.fromCharCode(65 + letter)] = 0x04 + letter;
  for (var digit = 0; digit < 10; digit++) keyIds[String(digit)] = digit === 0 ? 0x27 : 0x1d + digit;
  for (var f = 1; f <= 15; f++) keyIds['F' + f] = 0x3a + f - 1;
  keyIds.CTRL = keyIds.LCTRL; keyIds.SHIFT = keyIds.LSHFT; keyIds.ALT = keyIds.LALT; keyIds.GUI = keyIds.LGUI;

  function keycode(name) {
    var normalized = String(name || '').trim().toUpperCase();
    if (keyIds[normalized] == null) throw new Error('未対応のマクロキー: ' + name);
    return (0x07 << 16) | keyIds[normalized];
  }

  function modeId(mode) { return mode === 'press' ? 1 : mode === 'release' ? 2 : 0; }
  function modeName(mode) { return mode === 1 ? 'press' : mode === 2 ? 'release' : 'tap'; }

  function encodeMacro(macro, id) {
    var name = utf8((macro && macro.name) || '新しいマクロ');
    var target = utf8((macro && macro.target) || '');
    if (name.length > 24 || target.length > 32) throw new Error('マクロ名または割り当て先が長すぎます');
    var lines = String((macro && macro.steps) || 'A|tap|1').split(/\r?\n/).filter(Boolean);
    if (lines.length > MAX_STEPS) throw new Error('マクロのステップ数は8個までです');
    var out = new Uint8Array(4 + name.length + target.length + lines.length * 7);
    out[0] = id; out[1] = lines.length; out[2] = name.length; out[3] = target.length;
    out.set(name, 4); out.set(target, 4 + name.length);
    var offset = 4 + name.length + target.length;
    lines.forEach(function (line) {
      var parts = line.split('|');
      var wait = Number(parts[2] || 0);
      if (!Number.isInteger(wait) || wait < 0 || wait > MAX_WAIT_MS) throw new Error('待ち時間は0〜60000ミリ秒で指定してください');
      put32(out, offset, keycode(parts[0]));
      out[offset + 4] = modeId(String(parts[1] || 'tap').toLowerCase());
      put16(out, offset + 5, wait);
      offset += 7;
    });
    return out;
  }

  function decodeMacro(bytes) {
    if (!bytes || bytes.length < 4) return null;
    var id = bytes[0], stepsCount = bytes[1], nameLength = bytes[2], targetLength = bytes[3];
    if (stepsCount > MAX_STEPS || nameLength > 24 || targetLength > 32) throw new Error('保存されたマクロ形式が不正です');
    var header = 4 + nameLength + targetLength;
    if (bytes.length !== header + stepsCount * 7) throw new Error('保存されたマクロ長が不正です');
    var name = text(bytes.slice(4, 4 + nameLength));
    var target = text(bytes.slice(4 + nameLength, header));
    var steps = [];
    var offset = header;
    for (var i = 0; i < stepsCount; i++) {
      var encoded = get32(bytes, offset);
      var page = (encoded >>> 16) & 0xff;
      var usage = encoded & 0xffff;
      var key = Object.keys(keyIds).filter(function (k) { return keyIds[k] === usage; })[0] || ('0x' + usage.toString(16));
      steps.push(key + '|' + modeName(bytes[offset + 4]) + '|' + get16(bytes, offset + 5));
      offset += 7;
    }
    return { id: id, name: name, target: target, steps: steps.join('\n') };
  }

  function MacroProtocol(ble, options) {
    this.ble = ble; this.options = options || {}; this.service = null; this.command = null; this.response = null; this.txid = 0; this.pending = {};
    this._onResponse = this._onResponse.bind(this);
  }

  MacroProtocol.prototype.attach = async function () {
    if (!this.ble || !this.ble.server || !this.ble.server.connected) throw new Error('先にBLE接続してください');
    this.service = await this.ble.server.getPrimaryService(SERVICE_UUID);
    this.command = await this.service.getCharacteristic(COMMAND_UUID);
    this.response = await this.service.getCharacteristic(RESPONSE_UUID);
    await this.response.startNotifications();
    this.response.addEventListener('characteristicvaluechanged', this._onResponse);
    return true;
  };

  MacroProtocol.prototype._onResponse = function (event) {
    try {
      var parsed = parsePacket(new Uint8Array(event.target.value.buffer, event.target.value.byteOffset, event.target.value.byteLength));
      var waiter = this.pending[parsed.txid];
      if (!waiter) return;
      delete this.pending[parsed.txid];
      clearTimeout(waiter.timer);
      if (parsed.status !== STATUS.OK) { var error = new Error('マクロ通信エラー: status ' + parsed.status); error.status = parsed.status; waiter.reject(error); } else waiter.resolve(parsed.payload);
    } catch (error) { /* Ignore notifications that are not our response. */ }
  };

  MacroProtocol.prototype.request = async function (op, payload) {
    if (!this.command || !this.response) await this.attach();
    var txid = (this.txid = (this.txid + 1) & 0xff) || 1;
    var self = this;
    var result = new Promise(function (resolve, reject) {
      var timer = setTimeout(function () { delete self.pending[txid]; reject(new Error('マクロ通信がタイムアウトしました')); }, 5000);
      self.pending[txid] = { resolve: resolve, reject: reject, timer: timer };
    });
    var bytes = packet(op, txid, payload);
    try {
      if (this.command.writeValueWithResponse) await this.command.writeValueWithResponse(bytes); else await this.command.writeValue(bytes);
    } catch (error) { delete this.pending[txid]; throw error; }
    return result;
  };

  MacroProtocol.prototype.hello = async function () { return this.request(OP.HELLO, new Uint8Array(0)); };
  MacroProtocol.prototype.unlock = async function () { return this.request(OP.UNLOCK, new Uint8Array(0)); };
  MacroProtocol.prototype.getMacro = async function (id) {
    var offset = 0, total = null, chunks = [];
    while (total === null || offset < total) {
      var request = new Uint8Array([id, offset & 0xff, (offset >>> 8) & 0xff]);
      var response = await this.request(OP.GET, request);
      if (response.length < 5 || response[0] !== id || get16(response, 1) !== offset) throw new Error('BLEからのマクロ読み込み位置が不正です');
      total = get16(response, 3);
      var data = response.slice(5);
      chunks.push(data);
      offset += data.length;
      if (data.length === 0) break;
    }
    var blob = new Uint8Array(offset), cursor = 0;
    chunks.forEach(function (chunk) { blob.set(chunk, cursor); cursor += chunk.length; });
    return decodeMacro(blob);
  };
  MacroProtocol.prototype.setMacro = async function (macro, id) {
    var blob = encodeMacro(macro, id), begin = new Uint8Array([id, blob.length & 0xff, (blob.length >>> 8) & 0xff]);
    await this.request(OP.SET_BEGIN, begin);
    for (var offset = 0; offset < blob.length; offset += 3) {
      var length = Math.min(3, blob.length - offset), chunk = new Uint8Array(3 + length);
      chunk[0] = id; chunk[1] = offset & 0xff; chunk[2] = (offset >>> 8) & 0xff; chunk.set(blob.slice(offset, offset + length), 3);
      await this.request(OP.SET_CHUNK, chunk);
    }
    await this.request(OP.SET_COMMIT, new Uint8Array([id])); return true;
  };
  MacroProtocol.prototype.deleteMacro = async function (id) { await this.request(OP.DELETE, new Uint8Array([id])); return true; };
  MacroProtocol.prototype.runMacro = async function (id) { await this.request(OP.RUN, new Uint8Array([id])); return true; };
  MacroProtocol.prototype.readAll = async function () { var out = []; for (var i = 0; i < MAX_MACROS; i++) { var macro = await this.getMacro(i); if (macro) out.push(macro); } return out; };
  MacroProtocol.prototype.writeAll = async function (macros) {
    await this.hello(); await this.unlock();
    for (var i = 0; i < MAX_MACROS; i++) { if (macros[i]) await this.setMacro(macros[i], i); else await this.deleteMacro(i); }
    return true;
  };

  global.SoshoMacroProtocol = MacroProtocol;
  global.SoshoMacroProtocolConstants = { SERVICE_UUID: SERVICE_UUID, COMMAND_UUID: COMMAND_UUID, RESPONSE_UUID: RESPONSE_UUID, MAX_MACROS: MAX_MACROS };
})(window);
