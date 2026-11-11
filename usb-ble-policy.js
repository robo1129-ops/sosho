(function () {
  'use strict';

  // SO-SHO deliberately exposes USB as a maintenance channel only.  The
  // right Central still provides CDC/RPC for keymap editing and charging,
  // while all keyboard, pointer and consumer input goes through Bluetooth.
  window.soshoUsbHostInputDisabled = true;

  var copy = {
    ja: {
      subtitle: 'USBはキーマップ書き換え・充電のみ、PC入力はBluetoothのみです。右側Centralを接続してください。',
      title: '右側CentralをUSBまたはBluetoothで接続してください',
      body: 'USBはキーマップ書き換えと充電だけに使い、PCへのキー・マウス入力はBluetoothからのみ送信します。USB接続ではPC入力デバイスとして動作しません。',
      transport: 'USBは右側CentralのキーマップRPC専用、PC入力はBluetooth専用です。',
      transportExtra: 'USB接続中は充電とキーマップの読み取り・保存だけを行います。キー入力・マウス入力はBluetooth接続時だけ有効です。',
      rpc: '右側USBまたはBluetoothで接続後に編集できます。USBはキーマップRPC専用で、PCへの入力はBluetoothのみです。保存後は実機を再読み取りして一致を確認します。'
    },
    en: {
      subtitle: 'USB is for keymap editing and charging only. PC input uses Bluetooth only. Connect the right Central.',
      title: 'Connect the right Central by USB or Bluetooth',
      body: 'USB is used only for keymap editing and charging. Keyboard, pointer and consumer input to the PC is sent through Bluetooth only; USB does not act as a PC input device.',
      transport: 'USB is reserved for right-Central keymap RPC; PC input is Bluetooth-only.',
      transportExtra: 'While USB is connected, only charging and keymap read/write are active. Keyboard and pointer input is enabled through Bluetooth.',
      rpc: 'Edit after connecting the right USB or Bluetooth transport. USB is reserved for keymap RPC; PC input uses Bluetooth only. After saving, the device is read again to verify the result.'
    },
    'zh-CN': {
      subtitle: 'USB 仅用于键位编辑和充电，电脑输入仅使用蓝牙。请连接右侧 Central。',
      title: '请通过 USB 或蓝牙连接右侧 Central',
      body: 'USB 仅用于键位编辑和充电。键盘、指针和媒体输入只通过蓝牙发送到电脑；USB 不作为电脑输入设备。',
      transport: 'USB 仅用于右侧 Central 的键位 RPC，电脑输入仅使用蓝牙。',
      transportExtra: '连接 USB 时只进行充电以及键位读取和保存。键盘和指针输入仅在蓝牙连接时启用。',
      rpc: '连接右侧 USB 或蓝牙后即可编辑。USB 仅用于键位 RPC，电脑输入仅使用蓝牙。保存后会再次读取设备进行确认。'
    },
    ko: {
      subtitle: 'USB는 키맵 편집과 충전만 사용하고 PC 입력은 Bluetooth만 사용합니다. 오른쪽 Central을 연결하세요.',
      title: '오른쪽 Central을 USB 또는 Bluetooth로 연결하세요',
      body: 'USB는 키맵 편집과 충전에만 사용합니다. 키보드·포인터·미디어 입력은 Bluetooth로만 PC에 전송되며 USB는 PC 입력 장치로 동작하지 않습니다.',
      transport: 'USB는 오른쪽 Central 키맵 RPC 전용이며 PC 입력은 Bluetooth 전용입니다.',
      transportExtra: 'USB 연결 중에는 충전과 키맵 읽기·저장만 수행합니다. 키보드와 포인터 입력은 Bluetooth 연결에서만 활성화됩니다.',
      rpc: '오른쪽 USB 또는 Bluetooth로 연결한 뒤 편집합니다. USB는 키맵 RPC 전용이고 PC 입력은 Bluetooth만 사용합니다. 저장 후 장치를 다시 읽어 확인합니다.'
    },
    th: {
      subtitle: 'USB ใช้สำหรับแก้ไขคีย์แมปและชาร์จเท่านั้น ส่วนอินพุตไปยังพีซีใช้ Bluetooth เท่านั้น ให้เชื่อมต่อ Central ด้านขวา',
      title: 'เชื่อมต่อ Central ด้านขวาด้วย USB หรือ Bluetooth',
      body: 'USB ใช้สำหรับแก้ไขคีย์แมปและชาร์จเท่านั้น อินพุตคีย์บอร์ด พอยน์เตอร์ และมีเดียไปยังพีซีจะส่งผ่าน Bluetooth เท่านั้น USB จะไม่ทำหน้าที่เป็นอุปกรณ์อินพุตของพีซี',
      transport: 'USB สงวนไว้สำหรับ RPC ของคีย์แมปฝั่ง Central ขวา ส่วนอินพุตพีซีใช้ Bluetooth เท่านั้น',
      transportExtra: 'เมื่อเชื่อมต่อ USB จะเปิดใช้เฉพาะการชาร์จและการอ่าน/บันทึกคีย์แมป อินพุตคีย์บอร์ดและพอยน์เตอร์ใช้ได้ผ่าน Bluetooth',
      rpc: 'แก้ไขได้หลังเชื่อมต่อ USB หรือ Bluetooth ด้านขวา USB สงวนไว้สำหรับ RPC ของคีย์แมป ส่วนอินพุตพีซีใช้ Bluetooth เท่านั้น หลังบันทึกจะอ่านอุปกรณ์ซ้ำเพื่อตรวจสอบ'
    },
    es: {
      subtitle: 'USB solo sirve para editar el mapa y cargar. La entrada al PC usa únicamente Bluetooth. Conecta el Central derecho.',
      title: 'Conecta el Central derecho por USB o Bluetooth',
      body: 'USB se usa solo para editar el mapa y cargar. El teclado, el puntero y los controles multimedia se envían al PC únicamente por Bluetooth; USB no funciona como dispositivo de entrada.',
      transport: 'USB queda reservado para el RPC del mapa del Central derecho; la entrada al PC es solo Bluetooth.',
      transportExtra: 'Mientras USB está conectado solo están activos la carga y la lectura/escritura del mapa. La entrada de teclado y puntero se activa mediante Bluetooth.',
      rpc: 'Edita después de conectar el transporte USB o Bluetooth derecho. USB queda reservado para el RPC del mapa; la entrada al PC usa Bluetooth. Tras guardar, se vuelve a leer el dispositivo para verificarlo.'
    },
    de: {
      subtitle: 'USB dient nur zur Keymap-Bearbeitung und zum Laden. PC-Eingaben erfolgen ausschließlich über Bluetooth. Rechtes Central verbinden.',
      title: 'Rechtes Central per USB oder Bluetooth verbinden',
      body: 'USB wird nur für Keymap-Bearbeitung und Laden verwendet. Tastatur-, Zeiger- und Medien-Eingaben werden ausschließlich über Bluetooth an den PC gesendet; USB ist kein PC-Eingabegerät.',
      transport: 'USB ist für das Keymap-RPC des rechten Central reserviert; PC-Eingaben erfolgen nur über Bluetooth.',
      transportExtra: 'Bei USB-Verbindung sind nur Laden sowie Lesen und Speichern der Keymap aktiv. Tastatur- und Zeigereingaben laufen über Bluetooth.',
      rpc: 'Nach Verbindung des rechten USB- oder Bluetooth-Transports kann bearbeitet werden. USB ist für das Keymap-RPC reserviert, PC-Eingaben laufen über Bluetooth. Nach dem Speichern wird das Gerät erneut gelesen.'
    }
  };

  function currentLanguage() {
    var selector = document.getElementById('language-select');
    var language = selector && selector.value || document.documentElement.lang || 'ja';
    return copy[language] ? language : 'ja';
  }

  function applyCopy() {
    var values = copy[currentLanguage()];
    var subtitle = document.getElementById('site-subtitle');
    var title = document.getElementById('notice-title');
    var body = document.getElementById('notice-body');
    var notes = document.querySelectorAll('.transport-note');
    var rpc = document.getElementById('rpc-description');
    if (subtitle) subtitle.textContent = values.subtitle;
    if (title) title.textContent = values.title;
    if (body) body.textContent = values.body;
    if (notes[0]) notes[0].textContent = values.transport;
    if (notes[1]) notes[1].textContent = values.transportExtra;
    if (rpc) rpc.textContent = values.rpc;
  }

  function removeUsbOutputActions(root) {
    (root || document).querySelectorAll('.chip, button, [data-action]').forEach(function (node) {
      var label = String(node.getAttribute('data-action') || node.textContent || '')
        .replace(/[\s\u00a0]+/g, ' ').trim();
      if (/^(USB\s+OUTPUT|USB出力)$/i.test(label)) node.remove();
    });
  }

  function install() {
    applyCopy();
    removeUsbOutputActions(document);
    var selector = document.getElementById('language-select');
    if (selector) selector.addEventListener('change', function () { setTimeout(applyCopy, 0); });
    var palette = document.getElementById('palette');
    if (palette && typeof MutationObserver === 'function') {
      new MutationObserver(function () { removeUsbOutputActions(palette); }).observe(palette, { childList: true, subtree: true });
    }
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', install, { once: true });
  else install();
}());
