(function (global) {
  'use strict';

  var SOF = 0xAB;
  var ESC = 0xAC;
  var EOF_BYTE = 0xAD;
  var BLE_SERVICE_UUID = '00000000-0196-6107-c967-c5cfb1c2482a';
  var BLE_CHARACTERISTIC_UUID = '00000001-0196-6107-c967-c5cfb1c2482a';
  var MACRO_SERVICE_UUID = '7f5e0000-8a2a-4c2f-b93e-55f4b5d30001';
  var RPC_SCHEMA_SUPPORTED = true;
  var RPC_UNSUPPORTED_REASON = '公式ZMK Studio RPCのprotobufとフレーミングを実装済みです。実機の応答は接続先とファームウェア構成に依存します。';

  function concat() {
    var parts = Array.prototype.slice.call(arguments);
    var size = parts.reduce(function (n, part) { return n + part.length; }, 0);
    var out = new Uint8Array(size);
    var offset = 0;
    parts.forEach(function (part) { out.set(part, offset); offset += part.length; });
    return out;
  }

  function varint(value) {
    var n = Number(value) >>> 0;
    var out = [];
    do {
      var byte = n & 0x7F;
      n = Math.floor(n / 128);
      if (n) byte |= 0x80;
      out.push(byte);
    } while (n);
    return new Uint8Array(out);
  }

  function zigzag32(value) {
    var n = Number(value) | 0;
    return ((n << 1) ^ (n >> 31)) >>> 0;
  }

  function fieldVarint(number, value) { return concat(varint((number << 3) | 0), varint(value)); }
  function fieldSInt32(number, value) { return fieldVarint(number, zigzag32(value)); }
  function fieldBytes(number, bytes) { return concat(varint((number << 3) | 2), varint(bytes.length), bytes); }
  function fieldMessage(number, message) { return fieldBytes(number, message); }
  function fieldString(number, value) { return fieldBytes(number, new TextEncoder().encode(String(value || ''))); }
  function boolField(number) { return fieldVarint(number, 1); }

  function encodeFrame(payload) {
    var source = payload instanceof Uint8Array ? payload : new Uint8Array(payload || []);
    var out = [SOF];
    for (var i = 0; i < source.length; i++) {
      var byte = source[i];
      if (byte === SOF || byte === ESC || byte === EOF_BYTE) out.push(ESC);
      out.push(byte);
    }
    out.push(EOF_BYTE);
    return new Uint8Array(out);
  }

  function ByteReader(bytes) {
    this.bytes = bytes instanceof Uint8Array ? bytes : new Uint8Array(bytes || []);
    this.offset = 0;
  }
  ByteReader.prototype.done = function () { return this.offset >= this.bytes.length; };
  ByteReader.prototype.readVarint = function () {
    var result = 0;
    var multiplier = 1;
    for (var i = 0; i < 10 && !this.done(); i++) {
      var byte = this.bytes[this.offset++];
      result += (byte & 0x7F) * multiplier;
      if (!(byte & 0x80)) return result;
      multiplier *= 128;
    }
    throw new Error('invalid protobuf varint');
  };
  ByteReader.prototype.readBytes = function () {
    var length = this.readVarint();
    if (length < 0 || this.offset + length > this.bytes.length) throw new Error('invalid protobuf length');
    var result = this.bytes.slice(this.offset, this.offset + length);
    this.offset += length;
    return result;
  };
  ByteReader.prototype.skip = function (wireType) {
    if (wireType === 0) { this.readVarint(); return; }
    if (wireType === 1) { this.offset += 8; return; }
    if (wireType === 2) { this.offset += this.readVarint(); return; }
    if (wireType === 5) { this.offset += 4; return; }
    throw new Error('unsupported protobuf wire type ' + wireType);
  };
  ByteReader.prototype.fields = function (callback) {
    while (!this.done()) {
      var tag = this.readVarint();
      var number = tag >>> 3;
      var wireType = tag & 7;
      callback(number, wireType, wireType === 0 ? this.readVarint() : wireType === 2 ? this.readBytes() : null);
      if (wireType !== 0 && wireType !== 2) this.skip(wireType);
    }
  };
  function utf8(bytes) { return new TextDecoder().decode(bytes || new Uint8Array()); }
  function zigzagDecode(value) { return (value >>> 1) ^ -(value & 1); }

  function decodeMeta(bytes) {
    var result = {};
    new ByteReader(bytes).fields(function (number, wireType, value) { if (number === 2 && wireType === 0) result.simpleError = value; });
    return result;
  }
  function decodeCoreResponse(bytes) {
    var result = {};
    new ByteReader(bytes).fields(function (number, wireType, value) {
      if (number === 1 && wireType === 2) {
        var info = {};
        new ByteReader(value).fields(function (n, w, v) { if (n === 1 && w === 2) info.name = utf8(v); if (n === 2 && w === 2) info.serialNumber = v; });
        result.deviceInfo = info;
      } else if (number === 2 && wireType === 0) result.lockState = value;
      else if (number === 4 && wireType === 0) result.resetSettings = !!value;
    });
    return result;
  }
  function decodeBehaviorParameter(bytes) {
    var result = { name: '' };
    new ByteReader(bytes).fields(function (number, wireType, value) {
      if (number === 1 && wireType === 2) result.name = utf8(value);
      if (number === 2 && wireType === 2) result.type = 'nil';
      if (number === 3 && wireType === 0) { result.type = 'constant'; result.constant = value; }
      if (number === 4 && wireType === 2) {
        result.type = 'range';
        new ByteReader(value).fields(function (n, w, v) { if (n === 1 && w === 0) result.min = v; if (n === 2 && w === 0) result.max = v; });
      }
      if (number === 5 && wireType === 2) {
        result.type = 'hid_usage';
        new ByteReader(value).fields(function (n, w, v) { if (n === 1 && w === 0) result.keyboardMax = v; if (n === 2 && w === 0) result.consumerMax = v; });
      }
      if (number === 6 && wireType === 2) result.type = 'layer_id';
    });
    return result;
  }
  function decodeBehaviorParameterSet(bytes) {
    var result = { param1: [], param2: [] };
    new ByteReader(bytes).fields(function (number, wireType, value) { if (wireType === 2 && number === 1) result.param1.push(decodeBehaviorParameter(value)); if (wireType === 2 && number === 2) result.param2.push(decodeBehaviorParameter(value)); });
    return result;
  }
  function decodeBehaviorResponse(bytes) {
    var result = {};
    new ByteReader(bytes).fields(function (number, wireType, value) {
      if (number === 1 && wireType === 2) {
        result.behaviors = [];
        new ByteReader(value).fields(function (n, w, v) { if (n === 1 && w === 0) result.behaviors.push(v); });
      } else if (number === 2 && wireType === 2) {
        var detail = { metadata: [] };
        new ByteReader(value).fields(function (n, w, v) { if (n === 1 && w === 0) detail.id = v; if (n === 2 && w === 2) detail.displayName = utf8(v); if (n === 3 && w === 2) detail.metadata.push(decodeBehaviorParameterSet(v)); });
        result.behaviorDetails = detail;
      }
    });
    return result;
  }
  function decodeBinding(bytes) {
    var result = { behaviorId: 0, param1: 0, param2: 0 };
    new ByteReader(bytes).fields(function (number, wireType, value) { if (number === 1 && wireType === 0) result.behaviorId = zigzagDecode(value); if (number === 2 && wireType === 0) result.param1 = value; if (number === 3 && wireType === 0) result.param2 = value; });
    return result;
  }
  function decodeLayer(bytes) {
    var layer = { id: 0, name: '', bindings: [] };
    new ByteReader(bytes).fields(function (number, wireType, value) { if (number === 1 && wireType === 0) layer.id = value; if (number === 2 && wireType === 2) layer.name = utf8(value); if (number === 3 && wireType === 2) layer.bindings.push(decodeBinding(value)); });
    return layer;
  }
  function decodeKeymap(bytes) {
    var result = { layers: [], availableLayers: 0, maxLayerNameLength: 0 };
    new ByteReader(bytes).fields(function (number, wireType, value) { if (number === 1 && wireType === 2) result.layers.push(decodeLayer(value)); if (number === 2 && wireType === 0) result.availableLayers = value; if (number === 3 && wireType === 0) result.maxLayerNameLength = value; });
    return result;
  }
  function decodeKeymapResponse(bytes) {
    var result = {};
    new ByteReader(bytes).fields(function (number, wireType, value) {
      if (number === 1 && wireType === 2) result.keymap = decodeKeymap(value);
      else if (number === 2 && wireType === 0) result.setLayerBindingError = value;
      else if (number === 3 && wireType === 0) result.unsavedChanges = !!value;
      else if (number === 4 && wireType === 2) {
        result.saveChanges = {};
        new ByteReader(value).fields(function (n, w, v) { if (n === 1 && w === 0) result.saveChanges.ok = !!v; if (n === 2 && w === 0) result.saveChanges.error = v; });
      } else if (number === 5 && wireType === 0) result.discardChanges = !!value;
    });
    return result;
  }
  function decodeRequestResponse(bytes) {
    var result = { requestId: 0 };
    new ByteReader(bytes).fields(function (number, wireType, value) {
      if (number === 1 && wireType === 0) result.requestId = value;
      if (number === 2 && wireType === 2) { result.subsystem = 'meta'; result.data = decodeMeta(value); }
      if (number === 3 && wireType === 2) { result.subsystem = 'core'; result.data = decodeCoreResponse(value); }
      if (number === 4 && wireType === 2) { result.subsystem = 'behaviors'; result.data = decodeBehaviorResponse(value); }
      if (number === 5 && wireType === 2) { result.subsystem = 'keymap'; result.data = decodeKeymapResponse(value); }
    });
    return result;
  }
  function decodeStudioResponse(bytes) {
    var result = { notification: false };
    new ByteReader(bytes).fields(function (number, wireType, value) { if (number === 1 && wireType === 2) result.response = decodeRequestResponse(value); if (number === 2 && wireType === 2) result.notification = true; });
    return result;
  }

  function encodeBinding(binding) { return concat(fieldSInt32(1, binding.behaviorId || 0), fieldVarint(2, binding.param1 || 0), fieldVarint(3, binding.param2 || 0)); }
  function encodeCoreRequest(operation) { return boolField({ getDeviceInfo: 1, getLockState: 2, lock: 3, resetSettings: 4 }[operation]); }
  function encodeBehaviorRequest(operation, behaviorId) { return operation === 'listAllBehaviors' ? boolField(1) : fieldMessage(2, fieldVarint(1, behaviorId)); }
  function encodeKeymapRequest(operation, payload) {
    if (operation === 'getKeymap') return boolField(1);
    if (operation === 'checkUnsavedChanges') return boolField(3);
    if (operation === 'saveChanges') return boolField(4);
    if (operation === 'discardChanges') return boolField(5);
    if (operation === 'getPhysicalLayouts') return boolField(6);
    if (operation === 'setActivePhysicalLayout') return fieldVarint(7, payload);
    if (operation === 'setLayerBinding') return fieldMessage(2, concat(fieldVarint(1, payload.layerId), fieldVarint(2, payload.keyPosition), fieldMessage(3, encodeBinding(payload.binding))));
    if (operation === 'addLayer') return fieldMessage(9, new Uint8Array());
    if (operation === 'removeLayer') return fieldMessage(10, fieldVarint(1, payload));
    if (operation === 'moveLayer') return fieldMessage(8, concat(fieldVarint(1, payload.startIndex), fieldVarint(2, payload.destIndex)));
    if (operation === 'restoreLayer') return fieldMessage(11, concat(fieldVarint(1, payload.layerId), fieldVarint(2, payload.atIndex)));
    if (operation === 'setLayerProps') return fieldMessage(12, concat(fieldVarint(1, payload.layerId), fieldString(2, payload.name)));
    throw new Error('unsupported keymap operation ' + operation);
  }
  function encodeRequest(requestId, subsystem, operation, payload) {
    var tag = subsystem === 'core' ? 3 : subsystem === 'behaviors' ? 4 : 5;
    var body = subsystem === 'core' ? encodeCoreRequest(operation) : subsystem === 'behaviors' ? encodeBehaviorRequest(operation, payload) : encodeKeymapRequest(operation, payload);
    return concat(fieldVarint(1, requestId), fieldMessage(tag, body));
  }

  function StudioRpcClient(transport) { this.transport = transport; this.requestId = 1; this.serial = Promise.resolve(); }
  StudioRpcClient.prototype._requestNow = async function (subsystem, operation, payload, timeoutMs) {
    var id = this.requestId++;
    if (this.requestId > 0x7FFFFFFF) this.requestId = 1;
    var deadline = Date.now() + (timeoutMs || 5000);
    var framePromise = this.transport._waitForFrame(Math.max(250, deadline - Date.now()));
    try { await this.transport.sendFramedPayload(encodeRequest(id, subsystem, operation, payload)); }
    catch (error) { this.transport._rejectPending(error); throw error; }
    while (Date.now() < deadline) {
      var frame = await framePromise;
      var decoded = decodeStudioResponse(frame);
      if (!decoded.response || decoded.response.requestId !== id) {
        framePromise = this.transport._waitForFrame(Math.max(250, deadline - Date.now()));
        continue;
      }
      if (decoded.response.subsystem === 'meta' && decoded.response.data && decoded.response.data.simpleError !== undefined) {
        var rpcError = new Error('ZMK Studio RPC error ' + decoded.response.data.simpleError);
        rpcError.code = decoded.response.data.simpleError;
        throw rpcError;
      }
      return decoded.response;
    }
    throw new Error('ZMK Studio RPC response timeout');
  };
  StudioRpcClient.prototype.request = function (subsystem, operation, payload, timeoutMs) {
    var self = this;
    var task = this.serial.then(function () { return self._requestNow(subsystem, operation, payload, timeoutMs); });
    this.serial = task.catch(function () {});
    return task;
  };
  StudioRpcClient.prototype.getDeviceInfo = async function () { return (await this.request('core', 'getDeviceInfo')).data.deviceInfo; };
  StudioRpcClient.prototype.getLockState = async function () { return (await this.request('core', 'getLockState')).data.lockState; };
  StudioRpcClient.prototype.getKeymap = async function () { return (await this.request('keymap', 'getKeymap')).data.keymap; };
  StudioRpcClient.prototype.listBehaviors = async function () { return (await this.request('behaviors', 'listAllBehaviors')).data.behaviors || []; };
  StudioRpcClient.prototype.getBehaviorDetails = async function (id) { return (await this.request('behaviors', 'getBehaviorDetails', id)).data.behaviorDetails; };
  StudioRpcClient.prototype.setLayerBinding = async function (layerId, keyPosition, binding) { return this.request('keymap', 'setLayerBinding', { layerId: layerId, keyPosition: keyPosition, binding: binding }); };
  StudioRpcClient.prototype.saveChanges = async function () { return this.request('keymap', 'saveChanges'); };
  StudioRpcClient.prototype.readDeviceState = async function () {
    var info = await this.getDeviceInfo();
    var lockState = await this.getLockState();
    var keymap = await this.getKeymap();
    var idSet = Object.create(null);
    keymap.layers.forEach(function (layer) { layer.bindings.forEach(function (binding) { idSet[String(binding.behaviorId)] = true; }); });
    var ids = Object.keys(idSet).map(function (id) { return Number(id); });
    var details = [];
    for (var i = 0; i < ids.length; i++) { try { details.push(await this.getBehaviorDetails(ids[i])); } catch (error) {} }
    return { info: info, lockState: lockState, keymap: keymap, behaviors: details };
  };
  StudioRpcClient.prototype.writeKeymap = async function (changes) {
    for (var i = 0; i < changes.length; i++) await this.setLayerBinding(changes[i].layerId, changes[i].keyPosition, changes[i].binding);
    await this.saveChanges();
    return this.getKeymap();
  };

  function FramedTransport(options) {
    options = options || {};
    this.onFrame = typeof options.onFrame === 'function' ? options.onFrame : function () {};
    this.onStatus = typeof options.onStatus === 'function' ? options.onStatus : function () {};
    this.onDevice = typeof options.onDevice === 'function' ? options.onDevice : function () {};
    this.onLog = typeof options.onLog === 'function' ? options.onLog : function () {};
    this._inFrame = false; this._escaped = false; this._frameBytes = []; this._pending = [];
  }
  FramedTransport.prototype._setStatus = function (text) { try { this.onStatus(text); } catch (error) {} };
  FramedTransport.prototype._setDevice = function (text) { try { this.onDevice(text || '—'); } catch (error) {} };
  FramedTransport.prototype._setLog = function (text) { try { this.onLog(String(text || '')); } catch (error) {} };
  FramedTransport.prototype._consume = function (bytes) {
    for (var i = 0; i < bytes.length; i++) {
      var byte = bytes[i];
      if (!this._inFrame) { if (byte === SOF) { this._inFrame = true; this._escaped = false; this._frameBytes = []; } continue; }
      if (this._escaped) { this._frameBytes.push(byte); this._escaped = false; continue; }
      if (byte === ESC) { this._escaped = true; continue; }
      if (byte === EOF_BYTE) { var frame = new Uint8Array(this._frameBytes); this._inFrame = false; this._frameBytes = []; try { this.onFrame(frame); } catch (error) {} this._resolvePending(frame); continue; }
      if (byte === SOF) { this._frameBytes = []; this._escaped = false; continue; }
      this._frameBytes.push(byte);
    }
  };
  FramedTransport.prototype._waitForFrame = function (timeoutMs) {
    var self = this;
    return new Promise(function (resolve, reject) {
      var entry = { resolve: resolve, reject: reject };
      var timer = setTimeout(function () { self._pending = self._pending.filter(function (item) { return item !== entry; }); reject(new Error('Timed out waiting for framed response')); }, timeoutMs || 3000);
      entry.resolve = function (frame) { clearTimeout(timer); resolve(frame); };
      self._pending.push(entry);
    });
  };
  FramedTransport.prototype._resolvePending = function (frame) { var item = this._pending.shift(); if (item) item.resolve(frame); };
  FramedTransport.prototype._rejectPending = function (error) { this._pending.splice(0).forEach(function (item) { item.reject(error); }); };
  FramedTransport.prototype.requestFramedPayload = async function (payload, options) { await this.sendFramedPayload(payload); return this._waitForFrame((options || {}).timeoutMs || 3000); };
  Object.defineProperty(FramedTransport.prototype, 'canWriteKeymap', { get: function () { return RPC_SCHEMA_SUPPORTED; } });

  function ZmkSerialTransport(options) { FramedTransport.call(this, options); this.port = null; this.reader = null; this.writer = null; this.reading = false; this._disconnecting = false; }
  ZmkSerialTransport.prototype = Object.create(FramedTransport.prototype); ZmkSerialTransport.prototype.constructor = ZmkSerialTransport;
  Object.defineProperty(ZmkSerialTransport.prototype, 'isConnected', { get: function () { return !!this.port && this.reading; } });
  ZmkSerialTransport.prototype.connect = async function () {
    if (this.isConnected) return true;
    if (typeof navigator === 'undefined' || !navigator.serial) { this._setStatus('USB非対応ブラウザーです'); return false; }
    try { this._setStatus('USBデバイス選択待ち…'); this.port = await navigator.serial.requestPort(); await this.port.open({ baudRate: 115200, dataBits: 8, stopBits: 1, parity: 'none', flowControl: 'none' }); this.reading = true; this._setDevice('USB device'); this._setStatus('USB接続済み（ZMK Studio RPC）'); this._readLoop(); return true; }
    catch (error) { this.port = null; this.reader = null; this.reading = false; this._setDevice('—'); this._setStatus(error && error.name === 'NotFoundError' ? 'USBデバイス選択がキャンセルされました' : 'USB接続失敗: ' + (error && error.message ? error.message : 'unknown error')); return false; }
  };
  ZmkSerialTransport.prototype.disconnect = async function (silent) { var had = !!this.port || !!this.reader; this._disconnecting = true; try { if (this.reader) await this.reader.cancel(); } catch (error) {} try { if (this.writer) this.writer.releaseLock(); } catch (error) {} try { if (this.port) await this.port.close(); } catch (error) {} this.reader = null; this.writer = null; this.port = null; this.reading = false; this._disconnecting = false; this._rejectPending(new Error('USB disconnected')); this._setDevice('—'); if (had && !silent) this._setStatus('USB切断済み'); };
  ZmkSerialTransport.prototype._readLoop = async function () { while (this.port && this.reading && !this._disconnecting) { try { this.reader = this.port.readable.getReader(); while (this.reading && !this._disconnecting) { var result = await this.reader.read(); if (result.done) break; if (result.value) this._consume(result.value); } this.reader.releaseLock(); this.reader = null; } catch (error) { if (this.reader) try { this.reader.releaseLock(); } catch (releaseError) {} this.reader = null; if (!this._disconnecting) { this.reading = false; this._setStatus('USB受信失敗: ' + (error.message || 'unknown error')); } } } };
  ZmkSerialTransport.prototype.sendFramedPayload = async function (payload) { if (!this.isConnected) throw new Error('USB未接続です'); if (!this.port || !this.port.writable) throw new Error('USB writer unavailable'); var writer = this.writer || this.port.writable.getWriter(); this.writer = writer; await writer.write(encodeFrame(payload)); return true; };

  var BLE_NAME_PREFIXES = ['sosho', 'soho', 'SO-SHO', 'SOHO', 'ZMK'];
  function ZmkBleTransport(options) { FramedTransport.call(this, options); this.device = null; this.server = null; this.service = null; this.characteristic = null; this.macroService = null; this.studioAvailable = false; this.reading = false; this._connecting = false; this._onValue = this._handleValue.bind(this); this._onDisconnected = this._handleDisconnected.bind(this); }
  ZmkBleTransport.prototype = Object.create(FramedTransport.prototype); ZmkBleTransport.prototype.constructor = ZmkBleTransport;
  Object.defineProperty(ZmkBleTransport.prototype, 'isSupported', { get: function () { return typeof navigator !== 'undefined' && !!navigator.bluetooth && typeof window !== 'undefined' && window.isSecureContext === true; } });
  Object.defineProperty(ZmkBleTransport.prototype, 'isConnected', { get: function () { return !!this.device && !!this.server && this.server.connected && this.reading; } });
  Object.defineProperty(ZmkBleTransport.prototype, 'canWriteKeymap', { get: function () { return RPC_SCHEMA_SUPPORTED && this.studioAvailable; } });
  ZmkBleTransport.prototype.getDiagnostics = async function () {
    var secure = typeof window !== 'undefined' && window.isSecureContext === true;
    var bluetooth = typeof navigator !== 'undefined' && !!navigator.bluetooth;
    var availability = null;
    var availabilityError = '';
    var authorizedDeviceCount = null;
    var authorizedDeviceNames = [];
    var authorizedDevicesError = '';
    if (bluetooth && typeof navigator.bluetooth.getAvailability === 'function') {
      try { availability = await navigator.bluetooth.getAvailability(); } catch (error) { availabilityError = error && error.message ? error.message : String(error); }
    }
    if (bluetooth && typeof navigator.bluetooth.getDevices === 'function') {
      try {
        var authorizedDevices = await navigator.bluetooth.getDevices();
        authorizedDeviceCount = authorizedDevices.length;
        authorizedDeviceNames = authorizedDevices.map(function (device) { return device && device.name ? device.name : '名称なし'; });
      } catch (error) { authorizedDevicesError = error && error.message ? error.message : String(error); }
    }
    return {
      secureContext: secure,
      webBluetooth: bluetooth,
      availability: availability,
      availabilityApi: bluetooth && typeof navigator.bluetooth.getAvailability === 'function',
      getDevicesApi: bluetooth && typeof navigator.bluetooth.getDevices === 'function',
      authorizedDeviceCount: authorizedDeviceCount,
      authorizedDeviceNames: authorizedDeviceNames,
      authorizedDevicesError: authorizedDevicesError,
      requestDeviceApi: bluetooth && typeof navigator.bluetooth.requestDevice === 'function',
      deviceName: this.device && this.device.name ? this.device.name : '',
      gattConnected: !!(this.server && this.server.connected),
      officialServiceDiscovered: !!this.service,
      officialCharacteristicDiscovered: !!this.characteristic,
      studioAvailable: !!this.studioAvailable,
      officialServiceUuid: BLE_SERVICE_UUID,
      officialCharacteristicUuid: BLE_CHARACTERISTIC_UUID,
      normalFilterMode: 'namePrefix + official/custom service filters',
      broadFilterMode: 'diagnostic-only acceptAllDevices',
      availabilityError: availabilityError
    };
  };
  ZmkBleTransport.prototype.diagnosticConnect = async function () {
    if (!this.isSupported) { this._setStatus('診断失敗: HTTPS/localhostまたはWeb Bluetoothが必要です'); return false; }
    if (this._connecting) return false;
    this._connecting = true;
    try {
      this._setStatus('BLE診断: 全デバイス検索の許可待ち…');
      this._setLog('requestDevice開始（診断専用 acceptAllDevices）');
      var device = await navigator.bluetooth.requestDevice({ acceptAllDevices: true, optionalServices: [BLE_SERVICE_UUID, MACRO_SERVICE_UUID] });
      this._setLog('Device Picker選択: ' + (device && device.name ? device.name : '名称なし'));
      return await this._attach(device);
    } catch (error) {
      var name = error && error.name ? error.name : 'Error';
      var message = error && error.message ? error.message : 'unknown error';
      this._setLog('診断接続失敗 [' + name + ']: ' + message);
      if (name === 'NotFoundError') {
        this._setStatus('BLE診断: Device Pickerで選択されず終了（キャンセルまたは対象未検出）');
        this._setLog('ファームウェア/GATT未検証: Device Pickerで対象デバイスを選択するまで接続処理は開始されません');
      } else {
        this._setStatus('BLE診断失敗 [' + name + ']: ' + message);
      }
      return false;
    } finally { this._connecting = false; }
  };
  ZmkBleTransport.prototype._handleValue = function (event) { var value = event && event.target && event.target.value; if (value) this._consume(new Uint8Array(value.buffer, value.byteOffset, value.byteLength)); };
  ZmkBleTransport.prototype._handleDisconnected = function () { this.reading = false; this.studioAvailable = false; this.server = null; this.service = null; this.macroService = null; this.characteristic = null; this._rejectPending(new Error('BLE disconnected')); this._setLog('GATT切断イベントを受信'); this._setStatus('BLE切断: キーボードが見つかりません'); this._setDevice(this.device && this.device.name ? this.device.name : '—'); };
  ZmkBleTransport.prototype._attach = async function (device) {
    this.device = device; this.device.addEventListener('gattserverdisconnected', this._onDisconnected); this._setDevice(device.name || 'sosho'); this._setLog('デバイス選択完了: ' + (device.name || '名称なし')); if (!device.gatt) throw new Error('GATT unavailable'); this._setLog('GATT接続開始'); this.server = await device.gatt.connect(); this._setLog('GATT接続成功'); this.service = null; this.characteristic = null; this.macroService = null; this.studioAvailable = false;
    try { this._setLog('公式Service discovery開始: ' + BLE_SERVICE_UUID); this.service = await this.server.getPrimaryService(BLE_SERVICE_UUID); this._setLog('公式Service discovery成功'); this._setLog('公式Characteristic discovery開始: ' + BLE_CHARACTERISTIC_UUID); this.characteristic = await this.service.getCharacteristic(BLE_CHARACTERISTIC_UUID); this._setLog('公式Characteristic discovery成功'); this.characteristic.addEventListener('characteristicvaluechanged', this._onValue); this._setLog('公式Characteristic notifications開始'); await this.characteristic.startNotifications(); this.reading = true; this.studioAvailable = true; this._setLog('Studio RPC transport準備完了'); this._setStatus('BLE接続済み（公式ZMK Studioサービス）'); return true; }
    catch (studioError) { var studioName = studioError && studioError.name ? studioError.name : 'Error'; var studioMessage = studioError && studioError.message ? studioError.message : 'GATT service not found'; this._setLog('公式GATT discovery失敗 [' + studioName + ']: ' + studioMessage); try { this._setLog('SO-SHOマクロService discovery開始: ' + MACRO_SERVICE_UUID); this.macroService = await this.server.getPrimaryService(MACRO_SERVICE_UUID); this._setLog('SO-SHOマクロService discovery成功（公式Studio RPCは未接続）'); this.reading = true; this._setStatus('BLE接続済み（SO-SHOマクロサービスのみ）'); return true; } catch (macroError) { var macroName = macroError && macroError.name ? macroError.name : 'Error'; var macroMessage = macroError && macroError.message ? macroError.message : 'GATT service not found'; this._setLog('SO-SHOマクロService discovery失敗 [' + macroName + ']: ' + macroMessage); this._handleDisconnected(); throw new Error('公式ZMK Studioサービスに接続できません: ' + studioMessage); } }
  };
  ZmkBleTransport.prototype._authorizedDevice = async function () { if (typeof navigator.bluetooth.getDevices !== 'function') return null; try { var devices = await navigator.bluetooth.getDevices(); return devices.find(function (device) { var name = device && device.name || ''; return BLE_NAME_PREFIXES.some(function (prefix) { return name.indexOf(prefix) === 0; }); }) || null; } catch (error) { return null; } };
  ZmkBleTransport.prototype.connectAuthorized = async function () {
    if (this.isConnected) return true;
    if (!this.isSupported) { this._setStatus('Web Bluetooth非対応、またはHTTPS/localhostが必要です'); return false; }
    if (typeof navigator.bluetooth.getDevices !== 'function') { this._setLog('許可済みデバイス再接続不可: getDevices APIがありません'); this._setStatus('許可済みBLE再接続はこのブラウザーでは利用できません'); return false; }
    if (this._connecting) return false;
    this._connecting = true;
    try {
      this._setStatus('許可済みBLEデバイスを確認中…');
      this._setLog('getDevices開始（許可済みデバイス再接続）');
      var devices = await navigator.bluetooth.getDevices();
      this._setLog('getDevices完了: ' + devices.length + '件');
      var device = devices.find(function (candidate) {
        var name = candidate && candidate.name || '';
        return BLE_NAME_PREFIXES.some(function (prefix) { return name.indexOf(prefix) === 0; });
      });
      if (!device) {
        this._setLog('許可済みSO-SHOデバイスが見つかりません');
        this._setStatus('許可済みSO-SHOがありません。初回は「BLE接続」で選択してください');
        return false;
      }
      this._setLog('許可済みデバイスを再接続: ' + (device.name || '名称なし'));
      return await this._attach(device);
    } catch (error) {
      var name = error && error.name ? error.name : 'Error';
      var message = error && error.message ? error.message : 'unknown error';
      this._setLog('許可済みBLE再接続失敗 [' + name + ']: ' + message);
      this._setStatus('許可済みBLE再接続失敗 [' + name + ']: ' + message);
      return false;
    } finally { this._connecting = false; }
  };
  ZmkBleTransport.prototype.connect = async function () {
    if (this.isConnected) return true; if (!this.isSupported) { this._setStatus('Web Bluetooth非対応、またはHTTPS/localhostが必要です'); return false; } if (this._connecting) return false; this._connecting = true;
    try {
      // requestDevice() must be reached directly from the button's user activation.
      // Awaiting getAvailability()/getDevices() first can consume that activation in
      // Chrome and leave the user with no Device Picker and no useful error.
      if (this.device && this.device.gatt && !this.device.gatt.connected) {
        try { return await this._attach(this.device); } catch (reconnectError) { this._handleDisconnected(); }
      }
      this._setStatus('BLEデバイス選択待ち…（通常フィルター）');
      this._setLog('requestDevice開始（通常フィルター）');
      var filters = BLE_NAME_PREFIXES.map(function (prefix) { return { namePrefix: prefix }; }).concat([{ services: [BLE_SERVICE_UUID] }, { services: [MACRO_SERVICE_UUID] }]);
      var device = await navigator.bluetooth.requestDevice({ filters: filters, optionalServices: [BLE_SERVICE_UUID, MACRO_SERVICE_UUID] });
      this._setLog('Device Picker選択: ' + (device && device.name ? device.name : '名称なし'));
      return await this._attach(device);
    }
    catch (error) { this.reading = false; this.studioAvailable = false; this.server = null; this.service = null; this.macroService = null; this.characteristic = null; var name = error && error.name; var message = error && error.message ? error.message : 'unknown error'; this._setLog('BLE接続失敗 [' + (name || 'Error') + ']: ' + message); if (name === 'NotFoundError') { this._setStatus('BLE: Device Pickerで選択されず終了（キャンセルまたは対象未検出）'); this._setLog('ファームウェア/GATT未検証: Device Pickerでsoshoを選択するまで接続処理は開始されません'); } else if (name === 'SecurityError' || name === 'NotAllowedError') this._setStatus('BLE権限が拒否されました [' + name + ']: ' + message); else this._setStatus('BLE接続失敗 [' + (name || 'Error') + ']: ' + message); return false; }
    finally { this._connecting = false; }
  };
  ZmkBleTransport.prototype.reconnect = async function () { await this.disconnect(true); return this.connect(); };
  ZmkBleTransport.prototype.disconnect = async function (silent) { var had = !!this.device || !!this.server; try { if (this.characteristic) await this.characteristic.stopNotifications(); } catch (error) {} try { if (this.characteristic) this.characteristic.removeEventListener('characteristicvaluechanged', this._onValue); } catch (error) {} try { if (this.device) this.device.removeEventListener('gattserverdisconnected', this._onDisconnected); } catch (error) {} try { if (this.device && this.device.gatt && this.device.gatt.connected) this.device.gatt.disconnect(); } catch (error) {} this.reading = false; this.studioAvailable = false; this.server = null; this.service = null; this.macroService = null; this.characteristic = null; this._rejectPending(new Error('BLE disconnected')); if (!silent && had) this._setStatus('BLE切断済み'); if (!silent) this._setDevice('—'); };
  ZmkBleTransport.prototype.sendFramedPayload = async function (payload) { if (!this.isConnected || !this.studioAvailable) throw new Error('公式ZMK Studio BLEサービスに未接続です'); var bytes = encodeFrame(payload); if (this.characteristic.writeValueWithResponse) await this.characteristic.writeValueWithResponse(bytes); else await this.characteristic.writeValue(bytes); return true; };

  global.ZmkSerialTransport = ZmkSerialTransport;
  global.ZmkBleTransport = ZmkBleTransport;
  global.ZmkStudioRpc = StudioRpcClient;
  global.ZmkStudioProtocol = { SOF: SOF, ESC: ESC, EOF: EOF_BYTE, BLE_SERVICE_UUID: BLE_SERVICE_UUID, BLE_CHARACTERISTIC_UUID: BLE_CHARACTERISTIC_UUID, MACRO_SERVICE_UUID: MACRO_SERVICE_UUID, BLE_NAME_PREFIXES: BLE_NAME_PREFIXES, encodeFrame: encodeFrame, RPC_SCHEMA_SUPPORTED: RPC_SCHEMA_SUPPORTED, RPC_UNSUPPORTED_REASON: RPC_UNSUPPORTED_REASON, decodeStudioResponse: decodeStudioResponse };
})(window);
