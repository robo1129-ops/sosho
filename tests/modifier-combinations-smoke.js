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
  DELETE: 0x4c,
  SLASH: 0x38,
  PERIOD: 0x37,
  COMMA: 0x36,
  SEMICOLON: 0x33,
  QUOTE: 0x34,
  BACKSLASH: 0x31,
  MINUS: 0x2d,
  EQUAL: 0x2e
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
  ['半角/全角', [], 0x35, '半角/全角', ['LALT']],
  ['全角/半角', [], 0x35, '半角/全角', ['LALT']],
  ['LANG5', [], 0x94, '半角/全角'],
  ['LALT+半角/全角', ['LALT'], 0x35, '半角/全角'],
  ['/', [], key.SLASH, '/'],
  ['Slash', [], key.SLASH, '/'],
  ['ASCII_/', [], key.SLASH, '/'],
  ['LALT+/', ['LALT'], key.SLASH, 'Alt+/', ['LALT']],
  ['.', [], key.PERIOD, '.'],
  ['Comma', [], key.COMMA, ','],
  [';', [], key.SEMICOLON, ';'],
  ["'", [], key.QUOTE, "'"],
  ['\\', [], key.BACKSLASH, '\\'],
  ['Minus', [], key.MINUS, '-'],
  ['Equal', [], key.EQUAL, '='],
  ['!', [], 0x1e, '!', ['LSHIFT']],
  ['@', [], 0x1f, '@', ['LSHIFT']],
  ['?', [], key.SLASH, '?', ['LSHIFT']]
];

for (const [label, modifiers, code, display, packedModifiers = modifiers] of cases) {
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
  if (usage !== expected(packedModifiers, code)) {
    throw new Error(`${label} produced 0x${(usage >>> 0).toString(16)} instead of 0x${expected(packedModifiers, code).toString(16)}`);
  }
  if (diagnostics.label(usage) !== display) {
    throw new Error(`${label} displayed as ${diagnostics.label(usage)}`);
  }
}

if (diagnostics.parse('LALT+LALT+S').valid) throw new Error('duplicate modifiers must be rejected');
if (diagnostics.parse('NOT_A_MODIFIER+S').valid) throw new Error('unknown modifiers must be rejected');

if (!/function keyboardUsageForHoldLabel\(value\)[\s\S]*parseModifiedLabel\(rawLabel\)/.test(source) || !/function keyboardUsageForLabel\(value\)\s*\{\s*return keyboardUsageForHoldLabel\(value\);/.test(source)) {
  throw new Error('normal and hold-tap resolution do not share modifier parsing');
}
if (!/return code === undefined \? null : \(\(modified\.valid \? modified\.mask : 0\) << 24\)/.test(source)) {
  throw new Error('resolveBinding does not pack modifier bits');
}
if (!/function japaneseHalfFullwidthCode\(value\)/.test(source)) {
  throw new Error('Japanese 半角/全角 canonicalization is missing');
}
if (!/0x35:\s*'`'/.test(source)) {
  throw new Error('HID 0x35 is not displayed as the literal backtick');
}
if (!/\['Shift','LSHIFT'\]/.test(fs.readFileSync('index.html', 'utf8'))) {
  throw new Error('UI does not use the canonical LSHIFT value');
}
if (diagnostics.canonicalLabel('Slash') !== '/' || diagnostics.canonicalLabel('ASCII_/') !== '/') {
  throw new Error('palette slash aliases do not canonicalize to a literal slash');
}
if (!/assignments\[id\]=canonicalUiAction\(d\.slice\(7\)\)/.test(fs.readFileSync('index.html', 'utf8'))) {
  throw new Error('drag/drop does not use the shared canonical action path');
}
if (!/action\s*=\s*window\.soshoCanonicalKeyLabel\(action\)/.test(fs.readFileSync('ui-enhancements.js', 'utf8'))) {
  throw new Error('encoder drag/drop does not use the shared canonical action path');
}
if (!/data-key-popover-tap[\s\S]*data-key-popover-hold[\s\S]*data-key-popover-apply-selection/.test(fs.readFileSync('index.html', 'utf8'))) {
  throw new Error('tap/hold editor does not expose separate tap and hold save paths');
}
if (!/tapDanceRequest/.test(source) || !/behaviorById/.test(source)) {
  throw new Error('tap-dance resolution is not gated by the device behavior list');
}

for (const [label, expectedCode, expectedDisplay] of [
  ['/', 0x38, '/'], ['ASCII_/', 0x38, '/'], ['Slash', 0x38, '/'],
  ['!', 0x1e, '!'], ['@', 0x1f, '@'], ['?', 0x38, '?']
]) {
  const usage = diagnostics.keyboardUsage(label);
  if ((usage & 0xffff) !== expectedCode || diagnostics.label(usage) !== expectedDisplay) {
    throw new Error(`${label} did not round-trip as ${expectedDisplay}`);
  }
}

console.log('Modifier combination RPC smoke test passed');
