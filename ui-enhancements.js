(function () {
  'use strict';

  var notice = document.querySelector('.notice');
  var subtitle = document.querySelector('.subtitle');
  if (subtitle) subtitle.textContent = 'SO-SHO実機配列に合わせたキーマップ・マクロ編集ページ';
  var firmwareRepoLink = document.querySelector('a[href="https://github.com/robo1129-ops/sosho-firmware"]');
  var firmwareZipUrl = 'https://github.com/robo1129-ops/sosho-firmware/releases/download/latest/sosho-firmware-latest.zip';
  if (firmwareRepoLink) {
    firmwareRepoLink.href = firmwareZipUrl;
    firmwareRepoLink.textContent = 'カスタムファームウェアZIPを直接ダウンロード';
    firmwareRepoLink.setAttribute('download', 'sosho-firmware-latest.zip');
  }
  if (notice) {
    var card = document.createElement('section');
    card.className = 'download-card';
    card.setAttribute('aria-labelledby', 'firmware-download-heading');
    card.innerHTML = '' +
      '<div><strong id="firmware-download-heading">カスタムファームウェア（全パターン）</strong>' +
      '<span>右/左 × トラックボール/トラックパッドの4構成とsettings_resetを、成功ビルドごとに1つのZIPへまとめています。</span></div>' +
      '<div class="download-actions">' +
      '<a href="' + firmwareZipUrl + '" download="sosho-firmware-latest.zip" rel="noopener">最新ZIPをダウンロード</a>' +
      '<a href="https://github.com/robo1129-ops/sosho-firmware/actions/workflows/package-firmware.yml" target="_blank" rel="noopener">ビルド履歴</a>' +
      '</div>';
    notice.insertAdjacentElement('afterend', card);
  }

  function readJsonStorage(key, fallback) {
    try {
      var value = JSON.parse(localStorage.getItem(key) || 'null');
      return value === null ? fallback : value;
    } catch (error) {
      return fallback;
    }
  }

  function writeJsonStorage(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
  }

  function stringValue(value, fallback, maxLength) {
    if (typeof value !== 'string') return fallback;
    return value.slice(0, maxLength);
  }

  function validKeymap(value) {
    if (!value || typeof value !== 'object' || Array.isArray(value)) return {};
    var result = {};
    Object.keys(value).slice(0, 256).forEach(function (key) {
      if (typeof value[key] === 'string') result[String(key).slice(0, 128)] = value[key].slice(0, 160);
    });
    return result;
  }

  function validMacros(value) {
    if (!Array.isArray(value)) return [];
    return value.slice(0, 32).filter(function (macro) {
      return macro && typeof macro === 'object' && !Array.isArray(macro);
    }).map(function (macro) {
      return {
        name: stringValue(macro.name, '新しいマクロ', 100),
        target: stringValue(macro.target, '', 128),
        steps: stringValue(macro.steps, 'A|tap|1', 8000)
      };
    });
  }

  function validTapDance(value) {
    if (!Array.isArray(value)) return [];
    return value.slice(0, 64).filter(function (definition) {
      return definition && typeof definition === 'object' && !Array.isArray(definition);
    }).map(function (definition) {
      return {
        name: stringValue(definition.name, 'TD', 100),
        term: Math.max(50, Math.min(1000, Number(definition.term) || 200)),
        single: stringValue(definition.single, '', 80),
        double: stringValue(definition.double, '', 80),
        triple: stringValue(definition.triple, '', 80),
        hold: stringValue(definition.hold, '', 80)
      };
    });
  }

  function validDeviceSettings(value) {
    value = value && typeof value === 'object' && !Array.isArray(value) ? value : {};
    var timeout = Number(value.autoMouseTimeoutMs);
    if (!Number.isFinite(timeout)) timeout = 300;
    return {
      trackballCpi: Math.max(200, Math.min(1200, Number(value.trackballCpi) || 600)),
      trackpadScale: Math.max(.5, Math.min(2, Number(value.trackpadScale) || 1)),
      autoMouseEnabled: value.autoMouseEnabled !== false,
      autoMouseLayer: Math.max(0, Math.min(3, Number.isInteger(Number(value.autoMouseLayer)) ? Number(value.autoMouseLayer) : 1)),
      autoMouseTimeoutMs: Math.max(0, Math.min(60000, timeout)),
      scrollMode: 'hold',
      scrollDiagonal: value.scrollDiagonal !== false,
      scrollAxisLock: value.scrollAxisLock !== false,
      scrollAxisThreshold: Math.max(1.1, Math.min(4, Number(value.scrollAxisThreshold) || 1.8)),
      scrollDivider: Math.max(1, Math.min(16, Number(value.scrollDivider) || 4))
    };
  }

  function setupJsonTransfer() {
    var inspector = document.querySelector('.inspector');
    if (!inspector) return;
    var transfer = document.createElement('section');
    transfer.className = 'map-transfer';
    transfer.innerHTML = '<h3>設定ファイル</h3><p>キーマップ、マクロ、タップダンス、デバイス設定を1つのJSONに保存できます。</p><div class="map-transfer-actions"><button type="button" data-export-map>JSONをダウンロード</button><button type="button" data-import-map>JSONを読み込む</button></div><input type="file" accept="application/json,.json" data-import-map-file hidden><span class="map-transfer-status" role="status" aria-live="polite">ブラウザー内にも自動保存されます。</span>';
    inspector.insertBefore(transfer, inspector.querySelector('.footer-note'));
    var exportButton = transfer.querySelector('[data-export-map]');
    var importButton = transfer.querySelector('[data-import-map]');
    var fileInput = transfer.querySelector('[data-import-map-file]');
    var status = transfer.querySelector('.map-transfer-status');

    exportButton.addEventListener('click', function () {
      var payload = {
        format: 'sosho-keymap',
        schemaVersion: 1,
        layout: 'sosho-44',
        exportedAt: new Date().toISOString(),
        keymap: validKeymap(readJsonStorage('sosho-local-keymap-v1', {})),
        macros: validMacros(readJsonStorage('sosho-local-macros-v1', [])),
        tapDance: validTapDance(readJsonStorage('sosho-tap-dance-v1', [])),
        deviceSettings: validDeviceSettings(readJsonStorage('sosho-device-settings-v1', {}))
      };
      var blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json;charset=utf-8' });
      var url = URL.createObjectURL(blob);
      var link = document.createElement('a');
      link.href = url;
      link.download = 'sosho-keymap-' + new Date().toISOString().slice(0, 10) + '.json';
      document.body.appendChild(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(url);
      status.textContent = 'JSONをダウンロードしました。';
    });

    importButton.addEventListener('click', function () { fileInput.click(); });
    fileInput.addEventListener('change', function () {
      var file = fileInput.files && fileInput.files[0];
      if (!file) return;
      file.text().then(function (text) {
        var payload = JSON.parse(text);
        if (!payload || payload.format !== 'sosho-keymap' || Number(payload.schemaVersion) !== 1) {
          throw new Error('SO-SHO用のJSONではありません');
        }
        writeJsonStorage('sosho-local-keymap-v1', validKeymap(payload.keymap || payload.assignments));
        writeJsonStorage('sosho-local-macros-v1', validMacros(payload.macros));
        writeJsonStorage('sosho-tap-dance-v1', validTapDance(payload.tapDance));
        writeJsonStorage('sosho-device-settings-v1', validDeviceSettings(payload.deviceSettings));
        status.textContent = 'JSONを読み込みました。画面を更新します。';
        window.setTimeout(function () { window.location.reload(); }, 250);
      }).catch(function (error) {
        status.textContent = '読み込み失敗: ' + (error && error.message ? error.message : 'JSONを確認してください');
      }).then(function () { fileInput.value = ''; });
    });
  }

  setupJsonTransfer();

  function setupMacroDragBuilder() {
    var macroPanel = document.querySelector('.macro-panel');
    var macroList = document.getElementById('macro-list');
    if (!macroPanel || !macroList || macroPanel.dataset.macroBuilderReady) return;
    macroPanel.dataset.macroBuilderReady = 'true';

    var palette = document.createElement('section');
    palette.className = 'macro-drag-palette';
    palette.innerHTML = '<h3>ドラッグでマクロを作成</h3><p>キーを下の手順欄へドラッグしてください。修飾キーを選ぶと、Shift＋Sのような組み合わせを追加できます。</p><div class="macro-key-chips" data-macro-key-chips></div>';
    macroList.insertAdjacentElement('afterend', palette);

    var keyEntries = [
      ['A','A'], ['B','B'], ['C','C'], ['D','D'], ['E','E'], ['F','F'], ['G','G'], ['H','H'], ['I','I'], ['J','J'], ['K','K'], ['L','L'], ['M','M'], ['N','N'], ['O','O'], ['P','P'], ['Q','Q'], ['R','R'], ['S','S'], ['T','T'], ['U','U'], ['V','V'], ['W','W'], ['X','X'], ['Y','Y'], ['Z','Z'],
      ['0','0'], ['1','1'], ['2','2'], ['3','3'], ['4','4'], ['5','5'], ['6','6'], ['7','7'], ['8','8'], ['9','9'],
      ['Enter','RET'], ['Backspace','BSPC'], ['Tab','TAB'], ['Escape','ESC'], ['Space','SPACE'], ['←','LEFT'], ['→','RIGHT'], ['↑','UP'], ['↓','DOWN']
    ];
    var chipContainer = palette.querySelector('[data-macro-key-chips]');
    keyEntries.forEach(function (entry) {
      var chip = document.createElement('button');
      chip.type = 'button';
      chip.className = 'macro-key-chip';
      chip.draggable = true;
      chip.textContent = entry[0];
      chip.title = entry[1] + 'をマクロへ追加';
      chip.dataset.macroKey = entry[1];
      chip.addEventListener('dragstart', function (event) {
        event.dataTransfer.setData('text/plain', 'macro-key:' + entry[1]);
      });
      chipContainer.appendChild(chip);
    });

    var modifierNames = [['Shift', 'LSHFT'], ['Ctrl', 'LCTRL'], ['Alt', 'LALT'], ['GUI', 'LGUI']];
    function appendMacroStep(textarea, key) {
      var builder = textarea.closest('.macro-builder');
      var latencyInput = builder.querySelector('[data-macro-latency]');
      var latency = Math.max(0, Math.min(60000, Number(latencyInput.value) || 1));
      latencyInput.value = latency;
      var modifiers = Array.prototype.slice.call(builder.querySelectorAll('[data-macro-modifier]:checked')).map(function (input) { return input.value; });
      var lines = [];
      if (modifiers.length) {
        modifiers.forEach(function (modifier) { lines.push(modifier + '|press|' + latency); });
        lines.push(key + '|tap|' + latency);
        modifiers.slice().reverse().forEach(function (modifier) { lines.push(modifier + '|release|' + latency); });
      } else {
        lines.push(key + '|tap|' + latency);
      }
      var current = textarea.value.trim();
      textarea.value = current ? current + '\n' + lines.join('\n') : lines.join('\n');
      textarea.dispatchEvent(new Event('change', { bubbles: true }));
    }

    function enhanceMacroItem(item) {
      if (item.dataset.macroBuilderReady === 'true') return;
      var textarea = item.querySelector('textarea');
      var stepsLabel = textarea && textarea.closest('label');
      if (!textarea || !stepsLabel) return;
      item.dataset.macroBuilderReady = 'true';
      var builder = document.createElement('div');
      builder.className = 'macro-builder';
      builder.innerHTML = '<div class="macro-modifiers"><span>修飾キー:</span>' + modifierNames.map(function (entry) { return '<label><input type="checkbox" data-macro-modifier value="' + entry[1] + '">' + entry[0] + '</label>'; }).join('') + '</div><label class="macro-latency">追加時の待ち時間(ms)<input type="number" data-macro-latency min="0" max="60000" step="1" value="1"></label><div class="macro-drop-zone" data-macro-drop-zone>ここへキーをドラッグして追加</div><small>各行の末尾がその操作の待ち時間です。追加後も手順欄で1行ずつ変更できます。</small>';
      stepsLabel.appendChild(builder);
      var dropZone = builder.querySelector('[data-macro-drop-zone]');
      dropZone.addEventListener('dragover', function (event) { event.preventDefault(); dropZone.classList.add('drop-ready'); });
      dropZone.addEventListener('dragleave', function () { dropZone.classList.remove('drop-ready'); });
      dropZone.addEventListener('drop', function (event) {
        event.preventDefault();
        dropZone.classList.remove('drop-ready');
        var data = event.dataTransfer.getData('text/plain');
        var key = data.indexOf('macro-key:') === 0 ? data.slice(10) : '';
        if (key) appendMacroStep(textarea, key);
      });
    }

    function enhanceAllMacroItems() {
      macroList.querySelectorAll('.macro-item').forEach(enhanceMacroItem);
    }
    enhanceAllMacroItems();
    if (typeof MutationObserver === 'function') {
      var observer = new MutationObserver(enhanceAllMacroItems);
      observer.observe(macroList, { childList: true });
    }
  }

  setupMacroDragBuilder();

  var reference = document.querySelector('.reference-note');
  if (reference) {
    var badge = document.createElement('span');
    badge.className = 'layout-badge';
    badge.textContent = '実機レイアウト準拠';
    reference.appendChild(badge);
  }

  var hint = document.querySelector('.hint');
  if (hint) {
    hint.textContent = '実機の12列×4行レイアウトに合わせて表示しています。キーを選択し、アクションをクリックまたはドラッグしてください。紫色の□は未設定キーです。';
  }

  var legendItems = document.querySelectorAll('.legend span');
  if (legendItems.length >= 3 && legendItems[2].lastChild) {
    legendItems[2].lastChild.textContent = '未設定キー';
  }

  var palette = document.querySelector('.palette');
  if (palette) {
    var additions = document.createElement('div');
    additions.className = 'palette-additions';
    additions.innerHTML = '<details class="palette-group" open><summary>通常キー <span>A / ENTER / 数字 / 記号</span></summary><div class="palette-grid" data-basic-palette></div><p class="palette-help">キーをつかんで、上の実機配列へドラッグ＆ドロップしてください。</p></details>' +
      '<details class="palette-group" open><summary>日本語 / JIS <span>かな・英数・変換</span></summary><div class="palette-grid" data-jis-palette></div><p class="palette-help">Windowsの日本語入力で使うLANG/INTキーです。</p></details>' +
      '<details class="palette-group" open><summary>タップダンス <span>1回 / 2回 / 3回 / ホールド</span></summary><div data-tap-dance-list></div><div class="tap-dance-form"><label>名前<input data-td-name value="TD1"></label><label>判定時間(ms)<input data-td-term type="number" min="50" max="1000" step="10" value="200"></label><label>1回<select data-td-single></select></label><label>2回<select data-td-double></select></label><label>3回<select data-td-triple></select></label><label>ホールド<select data-td-hold></select></label><button class="chip wide" type="button" data-add-tap-dance>タップダンスを作成</button></div><p class="palette-help">作成した定義をドラッグすると、選択したキーに割り当てられます。</p></details>';
    palette.appendChild(additions);

    var basicKeys = 'A B C D E F G H I J K L M N O P Q R S T U V W X Y Z 0 1 2 3 4 5 6 7 8 9 Enter Backspace Tab Escape Space Minus Equal Comma Period Slash Semicolon Quote Left Right Up Down'.split(' ');
    var basicPalette = additions.querySelector('[data-basic-palette]');
    basicKeys.forEach(function (name) {
      var chip = document.createElement('button');
      chip.type = 'button';
      chip.className = 'chip';
      chip.draggable = true;
      chip.textContent = name;
      chip.title = name + 'をキーマップへドラッグ';
      chip.addEventListener('dragstart', function (event) {
        event.dataTransfer.setData('text/plain', 'action:' + name);
      });
      basicPalette.appendChild(chip);
    });

    var japaneseKeys = [
      ['かな', 'LANG1'],
      ['英数', 'LANG2'],
      ['全角/半角', 'LANG5'],
      ['カナ/かな', 'INT2'],
      ['変換', 'INT4'],
      ['無変換', 'INT5'],
      ['￥', 'INT3'],
      ['ろ', 'INT1']
    ];
    var jisPalette = additions.querySelector('[data-jis-palette]');
    japaneseKeys.forEach(function (entry) {
      var chip = document.createElement('button');
      chip.type = 'button';
      chip.className = 'chip jis-chip';
      chip.draggable = true;
      chip.textContent = entry[0];
      chip.title = entry[0] + ' (' + entry[1] + ') をキーマップへドラッグ';
      chip.addEventListener('dragstart', function (event) {
        event.dataTransfer.setData('text/plain', 'action:' + entry[1]);
      });
      jisPalette.appendChild(chip);
    });

    var optionKeys = ['未設定'].concat(basicKeys).concat(['Ctrl', 'Shift', 'Alt', 'GUI', 'MO 1', 'MO 2', 'BT0', 'BT1', 'BT2', 'BT3', 'BT4']);
    var tapDanceState = [];
    try {
      tapDanceState = JSON.parse(localStorage.getItem('sosho-tap-dance-v1') || '[]') || [];
    } catch (error) {
      tapDanceState = [];
    }

    function makeOptionSelect(selector) {
      var select = additions.querySelector(selector);
      optionKeys.forEach(function (name) {
        var option = document.createElement('option');
        option.value = name === '未設定' ? '' : name;
        option.textContent = name;
        select.appendChild(option);
      });
      return select;
    }

    var single = makeOptionSelect('[data-td-single]');
    var double = makeOptionSelect('[data-td-double]');
    var triple = makeOptionSelect('[data-td-triple]');
    var hold = makeOptionSelect('[data-td-hold]');
    single.value = 'A';
    double.value = 'Enter';
    triple.value = 'Backspace';
    hold.value = 'Escape';

    function saveTapDance() {
      try {
        localStorage.setItem('sosho-tap-dance-v1', JSON.stringify(tapDanceState));
      } catch (error) {
        // Keep the editor usable even when browser storage is unavailable.
      }
    }

    function renderTapDanceDefinitions() {
      var list = additions.querySelector('[data-tap-dance-list]');
      list.innerHTML = '';
      if (!tapDanceState.length) {
        list.innerHTML = '<p class="palette-help">まだ定義がありません。</p>';
        return;
      }
      tapDanceState.forEach(function (definition, index) {
        var row = document.createElement('div');
        row.className = 'tap-dance-definition';
        var label = document.createElement('span');
        label.textContent = definition.name + ' · ' + (definition.single || '—') + ' / ' + (definition.double || '—') + ' / ' + (definition.triple || '—') + ' / hold ' + (definition.hold || '—') + ' · ' + definition.term + 'ms';
        var drag = document.createElement('button');
        drag.type = 'button';
        drag.draggable = true;
        drag.textContent = 'ドラッグして割当';
        drag.title = 'このタップダンスをキーマップへドラッグ';
        drag.addEventListener('dragstart', function (event) {
          event.dataTransfer.setData('text/plain', 'action:TapDance[' + definition.name + ']');
        });
        row.appendChild(label);
        row.appendChild(drag);
        list.appendChild(row);
      });
    }

    additions.querySelector('[data-add-tap-dance]').addEventListener('click', function () {
      var name = additions.querySelector('[data-td-name]').value.trim() || ('TD' + (tapDanceState.length + 1));
      tapDanceState.push({
        name: name,
        term: Math.max(50, Math.min(1000, Number(additions.querySelector('[data-td-term]').value) || 200)),
        single: single.value,
        double: double.value,
        triple: triple.value,
        hold: hold.value
      });
      saveTapDance();
      renderTapDanceDefinitions();
    });
    renderTapDanceDefinitions();

    var basicDetail = additions.querySelector('[data-basic-palette]').closest('.palette-group');
    var jisDetail = additions.querySelector('[data-jis-palette]').closest('.palette-group');
    var tapDanceDetail = additions.querySelector('[data-tap-dance-list]').closest('.palette-group');
    basicDetail.dataset.paletteCategory = 'basic';
    jisDetail.dataset.paletteCategory = 'jis';
    tapDanceDetail.dataset.paletteCategory = 'tap-dance';

    var actionPanel = document.getElementById('palette');
    actionPanel.dataset.paletteCategory = 'functions';
    var devicePanel = document.createElement('div');
    devicePanel.className = 'device-settings-panel';
    devicePanel.dataset.paletteCategory = 'device';
    devicePanel.innerHTML = '<section class="device-settings-card"><h4>右モジュール · トラックボール</h4><p>移動量のCPIを調整します。</p><div class="device-setting-actions"><button type="button" data-trackball-step="-100">CPI −</button><button type="button" data-trackball-step="0">標準</button><button type="button" data-trackball-step="100">CPI ＋</button><span class="device-setting-value" data-trackball-value></span></div></section>' +
      '<section class="device-settings-card"><h4>左モジュール · トラックパッド</h4><p>カーソル移動倍率を調整します。</p><div class="device-setting-actions"><button type="button" data-trackpad-step="-0.25">移動倍率 −</button><button type="button" data-trackpad-step="0">標準</button><button type="button" data-trackpad-step="0.25">移動倍率 ＋</button><span class="device-setting-value" data-trackpad-value></span></div></section>' +
      '<section class="device-settings-card device-settings-card-wide"><h4>オートマウスレイヤー</h4><p>トラックボール／トラックパッドが動いている間と、停止後の指定時間だけ指定レイヤーを保持します。</p><div class="device-setting-form"><label class="device-setting-checkbox"><input type="checkbox" data-auto-mouse-enabled aria-label="オートマウス ON/OFF">オートマウス ON / OFF</label><label>保持するレイヤー<select data-auto-mouse-layer><option value="0">Layer 0</option><option value="1">Layer 1</option><option value="2">Layer 2</option><option value="3">Layer 3</option></select></label><label>停止後の保持時間(ms)<input type="number" data-auto-mouse-timeout min="0" max="60000" step="10"></label></div></section>' +
      '<section class="device-settings-card device-settings-card-wide"><h4>スクロールモード</h4><p>下のボタンをキーへドラッグして割り当てると、押している間だけトラックボール／トラックパッドをスクロールモードにします。</p><button type="button" class="device-action-chip" draggable="true" data-scroll-hold-action>押している間だけスクロール</button><div class="device-setting-form"><label class="device-setting-checkbox"><input type="checkbox" data-scroll-diagonal>斜めスクロールを許可</label><label class="device-setting-checkbox"><input type="checkbox" data-scroll-axis-lock>明確な縦横入力を軸ロック</label><label>軸ロック判定<select data-scroll-axis-threshold><option value="1.5">弱め (1.5×)</option><option value="1.8">標準 (1.8×)</option><option value="2.2">強め (2.2×)</option><option value="3">かなり強め (3×)</option></select></label><div class="device-setting-actions"><button type="button" data-scroll-divider-step="-1">分割 −</button><button type="button" data-scroll-divider-step="0">標準</button><button type="button" data-scroll-divider-step="1">分割 ＋</button><span class="device-setting-value" data-scroll-divider-value></span></div></div></section>' +
      '<p class="device-setting-note">Keyballのオートマウス層・押下中スクロール・軸ロック／スクロール分割の考え方を設定モデルに反映しています。値はJSONとこのブラウザーへ保存します。実機へ反映するには、同じ項目を扱うファームウェア通信が必要です。</p>';
    palette.appendChild(devicePanel);

    var tabBar = document.createElement('div');
    tabBar.className = 'palette-tabs';
    var categories = [
      ['basic', 'BASIC'],
      ['functions', 'FUNCTIONS'],
      ['jis', '日本語/JIS'],
      ['tap-dance', 'TAP DANCE'],
      ['device', 'DEVICE']
    ];
    categories.forEach(function (entry) {
      var tab = document.createElement('button');
      tab.type = 'button';
      tab.className = 'palette-tab';
      tab.textContent = entry[1];
      tab.dataset.paletteTab = entry[0];
      tab.setAttribute('aria-pressed', 'false');
      tab.addEventListener('click', function () { showPaletteCategory(entry[0]); });
      tabBar.appendChild(tab);
    });
    palette.insertBefore(tabBar, actionPanel);

    function showPaletteCategory(category) {
      [basicDetail, jisDetail, tapDanceDetail, actionPanel, devicePanel].forEach(function (panel) {
        panel.style.display = panel.dataset.paletteCategory === category ? '' : 'none';
      });
      tabBar.querySelectorAll('[data-palette-tab]').forEach(function (tab) {
        tab.setAttribute('aria-pressed', String(tab.dataset.paletteTab === category));
      });
    }

    var deviceSettings = {
      trackballCpi: 600,
      trackpadScale: 1,
      autoMouseEnabled: true,
      autoMouseLayer: 1,
      autoMouseTimeoutMs: 300,
      scrollMode: 'hold',
      scrollDiagonal: true,
      scrollAxisLock: true,
      scrollAxisThreshold: 1.8,
      scrollDivider: 4
    };
    try {
      deviceSettings = validDeviceSettings(Object.assign(deviceSettings, JSON.parse(localStorage.getItem('sosho-device-settings-v1') || '{}')));
    } catch (error) {
      // Use the safe defaults when localStorage contains invalid data.
    }
    function saveDeviceSettings() {
      deviceSettings = validDeviceSettings(deviceSettings);
      try { localStorage.setItem('sosho-device-settings-v1', JSON.stringify(deviceSettings)); } catch (error) {}
      devicePanel.querySelector('[data-trackball-value]').textContent = deviceSettings.trackballCpi + ' CPI';
      devicePanel.querySelector('[data-trackpad-value]').textContent = deviceSettings.trackpadScale.toFixed(2) + '×';
      devicePanel.querySelector('[data-auto-mouse-enabled]').checked = deviceSettings.autoMouseEnabled;
      devicePanel.querySelector('[data-auto-mouse-layer]').value = String(deviceSettings.autoMouseLayer);
      devicePanel.querySelector('[data-auto-mouse-timeout]').value = String(deviceSettings.autoMouseTimeoutMs);
      devicePanel.querySelector('[data-scroll-diagonal]').checked = deviceSettings.scrollDiagonal;
      devicePanel.querySelector('[data-scroll-axis-lock]').checked = deviceSettings.scrollAxisLock;
      devicePanel.querySelector('[data-scroll-axis-threshold]').value = String(deviceSettings.scrollAxisThreshold);
      devicePanel.querySelector('[data-scroll-divider-value]').textContent = '分割 ' + deviceSettings.scrollDivider;
    }
    devicePanel.querySelectorAll('[data-trackball-step]').forEach(function (button) {
      button.addEventListener('click', function () {
        var step = Number(button.dataset.trackballStep);
        deviceSettings.trackballCpi = step === 0 ? 600 : Math.max(200, Math.min(1200, deviceSettings.trackballCpi + step));
        saveDeviceSettings();
      });
    });
    devicePanel.querySelectorAll('[data-trackpad-step]').forEach(function (button) {
      button.addEventListener('click', function () {
        var step = Number(button.dataset.trackpadStep);
        deviceSettings.trackpadScale = step === 0 ? 1 : Math.max(.5, Math.min(2, Number((deviceSettings.trackpadScale + step).toFixed(2))));
        saveDeviceSettings();
      });
    });
    devicePanel.querySelector('[data-auto-mouse-enabled]').addEventListener('change', function (event) {
      deviceSettings.autoMouseEnabled = event.target.checked;
      saveDeviceSettings();
    });
    devicePanel.querySelector('[data-auto-mouse-layer]').addEventListener('change', function (event) {
      deviceSettings.autoMouseLayer = Number(event.target.value);
      saveDeviceSettings();
    });
    devicePanel.querySelector('[data-auto-mouse-timeout]').addEventListener('change', function (event) {
      deviceSettings.autoMouseTimeoutMs = Number(event.target.value);
      saveDeviceSettings();
    });
    devicePanel.querySelector('[data-scroll-diagonal]').addEventListener('change', function (event) {
      deviceSettings.scrollDiagonal = event.target.checked;
      saveDeviceSettings();
    });
    devicePanel.querySelector('[data-scroll-axis-lock]').addEventListener('change', function (event) {
      deviceSettings.scrollAxisLock = event.target.checked;
      saveDeviceSettings();
    });
    devicePanel.querySelector('[data-scroll-axis-threshold]').addEventListener('change', function (event) {
      deviceSettings.scrollAxisThreshold = Number(event.target.value);
      saveDeviceSettings();
    });
    devicePanel.querySelectorAll('[data-scroll-divider-step]').forEach(function (button) {
      button.addEventListener('click', function () {
        var step = Number(button.dataset.scrollDividerStep);
        deviceSettings.scrollDivider = step === 0 ? 4 : Math.max(1, Math.min(16, deviceSettings.scrollDivider + step));
        saveDeviceSettings();
      });
    });
    var scrollHoldAction = devicePanel.querySelector('[data-scroll-hold-action]');
    scrollHoldAction.addEventListener('dragstart', function (event) {
      event.dataTransfer.setData('text/plain', 'action:SCROLL_HOLD');
    });
    saveDeviceSettings();
    showPaletteCategory('basic');
  }

  function readAssignments() {
    try { return JSON.parse(localStorage.getItem('sosho-local-keymap-v1') || '{}') || {}; } catch (error) { return {}; }
  }

  function writeAssignments(assignments) {
    try { localStorage.setItem('sosho-local-keymap-v1', JSON.stringify(assignments)); } catch (error) {}
  }

  function activeLayerIndex() {
    var buttons = document.querySelectorAll('.layer-button');
    for (var i = 0; i < buttons.length; i++) if (buttons[i].getAttribute('aria-pressed') === 'true') return i;
    return 0;
  }

  function updateInspector(target, value) {
    var position = document.getElementById('selected-position');
    var action = document.getElementById('selected-action');
    if (position) position.textContent = '選択中: ' + target;
    if (action) action.textContent = value || '未設定';
  }

  function createEncoderTargets() {
    var layer = activeLayerIndex();
    document.querySelectorAll('#keyboard .half').forEach(function (half) {
      var existing = half.querySelector('.encoder-cluster');
      if (existing && existing.dataset.layer === String(layer)) return;
      if (existing) existing.remove();
      var oldMarker = half.querySelector('.device-marker');
      if (oldMarker) oldMarker.remove();
      var side = half.classList.contains('left') ? 'left' : 'right';
      var cluster = document.createElement('div');
      cluster.className = 'encoder-cluster';
      cluster.dataset.layer = String(layer);
      cluster.innerHTML = '<span class="encoder-title">ロータリーエンコーダー</span>';
      [['ccw', '↺ 左回転'], ['cw', '↻ 右回転']].forEach(function (entry) {
        var target = 'l' + layer + '-' + side + '-encoder-' + entry[0];
        var button = document.createElement('button');
        button.type = 'button';
        button.className = 'encoder-target';
        button.dataset.target = target;
        button.innerHTML = entry[1] + '<span class="encoder-assignment"></span>';
        button.addEventListener('click', function () {
          var assignments = readAssignments();
          updateInspector(target, assignments[target]);
        });
        button.addEventListener('dragover', function (event) {
          event.preventDefault();
          button.classList.add('drop-ready');
        });
        button.addEventListener('dragleave', function () { button.classList.remove('drop-ready'); });
        button.addEventListener('drop', function (event) {
          event.preventDefault();
          button.classList.remove('drop-ready');
          var data = event.dataTransfer.getData('text/plain');
          var assignments = readAssignments();
          if (data.indexOf('action:') === 0) assignments[target] = data.slice(7);
          if (data.indexOf('macro:') === 0) assignments[target] = 'Macro ' + data.slice(6);
          writeAssignments(assignments);
          renderEncoderAssignment(button, target);
          updateInspector(target, assignments[target]);
        });
        cluster.appendChild(button);
        renderEncoderAssignment(button, target);
      });
      half.appendChild(cluster);

      var marker = document.createElement('div');
      marker.className = 'device-marker';
      marker.innerHTML = side === 'left' ? '<strong>左 · トラックパッド</strong><span>移動倍率はDEVICEで設定</span>' : '<strong>右 · トラックボール</strong><span>CPIはDEVICEで設定</span>';
      half.appendChild(marker);
    });
  }

  function renderEncoderAssignment(button, target) {
    var assignments = readAssignments();
    var value = button.querySelector('.encoder-assignment');
    if (value) value.textContent = assignments[target] || '未設定';
  }

  var keyboard = document.getElementById('keyboard');
  if (keyboard && typeof MutationObserver === 'function') {
    var observer = new MutationObserver(function () { createEncoderTargets(); });
    observer.observe(keyboard, { childList: true, subtree: true });
  }
  createEncoderTargets();
})();
