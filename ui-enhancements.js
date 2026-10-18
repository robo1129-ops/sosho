(function () {
  'use strict';

  var notice = document.querySelector('.notice');
  if (notice) {
    var card = document.createElement('section');
    card.className = 'download-card';
    card.setAttribute('aria-labelledby', 'firmware-download-heading');
    card.innerHTML = '' +
      '<div><strong id="firmware-download-heading">カスタムファームウェア（全パターン）</strong>' +
      '<span>右/左 × トラックボール/トラックパッドの4構成とsettings_resetを、成功ビルドごとに1つのZIPへまとめています。</span></div>' +
      '<div class="download-actions">' +
      '<a href="https://github.com/robo1129-ops/sosho-firmware/releases/download/latest/sosho-firmware-latest.zip" target="_blank" rel="noopener">最新ZIPをダウンロード</a>' +
      '<a href="https://github.com/robo1129-ops/sosho-firmware/actions/workflows/package-firmware.yml" target="_blank" rel="noopener">ビルド履歴</a>' +
      '</div>';
    notice.insertAdjacentElement('afterend', card);
  }

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
  }
})();
