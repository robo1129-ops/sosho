"""Render an editor snapshot; never execute labels or treat them as markup."""
import argparse
import json
import os
from pathlib import Path
from reportlab.pdfgen import canvas
from reportlab.lib.pagesizes import landscape, A4
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.pdfbase.cidfonts import UnicodeCIDFont


def load_snapshot(raw):
    if len(raw.encode('utf-8')) > 60000:
        raise ValueError('Snapshot too large')
    data = json.loads(raw)
    if data.get('version') != 1 or not isinstance(data.get('layers'), list) or not 1 <= len(data['layers']) <= 16:
        raise ValueError('Invalid snapshot')
    for layer in data['layers']:
        for side in ('left', 'right'):
            keys = layer.get(side)
            if not isinstance(keys, list) or len(keys) != 22:
                raise ValueError('Each half must have 22 keys')
            for key in keys:
                if not isinstance(key, dict) or any(not isinstance(key.get(k, ''), str) or len(key.get(k, '')) > 160 for k in ('tap', 'hold')):
                    raise ValueError('Invalid key label')
        encoders = layer.get('encoders', {})
        if not isinstance(encoders, dict) or any(not isinstance(v, str) or len(v) > 160 for v in encoders.values()):
            raise ValueError('Invalid encoder label')
    return data


def render(data, output):
    font = 'JP'
    candidates = [os.environ.get('SOSHO_PDF_FONT', ''), 'C:/Windows/Fonts/msgothic.ttc', '/usr/share/fonts/opentype/ipafont-gothic/ipag.ttf']
    selected = next((p for p in candidates if p and Path(p).is_file()), None)
    if selected:
        pdfmetrics.registerFont(TTFont(font, selected))
    else:
        font = 'HeiseiKakuGo-W5'
        pdfmetrics.registerFont(UnicodeCIDFont(font))
    output = Path(output)
    output.parent.mkdir(parents=True, exist_ok=True)
    width, height = landscape(A4)
    c = canvas.Canvas(str(output), pagesize=(width, height))
    c.setTitle('SO-SHO キーマップ カンニングペーパー')

    def text(x, y, label, size=10, max_width=None):
        label = str(label).replace('\n', ' ').replace('\r', ' ')
        while max_width and pdfmetrics.stringWidth(label, font, size) > max_width and size > 5:
            size -= 0.25
        if max_width and pdfmetrics.stringWidth(label, font, size) > max_width:
            while label and pdfmetrics.stringWidth(label + '...', font, size) > max_width:
                label = label[:-1]
            label += '...'
        c.setFont(font, size)
        c.setFillColorRGB(0.09, 0.13, 0.18)
        c.drawString(x, y, label)

    for page, layer in enumerate(data['layers']):
        text(28, height - 37, 'SO-SHO キーマップ / ' + str(layer.get('name', 'Layer ' + str(page))), 19, width - 56)
        text(28, height - 59, '画面上の現在の割り当て（未保存の編集を含む） / ' + str(data.get('createdAt', ''))[:32], 9)
        for side_index, side in enumerate(('left', 'right')):
            origin = 28 + side_index * (width / 2)
            text(origin, height - 95, '左手' if side == 'left' else '右手', 13)
            cell_w, cell_h = 59, 58
            for index, key in enumerate(layer[side]):
                row = min(index // 6, 3)
                col = index % 6 if index < 18 else (0, 1, 4, 5)[index - 18]
                x, y = origin + col * 63, height - 165 - row * 65
                c.setFillColorRGB(.96, .97, .98)
                c.setStrokeColorRGB(.65, .69, .73)
                c.roundRect(x, y, cell_w, cell_h, 5, fill=1, stroke=1)
                text(x + 5, y + 43, str(index + 1), 7)
                text(x + 5, y + 25, key.get('tap') or '未設定', 10, cell_w - 10)
                if key.get('hold'):
                    text(x + 5, y + 9, 'Hold: ' + key['hold'], 8, cell_w - 10)
            encoder = layer.get('encoders', {})
            text(origin, 160, 'エンコーダー', 11)
            text(origin, 140, '左回転: ' + encoder.get(side + '-ccw', '未取得'), 10, 375)
            text(origin, 120, '右回転: ' + encoder.get(side + '-cw', '未取得'), 10, 375)
        text(28, 70, '上段はタップ／通常入力、Holdは長押し。キー番号は各側の物理配置順です。', 9)
        text(28, 52, '長い表記は縮小し、収まらない場合は末尾を省略します。', 8)
        text(width - 95, 24, f'{page + 1} / {len(data["layers"])}', 9)
        c.showPage()
    c.save()


if __name__ == '__main__':
    parser = argparse.ArgumentParser()
    parser.add_argument('--input')
    parser.add_argument('--output', required=True)
    args = parser.parse_args()
    raw = Path(args.input).read_text(encoding='utf-8') if args.input else os.environ['KEYMAP_SNAPSHOT']
    render(load_snapshot(raw), args.output)
