(function (global) {
  'use strict';
  var encode = function (value) { return new TextEncoder().encode(value); };
  function imagePdf(images) {
    var objects = [];
    objects[1] = encode('<< /Type /Catalog /Pages 2 0 R >>');
    objects[2] = encode('<< /Type /Pages /Count ' + images.length + ' /Kids [' + images.map(function (_, i) { return (3 + i * 3) + ' 0 R'; }).join(' ') + '] >>');
    images.forEach(function (image, index) {
      var page = 3 + index * 3;
      objects[page] = encode('<< /Type /Page /Parent 2 0 R /MediaBox [0 0 841.89 595.28] /Resources << /XObject << /Im0 ' + (page + 1) + ' 0 R >> >> /Contents ' + (page + 2) + ' 0 R >>');
      objects[page + 1] = [encode('<< /Type /XObject /Subtype /Image /Width ' + image.width + ' /Height ' + image.height + ' /ColorSpace /DeviceRGB /BitsPerComponent 8 /Filter /DCTDecode /Length ' + image.bytes.length + ' >>\nstream\n'), image.bytes, encode('\nendstream')];
      var content = 'q\n841.89 0 0 595.28 0 0 cm\n/Im0 Do\nQ\n';
      objects[page + 2] = encode('<< /Length ' + encode(content).length + ' >>\nstream\n' + content + 'endstream');
    });
    var parts = [encode('%PDF-1.3\n')], offsets = [0], length = parts[0].length;
    function append(bytes) { parts.push(bytes); length += bytes.length; }
    for (var i = 1; i < objects.length; i++) {
      offsets[i] = length;
      append(encode(i + ' 0 obj\n'));
      (Array.isArray(objects[i]) ? objects[i] : [objects[i]]).forEach(append);
      append(encode('\nendobj\n'));
    }
    var xref = length;
    append(encode('xref\n0 ' + objects.length + '\n0000000000 65535 f \n'));
    for (var j = 1; j < objects.length; j++) append(encode(String(offsets[j]).padStart(10, '0') + ' 00000 n \n'));
    append(encode('trailer\n<< /Size ' + objects.length + ' /Root 1 0 R >>\nstartxref\n' + xref + '\n%%EOF\n'));
    return new Blob(parts, { type: 'application/pdf' });
  }
  global.soshoRenderKeymapPdf = async function (data, canvasFactory) {
    if (!data || !Array.isArray(data.layers) || data.layers.length < 1 || data.layers.length > 16) throw new Error('レイヤー情報がありません。');
    var images = [];
    for (var page = 0; page < data.layers.length; page++) {
      var layer = data.layers[page];
      var canvas = canvasFactory ? canvasFactory() : document.createElement('canvas');
      canvas.width = 1684; canvas.height = 1191;
      var c = canvas.getContext('2d');
      if (!c) throw new Error('PDF描画用のCanvasを利用できません。');
      c.scale(2, 2);
      c.fillStyle = '#fff'; c.fillRect(0, 0, 842, 596);
      function text(x, y, value, size, maxWidth) {
        var label = String(value || '').replace(/[\r\n]/g, ' ');
        size = size || 10;
        function font() { c.font = size + 'px "Yu Gothic", "Meiryo", sans-serif'; }
        font();
        while (maxWidth && c.measureText(label).width > maxWidth && size > 5) { size -= 0.25; font(); }
        if (maxWidth && c.measureText(label).width > maxWidth) {
          while (label && c.measureText(label + '...').width > maxWidth) label = label.slice(0, -1);
          label += '...';
        }
        c.fillStyle = '#17212d'; c.fillText(label, x, y);
      }
      text(28, 37, 'SO-SHO キーマップ / ' + (layer.name || 'Layer ' + page), 19, 786);
      text(28, 59, '画面上の現在の割り当て（未保存の編集を含む） / ' + data.createdAt, 9, 786);
      ['left', 'right'].forEach(function (side, sideIndex) {
        var keys = layer[side];
        if (!Array.isArray(keys) || keys.length !== 22) throw new Error('左右各22キーのデータが必要です。');
        var origin = 28 + sideIndex * 421;
        text(origin, 95, side === 'left' ? '左手' : '右手', 13);
        keys.forEach(function (key, index) {
          var row = Math.min(Math.floor(index / 6), 3);
          var col = index < 18 ? index % 6 : [0, 1, 4, 5][index - 18];
          var x = origin + col * 63, y = 107 + row * 65;
          c.fillStyle = '#f5f7f9'; c.fillRect(x, y, 59, 58);
          c.strokeStyle = '#a6b0bb'; c.lineWidth = 0.7; c.strokeRect(x, y, 59, 58);
          text(x + 5, y + 14, index + 1, 7);
          text(x + 5, y + 33, key.tap || '未設定', 10, 49);
          if (key.hold) text(x + 5, y + 49, 'Hold: ' + key.hold, 8, 49);
        });
        var encoders = layer.encoders || {};
        text(origin, 435, 'エンコーダー', 11);
        text(origin, 455, '左回転: ' + (encoders[side + '-ccw'] || '未取得'), 10, 375);
        text(origin, 475, '右回転: ' + (encoders[side + '-cw'] || '未取得'), 10, 375);
      });
      text(28, 525, '上段はタップ／通常入力、Holdは長押し。キー番号は各側の物理配置順です。', 9);
      text(28, 543, '長い表記は縮小し、収まらない場合は末尾を省略します。', 8);
      text(747, 571, (page + 1) + ' / ' + data.layers.length, 9);
      var binary = atob(canvas.toDataURL('image/jpeg', 0.95).split(',')[1]);
      var bytes = new Uint8Array(binary.length);
      for (var n = 0; n < binary.length; n++) bytes[n] = binary.charCodeAt(n);
      images.push({ width: canvas.width, height: canvas.height, bytes: bytes });
      // Allow the progress message to paint between pages.
      await new Promise(function (resolve) { setTimeout(resolve, 0); });
    }
    return imagePdf(images);
  };
}(window));
