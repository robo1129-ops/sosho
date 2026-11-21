(function (global) {
  'use strict';
  var encode = function (value) { return new TextEncoder().encode(value); };
  function imagePdf(images) {
    var objects = [];
    objects[1] = encode('<< /Type /Catalog /Pages 2 0 R >>');
    objects[2] = encode('<< /Type /Pages /Count ' + images.length + ' /Kids [' + images.map(function (_, i) { return (3 + i * 3) + ' 0 R'; }).join(' ') + '] >>');
    images.forEach(function (image, index) {
      var page = 3 + index * 3;
      objects[page] = encode('<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595.28 841.89] /Resources << /XObject << /Im0 ' + (page + 1) + ' 0 R >> >> /Contents ' + (page + 2) + ' 0 R >>');
      objects[page + 1] = [encode('<< /Type /XObject /Subtype /Image /Width ' + image.width + ' /Height ' + image.height + ' /ColorSpace /DeviceRGB /BitsPerComponent 8 /Filter /DCTDecode /Length ' + image.bytes.length + ' >>\nstream\n'), image.bytes, encode('\nendstream')];
      var content = 'q\n595.28 0 0 841.89 0 0 cm\n/Im0 Do\nQ\n';
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
    var pageCount = Math.ceil(data.layers.length / 2);
    for (var page = 0; page < pageCount; page++) {
      var canvas = canvasFactory ? canvasFactory() : document.createElement('canvas');
      canvas.width = 1786; canvas.height = 2526;
      var c = canvas.getContext('2d');
      if (!c) throw new Error('PDF描画用のCanvasを利用できません。');
      c.scale(3, 3);
      c.fillStyle = '#fff'; c.fillRect(0, 0, 596, 842);
      function text(x, y, value, size, maxWidth) {
        var label = String(value || '').replace(/[\r\n]/g, ' ');
        size = size || 9;
        function font() { c.font = size + 'px "Yu Gothic", "Meiryo", sans-serif'; }
        font();
        while (maxWidth && c.measureText(label).width > maxWidth && size > 5) { size -= 0.25; font(); }
        if (maxWidth && c.measureText(label).width > maxWidth) {
          while (label && c.measureText(label + '...').width > maxWidth) label = label.slice(0, -1);
          label += '...';
        }
        c.fillStyle = '#17212d'; c.fillText(label, x, y);
      }
      text(22, 28, 'SO-SHO キーマップ', 17);
      text(22, 46, '画面上の現在値（未保存の編集を含む） / ' + data.createdAt, 7.5, 550);
      for (var slot = 0; slot < 2; slot++) {
        var layerIndex = page * 2 + slot;
        if (layerIndex >= data.layers.length) break;
        var layer = data.layers[layerIndex];
        var top = slot * 370;
        text(22, top + 76, layer.name || 'Layer ' + layerIndex, 14, 550);
        ['left', 'right'].forEach(function (side, sideIndex) {
          var keys = layer[side];
          if (!Array.isArray(keys) || keys.length !== 22) throw new Error('左右各22キーのデータが必要です。');
          var origin = 22 + sideIndex * 282;
          text(origin, top + 98, side === 'left' ? '左手' : '右手', 9);
          keys.forEach(function (key, index) {
            var row = Math.min(Math.floor(index / 6), 3);
            var col = index < 18 ? index % 6 : [0, 1, 4, 5][index - 18];
            var x = origin + col * 44, y = top + 109 + row * 50;
            c.fillStyle = '#f5f7f9'; c.fillRect(x, y, 41, 44);
            c.strokeStyle = '#a6b0bb'; c.lineWidth = 0.6; c.strokeRect(x, y, 41, 44);
            text(x + 3, y + 10, index + 1, 5.5);
            text(x + 3, y + 24, key.tap || '未設定', 7.5, 35);
            if (key.hold) text(x + 3, y + 37, 'Hold: ' + key.hold, 6, 35);
          });
          var encoders = layer.encoders || {};
          text(origin, top + 330, 'エンコーダー', 9);
          text(origin, top + 347, '左回転: ' + (encoders[side + '-ccw'] || '未取得'), 8, 261);
          text(origin, top + 363, '右回転: ' + (encoders[side + '-cw'] || '未取得'), 8, 261);
        });
        if (slot === 0 && layerIndex + 1 < data.layers.length) {
          c.strokeStyle = '#d9dee5'; c.lineWidth = 0.6;
          c.strokeRect(22, 408, 550, 0.5);
        }
      }
      text(22, 786, '上段: タップ／通常入力　Hold: 長押し　数字: 各側の物理配置順', 7.5, 550);
      text(22, 802, '長い表記は縮小し、収まらない場合は末尾を省略します。', 7);
      text(512, 824, (page + 1) + ' / ' + pageCount, 8);
      var binary = atob(canvas.toDataURL('image/jpeg', 0.95).split(',')[1]);
      var bytes = new Uint8Array(binary.length);
      for (var n = 0; n < binary.length; n++) bytes[n] = binary.charCodeAt(n);
      images.push({ width: canvas.width, height: canvas.height, bytes: bytes });
      await new Promise(function (resolve) { setTimeout(resolve, 0); });
    }
    return imagePdf(images);
  };
}(window));
