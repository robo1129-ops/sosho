const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const source = fs.readFileSync(
  path.resolve(__dirname, '..', 'chrome-extension', 'popup.js'),
  'utf8'
);

function element() {
  return {
    disabled: false,
    textContent: '',
    innerHTML: '',
    listeners: {},
    addEventListener(name, handler) { this.listeners[name] = handler; }
  };
}

const elements = new Map();
for (const id of ['status', 'log', 'check', 'connect', 'disconnect', 'copy', 'clear']) {
  elements.set(id, element());
}

let notificationStarted = false;
const characteristic = {
  async startNotifications() {
    notificationStarted = true;
  }
};
const service = {
  async getCharacteristic(uuid) {
    assert.equal(uuid, '00000001-0196-6107-c967-c5cfb1c2482a');
    return characteristic;
  }
};
const server = {
  async getPrimaryService(uuid) {
    assert.equal(uuid, '00000000-0196-6107-c967-c5cfb1c2482a');
    return service;
  }
};
const device = {
  name: 'sosho',
  gatt: {
    connected: false,
    async connect() {
      this.connected = true;
      return server;
    },
    disconnect() {
      this.connected = false;
    }
  },
  addEventListener() {}
};

const storage = {
  async get() { return {}; },
  async set() {}
};
const context = {
  console,
  Date,
  window: { isSecureContext: true },
  navigator: {
    bluetooth: {
      async requestDevice(options) {
        assert.equal(options.acceptAllDevices, true);
        assert.equal(
          options.optionalServices.join(','),
          '00000000-0196-6107-c967-c5cfb1c2482a,7f5e0000-8a2a-4c2f-b93e-55f4b5d30001'
        );
        return device;
      },
      async getAvailability() { return true; }
    }
  },
  chrome: { storage: { local: storage } },
  document: { getElementById(id) { return elements.get(id); } }
};

vm.runInNewContext(source, context);
elements.get('connect').listeners.click();

setImmediate(() => {
  try {
    assert.equal(notificationStarted, true);
    assert.equal(elements.get('status').textContent, 'BLE/GATT接続済み');
    assert.match(elements.get('log').innerHTML, /公式Service discovery成功/);
    assert.match(elements.get('log').innerHTML, /公式Characteristic discovery成功/);
    assert.equal(elements.get('connect').disabled, true);
    assert.equal(elements.get('disconnect').disabled, false);
    console.log('SO-SHO Chrome extension BLE flow unit test passed');
  } catch (error) {
    console.error(error.stack || error);
    process.exitCode = 1;
  }
});
