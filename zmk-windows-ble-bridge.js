(function (global) {
  'use strict';

  function decodeBase64(value) {
    var binary = atob(String(value || ''));
    var bytes = new Uint8Array(binary.length);
    for (var i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
    return bytes;
  }

  function encodeBase64(bytes) {
    var source = bytes instanceof Uint8Array ? bytes : new Uint8Array(bytes || []);
    var binary = '';
    for (var i = 0; i < source.length; i++) binary += String.fromCharCode(source[i]);
    return btoa(binary);
  }

  function ZmkWindowsBleBridgeTransport(options) {
    options = options || {};
    if (typeof ZmkBleTransport !== 'function') throw new Error('ZmkBleTransport is required');
    ZmkBleTransport.call(this, options);
    this.kind = 'ble';
    this.transportLabel = 'Windows BLE';
    this.isWindowsBleBridge = true;
    // Do not let the first keymap request race the Windows GATT connection or
    // the split Central's radio link.  The value is intentionally local to
    // the transport so USB/direct BLE keep their existing timings.
    this.rpcTimeoutMs = Math.max(8000, Number(options.rpcTimeoutMs) || 12000);
    this.startupSettleMs = Math.max(500, Number(options.startupSettleMs) || 1400);
    this.deferBehaviorDetails = true;
    this.requiredSide = 'central';
    this.socket = null;
    this.reading = false;
    this.studioAvailable = false;
    this._connecting = false;
    this._connectResolve = null;
    this._connectReject = null;
    this._url = options.url || 'ws://127.0.0.1:8765';
    // Windows can hide advertisements while the keyboard is connected as an
    // HID device. The bridge resolves paired devices directly, and that
    // lookup can take longer than a normal WebSocket handshake.
    this._timeoutMs = Math.max(15000, Number(options.timeoutMs) || 45000);
  }
  ZmkWindowsBleBridgeTransport.prototype = Object.create(ZmkBleTransport.prototype);
  ZmkWindowsBleBridgeTransport.prototype.constructor = ZmkWindowsBleBridgeTransport;
  Object.defineProperty(ZmkWindowsBleBridgeTransport.prototype, 'isSupported', { get: function () { return typeof WebSocket === 'function'; } });
  Object.defineProperty(ZmkWindowsBleBridgeTransport.prototype, 'isConnected', { get: function () { return !!this.socket && this.socket.readyState === WebSocket.OPEN && this.reading; } });
  Object.defineProperty(ZmkWindowsBleBridgeTransport.prototype, 'canWriteKeymap', { get: function () { return global.ZmkStudioProtocol.RPC_SCHEMA_SUPPORTED && this.studioAvailable && this.reading; } });

  ZmkWindowsBleBridgeTransport.prototype._send = function (payload) {
    if (!this.socket || this.socket.readyState !== WebSocket.OPEN) throw new Error('Windows BLEブリッジが接続されていません');
    this.socket.send(JSON.stringify(payload));
  };
  ZmkWindowsBleBridgeTransport.prototype._handleMessage = function (event) {
    var message;
    try { message = JSON.parse(String(event.data || '{}')); } catch (error) { this._setLog('ブリッジ応答のJSON解析失敗: ' + error.message); return; }
    if (message.type === 'frame') { this._consume(decodeBase64(message.data)); return; }
    if (message.type === 'devices') {
      var devices = Array.isArray(message.devices) ? message.devices.slice() : [];
      if (!devices.length) { this._setStatus('SO-SHOのBLEデバイスが見つかりません'); return; }
      devices.sort(function (left, right) {
        return Number(!!right.matchesOfficialService) - Number(!!left.matchesOfficialService) || Number(!!right.matchesPrefix) - Number(!!left.matchesPrefix) || Number(right.rssi || -999) - Number(left.rssi || -999);
      });
      this._setStatus('SO-SHO候補を選択中: ' + (devices[0].name || devices[0].id));
      this._send({ op: 'select', deviceId: devices[0].id });
      return;
    }
    if (message.type === 'status') { this._setStatus(message.message || 'Windows BLEブリッジ'); this._setLog(message.message || ''); return; }
    if (message.type === 'connected') {
      this.reading = true; this.studioAvailable = true; this._setDevice(message.name || 'SO-SHO / Windows BLE'); this._setStatus('Windows BLE接続済み（公式ZMK Studio GATT / RPC準備完了）'); this._setLog('公式Service/Characteristicを確認しました'); var connectedButton = document.getElementById('connect-windows-ble'); if (connectedButton) connectedButton.disabled = true;
      if (this._connectResolve) this._connectResolve(true); this._connectResolve = null; this._connectReject = null; return;
    }
    if (message.type === 'error') {
      var detail = message.message || 'Windows BLEブリッジで接続に失敗しました'; this._setLog(detail); this._setStatus('Windows BLE接続失敗: ' + detail);
      if (this._connectReject) this._connectReject(new Error(detail)); this._connectResolve = null; this._connectReject = null; return;
    }
    if (message.type === 'disconnected') { this._handleDisconnected(); }
  };
  ZmkWindowsBleBridgeTransport.prototype._handleDisconnected = function () { this.reading = false; this.studioAvailable = false; this._rejectPending(new Error('Windows BLEブリッジが切断されました')); this._setStatus('Windows BLEブリッジ切断済み'); this._setDevice('—'); var connectedButton = document.getElementById('connect-windows-ble'); if (connectedButton) connectedButton.disabled = false; };
  ZmkWindowsBleBridgeTransport.prototype.connect = function () {
    var self = this;
    if (this.isConnected) return Promise.resolve(true);
    if (!this.isSupported) { this._setStatus('WebSocketを利用できません'); return Promise.resolve(false); }
    if (this._connecting) return Promise.resolve(false);
    var previous = this.socket;
    this.socket = null;
    if (previous) try { previous.close(); } catch (error) {}
    this._connecting = true;
    return new Promise(function (resolve, reject) {
      var socket, timer, settled = false;
      function finish(error) {
        if (settled) return;
        settled = true;
        clearTimeout(timer);
        if (self.socket === socket) {
          self._connecting = false;
          self._connectResolve = null;
          self._connectReject = null;
        }
        if (error) {
          if (self.socket === socket) self.socket = null;
          if (socket) try { socket.close(); } catch (closeError) {}
          reject(error);
        } else resolve(true);
      }
      self._connectResolve = function () { finish(); };
      self._connectReject = function (error) { finish(error); };
      try {
        socket = new WebSocket(self._url);
        self.socket = socket;
        socket.addEventListener('open', function () {
          if (self.socket !== socket) return;
          self._setStatus('Windows BLEブリッジへ接続済み。SO-SHOを検索中…');
          self._send({ op: 'connect', namePrefix: 'sosho' });
        });
        socket.addEventListener('message', function (event) {
          if (self.socket === socket) self._handleMessage(event);
        });
        socket.addEventListener('error', function () {
          if (self.socket !== socket) return;
          var error = new Error('Windows BLEブリッジに接続できません。セットアップ済みのブリッジが起動しているか確認してください。');
          if (!settled) finish(error);
          else self._setStatus(error.message);
        });
        socket.addEventListener('close', function () {
          if (self.socket !== socket) return;
          if (!settled) finish(new Error('Windows BLEブリッジが接続処理中に切断されました。'));
          self._handleDisconnected();
        });
        timer = setTimeout(function () {
          if (self.socket !== socket || settled) return;
          finish(new Error('Windows BLEブリッジの接続がタイムアウトしました。SO-SHOのBluetooth接続先を確認して再接続してください。'));
        }, self._timeoutMs);
      } catch (error) { finish(error); }
    }).then(function () { return true; }).catch(function (error) {
      self._connecting = false;
      self._setStatus(error.message || String(error));
      return false;
    });
  };
  ZmkWindowsBleBridgeTransport.prototype.disconnect = async function () { if (this._connecting && this._connectReject) this._connectReject(new Error('Windows BLE接続を中止しました')); this._connecting = false; try { if (this.socket && this.socket.readyState === WebSocket.OPEN) this._send({ op: 'disconnect' }); } catch (error) {} this.reading = false; this.studioAvailable = false; this._rejectPending(new Error('Windows BLEブリッジが切断されました')); if (this.socket) try { this.socket.close(); } catch (error) {} this.socket = null; this._setDevice('—'); this._setStatus('Windows BLEブリッジ切断済み'); };
  ZmkWindowsBleBridgeTransport.prototype.sendFramedPayload = function (payload) { this._send({ op: 'write', data: encodeBase64(global.ZmkStudioProtocol.encodeFrame(payload)) }); return Promise.resolve(); };
  ZmkWindowsBleBridgeTransport.prototype.getDiagnostics = async function () { return { platform: 'Windows localhost BLE bridge', bridgeUrl: this._url, gattConnected: this.isConnected, officialServiceUuid: global.ZmkStudioProtocol.BLE_SERVICE_UUID, officialCharacteristicUuid: global.ZmkStudioProtocol.BLE_CHARACTERISTIC_UUID, keymapRpcReady: this.canWriteKeymap }; };

  var actions = document.querySelector('.connection-actions');
  if (actions && !document.getElementById('connect-windows-ble')) {
    var button = document.createElement('button');
    button.id = 'connect-windows-ble';
    button.type = 'button';
    button.textContent = 'Windows BLE接続（広告不要）';
    button.title = 'WindowsのBluetoothでペアリング済みのSO-SHOへ接続します。Chromeの一覧に表示されない場合も利用できます。';
    actions.insertBefore(button, document.getElementById('disconnect') || null);
  }
  global.ZmkWindowsBleBridgeTransport = ZmkWindowsBleBridgeTransport;
}(window));
