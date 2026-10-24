(function (global) {
  'use strict';

  var editor = global.soshoEditor;
  var readButton = document.getElementById('read-keymap');
  var writeButton = document.getElementById('write-keymap');
  var status = document.getElementById('rpc-status');
  var footer = document.querySelector('.inspector .footer-note');
  var deviceState = null;
  var rawById = Object.create(null);
  var labelById = Object.create(null);
  var behaviorById = Object.create(null);
  var readInProgress = false;

  if (footer) footer.textContent = 'ローカル編集はlocalStorageに保存されます。公式RPCで読み取りに成功した後だけ、実機への書き込みボタンが有効になります。';
  if (!editor || !readButton || !writeButton || typeof global.ZmkStudioRpc !== 'function') return;

  function uiId(layerIndex, position) {
    var row = position < 12 ? 0 : position < 24 ? 1 : position < 36 ? 2 : 3;
    var inRow = row === 0 ? position : row === 1 ? position - 12 : row === 2 ? position - 24 : position - 36;
    var side = row < 3 ? (inRow < 6 ? 'left' : 'right') : (inRow < 4 ? 'left' : 'right');
    var index = row < 3 ? (row * 6 + (inRow % 6)) : (inRow < 4 ? 18 + inRow : 18 + inRow - 4);
    return 'l' + layerIndex + '-' + side + '-' + index;
  }

  function detailFor(id) { return behaviorById[String(id)] || null; }
  function parameterName(detail, parameter, value) {
    var sets = detail && detail.metadata || [];
    for (var i = 0; i < sets.length; i++) {
      var values = parameter === 1 ? sets[i].param1 : sets[i].param2;
      for (var j = 0; j < (values || []).length; j++) {
        if (values[j].type === 'constant' && values[j].constant === value) return values[j].name;
      }
    }
    return '';
  }

  function hidUsageLabel(value) {
    var number = Number(value);
    if (!Number.isFinite(number)) return '';
    var usage = number >>> 0;
    if (Math.floor(usage / 0x10000) !== 0x07) return '';
    var code = usage & 0xffff;
    if (code >= 0x04 && code <= 0x1d) return String.fromCharCode(65 + code - 0x04);
    if (code >= 0x1e && code <= 0x27) return String(code === 0x27 ? 0 : code - 0x1d);
    var names = {
      0x28: 'ENTER', 0x29: 'ESC', 0x2a: 'BACKSPACE', 0x2b: 'TAB', 0x2c: 'SPACE',
      0x2d: '-', 0x2e: '=', 0x2f: '[', 0x30: ']', 0x31: '\\', 0x33: ';', 0x34: "'", 0x35: '`',
      0x36: ',', 0x37: '.', 0x38: '/', 0x39: 'CAPS LOCK', 0x46: 'PRINT SCREEN',
      0x47: 'SCROLL LOCK', 0x48: 'PAUSE', 0x49: 'INSERT', 0x4a: 'HOME', 0x4b: 'PAGE UP',
      0x4c: 'DELETE', 0x4d: 'END', 0x4e: 'PAGE DOWN', 0x4f: 'RIGHT', 0x50: 'LEFT',
      0x51: 'DOWN', 0x52: 'UP', 0x53: 'NUM LOCK', 0xe0: 'LCTRL', 0xe1: 'LSHIFT',
      0xe2: 'LALT', 0xe3: 'LGUI', 0xe4: 'RCTRL', 0xe5: 'RSHIFT', 0xe6: 'RALT', 0xe7: 'RGUI'
    };
    if (code >= 0x3a && code <= 0x45) return 'F' + String(code - 0x39);
    return names[code] || 'HID 0x' + code.toString(16).toUpperCase();
  }

  function readableParameter(value) {
    return hidUsageLabel(value) || String(value);
  }

  function firstHidUsage(binding) {
    var values = [binding && binding.param1, binding && binding.param2, binding && binding.value, binding && binding.behaviorId];
    for (var i = 0; i < values.length; i++) {
      var label = hidUsageLabel(values[i]);
      if (label) return label;
    }
    return '';
  }

  function friendlyBehaviorName(name) {
    var normalized = String(name || '').trim().toLowerCase();
    if (/key\s*press|^kp$/.test(normalized)) return 'Key';
    if (/momentary.*layer|^mo$/.test(normalized)) return 'Layer';
    if (/toggle.*layer|^tg$/.test(normalized)) return 'Layer toggle';
    if (/transparent|^trans$/.test(normalized)) return 'Transparent';
    if (/none|no.?op/.test(normalized)) return 'None';
    return String(name || 'Action');
  }

  function layerNumber(detail, value) {
    var named = parameterName(detail, 1, value);
    var namedMatch = /(?:layer|mo|tg)\s*(\d+)/i.exec(String(named || ''));
    if (namedMatch) return namedMatch[1];
    var number = Number(value);
    return Number.isInteger(number) && number >= 0 && number < 16 ? String(number) : '';
  }

  function bindingLabel(binding) {
    var detail = detailFor(binding.behaviorId);
    if (!detail) return 'Action';
    var behaviorName = friendlyBehaviorName(detail.displayName);
    if (behaviorName === 'Key') return firstHidUsage(binding) || readableParameter(binding.param1) || 'Key';
    if (behaviorName === 'Layer') {
      var layer = layerNumber(detail, binding.param1);
      return layer ? 'Layer ' + layer : 'Layer';
    }
    if (behaviorName === 'Layer toggle') {
      var toggleLayer = layerNumber(detail, binding.param1);
      return toggleLayer ? 'Layer toggle ' + toggleLayer : 'Layer toggle';
    }
    var first = parameterName(detail, 1, binding.param1);
    var second = parameterName(detail, 2, binding.param2);
    var params = [first || readableParameter(binding.param1), second || readableParameter(binding.param2)];
    while (params.length && (params[params.length - 1] === 0 || params[params.length - 1] === '0')) params.pop();
    return behaviorName + (params.length ? ' · ' + params.join(', ') : '');
  }

  function sameBinding(a, b) {
    return !!a && !!b && a.behaviorId === b.behaviorId && a.param1 === b.param1 && a.param2 === b.param2;
  }

  function setStatus(text) {
    status.textContent = text;
    if (typeof global.soshoLog === 'function') global.soshoLog('rpc', text);
    var detail = String(text || '');
    if (/失敗|タイムアウト|応答なし|見つかりません/.test(detail)) {
      if (typeof global.soshoConnectionError === 'function') {
        global.soshoConnectionError(
          'キーマップ通信に失敗しました。',
          'USBポート自体は接続されていますが、現在のファームウェアからZMK Studio RPCの応答がありません。右側Centralであること、対応ファームウェアであること、他のシリアル接続が閉じていることを確認してください。'
        );
      }
    } else if (/読み取り成功|保存後の再読み取り成功/.test(detail) && typeof global.soshoClearConnectionError === 'function') {
      global.soshoClearConnectionError();
    }
  }

  function mapDeviceState() {
    var keymap = deviceState.keymap;
    rawById = Object.create(null);
    labelById = Object.create(null);
    keymap.layers.forEach(function (layer, layerIndex) {
      var uiLayer = editor.getLayers()[layerIndex];
      if (uiLayer && layer.name) uiLayer.name = layer.name;
      layer.bindings.forEach(function (binding, position) {
        var id = uiId(layerIndex, position);
        rawById[id] = binding;
        labelById[id] = bindingLabel(binding);
        editor.setAssignment(id, labelById[id]);
      });
    });
    if (typeof global.soshoSetKeymapLoaded === 'function') global.soshoSetKeymapLoaded(true);
    else editor.render();
  }

  async function readKeymap() {
    if (readInProgress) return false;
    var transport = editor.getTransport();
    if (!transport || !transport.isConnected) { setStatus('先に公式ZMK Studioサービスへ接続してください'); return false; }
    if (!transport.canWriteKeymap) { setStatus('接続済みですが、公式ZMK Studio GATTサービスが見つかりません'); return false; }
    readInProgress = true;
    try {
      readButton.disabled = true; writeButton.disabled = true; setStatus('公式RPCでキーマップを読み取り中…');
      var rpc = new global.ZmkStudioRpc(transport);
      deviceState = await rpc.readDeviceState();
      behaviorById = Object.create(null);
      (deviceState.behaviors || []).forEach(function (detail) { behaviorById[String(detail.id)] = detail; });
      mapDeviceState();
      global.soshoStudioState = { rpc: rpc, deviceState: deviceState, rawById: rawById, labelById: labelById };
      var lockText = deviceState.lockState === 1 ? 'Studioロック解除済み' : deviceState.lockState === 0 ? 'Studioロック中（キーボードの&studio_unlockを押すと保存可能）' : 'lockState=' + deviceState.lockState;
      setStatus('読み取り成功: ' + (deviceState.info && deviceState.info.name ? deviceState.info.name : 'sosho') + ' / ' + deviceState.keymap.layers.length + ' layers / ' + lockText);
      return true;
    } catch (error) {
      deviceState = null; if (typeof global.soshoSetKeymapLoaded === 'function') global.soshoSetKeymapLoaded(false); setStatus('公式RPC読み取り失敗: ' + (error.message || error));
      return false;
    } finally { readInProgress = false; updateButtons(); }
  }

  function resolveBinding(label, raw) {
    if (label === labelById[raw && raw._id]) return raw;
    var direct = /^#(-?\d+)\((\d+),(\d+)\)$/.exec(String(label || '').trim());
    if (direct) return { behaviorId: Number(direct[1]), param1: Number(direct[2]), param2: Number(direct[3]) };
    var match = null;
    Object.keys(behaviorById).some(function (id) {
      var detail = behaviorById[id];
      var name = String(detail.displayName || '').toLowerCase();
      if (name.indexOf('key') < 0 && name.indexOf('press') < 0 && name !== 'kp') return false;
      (detail.metadata || []).some(function (set) {
        return (set.param1 || []).some(function (value) {
          if (value.type === 'constant' && String(value.name).toLowerCase() === String(label).toLowerCase()) { match = { behaviorId: detail.id, param1: value.constant, param2: 0 }; return true; }
          return false;
        });
      });
      return !!match;
    });
    return match;
  }

  async function writeKeymap() {
    var transport = editor.getTransport();
    if (!deviceState || !transport || !transport.isConnected || !transport.canWriteKeymap) { setStatus('先にキーマップを読み取り、公式RPC接続を確認してください'); return; }
    if (deviceState.lockState !== 1) { setStatus('Studioロック中です。キーボードのLayer 3にある&studio_unlockを押してから、もう一度読み取りを実行してください'); return; }
    var changes = [];
    try {
      deviceState.keymap.layers.forEach(function (layer, layerIndex) {
        layer.bindings.forEach(function (original, position) {
          var id = uiId(layerIndex, position);
          original._id = id;
          var desiredLabel = editor.getAssignments()[id] || labelById[id];
          var desired = resolveBinding(desiredLabel, original);
          if (!desired) throw new Error(id + ' の割り当てを公式behavior bindingへ変換できません: ' + desiredLabel);
          if (!sameBinding(original, desired)) changes.push({ layerId: layer.id, keyPosition: position, binding: desired });
        });
      });
      setStatus(changes.length ? changes.length + '件を公式RPCで保存中…' : '変更なし。保存後の再読み取りを行います…');
      var rpc = global.soshoStudioState.rpc;
      var afterWrite = await rpc.writeKeymap(changes);
      deviceState.keymap = afterWrite;
      var verified = await rpc.readDeviceState();
      deviceState = verified;
      mapDeviceState();
      var lockText = verified.lockState === 1 ? 'Studioロック解除済み' : verified.lockState === 0 ? 'Studioロック中' : 'lockState=' + verified.lockState;
      setStatus('保存・再読み取り成功: ' + changes.length + '件 / ' + lockText);
    } catch (error) { setStatus('公式RPC書き込み失敗: ' + (error.message || error)); }
    finally { updateButtons(); }
  }

  function updateButtons() {
    var transport = editor.getTransport();
    var ready = !!(transport && transport.isConnected && transport.canWriteKeymap);
    if (!ready && deviceState) { deviceState = null; global.soshoStudioState = null; }
    readButton.disabled = !ready;
    writeButton.disabled = !ready || !deviceState || deviceState.lockState !== 1;
  }

  readButton.addEventListener('click', readKeymap);
  writeButton.addEventListener('click', writeKeymap);
  global.soshoReadKeymap = readKeymap;
  setInterval(updateButtons, 350);
  updateButtons();
})(window);
