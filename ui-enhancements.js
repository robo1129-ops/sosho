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
})();
