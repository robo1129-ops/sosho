const fs = require('fs');
const vm = require('vm');

const rpcSource = fs.readFileSync('sosho-rpc-ui.js', 'utf8');
const indexSource = fs.readFileSync('index.html', 'utf8');
const enhancementSource = fs.readFileSync('ui-enhancements.js', 'utf8');
const context = {
  window: {},
  document: {
    getElementById() { return null; },
    querySelector() { return null; }
  },
  setInterval() {}
};
vm.runInNewContext(rpcSource, context, { filename: 'sosho-rpc-ui.js' });
const diagnostics = context.window.soshoModifierDiagnostics;
if (!diagnostics) throw new Error('keycode diagnostics hook was not installed');

const baseCases = [];
for (let code = 0x04; code <= 0x1d; code++) baseCases.push([String.fromCharCode(65 + code - 0x04), code]);
for (let digit = 0; digit <= 9; digit++) baseCases.push([String(digit), digit === 0 ? 0x27 : 0x1d + digit]);
for (let f = 1; f <= 24; f++) baseCases.push([`F${f}`, 0x39 + f]);
for (const [label, code] of [
  ['Enter', 0x28], ['Backspace', 0x2a], ['Tab', 0x2b], ['Escape', 0x29], ['Space', 0x2c],
  ['Insert', 0x49], ['Delete', 0x4c], ['Home', 0x4a], ['End', 0x4d], ['Page Up', 0x4b], ['Page Down', 0x4e],
  ['Right', 0x4f], ['Left', 0x50], ['Down', 0x51], ['Up', 0x52], ['CapsLock', 0x39],
  ['Num Lock', 0x53], ['Scroll Lock', 0x47], ['Print Screen', 0x46], ['Menu', 0x65],
  ['INT1', 0x87], ['INT2', 0x88], ['INT3', 0x89], ['INT4', 0x8a], ['INT5', 0x8b],
  ['LANG1', 0x90], ['LANG2', 0x91], ['LANG3', 0x92], ['LANG4', 0x93], ['LANG5', 0x94],
  ['LANG6', 0x95], ['LANG7', 0x96], ['LANG8', 0x97], ['LANG9', 0x98]
]) baseCases.push([label, code]);

for (const [label, code] of baseCases) {
  const usage = diagnostics.keyboardUsage(label);
  if (usage === null || (usage & 0xffff) !== code) throw new Error(`${label} resolved to the wrong HID usage`);
}

const punctuation = [
  ['`', 0x35], ['-', 0x2d], ['=', 0x2e], ['[', 0x2f], [']', 0x30], ['\\', 0x31],
  [';', 0x33], ["'", 0x34], [',', 0x36], ['.', 0x37], ['/', 0x38]
];
for (const [label, code] of punctuation) {
  const usage = diagnostics.keyboardUsage(label);
  if ((usage & 0xffff) !== code || diagnostics.label(usage) !== label) throw new Error(`${label} did not round-trip literally`);
}
for (const [label, code] of Object.entries({ '!': 0x1e, '@': 0x1f, '#': 0x20, '$': 0x21, '%': 0x22, '^': 0x23, '&': 0x24, '*': 0x25, '(': 0x26, ')': 0x27, '_': 0x2d, '+': 0x2e, '{': 0x2f, '}': 0x30, '|': 0x31, ':': 0x33, '"': 0x34, '~': 0x35, '<': 0x36, '>': 0x37, '?': 0x38 })) {
  const usage = diagnostics.keyboardUsage(label);
  if ((usage >>> 24) !== 0x02 || (usage & 0xffff) !== code || diagnostics.label(usage) !== label) throw new Error(`${label} did not round-trip with Shift`);
}

for (const [alias, literal] of [['Slash', '/'], ['ASCII_/', '/'], ['Period', '.'], ['Comma', ','], ['Semicolon', ';'], ['Quote', "'"], ['Backslash', '\\'], ['Minus', '-'], ['Equal', '=']]) {
  if (diagnostics.canonicalLabel(alias) !== literal) throw new Error(`${alias} was not canonicalized to ${literal}`);
}
for (const modifier of ['LCTRL', 'RCTRL', 'LSHIFT', 'RSHIFT', 'LALT', 'RALT', 'LGUI', 'RGUI']) {
  const usage = diagnostics.keyboardUsage(`${modifier}+/`);
  if (!usage || (usage & 0xffff) !== 0x38) throw new Error(`${modifier}+/ lost the slash usage`);
}

if (!/canonicalUiAction\(select\.value\)/.test(indexSource) || !/canonicalUiAction\(d\.slice\(7\)\)/.test(indexSource) || !/soshoAssignAction=function\(name\).*canonicalUiAction/.test(indexSource)) {
  throw new Error('normal, list, or layout drag paths do not share canonical labels');
}
if (!/soshoCanonicalKeyLabel\(action\)/.test(enhancementSource)) throw new Error('encoder drag path does not share canonical labels');
if (!/data-key-popover-tap/.test(indexSource) || !/data-key-popover-hold/.test(indexSource) || !/data-key-popover-apply-selection/.test(indexSource)) {
  throw new Error('tap/hold controls are not separated');
}
if (!/tapDanceRequest/.test(rpcSource) || !/behaviorById/.test(rpcSource)) throw new Error('tap dance is not resolved against advertised behavior metadata');

console.log('All keycode, punctuation, modifier, hold-tap, tap-dance and drag paths round-trip');
