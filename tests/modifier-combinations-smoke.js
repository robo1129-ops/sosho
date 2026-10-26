const fs = require('fs');
const vm = require('vm');

const source = fs.readFileSync('sosho-rpc-ui.js', 'utf8');
const context = {
  window: {},
  document: {
    getElementById() { return null; },
    querySelector() { return null; }
  },
  setInterval() {}
};
context.window = context.window;
vm.runInNewContext(source, context, { filename: 'sosho-rpc-ui.js' });

const diagnostics = context.window.soshoModifierDiagnostics;
if (!diagnostics) throw new Error('modifier diagnostics hook was not installed');

const key = {
  A: 0x04,
  S: 0x16,
  ENTER: 0x28,
  DELETE: 0x4c
};
const bit = {
  LCTRL: 0x01,
  LSHIFT: 0x02,
  LALT: 0x04,
  LGUI: 0x08,
  RCTRL: 0x10,
  RSHIFT: 0x20,
  RALT: 0x40,
  RGUI: 0x80
};

function expected(modifiers, code) {
  const mask = modifiers.reduce((value, name) => value | bit[name], 0);
  return (((mask << 24) | (0x07 << 16) | code) >>> 0);
}

const cases = [
  ['LALT+S', ['LALT'], key.S, 'Alt+S'],
  ['LCTRL+LALT+S', ['LCTRL', 'LALT'], key.S, 'Ctrl+Alt+S'],
  ['LSHIFT+LGUI+ENTER', ['LSHIFT', 'LGUI'], key.ENTER, 'Shift+GUI+ENTER'],
  ['RCTRL+RALT+DELETE', ['RCTRL', 'RALT'], key.DELETE, 'Right Ctrl+Right Alt+DELETE'],
  ['LSHFT+S', ['LSHIFT'], key.S, 'Shift+S'],
  ['RSHFT+S', ['RSHIFT'], key.S, 'Right Shift+S'],
  ['半角/全角', [], 0x94, '半角/全角'],
  ['全角/半角', [], 0x94, '半角/全角'],
  ['LANG5', [], 0x94, '半角/全角'],
  ['LALT+半角/全角', ['LALT'], 0x94, 'Alt+半角/全角']
];

for (const [label, modifiers, code, display] of cases) {
  const parsed = diagnostics.parse(label);
  const expectedMask = modifiers.reduce((value, name) => value | bit[name], 0);
  if (modifiers.length) {
    if (!parsed.valid) throw new Error(`${label} was rejected`);
    if (parsed.mask !== expectedMask) {
      throw new Error(`${label} produced mask 0x${parsed.mask.toString(16)}`);
    }
  } else if (parsed.valid && parsed.mask !== 0) {
    throw new Error(`${label} unexpectedly parsed as a modified key`);
  }
  const usage = diagnostics.keyboardUsage(label);
  if (usage !== expected(modifiers, code)) {
    throw new Error(`${label} produced 0x${(usage >>> 0).toString(16)} instead of 0x${expected(modifiers, code).toString(16)}`);
  }
  if (diagnostics.label(usage) !== display) {
    throw new Error(`${label} displayed as ${diagnostics.label(usage)}`);
  }
}

if (diagnostics.parse('LALT+LALT+S').valid) throw new Error('duplicate modifiers must be rejected');
if (diagnostics.parse('NOT_A_MODIFIER+S').valid) throw new Error('unknown modifiers must be rejected');

if (!/function keyboardUsageForLabel\(value\)[\s\S]*parseModifiedLabel\(value\)/.test(source)) {
  throw new Error('resolveBinding does not parse modifier combinations');
}
if (!/return code === undefined \? null : \(\(modified\.valid \? modified\.mask : 0\) << 24\)/.test(source)) {
  throw new Error('resolveBinding does not pack modifier bits');
}
if (!/function japaneseHalfFullwidthCode\(value\)/.test(source)) {
  throw new Error('Japanese 半角/全角 canonicalization is missing');
}
if (!/0x94:\s*'半角\/全角'/.test(source)) {
  throw new Error('HID 0x94 is not displayed as 半角/全角');
}
if (!/\['Shift','LSHIFT'\]/.test(fs.readFileSync('index.html', 'utf8'))) {
  throw new Error('UI does not use the canonical LSHIFT value');
}

console.log('Modifier combination RPC smoke test passed');
