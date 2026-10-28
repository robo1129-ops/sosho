const assert = require('assert');
const fs = require('fs');
const path = require('path');

const rpcUi = fs.readFileSync(path.join(__dirname, '..', 'sosho-rpc-ui.js'), 'utf8');
const enhancements = fs.readFileSync(path.join(__dirname, '..', 'ui-enhancements.js'), 'utf8');
const firmwareKeymap = fs.readFileSync(path.join(__dirname, '..', '..', 'sosho-firmware', 'config', 'sosho.keymap'), 'utf8');

// Bootloader is a zero-parameter ZMK behavior, not a keyboard HID usage.
// The editor must resolve it through the connected behavior registry.
assert.match(rpcUi, /builtinReset === 'RESET' \|\| builtinReset === 'BOOTLOADER'/);
assert.match(rpcUi, /BOOT\\s\*LOADER/);
assert.match(rpcUi, /behaviorId: Number\(resetDetail\.id\), param1: 0, param2: 0/);
assert.match(rpcUi, /UF2のブートローダー書き込みはキーマップ割り当てとは別経路です/);
assert.match(rpcUi, /reservedBootloaderPosition = 43/);
assert.match(rpcUi, /右下のブートローダーキーはWebアプリから変更できません/);
assert.match(fs.readFileSync(path.join(__dirname, '..', 'index.html'), 'utf8'), /reservedBootloader/);

// Keep the action visible in the enhanced palette; it is now safe to save
// when the connected firmware advertises the built-in behavior.
assert.match(enhancements, /\['RESET', 'RESET'\]/);
assert.match(enhancements, /\['BOOTLOADER', 'BOOTLOADER'\]/);

// The default Layer 3 map exposes a safe left-side key while the momentary
// Layer 3 key is held, so the user can enter UF2 mode without a PC-side RPC.
assert.match(firmwareKeymap, /&bt BT_CLR &bootloader &trans/);

// The physical left bottom key second from the right is the Japanese
// half-width/full-width key on tap and Layer 1 on hold.  Keep the firmware
// default aligned with the editor's LT(1, LANG5) representation.
assert.match(firmwareKeymap, /&lt 1 LANG5\s+&kp SPACE/);

console.log('Bootloader keymap binding smoke test passed');
