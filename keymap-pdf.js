(function (global) {
  'use strict';
  var repo = 'robo1129-ops/sosho';
  var api = 'https://api.github.com/repos/' + repo;
  var workflow = 'keymap-pdf.yml';
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
  section.innerHTML = '<h3>カンニングペーパー PDF</h3><p>現在の画面のキー配置・タップ／ホールド・エンコーダーを、GitHub ActionsでPDFにします。未保存の編集も含みます。</p>' +
    '<p><strong>キーマップの内容とPDFは公開GitHubに送信・公開されます。</strong>マクロ本文や接続用の秘密情報は送信しません。</p>' +
    '<details><summary>GitHub認証の設定</summary><p>このリポジトリにActionsの書き込み権限を持つGitHubトークンが必要です。トークンは保存しません。</p><p>Fine-grained tokenの場合、対象をrobo1129-ops/soshoに絞り、ActionsをRead and write、ContentsをRead-onlyにしてください。リポジトリの操作権限があるアカウントで発行します。</p><a href="https://github.com/settings/personal-access-tokens/new" target="_blank" rel="noopener noreferrer">GitHubでトークンを発行</a></details>' +
    '<label>GitHubトークン<input type="password" autocomplete="off" spellcheck="false" data-pdf-token style="display:block;width:100%;box-sizing:border-box"></label>' +
    '<label style="display:block;margin:10px 0"><input type="checkbox" data-pdf-consent> キー配置を公開してPDFを生成する</label>' +
    '<button type="button" data-pdf-generate>GitHubでPDF生成・自動ダウンロード</button>' +
    '<p role="status" aria-live="polite" data-pdf-status>生成後、自動でPDFをダウンロードします。ページを開いたままお待ちください。</p>' +
    '<a data-pdf-link hidden>PDFをダウンロード</a>';
  host.appendChild(section);
  var tokenInput = section.querySelector('[data-pdf-token]');
  var button = section.querySelector('[data-pdf-generate]');
  var status = section.querySelector('[data-pdf-status]');
  var link = section.querySelector('[data-pdf-link]');
  var previousUrl;
  var sleep = function (ms) { return new Promise(function (resolve) { setTimeout(resolve, ms); }); };
  button.addEventListener('click', async function () {
    if (!section.querySelector('[data-pdf-consent]').checked) { status.textContent = '公開への同意にチェックしてください。'; return; }
    var token = tokenInput.value.trim();
    tokenInput.value = '';
    button.disabled = true;
    link.hidden = true;
    async function request(path, options) {
      var response = await fetch(api + path, Object.assign({}, options, { headers: { Authorization: 'Bearer ' + token, Accept: 'application/vnd.github+json', 'Content-Type': 'application/json' } }));
      if (!response.ok) throw new Error('GitHub API ' + response.status + '。トークンの権限・有効期限・Actions設定を確認してください。');
      return response.status === 204 ? null : response.json();
    }
    try {
      if (!token) throw new Error('GitHubトークンを入力してください。');
      var payload = JSON.stringify(snapshot(global.soshoEditor));
      if (new TextEncoder().encode(payload).length > 60000) throw new Error('キー表示データが大きすぎます。');
      var requestId = crypto.randomUUID();
      status.textContent = 'GitHub Actionsへ生成要求を送信しています…';
      await request('/actions/workflows/' + workflow + '/dispatches', { method: 'POST', body: JSON.stringify({ ref: 'main', inputs: { request_id: requestId, keymap_snapshot: payload } }) });
      var deadline = Date.now() + 12 * 60 * 1000;
      var run;
      while (Date.now() < deadline) {
        var runs = await request('/actions/workflows/' + workflow + '/runs?event=workflow_dispatch&per_page=50');
        run = runs.workflow_runs.find(function (item) { return item.display_title === 'SO-SHO PDF ' + requestId; });
        if (run && run.status === 'completed') {
          if (run.conclusion !== 'success') throw new Error('PDF生成が完了しませんでした。GitHub Actionsの実行結果を確認してください: ' + run.html_url);
          break;
        }
        status.textContent = run && run.status === 'in_progress' ? 'PDFを生成しています…' : 'GitHub Actionsの実行開始を待っています…';
        await sleep(5000);
      }
      if (!run || run.conclusion !== 'success') throw new Error('生成待ちがタイムアウトしました。GitHub Actionsで進捗を確認してください。');
      token = '';
      status.textContent = 'PDFをダウンロードしています…';
      // Public GitHub Contents API supports CORS and avoids waiting for Pages deployment.
      var assetResponse = await fetch(api + '/contents/downloads/keymaps/' + run.id + '.pdf', { headers: { Accept: 'application/vnd.github.raw+json' } });
      if (!assetResponse.ok) throw new Error('生成済みPDFの取得に失敗しました。GitHubのdownloads/keymapsフォルダーを確認してください。');
      var blob = await assetResponse.blob();
      if ((await blob.slice(0, 5).text()) !== '%PDF-') throw new Error('PDF以外の応答を受信しました。');
      if (previousUrl) URL.revokeObjectURL(previousUrl);
      previousUrl = URL.createObjectURL(new Blob([blob], { type: 'application/pdf' }));
      link.href = previousUrl;
      link.download = 'sosho-keymap-' + new Date().toISOString().slice(0, 10) + '.pdf';
      link.hidden = false;
      link.click();
      status.textContent = 'PDFを生成し、自動ダウンロードを開始しました。開始しない場合は下のリンクを押してください。';
    } catch (error) { status.textContent = error.message || String(error); }
    finally { token = ''; button.disabled = false; }
  });
}(window));
