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
assert.ok(!rpcUi.includes('reservedBootloaderPosition'), 'RPC must not reserve a physical position');
assert.ok(!rpcUi.includes('右下のブートローダーキーはWebアプリから変更できません'), 'RPC must not reject the former reserved position');
const editor = fs.readFileSync(path.join(__dirname, '..', 'index.html'), 'utf8');
assert.ok(!editor.includes('reservedBootloader'), 'renderer must not mark a physical key as reserved');
assert.ok(editor.includes('setDropTarget(key,id)'), 'the former reserved key must use the normal drop path');
assert.ok(!editor.includes("left:['Studio','BT0','BT1','BT2','BT3','BT4','□','BT CLR ALL','BT CLR','Bootloader'"), 'factory editor layout must not bind Bootloader to a physical key');
assert.match(editor, /ブートローダーは通常キーへ固定せず/);

// Keep the action visible in the enhanced palette; it is now safe to save
// when the connected firmware advertises the built-in behavior.
assert.match(enhancements, /\['RESET', 'RESET'\]/);
assert.match(enhancements, /\['BOOTLOADER', 'BOOTLOADER'\]/);

// Bootloader remains available through the connected behavior registry, but
// no factory key physically enters UF2 mode.  This prevents an accidental
// Layer 3 key press from looking like a dead or failed firmware.
assert.match(firmwareKeymap, /&bt BT_CLR &trans &trans &trans/);
assert.ok(!firmwareKeymap.includes('&sosho_bootloader'), 'factory keymap must not bind a physical bootloader action');
assert.ok(!firmwareKeymap.includes('&bootloader'), 'factory keymap must not bind a physical bootloader action');

// The physical left bottom key second from the right is the Japanese
// half-width/full-width key on tap and Layer 1 on hold.  Keep the firmware
// default uses the Windows-US/IME-compatible Alt+GRAVE usage for the
// human-facing half/full-width action uses the dedicated HID Language 5 key.
assert.match(firmwareKeymap, /#define SOSHO_HALF_FULL LANG5/);
assert.match(firmwareKeymap, /&lt 1 SOSHO_HALF_FULL\s+&kp SPACE/);

console.log('Bootloader keymap binding smoke test passed');
