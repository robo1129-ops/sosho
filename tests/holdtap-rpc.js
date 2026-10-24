const fs = require('fs');
const path = require('path');
const root = path.resolve(__dirname, '..');
const ui = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
const rpc = fs.readFileSync(path.join(root, 'sosho-rpc-ui.js'), 'utf8');
const transport = fs.readFileSync(path.join(root, 'zmk-studio-transport.js'), 'utf8');

if (!ui.includes('data-key-popover-hold')) throw new Error('hold editor is missing');
if (!ui.includes('getHoldAssignments')) throw new Error('hold assignments are not exposed to RPC');
if (!rpc.includes('resolveHoldTapBinding')) throw new Error('hold-tap binding resolver is missing');
if (!rpc.includes('holdTapParameter(detail, 1, holdLabel)')) throw new Error('hold parameter is not encoded');
if (!rpc.includes('holdTapParameter(detail, 2, tapLabel)')) throw new Error('tap parameter is not encoded');
if (!transport.includes('var listed = await self.listBehaviors()')) throw new Error('unused hold-tap behaviors are not loaded');

console.log('Hold-tap editor and ZMK Studio binding path smoke test passed');
