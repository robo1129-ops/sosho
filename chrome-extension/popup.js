(function () {
  'use strict';

  var BLE_SERVICE_UUID = '00000000-0196-6107-c967-c5cfb1c2482a';
  var BLE_CHARACTERISTIC_UUID = '00000001-0196-6107-c967-c5cfb1c2482a';
  var MACRO_SERVICE_UUID = '7f5e0000-8a2a-4c2f-b93e-55f4b5d30001';
  var statusEl = document.getElementById('status');
  var logEl = document.getElementById('log');
  var checkButton = document.getElementById('check');
  var connectButton = document.getElementById('connect');
  var disconnectButton = document.getElementById('disconnect');
  var copyButton = document.getElementById('copy');
  var clearButton = document.getElementById('clear');
  var logs = [];
  var device = null;
  var server = null;
  var characteristic = null;

  function escapeHtml(value) {
    return String(value == null ? '' : value).replace(/[&<>"']/g, function (ch) {
      return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch];
    });
  }

  function renderLogs() {
    logEl.innerHTML = logs.length ? logs.map(function (entry) {
      return '<li><time>' + escapeHtml(entry.time) + '</time>' + escapeHtml(entry.text) + '</li>';
    }).join('') : '<li>まだログはありません</li>';
    logEl.scrollTop = logEl.scrollHeight;
  }

  function persistLogs() {
    try { chrome.storage.local.set({ soshoBleDiagnosticLogs: logs.slice(-120) }); } catch (error) {}
  }

  function log(text) {
    var entry = { time: new Date().toLocaleTimeString(), text: String(text) };
    logs.push(entry);
    if (logs.length > 120) logs.shift();
    renderLogs();
    persistLogs();
  }

  function setStatus(text) {
    statusEl.textContent = text;
    log(text);
  }

  function setConnected(connected) {
    connectButton.disabled = connected;
    disconnectButton.disabled = !connected;
  }

  async function restoreLogs() {
    try {
      var stored = await chrome.storage.local.get('soshoBleDiagnosticLogs');
      if (Array.isArray(stored.soshoBleDiagnosticLogs)) {
        logs = stored.soshoBleDiagnosticLogs;
        renderLogs();
      }
    } catch (error) {
      log('ログ復元失敗: ' + error.message);
    }
  }

  async function checkBrowser() {
    var secure = window.isSecureContext === true;
    var bluetooth = !!navigator.bluetooth;
    log('Secure Context: ' + (secure ? 'PASS' : 'FAIL'));
    log('navigator.bluetooth: ' + (bluetooth ? 'PASS' : 'FAIL'));
    log('requestDevice API: ' + (bluetooth && typeof navigator.bluetooth.requestDevice === 'function' ? 'PASS' : 'FAIL'));
    log('getDevices API: ' + (bluetooth && typeof navigator.bluetooth.getDevices === 'function' ? 'PASS' : 'NOT_VERIFIED'));
    log('Chrome bluetoothLowEnergy API: ' + (typeof chrome !== 'undefined' && chrome.bluetoothLowEnergy ? 'AVAILABLE' : 'NOT_AVAILABLE（Windowsでは想定内）'));
    if (bluetooth && typeof navigator.bluetooth.getAvailability === 'function') {
      try { log('Bluetooth availability: ' + (await navigator.bluetooth.getAvailability() ? 'PASS' : 'FAIL')); }
      catch (error) { log('getAvailability失敗 [' + error.name + ']: ' + error.message); }
    }
  }

  async function connect() {
    if (!window.isSecureContext || !navigator.bluetooth) {
      setStatus('Web Bluetoothを利用できません');
      return;
    }
    connectButton.disabled = true;
    try {
      // Keep requestDevice as the first awaited Web Bluetooth operation after the click.
      log('requestDevice開始（acceptAllDevices）');
      device = await navigator.bluetooth.requestDevice({
        acceptAllDevices: true,
        optionalServices: [BLE_SERVICE_UUID, MACRO_SERVICE_UUID]
      });
      log('Device Picker選択: ' + (device.name || '名称なし'));
      device.addEventListener('gattserverdisconnected', onDisconnected);
      if (!device.gatt) throw new Error('GATT unavailable');
      log('GATT接続開始');
      server = await device.gatt.connect();
      log('GATT接続成功');
      log('公式Service discovery開始: ' + BLE_SERVICE_UUID);
      var service = await server.getPrimaryService(BLE_SERVICE_UUID);
      log('公式Service discovery成功');
      log('公式Characteristic discovery開始: ' + BLE_CHARACTERISTIC_UUID);
      characteristic = await service.getCharacteristic(BLE_CHARACTERISTIC_UUID);
      log('公式Characteristic discovery成功');
      await characteristic.startNotifications();
      log('公式Characteristic notifications開始');
      setStatus('BLE/GATT接続済み');
      setConnected(true);
    } catch (error) {
      var name = error && error.name ? error.name : 'Error';
      var message = error && error.message ? error.message : String(error);
      log('接続失敗 [' + name + ']: ' + message);
      setStatus(name === 'NotFoundError' ? 'Device Pickerで選択されず終了（キャンセルまたは対象未検出）' : '接続失敗 [' + name + ']');
      if (name === 'NotFoundError') log('soshoを一覧で選択するまでGATT接続は開始されません。ファームウェアの成否は未判定です。');
      device = null;
      server = null;
      characteristic = null;
      setConnected(false);
    }
  }

  function onDisconnected() {
    log('GATT切断イベントを受信');
    server = null;
    characteristic = null;
    setConnected(false);
    statusEl.textContent = '切断済み';
  }

  function disconnect() {
    try { if (device && device.gatt && device.gatt.connected) device.gatt.disconnect(); }
    catch (error) { log('切断失敗 [' + error.name + ']: ' + error.message); }
    onDisconnected();
  }

  checkButton.addEventListener('click', checkBrowser);
  connectButton.addEventListener('click', connect);
  disconnectButton.addEventListener('click', disconnect);
  copyButton.addEventListener('click', async function () {
    var text = logs.map(function (entry) { return entry.time + ' ' + entry.text; }).join('\n');
    try { await navigator.clipboard.writeText(text); log('ログをコピーしました'); }
    catch (error) { log('ログコピー失敗: ' + error.message); }
  });
  clearButton.addEventListener('click', function () { logs = []; persistLogs(); renderLogs(); });
  setConnected(false);
  restoreLogs();
}());
