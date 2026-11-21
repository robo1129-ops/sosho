(function (global) {
  'use strict';
  function snapshot(editor) {
    if (!editor || !editor.isKeymapLoaded()) throw new Error('先に実機のキーマップを読み込んでください。');
    var assignments = editor.getAssignments();
    var holds = Object.assign({}, editor.getDeviceHoldAssignments(), editor.getHoldAssignments());
    var data = { version: 1, createdAt: new Date().toISOString(), layers: [] };
    editor.getLayers().forEach(function (layer, number) {
      var item = { name: layer.name || 'Layer ' + number, left: [], right: [], encoders: {} };
      ['left', 'right'].forEach(function (side) {
        for (var index = 0; index < 22; index++) {
          var id = editor.keyId(number, side, index);
          item[side].push({ tap: String(assignments[id] || layer[side] && layer[side][index] || ''), hold: String(holds[id] || '') });
        }
        ['ccw', 'cw'].forEach(function (direction) {
          item.encoders[side + '-' + direction] = String(assignments['l' + number + '-' + side + '-encoder-' + direction] || '未取得');
        });
      });
      data.layers.push(item);
    });
    return data;
  }
  global.soshoPdfSnapshot = snapshot;
  var host = document.querySelector('.inspector') || document.querySelector('main');
  if (!host) return;
  var section = document.createElement('section');
  section.className = 'card';
  section.style.cssText = 'padding:16px;margin-top:16px';
  section.innerHTML = '<h3>カンニングペーパー PDF</h3><p>現在の画面のキー配置・タップ／ホールド・エンコーダーをPDFにします。未保存の編集も含みます。ログインやトークン入力は不要です。</p>' +
    '<p>PDFはこのブラウザー内で生成します。キーマップを外部へ送信しません。</p>' +
    '<button type="button" data-pdf-generate>PDFを生成してダウンロード</button>' +
    '<p role="status" aria-live="polite" data-pdf-status>実機のキーマップを読み込んでから押してください。</p>' +
    '<a data-pdf-link hidden>PDFをダウンロード</a>';
  host.appendChild(section);
  var button = section.querySelector('[data-pdf-generate]');
  var status = section.querySelector('[data-pdf-status]');
  var link = section.querySelector('[data-pdf-link]');
  var previousUrl;
  button.addEventListener('click', async function () {
    button.disabled = true;
    link.hidden = true;
    try {
      var data = snapshot(global.soshoEditor);
      status.textContent = 'PDFを生成しています…';
      var blob = await global.soshoRenderKeymapPdf(data);
      if (previousUrl) URL.revokeObjectURL(previousUrl);
      previousUrl = URL.createObjectURL(blob);
      link.href = previousUrl;
      link.download = 'sosho-keymap-' + new Date().toISOString().slice(0, 10) + '.pdf';
      link.hidden = false;
      link.click();
      status.textContent = 'PDFの自動ダウンロードを開始しました。開始しない場合は下のリンクを押してください。';
    } catch (error) { status.textContent = error.message || String(error); }
    finally { button.disabled = false; }
  });
}(window));
