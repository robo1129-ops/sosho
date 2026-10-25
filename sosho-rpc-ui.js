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
  var behaviorIds = [];
  var readInProgress = false;
  var writePhase = 'idle';
  var verificationRoot = document.getElementById('rpc-verification');
  var verificationModel = {
    prepare: { state: 'idle', detail: 'USB接続と読み取りが必要です。' },
    write: { state: 'idle', detail: '保存を押すと開始します。' },
    save: { state: 'idle', detail: 'ファームウェアの保存応答を待ちます。' },
    verify: { state: 'idle', detail: '実機の現在値と照合します。' }
  };
  var verificationResult = { state: 'idle', detail: 'まだ実機への書き込み確認は実行されていません。' };
  var defaultVerificationLabels = {
    idle: '待機中', running: '実行中', success: '成功', failure: '失敗',
    resultIdle: '未実行', resultRunning: '確認中', resultSuccess: '実機反映成功', resultFailure: '実機反映を確認できません'
  };

  if (footer) footer.textContent = 'ローカル編集はlocalStorageに保存されます。USB接続中に保存を押すと、現在の実機キーマップを自動読み取りしてから書き込み・再読み取り確認まで実行します。';
  function verificationLabels() {
    return Object.assign({}, defaultVerificationLabels, global.soshoRpcVerificationLabels || {});
  }

  function renderVerification() {
    if (!verificationRoot) return;
    var labels = verificationLabels();
    Object.keys(verificationModel).forEach(function (key) {
      var item = verificationRoot.querySelector('[data-rpc-verify-step="' + key + '"]');
      if (!item) return;
      var model = verificationModel[key];
      item.dataset.state = model.state;
      var stateNode = item.querySelector('.rpc-verify-state');
      var detailNode = item.querySelector('.rpc-verify-detail');
      if (stateNode) stateNode.textContent = labels[model.state] || model.state;
      if (detailNode) detailNode.textContent = model.detail || '';
    });
    var result = document.getElementById('rpc-verification-result');
    if (result) {
      result.dataset.state = verificationResult.state;
      result.textContent = labels['result' + verificationResult.state.charAt(0).toUpperCase() + verificationResult.state.slice(1)] || verificationResult.state;
    }
    var detail = document.getElementById('rpc-verification-detail');
    if (detail) { detail.dataset.state = verificationResult.state; detail.textContent = verificationResult.detail || ''; }
  }

  function setVerificationStep(key, state, detail) {
    if (!verificationModel[key]) return;
    verificationModel[key] = { state: state, detail: String(detail || '') };
    renderVerification();
  }

  function setVerificationResult(state, detail) {
    verificationResult = { state: state, detail: String(detail || '') };
    renderVerification();
  }

  function resetVerification(detail) {
    setVerificationStep('prepare', 'idle', 'USB接続と読み取りが必要です。');
    setVerificationStep('write', 'idle', '保存を押すと開始します。');
    setVerificationStep('save', 'idle', 'ファームウェアの保存応答を待ちます。');
    setVerificationStep('verify', 'idle', '実機の現在値と照合します。');
    setVerificationResult('idle', detail || 'まだ実機への書き込み確認は実行されていません。');
  }

  global.soshoRefreshRpcVerification = renderVerification;
  renderVerification();

  function uiId(layerIndex, position) {
    var row = position < 12 ? 0 : position < 24 ? 1 : position < 36 ? 2 : 3;
    var inRow = row === 0 ? position : row === 1 ? position - 12 : row === 2 ? position - 24 : position - 36;
    var side = row < 3 ? (inRow < 6 ? 'left' : 'right') : (inRow < 4 ? 'left' : 'right');
    var index = row < 3 ? (row * 6 + (inRow % 6)) : (inRow < 4 ? 18 + inRow : 18 + inRow - 4);
    return 'l' + layerIndex + '-' + side + '-' + index;
  }

  function detailFor(id) { return behaviorById[String(id)] || null; }

  // ZMK Studio derives a behavior's local ID from the device-tree node name
  // with Zephyr's CRC16/ANSI implementation (reflected polynomial, 0xffff
  // initial value). The custom SO-SHO behavior is named sosho_controls.
  function crc16Ansi(text) {
    var crc = 0xffff;
    var bytes = new TextEncoder().encode(String(text || ''));
    for (var i = 0; i < bytes.length; i++) {
      crc ^= bytes[i];
      for (var bit = 0; bit < 8; bit++) crc = (crc & 1) ? ((crc >>> 1) ^ 0xA001) : (crc >>> 1);
    }
    return crc & 0xffff;
  }
  var soshoControlsBehaviorId = crc16Ansi('sosho_controls');
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

  var modifierBits = {
    LCTRL: 0x01, LSHIFT: 0x02, LSHFT: 0x02, LALT: 0x04, LGUI: 0x08,
    RCTRL: 0x10, RSHIFT: 0x20, RSHFT: 0x20, RALT: 0x40, RGUI: 0x80
  };
  var modifierAliases = {
    CTRL: 'LCTRL', LCTRL: 'LCTRL', RCTRL: 'RCTRL', SHIFT: 'LSHIFT', LSHIFT: 'LSHIFT', LSHFT: 'LSHIFT',
    RSHIFT: 'RSHIFT', RSHFT: 'RSHIFT', ALT: 'LALT', LALT: 'LALT', RALT: 'RALT',
    GUI: 'LGUI', WIN: 'LGUI', LGUI: 'LGUI', RGUI: 'RGUI'
  };
  var modifierLabels = {
    LCTRL: 'Ctrl', LSHIFT: 'Shift', LALT: 'Alt', LGUI: 'GUI',
    RCTRL: 'Right Ctrl', RSHIFT: 'Right Shift', RALT: 'Right Alt', RGUI: 'Right GUI'
  };
  function canonicalModifier(value) {
    return modifierAliases[String(value || '').trim().toUpperCase()] || '';
  }
  function parseModifiedLabel(value) {
    var parts = String(value || '').trim().split('+');
    if (parts.length < 2) return { base: String(value || '').trim(), modifiers: [], mask: 0, valid: false };
    var modifiers = [], mask = 0;
    for (var i = 0; i < parts.length - 1; i++) {
      var modifier = canonicalModifier(parts[i]);
      if (!modifier || modifiers.indexOf(modifier) >= 0) continue;
      modifiers.push(modifier);
      mask |= modifierBits[modifier];
    }
    var valid = modifiers.length === parts.length - 1 && !!parts[parts.length - 1];
    return { base: parts[parts.length - 1], modifiers: modifiers, mask: mask, valid: valid };
  }
  function hidUsageLabel(value) {
    var number = Number(value);
    if (!Number.isFinite(number)) return '';
    var usage = number >>> 0;
    if (((usage >>> 16) & 0xff) !== 0x07) return '';
    var modifierMask = usage >>> 24;
    var code = usage & 0xffff;
    var modifierText = [];
    Object.keys(modifierBits).forEach(function (name) {
      var canonical = canonicalModifier(name);
      if (canonical && modifierText.indexOf(canonical) < 0 && (modifierMask & modifierBits[name])) modifierText.push(canonical);
    });
    var names = {
      0x28: 'ENTER', 0x29: 'ESC', 0x2a: 'BACKSPACE', 0x2b: 'TAB', 0x2c: 'SPACE',
      0x2d: '-', 0x2e: '=', 0x2f: '[', 0x30: ']', 0x31: '\\', 0x33: ';', 0x34: "'", 0x35: '`',
      0x36: ',', 0x37: '.', 0x38: '/', 0x39: 'CAPS LOCK', 0x46: 'PRINT SCREEN',
      0x47: 'SCROLL LOCK', 0x48: 'PAUSE', 0x49: 'INSERT', 0x4a: 'HOME', 0x4b: 'PAGE UP',
      0x4c: 'DELETE', 0x4d: 'END', 0x4e: 'PAGE DOWN', 0x4f: 'RIGHT', 0x50: 'LEFT',
      0x51: 'DOWN', 0x52: 'UP', 0x53: 'NUM LOCK', 0xe0: 'LCTRL', 0xe1: 'LSHIFT',
      0xe2: 'LALT', 0xe3: 'LGUI', 0xe4: 'RCTRL', 0xe5: 'RSHIFT', 0xe6: 'RALT', 0xe7: 'RGUI'
    };
    var base = code >= 0x04 && code <= 0x1d
      ? String.fromCharCode(65 + code - 0x04)
      : code >= 0x1e && code <= 0x27
        ? String(code === 0x27 ? 0 : code - 0x1d)
        : code >= 0x3a && code <= 0x45
          ? 'F' + String(code - 0x39)
          : (names[code] || 'HID 0x' + code.toString(16).toUpperCase());
    return modifierText.length ? modifierText.map(function (name) { return modifierLabels[name] || name; }).join('+') + '+' + base : base;
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

  function keyboardUsageForHoldLabel(value) {
    var modified = parseModifiedLabel(value);
    var normalized = String(modified.valid ? modified.base : value || '').toUpperCase().replace(/[\s_\-\/]+/g, '');
    var named = {
      BACKSPACE: 0x2a, BSPC: 0x2a, ENTER: 0x28, RET: 0x28, RETURN: 0x28,
      ESCAPE: 0x29, ESC: 0x29, TAB: 0x2b, SPACE: 0x2c, SPC: 0x2c,
      INSERT: 0x49, INS: 0x49, DELETE: 0x4c, DEL: 0x4c, HOME: 0x4a,
      END: 0x4d, PAGEUP: 0x4b, PGUP: 0x4b, PAGEDOWN: 0x4e, PGDN: 0x4e,
      RIGHT: 0x4f, LEFT: 0x50, DOWN: 0x51, UP: 0x52,
      CTRL: 0xe0, LCTRL: 0xe0, SHIFT: 0xe1, LSHIFT: 0xe1,
      ALT: 0xe2, LALT: 0xe2, GUI: 0xe3, WIN: 0xe3,
      RCTRL: 0xe4, RSHIFT: 0xe5, RALT: 0xe6, RGUI: 0xe7
    };
    var code = named[normalized];
    if (code === undefined && /^[A-Z]$/.test(normalized)) code = 0x04 + normalized.charCodeAt(0) - 65;
    if (code === undefined && /^[0-9]$/.test(normalized)) code = normalized === '0' ? 0x27 : 0x1d + Number(normalized);
    var functionKey = /^F([1-9]|1[0-9]|2[0-4])$/.exec(normalized);
    if (code === undefined && functionKey) code = 0x39 + Number(functionKey[1]);
    return code === undefined ? null : ((modified.valid ? modified.mask : 0) << 24) | (0x07 << 16) | code;
  }

  // Expose the pure conversion path for the local smoke test.  This does not
  // expose transport handles or device state; it only makes modifier parsing
  // and HID packing testable without a connected keyboard.
  global.soshoModifierDiagnostics = {
    parse: parseModifiedLabel,
    label: hidUsageLabel,
    keyboardUsage: keyboardUsageForHoldLabel
  };

  if (!editor || !readButton || !writeButton || typeof global.ZmkStudioRpc !== 'function') return;

  function layerNumberFromLabel(value) {
    var match = /^(?:MO|TO|TG|TT|OSL|LAYER|MOMENTARY LAYER|LAYER TOGGLE|TAP-TOGGLE LAYER|ONE-SHOT LAYER)\s*(\d+)$/i.exec(String(value || '').trim());
    return match ? Number(match[1]) : null;
  }

  function layerActionKind(value) {
    var text = String(value || '').trim().toUpperCase().replace(/[\u2010-\u2015\s_\-\/]+/g, ' ');
    var match = /^(MO|TO|TG|TT|OSL)\s*(\d+)$/.exec(text);
    if (!match) return null;
    return { kind: match[1], layer: Number(match[2]) };
  }

  function layerBehaviorFor(kind) {
    var patterns = {
      MO: /momentary|momentary layer|^mo$|layer.*hold|hold.*layer/,
      TO: /(^|\s)to(\s|$)|to layer|set layer|switch layer|select layer/,
      TG: /toggle.*layer|layer.*toggle|^tg$/,
      TT: /tap.*toggle|tap.*to.*toggle|^tt$/,
      OSL: /one.?shot.*layer|layer.*one.?shot|sticky\s+layer|^osl$/
    };
    var pattern = patterns[kind];
    if (!pattern) return null;
    var ids = Object.keys(behaviorById);
    for (var i = 0; i < ids.length; i++) {
      var detail = behaviorById[ids[i]] || {};
      var name = String(detail.displayName || '').trim().toLowerCase();
      var hasLayer = (detail.metadata || []).some(function (set) {
        return (set.param1 || []).some(function (value) { return value.type === 'layer_id'; });
      });
      if (hasLayer && pattern.test(name)) return detail;
    }
    return null;
  }

  function holdTapParameter(detail, slot, label) {
    var values = [];
    (detail && detail.metadata || []).some(function (set) {
      values = slot === 1 ? (set.param1 || []) : (set.param2 || []);
      return values.length > 0;
    });
    var wanted = String(label || '').trim();
    if (!wanted) return null;
    var usage = keyboardUsageForHoldLabel(wanted);
    if (usage !== null && values.some(function (value) { return value.type === 'hid_usage'; })) return usage;
    var layer = layerNumberFromLabel(wanted);
    if (layer !== null && values.some(function (value) { return value.type === 'layer_id'; })) return layer;
    var normalized = wanted.toUpperCase().replace(/[\s_\-\/]+/g, '');
    for (var i = 0; i < values.length; i++) {
      var valueName = String(values[i].name || '').toUpperCase().replace(/[\s_\-\/]+/g, '');
      if (valueName === normalized && values[i].type === 'constant') return values[i].constant;
    }
    return null;
  }

  function resolveHoldTapBinding(tapLabel, holdLabel) {
    var candidates = Object.keys(behaviorById).map(function (id) { return behaviorById[id]; }).filter(function (detail) {
      return detail && /(?:mod|layer|hold)[\s-]*tap/i.test(String(detail.displayName || '')) && (detail.metadata || []).some(function (set) { return (set.param1 || []).length && (set.param2 || []).length; });
    });
    for (var i = 0; i < candidates.length; i++) {
      var detail = candidates[i];
      var holdValue = holdTapParameter(detail, 1, holdLabel);
      var tapValue = holdTapParameter(detail, 2, tapLabel);
      if (holdValue !== null && tapValue !== null) return { behaviorId: Number(detail.id), param1: holdValue, param2: tapValue };
    }
    return null;
  }

  function setStatus(text) {
    status.textContent = text;
    if (typeof global.soshoLog === 'function') global.soshoLog('rpc', text);
    var detail = String(text || '');
    if (/失敗|タイムアウト|応答なし|見つかりません/.test(detail)) {
      if (typeof global.soshoConnectionError === 'function') {
        global.soshoConnectionError(
          'キーマップ通信に失敗しました。',
          'USBポートは開けましたが、キーマップRPCの応答がありません。右側Centralを選択し、他のシリアル接続ソフトを閉じてから再接続してください。'
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
    // A device read is authoritative. Drop browser-only overrides first so
    // stale hold/tap entries cannot be mistaken for edits to another key.
    if (editor.resetForDevice) editor.resetForDevice();
    keymap.layers.forEach(function (layer, layerIndex) {
      var uiLayer = editor.getLayers()[layerIndex];
      if (uiLayer && layer.name) uiLayer.name = layer.name;
      layer.bindings.forEach(function (binding, position) {
        var id = uiId(layerIndex, position);
        rawById[id] = binding;
        labelById[id] = bindingLabel(binding);
        if (editor.setDeviceAssignment) editor.setDeviceAssignment(id, labelById[id]);
        else editor.setAssignment(id, labelById[id]);
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
      readButton.disabled = true; writeButton.disabled = true;
      setVerificationStep('prepare', 'running', '実機の現在のキーマップを読み取っています。');
      setVerificationResult('running', '実機の現在値を確認しています。');
      setStatus('公式RPCでキーマップを読み取り中…');
      var rpc = new global.ZmkStudioRpc(transport);
      deviceState = await rpc.readDeviceState();
      behaviorById = Object.create(null);
      behaviorIds = (deviceState.behaviorIds || []).map(Number).filter(function (id) { return Number.isFinite(id); });
      (deviceState.behaviors || []).forEach(function (detail) { behaviorById[String(detail.id)] = detail; });
      // Keep a read-only diagnostic snapshot available while validating
      // custom behavior resolution against real firmware.  It is not used by
      // the editor write path and contains only the behavior metadata already
      // returned by the connected device.
      global.soshoBehaviorDiagnostics = (deviceState.behaviors || []).map(function (detail) {
        return { id: detail.id, displayName: detail.displayName, metadata: detail.metadata };
      });
      try { console.info('[sosho-behaviors]', JSON.stringify(global.soshoBehaviorDiagnostics)); } catch (_) {}
      mapDeviceState();
      global.soshoStudioState = { rpc: rpc, deviceState: deviceState, rawById: rawById, labelById: labelById };
      var lockText = deviceState.lockState === 1 ? 'Studioロック解除済み' : deviceState.lockState === 0 ? 'Studioロック中（キーボードの&studio_unlockを押すと保存可能）' : 'lockState=' + deviceState.lockState;
      setVerificationStep('prepare', 'success', deviceState.keymap.layers.length + 'レイヤーを読み取りました。' + (deviceState.info && deviceState.info.name ? ' ' + deviceState.info.name : ''));
      setVerificationResult('idle', '読み取り済みです。変更後に保存すると、実機を再読み取りして一致確認します。');
      setStatus('読み取り成功: ' + (deviceState.info && deviceState.info.name ? deviceState.info.name : 'sosho') + ' / ' + deviceState.keymap.layers.length + ' layers / ' + lockText);
      return true;
    } catch (error) {
      deviceState = null; if (typeof global.soshoSetKeymapLoaded === 'function') global.soshoSetKeymapLoaded(false);
      setVerificationStep('prepare', 'failure', error.message || String(error));
      setVerificationResult('failure', '実機の現在値を読み取れなかったため、保存結果を確認できません。');
      setStatus('公式RPC読み取り失敗: ' + (error.message || error));
      return false;
    } finally { readInProgress = false; updateButtons(); }
  }

  function resolveBinding(label, raw) {
    if (label === labelById[raw && raw._id]) return raw;
    var direct = /^#(-?\d+)\((\d+),(\d+)\)$/.exec(String(label || '').trim());
    if (direct) return { behaviorId: Number(direct[1]), param1: Number(direct[2]), param2: Number(direct[3]) };
    // The palette uses descriptive Japanese labels for the reserved scroll
    // layer. Resolve them to the same official layer behaviors as MO(4) and
    // TG(4), so the user-facing label is not required to be a ZMK token.
    var descriptiveLayer = String(label || '').trim();
    if (descriptiveLayer === '押している間だけスクロール') {
      return resolveBinding('MO 4', raw);
    }
    if (descriptiveLayer === 'スクロール切替') {
      return resolveBinding('TG 4', raw);
    }
    var requestedLayer = layerActionKind(label);
    if (requestedLayer) {
      var layerDetail = layerBehaviorFor(requestedLayer.kind);
      if (layerDetail) {
        return { behaviorId: Number(layerDetail.id), param1: requestedLayer.layer, param2: 0 };
      }
    }
    // Bluetooth profile actions are firmware-defined behaviors, not HID
    // usages.  The picker exposes them as BT0..BT4 (and clear actions), but
    // their behavior id/parameter pair is supplied by the connected device.
    // Reusing a matching binding read from that device is both more precise
    // and compatible with custom ZMK Studio behavior ids.
    function bluetoothActionName(value) {
      var text = String(value || '').trim().toUpperCase().replace(/\s+/g, ' ');
      var profile = /^BT\s*([0-4])$/.exec(text);
      if (profile) return 'BT' + profile[1];
      if (/^BT\s*CLR\s*ALL$/.test(text) || /CLEAR\s+ALL/.test(text)) return 'BT CLR ALL';
      if (/^BT\s*CLR$/.test(text) || /BLUETOOTH.*(?:CLEAR|CLR)/.test(text)) return 'BT CLR';
      if (/BLUETOOTH.*SELECT\s+PROFILE/.test(text)) {
        var suffix = /(?:,|·)\s*([0-4])$/.exec(text);
        return suffix ? 'BT' + suffix[1] : 'BT0';
      }
      return '';
    }
    var wantedBluetoothAction = bluetoothActionName(label);
    if (wantedBluetoothAction) {
      var deviceAction = Object.keys(rawById).map(function (id) {
        return { binding: rawById[id], label: labelById[id] };
      }).find(function (entry) { return bluetoothActionName(entry.label) === wantedBluetoothAction; });
      if (deviceAction && deviceAction.binding) {
        return {
          behaviorId: deviceAction.binding.behaviorId,
          param1: deviceAction.binding.param1 || 0,
          param2: deviceAction.binding.param2 || 0
        };
      }
      // Some sosho firmware revisions expose BT1..BT4 as numeric behavior
      // labels (the firmware does not provide a display name for them).  The
      // five profile bindings are placed consecutively in Layer 3's left
      // module row 2, so retain their official id/parameter pair by position
      // when the label-based lookup cannot identify them.
      var profileNumber = /^BT([0-4])$/.exec(wantedBluetoothAction);
      if (profileNumber) {
        var profileId = 'l3-left-' + (6 + Number(profileNumber[1]));
        var positionalProfile = rawById[profileId];
        if (positionalProfile) {
          return {
            behaviorId: positionalProfile.behaviorId,
            param1: positionalProfile.param1 || 0,
            param2: positionalProfile.param2 || 0
          };
        }
        // A few builds omit the physical id from the decoded map.  In that
        // case the same bindings are exposed as numeric labels; preserve the
        // device order rather than inventing a generic HID binding.
        var numericProfiles = Object.keys(rawById).map(function (id) {
          return { id: id, binding: rawById[id], label: String(labelById[id] || '') };
        }).filter(function (entry) {
          return /^\d+$/.test(entry.label) && /left/.test(entry.id);
        }).sort(function (a, b) {
          var an = Number((/([0-9]+)$/.exec(a.id) || [0, 0])[1]);
          var bn = Number((/([0-9]+)$/.exec(b.id) || [0, 0])[1]);
          return an - bn;
        });
        var numericProfile = numericProfiles[Number(profileNumber[1]) - 1];
        if (numericProfile && numericProfile.binding) {
          return {
            behaviorId: numericProfile.binding.behaviorId,
            param1: numericProfile.binding.param1 || 0,
            param2: numericProfile.binding.param2 || 0
          };
        }
      }
      // If a clear action is not currently assigned, prefer a behavior whose
      // connected-device metadata names that operation.  This keeps BT CLR
      // and BT CLR ALL usable even on maps that do not already contain them.
      var bluetoothMatch = null;
      Object.keys(behaviorById).some(function (id) {
        var detail = behaviorById[id] || {};
        var name = String(detail.displayName || '').toUpperCase();
        var matches = wantedBluetoothAction === 'BT CLR ALL'
          ? /BLUETOOTH|BT/.test(name) && /CLEAR|CLR/.test(name) && /ALL/.test(name)
          : wantedBluetoothAction === 'BT CLR'
            ? /BLUETOOTH|BT/.test(name) && /CLEAR|CLR/.test(name) && !/ALL/.test(name)
            : false;
        if (!matches) return false;
        var firstSet = (detail.metadata || [])[0] || {};
        var first = (firstSet.param1 || [])[0];
        bluetoothMatch = { behaviorId: Number(detail.id), param1: first && first.constant || 0, param2: 0 };
        return true;
      });
      if (bluetoothMatch) return bluetoothMatch;
      // The current firmware exposes both clear actions as constants inside
      // the single Bluetooth behavior metadata.  They are not separate
      // behavior display names, so inspect the constant names as well.
      var clearConstant = wantedBluetoothAction === 'BT CLR ALL'
        ? /clear\s+all/i
        : wantedBluetoothAction === 'BT CLR'
          ? /clear\s+selected/i
          : null;
      if (clearConstant) {
        Object.keys(behaviorById).some(function (id) {
          var detail = behaviorById[id] || {};
          if (!/bluetooth/i.test(String(detail.displayName || ''))) return false;
          return (detail.metadata || []).some(function (set) {
            return (set.param1 || []).some(function (value) {
              if (value.type !== 'constant' || !clearConstant.test(String(value.name || ''))) return false;
              bluetoothMatch = { behaviorId: Number(detail.id), param1: Number(value.constant) || 0, param2: 0 };
              return true;
            });
          });
        });
      }
      if (bluetoothMatch) return bluetoothMatch;
    }
    // Output Selection is also firmware-defined.  Expose the constants that
    // the connected device advertises instead of inventing a HID keycode.
    var outputAction = String(label || '').trim().toUpperCase();
    var outputConstantName = {
      'USB OUTPUT': /USB\s+OUTPUT/,
      'BLE OUTPUT': /BLE\s+OUTPUT|BLUETOOTH\s+OUTPUT/,
      'TOGGLE OUTPUTS': /TOGGLE\s+OUTPUT/,
      'NO OUTPUT': /NO\s+OUTPUT/
    }[outputAction];
    if (outputConstantName) {
      var outputMatch = null;
      Object.keys(behaviorById).some(function (id) {
        var detail = behaviorById[id] || {};
        if (!/output\s+selection/i.test(String(detail.displayName || ''))) return false;
        return (detail.metadata || []).some(function (set) {
          return (set.param1 || []).some(function (value) {
            if (value.type !== 'constant' || !outputConstantName.test(String(value.name || ''))) return false;
            outputMatch = { behaviorId: Number(detail.id), param1: Number(value.constant) || 0, param2: 0 };
            return true;
          });
        });
      });
      if (outputMatch) return outputMatch;
    }
    /* SO-SHO firmware controls are ordinary Studio behaviors.  Resolve them
     * from the metadata advertised by the connected firmware instead of
     * sending a made-up HID keycode.  This keeps the editor compatible with
     * the firmware's actual behavior IDs after a build. */
    var customAction = String(label || '').trim().replace(/[−–—]/g, '-').replace(/\s+/g, ' ');
    var customActionMatchers = {
      'CPI -': /^CPI\s*-$/i,
      'CPI +': /^CPI\s*\+$/i,
      'Trackpad -': /^Trackpad\s*-$/i,
      'Trackpad +': /^Trackpad\s*\+$/i,
      'Auto Mouse ON/OFF': /^Auto\s+Mouse\s+(?:ON\/OFF|Toggle)$/i,
      'Wheel Up': /^Wheel\s+Up$/i,
      'Wheel Down': /^Wheel\s+Down$/i,
      'Wheel Left': /^Wheel\s+Left$/i,
      'Wheel Right': /^Wheel\s+Right$/i
    };
    var macroMatch = /^Macro\s+(\d+)$/i.exec(customAction);
    var customMatch = customActionMatchers[customAction] ||
      (macroMatch ? new RegExp('^Macro\\s+' + macroMatch[1] + '$', 'i') : null);
    if (customMatch) {
      var customBinding = null;
      Object.keys(behaviorById).some(function (id) {
        var detail = behaviorById[id] || {};
        return (detail.metadata || []).some(function (set) {
          return (set.param1 || []).some(function (value) {
            if (value.type !== 'constant' || !customMatch.test(String(value.name || ''))) return false;
            customBinding = { behaviorId: Number(detail.id), param1: Number(value.constant) || 0, param2: 0 };
            return true;
          });
        });
      });
      if (customBinding) return customBinding;

      // Some firmware exposes the behavior ID through listAllBehaviors but
      // cannot return its metadata. It is still safe to emit the binding:
      // the ID is advertised by the device and the parameter values are the
      // constants defined by sosho_behavior_controls.c.
      var advertisedControls = behaviorIds.some(function (id) { return Number(id) === soshoControlsBehaviorId; });
      if (!advertisedControls) {
        advertisedControls = Object.keys(behaviorById).some(function (id) {
          var detail = behaviorById[id] || {};
          return Number(id) === soshoControlsBehaviorId || /sosho[_ -]?controls/i.test(String(detail.displayName || detail.name || ''));
        });
      }
      if (advertisedControls) {
        var controlValue = {
          'CPI -': 0, 'CPI +': 1, 'Trackpad -': 2, 'Trackpad +': 3,
          'Auto Mouse ON/OFF': 4, 'Wheel Up': 5, 'Wheel Down': 6,
          'Wheel Left': 7, 'Wheel Right': 8
        }[customAction];
        if (controlValue !== undefined) return { behaviorId: soshoControlsBehaviorId, param1: controlValue, param2: 0 };
        if (macroMatch) {
          var macroValue = 9 + Number(macroMatch[1]);
          if (macroValue >= 9 && macroValue <= 24) return { behaviorId: soshoControlsBehaviorId, param1: macroValue, param2: 0 };
        }
      }
    }
    // Mouse button actions use the firmware's Mouse Key Press behavior.  The
    // palette uses human-readable names while ZMK Studio exposes MB1..MB5 as
    // constants, so resolve that mapping explicitly instead of treating the
    // labels as keyboard HID usages.
    var mouseButton = /^MOUSE\s+(LEFT|RIGHT|MIDDLE|BACK|FORWARD)$/.exec(String(label || '').trim().toUpperCase());
    if (mouseButton) {
      var buttonValue = { LEFT: 1, RIGHT: 2, MIDDLE: 4, BACK: 8, FORWARD: 16 }[mouseButton[1]];
      var mouseBinding = null;
      Object.keys(behaviorById).some(function (id) {
        var detail = behaviorById[id] || {};
        if (!/mouse\s+key\s+press/i.test(String(detail.displayName || ''))) return false;
        (detail.metadata || []).some(function (set) {
          return (set.param1 || []).some(function (value) {
            if (value.type === 'constant' && Number(value.constant) === buttonValue) {
              mouseBinding = { behaviorId: Number(detail.id), param1: buttonValue, param2: 0 };
              return true;
            }
            return false;
          });
        });
        return !!mouseBinding;
      });
      if (mouseBinding) return mouseBinding;
    }
    function normalizeKeyName(value) {
      return String(value || '').toUpperCase().replace(/[\s_\-\/]+/g, '');
    }
    function keyboardUsageForLabel(value) {
      var modified = parseModifiedLabel(value);
      var normalized = normalizeKeyName(modified.valid ? modified.base : value);
      var named = {
        BACKSPACE: 0x2a, BSPC: 0x2a, KCBSPC: 0x2a,
        ENTER: 0x28, RET: 0x28, RETURN: 0x28, KCENTER: 0x28, KCRET: 0x28,
        ESCAPE: 0x29, ESC: 0x29, KCESC: 0x29,
        TAB: 0x2b, KCTAB: 0x2b,
        SPACE: 0x2c, SPC: 0x2c, KCSPACE: 0x2c,
        INSERT: 0x49, INS: 0x49, KCINSERT: 0x49,
        DELETE: 0x4c, DEL: 0x4c, KCDELETE: 0x4c,
        HOME: 0x4a, KCHOME: 0x4a,
        END: 0x4d, KCEND: 0x4d,
        PAGEUP: 0x4b, PGUP: 0x4b, KCPGUP: 0x4b,
        PAGEDOWN: 0x4e, PGDN: 0x4e, PGDOWN: 0x4e, KCPGDN: 0x4e,
        CAPSLOCK: 0x39, KCCAPSLOCK: 0x39,
        NUMLOCK: 0x53, KCNUMLOCK: 0x53,
        SCROLLLOCK: 0x47, KCSCROLLLOCK: 0x47,
        PRINTSCREEN: 0x46, KCPRINTSCREEN: 0x46, PRTSC: 0x46,
        MENU: 0x65, APPLICATION: 0x65, KCAPPLICATION: 0x65,
        COMPOSE: 0x65, KCCOMPOSE: 0x65,
        INTERNATIONAL1: 0x87, KCINTERNATIONAL1: 0x87,
        INTERNATIONAL2: 0x88, KCINTERNATIONAL2: 0x88,
        'かな': 0x88, KANA: 0x88, KCKANA: 0x88,
        '半角全角': 0x94,
        RIGHT: 0x4f, RIGHTARROW: 0x4f, KCRIGHT: 0x4f,
        LEFT: 0x50, LEFTARROW: 0x50, KCLEFT: 0x50,
        DOWN: 0x51, DOWNARROW: 0x51, KCDOWN: 0x51,
        UP: 0x52, UPARROW: 0x52, KCUP: 0x52,
        CTRL: 0xe0, LCTRL: 0xe0, RCTRL: 0xe4,
        SHIFT: 0xe1, LSHIFT: 0xe1, RSHIFT: 0xe5,
        ALT: 0xe2, LALT: 0xe2, RALT: 0xe6,
        GUI: 0xe3, WIN: 0xe3, LGUI: 0xe3, RGUI: 0xe7
      };
      var code = named[normalized];
      if (code === undefined && /^[A-Z]$/.test(normalized)) code = 0x04 + normalized.charCodeAt(0) - 65;
      if (code === undefined && /^[0-9]$/.test(normalized)) code = normalized === '0' ? 0x27 : 0x1d + Number(normalized);
      var functionKey = /^F([1-9]|1[0-9]|2[0-4])$/.exec(normalized);
      if (code === undefined && functionKey) code = 0x39 + Number(functionKey[1]);
      return code === undefined ? null : ((modified.valid ? modified.mask : 0) << 24) | (0x07 << 16) | code;
    }
    function keyNameAliases(value) {
      var normalized = normalizeKeyName(value);
      var aliases = {
        DELETE: ['DELETE', 'DEL', 'KCDELETE'],
        BACKSPACE: ['BACKSPACE', 'BSPC', 'KCBSPC'],
        ENTER: ['ENTER', 'RET', 'RETURN', 'KCENTER', 'KCRET'],
        ESCAPE: ['ESCAPE', 'ESC', 'KCESC'],
        TAB: ['TAB', 'KCTAB'],
        SPACE: ['SPACE', 'SPC', 'KCSPACE'],
        'PAGEUP': ['PAGEUP', 'PGUP', 'PGUP', 'KCPGUP'],
        'PAGEDOWN': ['PAGEDOWN', 'PGDN', 'PGDOWN', 'KCPGDN'],
        LEFT: ['LEFT', 'LEFTARROW', 'KCLEFT'],
        RIGHT: ['RIGHT', 'RIGHTARROW', 'KCRIGHT'],
        UP: ['UP', 'UPARROW', 'KCUP'],
        DOWN: ['DOWN', 'DOWNARROW', 'KCDOWN'],
        INSERT: ['INSERT', 'INS', 'KCINSERT'],
        HOME: ['HOME', 'KCHOME'],
        END: ['END', 'KCEND']
      };
      return [normalized].concat(aliases[normalized] || []);
    }
    var wantedNames = keyNameAliases(label);
    var desiredUsage = keyboardUsageForLabel(label);
    function isWantedConstant(value) {
      var name = normalizeKeyName(value && value.name);
      if (wantedNames.indexOf(name) >= 0) return true;
      var hidName = normalizeKeyName(hidUsageLabel(value && value.constant));
      return wantedNames.indexOf(hidName) >= 0;
    }
    var match = null;
    // ZMK Studio exposes the key-press parameter as `hid_usage` rather than
    // as named constants. Reuse the current binding's behavior ID when it
    // already accepts that parameter, then encode the selected key as the
    // official keyboard HID usage value.
    if (desiredUsage !== null && raw) {
      var rawDetail = detailFor(raw.behaviorId);
      var rawHasHidUsage = (rawDetail && rawDetail.metadata || []).some(function (set) {
        return (set.param1 || []).some(function (value) { return value.type === 'hid_usage'; });
      });
      if (rawHasHidUsage) return { behaviorId: raw.behaviorId, param1: desiredUsage, param2: 0 };
    }
    Object.keys(behaviorById).some(function (id) {
      var detail = behaviorById[id];
      (detail.metadata || []).some(function (set) {
        return (set.param1 || []).some(function (value) {
          if (value.type === 'constant' && isWantedConstant(value)) { match = { behaviorId: detail.id, param1: value.constant, param2: 0 }; return true; }
          if (value.type === 'hid_usage' && desiredUsage !== null) { match = { behaviorId: detail.id, param1: desiredUsage, param2: 0 }; return true; }
          return false;
        });
      });
      return !!match;
    });
    return match;
  }

  function bindingsEqual(a, b) {
    return !!a && !!b && String(a.behaviorId) === String(b.behaviorId) && Number(a.param1 || 0) === Number(b.param1 || 0) && Number(a.param2 || 0) === Number(b.param2 || 0);
  }

  function findLayer(keymap, layerId) {
    return (keymap && keymap.layers || []).find(function (layer) { return String(layer.id) === String(layerId); }) || null;
  }

  function findVerificationMismatches(keymap, changes) {
    return changes.filter(function (change) {
      var layer = findLayer(keymap, change.layerId);
      var actual = layer && layer.bindings ? layer.bindings[change.keyPosition] : null;
      return !bindingsEqual(actual, change.binding);
    });
  }

  async function writeKeymap() {
    var transport = editor.getTransport();
    function failBeforeWrite(message) {
      setVerificationStep('prepare', 'failure', message);
      setVerificationStep('write', 'failure', '書き込み送信は実行されませんでした。');
      setVerificationStep('save', 'idle', '書き込み送信前のため未実行です。');
      setVerificationStep('verify', 'idle', '保存後の再読み取りは未実行です。');
      setVerificationResult('failure', '書き込み送信まで到達できませんでした。');
      setStatus(message);
      return false;
    }
    if (!transport || !transport.isConnected || !transport.canWriteKeymap) {
      return failBeforeWrite('USB接続または公式RPC接続を確認できません。保存処理は実行されませんでした。');
    }
    // Saving is self-contained: if a page reload or a reconnect left no
    // cached device state, read the current map automatically before building
    // the write request instead of requiring a separate Read action.
    if (!deviceState) {
      setVerificationResult('running', '保存を押したため、実機の現在キーマップを自動読み取りしています。');
      if (!(await readKeymap()) || !deviceState) {
        return failBeforeWrite('実機の現在キーマップを自動読み取りできません。書き込み送信は実行されませんでした。');
      }
    }
    if (deviceState.lockState !== 1) {
      return failBeforeWrite('Studioロック中です。キーボードのLayer 3にある&studio_unlockを押してから、もう一度保存してください。');
    }
    var changes = [];
    writePhase = 'prepare';
    try {
      setVerificationStep('prepare', 'running', '画面の変更内容を実機へ送る準備をしています。');
      setVerificationStep('write', 'idle', '書き込み送信を待っています。');
      setVerificationStep('save', 'idle', 'ファームウェアの保存応答を待ちます。');
      setVerificationStep('verify', 'idle', '保存後に実機を再読み取りします。');
      setVerificationResult('running', '書き込み処理を開始しました。');
      var editedAssignments = editor.getLocalAssignments ? editor.getLocalAssignments() : editor.getAssignments();
      deviceState.keymap.layers.forEach(function (layer, layerIndex) {
        layer.bindings.forEach(function (original, position) {
          var id = uiId(layerIndex, position);
          original._id = id;
          var desiredLabel = editedAssignments[id] || labelById[id];
          var holdLabel = editor.getHoldAssignments && editor.getHoldAssignments()[id];
          // Preserve bindings that came from the device verbatim. This is
          // essential for behavior bindings whose metadata is not editable
          // through the generic key picker (for example Mod-Tap/Layer-Tap).
          var unchangedDeviceBinding = !holdLabel && ((editor.isDeviceAssignmentUnchanged && editor.isDeviceAssignmentUnchanged(id, desiredLabel)) || desiredLabel === labelById[id]);
          var desired = unchangedDeviceBinding && !holdLabel ? original : (holdLabel ? resolveHoldTapBinding(desiredLabel, holdLabel) : resolveBinding(desiredLabel, original));
          if (!desired) throw new Error(id + ' の割り当てを公式behavior bindingへ変換できません: ' + desiredLabel);
          if (!sameBinding(original, desired)) changes.push({ layerId: layer.id, keyPosition: position, binding: desired });
        });
      });
      setVerificationStep('prepare', 'success', changes.length ? changes.length + '件の変更を準備しました。' : '変更はありません。保存状態を再確認します。');
      setVerificationStep('write', 'running', changes.length ? changes.length + '件を公式RPCへ送信中です。' : '保存状態を公式RPCへ確認中です。');
      setStatus(changes.length ? changes.length + '件を公式RPCで保存中…' : '変更なし。保存後の再読み取りを行います…');
      var rpc = global.soshoStudioState.rpc;
      writePhase = 'write';
      var afterWrite = await rpc.writeKeymap(changes);
      setVerificationStep('write', 'success', changes.length ? changes.length + '件の書き込み要求を送信しました。' : '書き込み対象はありませんでした。');
      setVerificationStep('save', 'success', 'ファームウェアから保存応答を受信しました。');
      setVerificationStep('verify', 'running', '保存後の実機キーマップを再読み取りしています。');
      setStatus('保存応答を受信しました。実機を再読み取り中…');
      writePhase = 'verify';
      deviceState.keymap = afterWrite;
      var verified = await rpc.readDeviceState();
      var mismatches = findVerificationMismatches(verified.keymap, changes);
      if (mismatches.length) {
        var mismatchError = new Error('再読み取りで ' + mismatches.length + '件の差分が残っています');
        mismatchError.verification = true;
        throw mismatchError;
      }
      deviceState = verified;
      mapDeviceState();
      var lockText = verified.lockState === 1 ? 'Studioロック解除済み' : verified.lockState === 0 ? 'Studioロック中' : 'lockState=' + verified.lockState;
      setVerificationStep('verify', 'success', '再読み取りした実機の値が送信内容と一致しました。');
      setVerificationResult('success', '実機反映成功：保存応答と再読み取りの一致を確認しました。');
      setStatus('保存・再読み取り成功: ' + changes.length + '件 / ' + lockText);
    } catch (error) {
      var errorText = error.message || String(error);
      if (writePhase === 'prepare') {
        setVerificationStep('prepare', 'failure', errorText);
        setVerificationStep('write', 'failure', '書き込み送信は実行されませんでした。');
        setVerificationStep('save', 'idle', '書き込み送信前のため未実行です。');
        setVerificationStep('verify', 'idle', '保存後の再読み取りは未実行です。');
      } else if (writePhase === 'write') {
        setVerificationStep('write', 'failure', errorText);
        setVerificationStep('save', 'idle', '保存応答を受信できなかったため未確認です。');
        setVerificationStep('verify', 'idle', '保存後の再読み取りは未実行です。');
      } else if (writePhase === 'verify') {
        setVerificationStep('verify', 'failure', errorText);
      }
      setVerificationResult('failure', error.verification ? '保存応答は受信しましたが、再読み取りの値が一致しません。' : '書き込み処理に失敗したため、実機反映を確認できません。');
      setStatus('公式RPC書き込み失敗: ' + errorText);
      return false;
    }
    finally { writePhase = 'idle'; updateButtons(); }
    return true;
  }

  function updateButtons() {
    var transport = editor.getTransport();
    var ready = !!(transport && transport.isConnected && transport.canWriteKeymap);
    if (!ready && deviceState) { deviceState = null; global.soshoStudioState = null; }
    readButton.disabled = !ready;
    writeButton.disabled = !ready || !!(deviceState && deviceState.lockState !== 1);
  }

  readButton.addEventListener('click', readKeymap);
  writeButton.addEventListener('click', writeKeymap);
  global.soshoReadKeymap = readKeymap;
  setInterval(updateButtons, 350);
  updateButtons();
})(window);
