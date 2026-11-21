import importlib.util
import json
import tempfile
import unittest
from pathlib import Path

spec = importlib.util.spec_from_file_location('keymap_pdf', Path(__file__).parents[1] / 'scripts/keymap_pdf.py')
pdf = importlib.util.module_from_spec(spec)
spec.loader.exec_module(pdf)


def example():
    labels = ['半角/全角', 'GUI+LEFT', '音量＋', '←', '<script>alert(1)</script>', 'A']
    return {'version': 1, 'createdAt': '2026-11-21 / テスト', 'layers': [
        {'name': f'Layer {n}', 'left': [{'tap': labels[i % len(labels)], 'hold': 'Layer 1' if i == 21 else ''} for i in range(22)],
         'right': [{'tap': 'Backspace', 'hold': 'LALT' if i == 20 else ''} for i in range(22)],
         'encoders': {'left-ccw': '音量－', 'left-cw': '音量＋', 'right-ccw': 'Wheel Down', 'right-cw': 'Wheel Up'}} for n in range(11)]}


class PdfTests(unittest.TestCase):
    def test_render_all_layers(self):
        data = pdf.load_snapshot(json.dumps(example(), ensure_ascii=False))
        with tempfile.TemporaryDirectory() as directory:
            output = Path(directory) / 'keymap.pdf'
            pdf.render(data, output)
            self.assertTrue(output.read_bytes().startswith(b'%PDF-'))

    def test_bad_shape_and_oversize_rejected(self):
        data = example()
        data['layers'][0]['left'].pop()
        with self.assertRaises(ValueError):
            pdf.load_snapshot(json.dumps(data))
        with self.assertRaises(ValueError):
            pdf.load_snapshot(' ' * 60001)


if __name__ == '__main__':
    unittest.main()
