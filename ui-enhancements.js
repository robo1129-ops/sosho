(function () {
  'use strict';

  if (window.__soshoUiEnhancementsLoaded) return;
  window.__soshoUiEnhancementsLoaded = true;

  var languageCatalog = {
    ja: {
      title: 'SO-SHO キーマップエディター', wordmark: 'Studio', diagnostics: 'デバイス・ファームウェア・診断', layout: '配列:', layers: 'レイヤー:', navigation: 'キーマップナビゲーション', save: '保存', saveTitle: 'キーマップをUSBへ保存', discard: '破棄', discardTitle: '未保存の編集をデフォルトへ戻す', editor: 'キーマップ', connection: 'USB接続', log: 'USB接続ログ', read: 'USBからキーマップを読み込む', write: 'USBへキーマップを保存', macro: 'マクロ設計', addMacro: 'マクロを追加', language: 'Language',
      subtitle: 'SO-SHO実機配列に合わせたキーマップ・マクロ編集ページ', firmwareLink: 'カスタムファームウェアZIPを直接ダウンロード', downloadHeading: 'カスタムファームウェア（全パターン）', downloadDescription: '通常版に加えて、公式Cirque Pinnacleドライバの一次タップ・ドラッグ対応タッチプロファイルも含むZIPです。', latestZip: '最新ZIPをダウンロード', buildHistory: 'ビルド履歴', noticeTitle: '右側CentralをUSBで接続してください', noticeBody: 'このページの実機編集経路はWeb Serial（USB/COM）だけです。左右分割間の通信はファームウェア側で維持されますが、PCとのBLE編集は使用しません。ChromeまたはEdgeで右側をUSB接続し、初回だけ「右側USB / COM接続」を押してください。', connectionDescription: '右側CentralのUSB CDC-ACMをWeb Serialで開き、公式ZMK Studio RPCを使って読み取り・保存します。', transportNote: '右側CentralのUSB CDC-ACMをWeb Serialで開き、公式ZMK Studio RPCを使って読み取り・保存します。', logDescription: 'USB接続、RPC読み取り・保存の前後状態をこのページ内に保持します。', rpcDescription: '右側USBで接続後に読み取りを実行し、実機の現在値を画面へ反映します。保存は公式ZMK Studio RPCで送信し、USB CDC-ACM経由で書き込んだ後、実機から再読み取りして確認します。読み取り結果が「Studioロック中」の場合は、キーボードのLayer 3にある &studio_unlock を押してから保存してください。', editorHint: 'キーをクリックすると編集ポップオーバーが開きます。パレットはドラッグ＆ドロップで割り当てます。', referenceNote: 'SO-SHO実機配列・44キー（左右各22キー）。既存の割り当てはこのブラウザーに保存されます。', layoutBadge: '実機レイアウト準拠', selectedLegend: '選択中', assignedLegend: 'アクション設定済み', unassignedLegend: '未設定キー', paletteHeading: 'アクションパレット', inspector: 'インスペクター', selectedPosition: '選択中の位置', selectPrompt: 'キーを選択してください', currentAction: '現在のアクション', defaultHeading: 'デフォルト設定', defaultDescription: '現在の編集内容を次回の初期設定として保存できます。ファームウェア標準へ戻すこともできます。', saveDefault: '現在の設定をデフォルトにする', restoreDefaults: 'ファームウェア標準へ戻す', defaultStatus: 'Layer 0のMO(3)は初期配置済みです。', footerNote: 'キーマップはブラウザーにも保存されます。実機へ反映するには右側USB接続後に「USBへキーマップを保存」を押してください。', clearSelected: '選択中を未設定にする', resetSaved: '保存済みデフォルトへ戻す', macroDescription: '通常キーとは別に、名前・割り当て先・キー列・押下/解放モード・待ち時間を編集します。', macroContractLabel: 'USB専用の反映範囲:', macroContractBody: 'マクロの編集内容はJSONとブラウザーへ保存できます。公式ZMK Studio RPCはキーマップ保存用のため、マクロの実機反映には対応ファームウェアが必要です。', macroPaletteHeading: 'ドラッグでマクロを作成', macroPaletteDescription: 'Remapと同じように、キーコードを下の手順欄へドラッグしてください。クリックは選択だけで、入力は変更しません。', language: 'Language',
      groupBasic: '通常キー', groupJis: '日本語 / JIS', groupLayer: 'レイヤー', groupSpecial: '特殊キー', groupAscii: 'ASCII', groupTapDance: 'タップダンス', paletteHelp: 'キーをつかんで、上の実機配列へドラッグ＆ドロップしてください。', deviceBall: '右モジュール · トラックボール', deviceBallDesc: '移動量のCPIを調整します。', devicePad: '左モジュール · トラックパッド', devicePadDesc: 'カーソル移動倍率を調整します。', autoMouse: 'オートマウスレイヤー', autoMouseDesc: '入力中と停止後の指定時間だけ指定レイヤーを保持します。', scrollMode: 'スクロールモード', scrollDesc: 'ボタンをキーへ割り当てると、押している間だけスクロールします。', deviceNote: '設定値はJSONとブラウザーへ保存されます。実機へ反映するには対応ファームウェアが必要です。'
    },
    en: {
      title: 'SO-SHO Keymap Editor', wordmark: 'Keymap Studio', diagnostics: 'Device, firmware and diagnostics', layout: 'Layout:', layers: 'Layers:', navigation: 'Keymap navigation', save: 'Save', saveTitle: 'Save keymap to USB', discard: 'Discard', discardTitle: 'Restore the saved default', editor: 'Keymap', connection: 'USB connection', log: 'USB connection log', read: 'Read keymap from USB', write: 'Save keymap to USB', macro: 'Macro editor', addMacro: 'Add macro', language: 'Language', subtitle: 'Keymap and macro editor for the physical SO-SHO layout', firmwareLink: 'Download custom firmware ZIP', downloadHeading: 'Custom firmware (all profiles)', downloadDescription: 'The ZIP includes the standard profile and the Cirque Pinnacle touch profile with tap and drag support.', latestZip: 'Download latest ZIP', buildHistory: 'Build history', noticeTitle: 'Connect the right Central module by USB', noticeBody: 'This editor uses Web Serial (USB/COM) for device editing. Split communication remains in the firmware; BLE editing from the PC is not used. In Chrome or Edge, connect the right module by USB and choose USB connection once.', connectionDescription: 'Opens the right Central USB CDC-ACM port with Web Serial and uses the official ZMK Studio RPC for reading and saving.', transportNote: 'Opens the right Central USB CDC-ACM port with Web Serial and uses the official ZMK Studio RPC for reading and saving.', logDescription: 'Keeps the before-and-after state of USB and RPC operations in this page.', rpcDescription: 'Read the device after connecting the right USB module. Saving uses the official ZMK Studio RPC over USB CDC-ACM and reads the device again for verification. If the result says Studio locked, press &studio_unlock on Layer 3 before saving.', editorHint: 'Click a key to open its editor. Drag actions from the palette to assign them.', referenceNote: 'SO-SHO physical layout · 44 keys (22 per half). Existing assignments are saved in this browser.', layoutBadge: 'Physical layout', selectedLegend: 'Selected', assignedLegend: 'Assigned', unassignedLegend: 'Unassigned key', paletteHeading: 'Action palette', inspector: 'Inspector', selectedPosition: 'Selected position', selectPrompt: 'Select a key', currentAction: 'Current action', defaultHeading: 'Default settings', defaultDescription: 'Save the current edits as the next default or restore the firmware defaults.', saveDefault: 'Save current as default', restoreDefaults: 'Restore firmware defaults', defaultStatus: 'Layer 0 MO(3) is included in the initial layout.', footerNote: 'Keymaps are also saved in this browser. To write to the device, connect the right USB module and choose Save keymap to USB.', clearSelected: 'Clear selected key', resetSaved: 'Restore saved default', macroDescription: 'Edit macro names, targets, key sequences, press/release modes and delays separately from normal keys.', macroContractLabel: 'USB write scope:', macroContractBody: 'Macro edits are saved to JSON and this browser. Official ZMK Studio RPC saves keymaps; macro hardware support requires compatible firmware.', macroPaletteHeading: 'Build a macro by dragging', macroPaletteDescription: 'Drag keycodes into the sequence area like Remap. Clicking selects a key without changing the sequence.', groupBasic: 'Basic keys', groupJis: 'Japanese / JIS', groupLayer: 'Layers', groupSpecial: 'Special keys', groupAscii: 'ASCII', groupTapDance: 'Tap dance', paletteHelp: 'Drag a key onto the physical layout above.', deviceBall: 'Right module · trackball', deviceBallDesc: 'Adjust pointer CPI.', devicePad: 'Left module · trackpad', devicePadDesc: 'Adjust cursor movement scale.', autoMouse: 'Auto-mouse layer', autoMouseDesc: 'Hold the selected layer while input is active and for the selected timeout afterward.', scrollMode: 'Scroll mode', scrollDesc: 'Assign the button to a key to scroll only while it is held.', deviceNote: 'Values are saved to JSON and this browser. Compatible firmware is required to write them to the device.'
    },
    'zh-CN': {
      title: 'SO-SHO 键位编辑器', wordmark: '键位工作台', diagnostics: '设备、固件与诊断', layout: '布局：', layers: '层：', navigation: '键位导航', save: '保存', saveTitle: '保存键位到 USB', discard: '放弃', discardTitle: '恢复已保存的默认设置', editor: '键位映射', connection: 'USB 连接', log: 'USB 连接日志', read: '从 USB 读取键位', write: '将键位保存到 USB', macro: '宏编辑器', addMacro: '添加宏', language: '语言', subtitle: '适用于 SO-SHO 实际布局的键位与宏编辑器', firmwareLink: '下载自定义固件 ZIP', downloadHeading: '自定义固件（全部配置）', downloadDescription: 'ZIP 包含标准配置，以及支持点击和拖动的 Cirque Pinnacle 触控配置。', latestZip: '下载最新 ZIP', buildHistory: '构建记录', noticeTitle: '请通过 USB 连接右侧 Central 模块', noticeBody: '本编辑器使用 Web Serial（USB/COM）编辑设备。左右分体通信由固件保持，不使用电脑端 BLE 编辑。请在 Chrome 或 Edge 中通过 USB 连接右侧模块，然后选择一次 USB 连接。', connectionDescription: '通过 Web Serial 打开右侧 Central 的 USB CDC-ACM，并使用官方 ZMK Studio RPC 读取和保存。', transportNote: '通过 Web Serial 打开右侧 Central 的 USB CDC-ACM，并使用官方 ZMK Studio RPC 读取和保存。', logDescription: '在本页面保留 USB 和 RPC 操作前后的状态。', rpcDescription: '连接右侧 USB 后读取设备。保存通过 USB CDC-ACM 使用官方 ZMK Studio RPC，并再次读取设备进行确认。如果提示 Studio 已锁定，请先按下第 3 层的 &studio_unlock。', editorHint: '点击按键打开编辑器，也可以从操作面板拖放来分配。', referenceNote: 'SO-SHO 实际布局 · 44 个按键（每侧 22 个）。现有分配会保存在此浏览器中。', layoutBadge: '实际布局', selectedLegend: '已选择', assignedLegend: '已分配', unassignedLegend: '未设置按键', paletteHeading: '操作面板', inspector: '检查器', selectedPosition: '已选择位置', selectPrompt: '请选择按键', currentAction: '当前操作', defaultHeading: '默认设置', defaultDescription: '可以将当前编辑保存为下次默认设置，也可以恢复固件默认值。', saveDefault: '保存为当前默认', restoreDefaults: '恢复固件默认值', defaultStatus: '第 0 层的 MO(3) 已包含在初始布局中。', footerNote: '键位也会保存在此浏览器中。连接右侧 USB 后选择保存键位到 USB，才能写入设备。', clearSelected: '清除所选按键', resetSaved: '恢复已保存默认', macroDescription: '单独编辑宏名称、目标、按键序列、按下/释放模式和延迟。', macroContractLabel: 'USB 写入范围：', macroContractBody: '宏编辑会保存到 JSON 和浏览器。官方 ZMK Studio RPC 用于保存键位；写入宏需要兼容的固件。', macroPaletteHeading: '拖放创建宏', macroPaletteDescription: '像 Remap 一样将键码拖入步骤区域。点击只选择按键，不会改变步骤。', groupBasic: '普通按键', groupJis: '日文 / JIS', groupLayer: '层', groupSpecial: '特殊按键', groupAscii: 'ASCII', groupTapDance: '点按舞', paletteHelp: '将按键拖到上方的实际布局。', deviceBall: '右侧模块 · 轨迹球', deviceBallDesc: '调整指针 CPI。', devicePad: '左侧模块 · 触控板', devicePadDesc: '调整光标移动倍率。', autoMouse: '自动鼠标层', autoMouseDesc: '输入期间及停止后的指定时间保持所选层。', scrollMode: '滚动模式', scrollDesc: '将按钮分配给按键后，仅在按住时滚动。', deviceNote: '数值会保存到 JSON 和浏览器。写入设备需要兼容固件。'
    },
    ko: {
      title: 'SO-SHO 키맵 편집기', wordmark: '키맵 스튜디오', diagnostics: '장치·펌웨어·진단', layout: '배열:', layers: '레이어:', navigation: '키맵 탐색', save: '저장', saveTitle: 'USB에 키맵 저장', discard: '취소', discardTitle: '저장된 기본값으로 복원', editor: '키맵', connection: 'USB 연결', log: 'USB 연결 로그', read: 'USB에서 키맵 읽기', write: 'USB에 키맵 저장', macro: '매크로 편집기', addMacro: '매크로 추가', language: '언어', subtitle: 'SO-SHO 실제 배열용 키맵·매크로 편집기', firmwareLink: '커스텀 펌웨어 ZIP 다운로드', downloadHeading: '커스텀 펌웨어(전체 프로필)', downloadDescription: '표준 프로필과 탭·드래그를 지원하는 Cirque Pinnacle 터치 프로필이 포함되어 있습니다.', latestZip: '최신 ZIP 다운로드', buildHistory: '빌드 기록', noticeTitle: '오른쪽 Central 모듈을 USB로 연결하세요', noticeBody: '이 편집기는 Web Serial(USB/COM)로 장치를 편집합니다. 분할 통신은 펌웨어가 유지하며 PC의 BLE 편집은 사용하지 않습니다. Chrome 또는 Edge에서 오른쪽 모듈을 USB로 연결한 뒤 USB 연결을 선택하세요.', connectionDescription: 'Web Serial로 오른쪽 Central의 USB CDC-ACM을 열고 공식 ZMK Studio RPC로 읽기와 저장을 수행합니다.', transportNote: 'Web Serial로 오른쪽 Central의 USB CDC-ACM을 열고 공식 ZMK Studio RPC로 읽기와 저장을 수행합니다.', logDescription: 'USB 및 RPC 작업 전후 상태를 이 페이지에 보관합니다.', rpcDescription: '오른쪽 USB를 연결한 뒤 장치를 읽습니다. 저장은 USB CDC-ACM을 통한 공식 ZMK Studio RPC로 수행하고 다시 읽어 확인합니다. Studio 잠금 상태라면 Layer 3의 &studio_unlock을 누른 뒤 저장하세요.', editorHint: '키를 클릭해 편집기를 열거나 팔레트에서 드래그해 할당하세요.', referenceNote: 'SO-SHO 실제 배열 · 44키(각 측 22키). 기존 할당은 이 브라우저에 저장됩니다.', layoutBadge: '실제 배열', selectedLegend: '선택됨', assignedLegend: '할당됨', unassignedLegend: '미설정 키', paletteHeading: '동작 팔레트', inspector: '인스펙터', selectedPosition: '선택한 위치', selectPrompt: '키를 선택하세요', currentAction: '현재 동작', defaultHeading: '기본 설정', defaultDescription: '현재 편집 내용을 다음 기본값으로 저장하거나 펌웨어 기본값으로 복원할 수 있습니다.', saveDefault: '현재 설정을 기본값으로 저장', restoreDefaults: '펌웨어 기본값 복원', defaultStatus: 'Layer 0의 MO(3)가 초기 배열에 포함되어 있습니다.', footerNote: '키맵은 이 브라우저에도 저장됩니다. 장치에 쓰려면 오른쪽 USB를 연결하고 USB에 키맵 저장을 선택하세요.', clearSelected: '선택 키 지우기', resetSaved: '저장된 기본값 복원', macroDescription: '일반 키와 별도로 매크로 이름, 대상, 키 순서, 누름/해제 모드와 지연을 편집합니다.', macroContractLabel: 'USB 기록 범위:', macroContractBody: '매크로 편집은 JSON과 브라우저에 저장됩니다. 공식 ZMK Studio RPC는 키맵용이며 매크로 기록에는 호환 펌웨어가 필요합니다.', macroPaletteHeading: '드래그로 매크로 만들기', macroPaletteDescription: 'Remap처럼 키코드를 순서 영역으로 드래그하세요. 클릭은 선택만 하며 순서를 바꾸지 않습니다.', groupBasic: '기본 키', groupJis: '일본어 / JIS', groupLayer: '레이어', groupSpecial: '특수 키', groupAscii: 'ASCII', groupTapDance: '탭 댄스', paletteHelp: '위의 실제 배열로 키를 드래그하세요.', deviceBall: '오른쪽 모듈 · 트랙볼', deviceBallDesc: '포인터 CPI를 조정합니다.', devicePad: '왼쪽 모듈 · 트랙패드', devicePadDesc: '커서 이동 배율을 조정합니다.', autoMouse: '자동 마우스 레이어', autoMouseDesc: '입력 중과 정지 후 지정 시간 동안 선택한 레이어를 유지합니다.', scrollMode: '스크롤 모드', scrollDesc: '키에 버튼을 할당하면 누르는 동안만 스크롤합니다.', deviceNote: '값은 JSON과 브라우저에 저장됩니다. 장치에 쓰려면 호환 펌웨어가 필요합니다.'
    },
    th: {
      title: 'ตัวแก้ไขคีย์แมป SO-SHO', wordmark: 'คีย์แมปสตูดิโอ', diagnostics: 'อุปกรณ์ เฟิร์มแวร์ และการวินิจฉัย', layout: 'เลย์เอาต์:', layers: 'เลเยอร์:', navigation: 'นำทางคีย์แมป', save: 'บันทึก', saveTitle: 'บันทึกคีย์แมปลง USB', discard: 'ยกเลิก', discardTitle: 'คืนค่าเริ่มต้นที่บันทึกไว้', editor: 'คีย์แมป', connection: 'การเชื่อมต่อ USB', log: 'บันทึกการเชื่อมต่อ USB', read: 'อ่านคีย์แมปจาก USB', write: 'บันทึกคีย์แมปลง USB', macro: 'ตัวแก้ไขมาโคร', addMacro: 'เพิ่มมาโคร', language: 'ภาษา', subtitle: 'ตัวแก้ไขคีย์แมปและมาโครตามเลย์เอาต์จริงของ SO-SHO', firmwareLink: 'ดาวน์โหลด ZIP เฟิร์มแวร์แบบกำหนดเอง', downloadHeading: 'เฟิร์มแวร์แบบกำหนดเอง (ทุกโปรไฟล์)', downloadDescription: 'ZIP มีโปรไฟล์มาตรฐานและโปรไฟล์ทัช Cirque Pinnacle ที่รองรับการแตะและลาก', latestZip: 'ดาวน์โหลด ZIP ล่าสุด', buildHistory: 'ประวัติการบิลด์', noticeTitle: 'เชื่อมต่อโมดูล Central ด้านขวาด้วย USB', noticeBody: 'ตัวแก้ไขนี้ใช้ Web Serial (USB/COM) สำหรับแก้ไขอุปกรณ์ การสื่อสารระหว่างสองฝั่งยังอยู่ในเฟิร์มแวร์ และไม่ใช้การแก้ไขผ่าน BLE จากคอมพิวเตอร์ ให้เชื่อมต่อโมดูลด้านขวาด้วย USB ใน Chrome หรือ Edge แล้วเลือกการเชื่อมต่อ USB', connectionDescription: 'เปิด USB CDC-ACM ของ Central ด้านขวาด้วย Web Serial และใช้ ZMK Studio RPC อย่างเป็นทางการเพื่ออ่านและบันทึก', transportNote: 'เปิด USB CDC-ACM ของ Central ด้านขวาด้วย Web Serial และใช้ ZMK Studio RPC อย่างเป็นทางการเพื่ออ่านและบันทึก', logDescription: 'เก็บสถานะก่อนและหลังการเชื่อมต่อ USB และการทำงาน RPC ไว้ในหน้านี้', rpcDescription: 'อ่านอุปกรณ์หลังเชื่อมต่อ USB ด้านขวา การบันทึกใช้ ZMK Studio RPC ผ่าน USB CDC-ACM แล้วอ่านซ้ำเพื่อตรวจสอบ หาก Studio ถูกล็อก ให้กด &studio_unlock ใน Layer 3 ก่อนบันทึก', editorHint: 'คลิกปุ่มเพื่อเปิดตัวแก้ไข หรือลากการทำงานจากแผงไปวางเพื่อกำหนดค่า', referenceNote: 'เลย์เอาต์จริง SO-SHO · 44 ปุ่ม (ข้างละ 22 ปุ่ม) การกำหนดค่าจะถูกบันทึกในเบราว์เซอร์นี้', layoutBadge: 'เลย์เอาต์จริง', selectedLegend: 'เลือกอยู่', assignedLegend: 'กำหนดแล้ว', unassignedLegend: 'ปุ่มที่ยังไม่ได้ตั้งค่า', paletteHeading: 'แผงการทำงาน', inspector: 'ตัวตรวจสอบ', selectedPosition: 'ตำแหน่งที่เลือก', selectPrompt: 'เลือกปุ่ม', currentAction: 'การทำงานปัจจุบัน', defaultHeading: 'การตั้งค่าเริ่มต้น', defaultDescription: 'บันทึกการแก้ไขปัจจุบันเป็นค่าเริ่มต้นครั้งถัดไป หรือคืนค่าเริ่มต้นจากเฟิร์มแวร์', saveDefault: 'บันทึกเป็นค่าเริ่มต้น', restoreDefaults: 'คืนค่าเริ่มต้นจากเฟิร์มแวร์', defaultStatus: 'MO(3) ของ Layer 0 อยู่ในเลย์เอาต์เริ่มต้น', footerNote: 'คีย์แมปถูกบันทึกในเบราว์เซอร์ด้วย หากต้องการเขียนลงอุปกรณ์ ให้เชื่อมต่อ USB ด้านขวาแล้วเลือกบันทึกคีย์แมปลง USB', clearSelected: 'ล้างปุ่มที่เลือก', resetSaved: 'คืนค่าค่าเริ่มต้นที่บันทึกไว้', macroDescription: 'แก้ไขชื่อมาโคร เป้าหมาย ลำดับปุ่ม โหมดกด/ปล่อย และความหน่วงแยกจากปุ่มปกติ', macroContractLabel: 'ขอบเขตการเขียนผ่าน USB:', macroContractBody: 'การแก้ไขมาโครจะถูกบันทึกเป็น JSON และในเบราว์เซอร์ การบันทึกคีย์แมปใช้ ZMK Studio RPC อย่างเป็นทางการ ส่วนมาโครต้องใช้เฟิร์มแวร์ที่รองรับ', macroPaletteHeading: 'สร้างมาโครด้วยการลาก', macroPaletteDescription: 'ลากคีย์โค้ดไปยังพื้นที่ลำดับเหมือน Remap การคลิกจะเลือกเท่านั้นและไม่เปลี่ยนลำดับ', groupBasic: 'ปุ่มพื้นฐาน', groupJis: 'ญี่ปุ่น / JIS', groupLayer: 'เลเยอร์', groupSpecial: 'ปุ่มพิเศษ', groupAscii: 'ASCII', groupTapDance: 'แตะแบบหลายจังหวะ', paletteHelp: 'ลากปุ่มไปยังเลย์เอาต์จริงด้านบน', deviceBall: 'โมดูลขวา · แทร็กบอล', deviceBallDesc: 'ปรับ CPI ของตัวชี้', devicePad: 'โมดูลซ้าย · แทร็กแพด', devicePadDesc: 'ปรับสเกลการเคลื่อนที่ของเคอร์เซอร์', autoMouse: 'เลเยอร์เมาส์อัตโนมัติ', autoMouseDesc: 'คงเลเยอร์ที่เลือกไว้ระหว่างการป้อนข้อมูลและตามเวลาที่กำหนดหลังหยุด', scrollMode: 'โหมดเลื่อน', scrollDesc: 'กำหนดปุ่มให้กับคีย์เพื่อเลื่อนเฉพาะขณะกดค้าง', deviceNote: 'ค่าจะถูกบันทึกเป็น JSON และในเบราว์เซอร์ ต้องใช้เฟิร์มแวร์ที่รองรับเพื่อเขียนลงอุปกรณ์'
    },
    es: { title: 'Editor de mapas de SO-SHO', wordmark: 'Estudio de mapas', diagnostics: 'Dispositivo, firmware y diagnóstico', layout: 'Distribución:', layers: 'Capas:', navigation: 'Navegación del mapa', save: 'Guardar', saveTitle: 'Guardar mapa en USB', discard: 'Descartar', discardTitle: 'Restaurar el valor predeterminado guardado', editor: 'Mapa de teclas', connection: 'Conexión USB', log: 'Registro de conexión USB', read: 'Leer mapa desde USB', write: 'Guardar mapa en USB', macro: 'Editor de macros', addMacro: 'Añadir macro', language: 'Idioma', subtitle: 'Editor de mapas y macros para la distribución física SO-SHO', firmwareLink: 'Descargar ZIP de firmware personalizado', downloadHeading: 'Firmware personalizado (todos los perfiles)', downloadDescription: 'El ZIP incluye el perfil estándar y un perfil táctil Cirque Pinnacle con toque y arrastre.', latestZip: 'Descargar ZIP más reciente', buildHistory: 'Historial de compilación', noticeTitle: 'Conecta por USB el módulo Central derecho', noticeBody: 'Este editor usa Web Serial (USB/COM). La comunicación dividida se mantiene en el firmware y no se usa BLE desde el PC. Conecta el módulo derecho por USB en Chrome o Edge y elige conexión USB.', connectionDescription: 'Abre el USB CDC-ACM del Central derecho con Web Serial y usa el RPC oficial de ZMK Studio para leer y guardar.', transportNote: 'Abre el USB CDC-ACM del Central derecho con Web Serial y usa el RPC oficial de ZMK Studio para leer y guardar.', logDescription: 'Conserva en esta página el estado antes y después de las operaciones USB y RPC.', rpcDescription: 'Lee el dispositivo después de conectar el USB derecho. El guardado usa el RPC oficial de ZMK Studio por USB CDC-ACM y vuelve a leer para verificar. Si Studio está bloqueado, pulsa &studio_unlock en la capa 3.', editorHint: 'Haz clic en una tecla para abrir el editor o arrastra acciones desde la paleta.', referenceNote: 'Distribución física SO-SHO · 44 teclas (22 por lado). Las asignaciones se guardan en este navegador.', layoutBadge: 'Distribución física', selectedLegend: 'Seleccionada', assignedLegend: 'Asignada', unassignedLegend: 'Tecla sin asignar', paletteHeading: 'Paleta de acciones', inspector: 'Inspector', selectedPosition: 'Posición seleccionada', selectPrompt: 'Selecciona una tecla', currentAction: 'Acción actual', defaultHeading: 'Configuración predeterminada', defaultDescription: 'Guarda la edición actual como valor predeterminado o restaura los valores del firmware.', saveDefault: 'Guardar como predeterminado', restoreDefaults: 'Restaurar valores del firmware', defaultStatus: 'MO(3) de la capa 0 está en la disposición inicial.', footerNote: 'El mapa también se guarda en este navegador. Para escribir en el dispositivo, conecta el USB derecho y pulsa guardar mapa en USB.', clearSelected: 'Limpiar tecla seleccionada', resetSaved: 'Restaurar valor guardado', macroDescription: 'Edita nombres, destinos, secuencias, modos de pulsación/liberación y retrasos por separado.', macroContractLabel: 'Alcance de escritura USB:', macroContractBody: 'Las macros se guardan en JSON y en el navegador. El RPC oficial guarda mapas; para escribir macros se necesita firmware compatible.', macroPaletteHeading: 'Crear una macro arrastrando', macroPaletteDescription: 'Arrastra códigos al área de pasos como en Remap. El clic solo selecciona.', groupBasic: 'Teclas básicas', groupJis: 'Japonés / JIS', groupLayer: 'Capas', groupSpecial: 'Teclas especiales', groupAscii: 'ASCII', groupTapDance: 'Tap dance', paletteHelp: 'Arrastra una tecla a la distribución física.', deviceBall: 'Módulo derecho · trackball', deviceBallDesc: 'Ajusta el CPI del puntero.', devicePad: 'Módulo izquierdo · trackpad', devicePadDesc: 'Ajusta la escala del cursor.', autoMouse: 'Capa de ratón automático', autoMouseDesc: 'Mantén la capa durante el movimiento y el tiempo indicado después de parar.', scrollMode: 'Modo de desplazamiento', scrollDesc: 'Asigna el botón a una tecla para desplazar solo mientras se mantiene pulsado.', deviceNote: 'Los valores se guardan en JSON y en el navegador. Se necesita firmware compatible para escribirlos.' },
    de: { title: 'SO-SHO Tastenbelegungs-Editor', wordmark: 'Keymap Studio', diagnostics: 'Gerät, Firmware und Diagnose', layout: 'Layout:', layers: 'Ebenen:', navigation: 'Keymap-Navigation', save: 'Speichern', saveTitle: 'Keymap auf USB speichern', discard: 'Verwerfen', discardTitle: 'Gespeicherten Standard wiederherstellen', editor: 'Keymap', connection: 'USB-Verbindung', log: 'USB-Verbindungsprotokoll', read: 'Keymap von USB lesen', write: 'Keymap auf USB speichern', macro: 'Makro-Editor', addMacro: 'Makro hinzufügen', language: 'Sprache', subtitle: 'Keymap- und Makro-Editor für das physische SO-SHO-Layout', firmwareLink: 'Benutzerdefinierte Firmware als ZIP herunterladen', downloadHeading: 'Benutzerdefinierte Firmware (alle Profile)', downloadDescription: 'Das ZIP enthält das Standardprofil und ein Cirque-Pinnacle-Touchprofil mit Tipp- und Ziehunterstützung.', latestZip: 'Neuestes ZIP herunterladen', buildHistory: 'Build-Verlauf', noticeTitle: 'Rechtes Central-Modul per USB verbinden', noticeBody: 'Dieser Editor nutzt Web Serial (USB/COM). Die Kommunikation der geteilten Hälften bleibt in der Firmware; BLE-Editing vom PC wird nicht verwendet. Verbinde das rechte Modul in Chrome oder Edge per USB und wähle USB-Verbindung.', connectionDescription: 'Öffnet den USB-CDC-ACM-Port des rechten Central-Moduls per Web Serial und nutzt das offizielle ZMK-Studio-RPC zum Lesen und Speichern.', transportNote: 'Öffnet den USB-CDC-ACM-Port des rechten Central-Moduls per Web Serial und nutzt das offizielle ZMK-Studio-RPC zum Lesen und Speichern.', logDescription: 'Bewahrt den Zustand vor und nach USB- und RPC-Aktionen auf dieser Seite auf.', rpcDescription: 'Lies das Gerät nach dem Anschluss des rechten USB-Moduls aus. Das Speichern verwendet das offizielle ZMK-Studio-RPC über USB CDC-ACM und liest zur Prüfung erneut. Bei gesperrtem Studio zuerst &studio_unlock auf Layer 3 drücken.', editorHint: 'Klicke eine Taste zum Öffnen des Editors oder ziehe Aktionen aus der Palette.', referenceNote: 'Physisches SO-SHO-Layout · 44 Tasten (22 je Hälfte). Belegungen werden in diesem Browser gespeichert.', layoutBadge: 'Physisches Layout', selectedLegend: 'Ausgewählt', assignedLegend: 'Zugewiesen', unassignedLegend: 'Nicht belegte Taste', paletteHeading: 'Aktionspalette', inspector: 'Inspektor', selectedPosition: 'Ausgewählte Position', selectPrompt: 'Taste auswählen', currentAction: 'Aktuelle Aktion', defaultHeading: 'Standardeinstellungen', defaultDescription: 'Speichere die aktuelle Bearbeitung als Standard oder stelle die Firmware-Standards wieder her.', saveDefault: 'Als Standard speichern', restoreDefaults: 'Firmware-Standards wiederherstellen', defaultStatus: 'MO(3) von Layer 0 ist im Startlayout enthalten.', footerNote: 'Keymaps werden auch im Browser gespeichert. Zum Schreiben das rechte USB-Modul anschließen und Keymap auf USB speichern wählen.', clearSelected: 'Ausgewählte Taste löschen', resetSaved: 'Gespeicherten Standard wiederherstellen', macroDescription: 'Bearbeite Makronamen, Ziele, Tastenfolgen, Drück-/Loslassmodi und Verzögerungen getrennt.', macroContractLabel: 'USB-Schreibumfang:', macroContractBody: 'Makros werden als JSON und im Browser gespeichert. Das offizielle RPC speichert Keymaps; zum Schreiben von Makros ist kompatible Firmware nötig.', macroPaletteHeading: 'Makro per Drag-and-drop erstellen', macroPaletteDescription: 'Ziehe Keycodes wie bei Remap in den Schrittbereich. Klicken wählt nur aus.', groupBasic: 'Grundtasten', groupJis: 'Japanisch / JIS', groupLayer: 'Ebenen', groupSpecial: 'Sondertasten', groupAscii: 'ASCII', groupTapDance: 'Tap Dance', paletteHelp: 'Ziehe eine Taste auf das physische Layout.', deviceBall: 'Rechtes Modul · Trackball', deviceBallDesc: 'Pointer-CPI einstellen.', devicePad: 'Linkes Modul · Trackpad', devicePadDesc: 'Cursor-Bewegung skalieren.', autoMouse: 'Auto-Maus-Ebene', autoMouseDesc: 'Die gewählte Ebene während der Bewegung und nach dem Stopp für die eingestellte Zeit halten.', scrollMode: 'Scrollmodus', scrollDesc: 'Weise die Taste zu, um nur während des Haltens zu scrollen.', deviceNote: 'Werte werden als JSON und im Browser gespeichert. Zum Schreiben ist kompatible Firmware erforderlich.' }
  };

  var languageExtras = {
    ja: { mapTransferHeading: '設定ファイル', mapTransferDescription: 'キーマップ、マクロ、タップダンス、デバイス設定を1つのJSONに保存できます。', mapExport: 'JSONをダウンロード', mapImport: 'JSONを読み込む', mapTransferStatus: 'ブラウザー内にも自動保存されます。', macroModifiers: '修飾キー:', macroLatency: '追加時の待ち時間(ms)', macroDropZone: 'ここへキーをドラッグして追加', macroStepHelp: '各行の末尾がその操作の待ち時間です。追加後も手順欄で1行ずつ変更できます。', footerZmk: 'ZMK Studio公式ドキュメント', footerLicense: 'ライセンス', footerNoteShort: '© 2024 - The ZMK Contributors', zoom: 'ズーム', layerControl: 'レイヤー', layerMessage: 'レイヤー数はファームウェア定義のため、このUIでは固定です。', layerDescription: '通常入力。右手親指のMO 3を押してLayer 3へ切り替えます。', macroLibraryDescription: 'マクロカードをキーへドラッグすると割り当てできます。右下の鉛筆で編集モードに入ります。', macroLibraryCount: '最大16枠', padMarker: '左 · トラックパッド', padMarkerDesc: '移動倍率はDEVICEで設定', ballMarker: '右 · トラックボール', ballMarkerDesc: 'CPIはDEVICEで設定' },
    en: { mapTransferHeading: 'Configuration file', mapTransferDescription: 'Save the keymap, macros, tap dances and device settings in one JSON file.', mapExport: 'Download JSON', mapImport: 'Load JSON', mapTransferStatus: 'The browser also saves changes automatically.', macroModifiers: 'Modifiers:', macroLatency: 'Delay for added step (ms)', macroDropZone: 'Drag a key here to add it', macroStepHelp: 'The number at the end of each row is that step delay. You can edit each row afterward.', footerZmk: 'ZMK Studio documentation', footerLicense: 'License', footerNoteShort: '© 2024 - The ZMK Contributors', zoom: 'Zoom', layerControl: 'Layer', layerMessage: 'The number of layers is defined by the firmware and fixed in this UI.', layerDescription: 'Normal input. Hold MO 3 on the right thumb to switch to Layer 3.', macroLibraryDescription: 'Drag a macro card onto a key to assign it. Use the pencil in the lower-right corner to edit.', macroLibraryCount: 'Up to 16 slots', padMarker: 'Left · trackpad', padMarkerDesc: 'Set movement scale in DEVICE', ballMarker: 'Right · trackball', ballMarkerDesc: 'Set CPI in DEVICE' },
    'zh-CN': { mapTransferHeading: '配置文件', mapTransferDescription: '将键位、宏、点按舞和设备设置保存到一个 JSON 文件。', mapExport: '下载 JSON', mapImport: '读取 JSON', mapTransferStatus: '浏览器也会自动保存更改。', macroModifiers: '修饰键：', macroLatency: '新增步骤延迟（毫秒）', macroDropZone: '将按键拖到这里添加', macroStepHelp: '每行末尾的数字是该步骤的延迟。添加后可以逐行编辑。', footerZmk: 'ZMK Studio 文档', footerLicense: '许可证', footerNoteShort: '© 2024 - ZMK Contributors', zoom: '缩放', layerControl: '层', layerMessage: '层数由固件定义，此界面中固定。', layerDescription: '普通输入。按住右侧拇指的 MO 3 可切换到第 3 层。', macroLibraryDescription: '将宏卡片拖到按键上即可分配。使用右下角的铅笔进入编辑模式。', macroLibraryCount: '最多 16 个', padMarker: '左侧 · 触控板', padMarkerDesc: '在 DEVICE 中设置移动倍率', ballMarker: '右侧 · 轨迹球', ballMarkerDesc: '在 DEVICE 中设置 CPI' },
    ko: { mapTransferHeading: '설정 파일', mapTransferDescription: '키맵, 매크로, 탭 댄스와 장치 설정을 하나의 JSON 파일로 저장합니다.', mapExport: 'JSON 다운로드', mapImport: 'JSON 불러오기', mapTransferStatus: '브라우저에도 변경 사항이 자동 저장됩니다.', macroModifiers: '수식 키:', macroLatency: '추가 단계 지연(ms)', macroDropZone: '키를 여기로 드래그해 추가', macroStepHelp: '각 행 끝의 숫자는 해당 단계의 지연입니다. 추가 후 한 줄씩 편집할 수 있습니다.', footerZmk: 'ZMK Studio 문서', footerLicense: '라이선스', footerNoteShort: '© 2024 - The ZMK Contributors', zoom: '확대/축소', layerControl: '레이어', layerMessage: '레이어 수는 펌웨어에서 정하며 이 UI에서는 고정됩니다.', layerDescription: '일반 입력입니다. 오른쪽 엄지의 MO 3을 누르면 Layer 3으로 전환합니다.', macroLibraryDescription: '매크로 카드를 키로 드래그해 할당하세요. 오른쪽 아래 연필로 편집 모드에 들어갑니다.', macroLibraryCount: '최대 16개', padMarker: '왼쪽 · 트랙패드', padMarkerDesc: 'DEVICE에서 이동 배율 설정', ballMarker: '오른쪽 · 트랙볼', ballMarkerDesc: 'DEVICE에서 CPI 설정' },
    th: { mapTransferHeading: 'ไฟล์การตั้งค่า', mapTransferDescription: 'บันทึกคีย์แมป มาโคร แตะแบบหลายจังหวะ และการตั้งค่าอุปกรณ์เป็นไฟล์ JSON เดียว', mapExport: 'ดาวน์โหลด JSON', mapImport: 'โหลด JSON', mapTransferStatus: 'เบราว์เซอร์จะบันทึกการเปลี่ยนแปลงให้อัตโนมัติด้วย', macroModifiers: 'ปุ่มปรับแต่ง:', macroLatency: 'ความหน่วงของขั้นตอนที่เพิ่ม (มิลลิวินาที)', macroDropZone: 'ลากปุ่มมาวางที่นี่เพื่อเพิ่ม', macroStepHelp: 'ตัวเลขท้ายแต่ละบรรทัดคือความหน่วงของขั้นตอนนั้น แก้ไขทีละบรรทัดได้หลังเพิ่มแล้ว', footerZmk: 'เอกสาร ZMK Studio', footerLicense: 'ใบอนุญาต', footerNoteShort: '© 2024 - ผู้ร่วมพัฒนา ZMK', zoom: 'ซูม', layerControl: 'เลเยอร์', layerMessage: 'จำนวนเลเยอร์กำหนดโดยเฟิร์มแวร์และคงที่ในหน้านี้', layerDescription: 'การป้อนข้อมูลปกติ กด MO 3 ที่นิ้วโป้งขวาเพื่อเปลี่ยนเป็น Layer 3', macroLibraryDescription: 'ลากการ์ดมาโครไปยังปุ่มเพื่อกำหนดค่า ใช้ดินสอมุมขวาล่างเพื่อเข้าสู่โหมดแก้ไข', macroLibraryCount: 'สูงสุด 16 ช่อง', padMarker: 'ซ้าย · แทร็กแพด', padMarkerDesc: 'ตั้งค่าสเกลการเคลื่อนที่ใน DEVICE', ballMarker: 'ขวา · แทร็กบอล', ballMarkerDesc: 'ตั้งค่า CPI ใน DEVICE' },
    es: { mapTransferHeading: 'Archivo de configuración', mapTransferDescription: 'Guarda el mapa, las macros, los tap dances y la configuración del dispositivo en un JSON.', mapExport: 'Descargar JSON', mapImport: 'Cargar JSON', mapTransferStatus: 'El navegador también guarda los cambios automáticamente.', macroModifiers: 'Modificadores:', macroLatency: 'Retraso del paso añadido (ms)', macroDropZone: 'Arrastra una tecla aquí para añadirla', macroStepHelp: 'El número al final de cada fila es el retraso de ese paso. Puedes editar cada fila después.', footerZmk: 'Documentación de ZMK Studio', footerLicense: 'Licencia', footerNoteShort: '© 2024 - Colaboradores de ZMK', zoom: 'Zoom', layerControl: 'Capa', layerMessage: 'El número de capas lo define el firmware y es fijo en esta interfaz.', layerDescription: 'Entrada normal. Mantén MO 3 en el pulgar derecho para cambiar a la capa 3.', macroLibraryDescription: 'Arrastra una tarjeta de macro a una tecla para asignarla. Usa el lápiz inferior derecho para editar.', macroLibraryCount: 'Hasta 16 ranuras', padMarker: 'Izquierda · trackpad', padMarkerDesc: 'Configura la escala en DEVICE', ballMarker: 'Derecha · trackball', ballMarkerDesc: 'Configura el CPI en DEVICE' },
    de: { mapTransferHeading: 'Konfigurationsdatei', mapTransferDescription: 'Keymap, Makros, Tap Dance und Geräteeinstellungen in einer JSON-Datei speichern.', mapExport: 'JSON herunterladen', mapImport: 'JSON laden', mapTransferStatus: 'Der Browser speichert Änderungen ebenfalls automatisch.', macroModifiers: 'Modifikatoren:', macroLatency: 'Verzögerung für neuen Schritt (ms)', macroDropZone: 'Taste hierher ziehen, um sie hinzuzufügen', macroStepHelp: 'Die Zahl am Ende jeder Zeile ist die Verzögerung dieses Schritts. Danach kann jede Zeile bearbeitet werden.', footerZmk: 'ZMK-Studio-Dokumentation', footerLicense: 'Lizenz', footerNoteShort: '© 2024 - Die ZMK-Mitwirkenden', zoom: 'Zoom', layerControl: 'Ebene', layerMessage: 'Die Ebenenzahl wird von der Firmware festgelegt und ist in dieser Oberfläche fest.', layerDescription: 'Normale Eingabe. MO 3 am rechten Daumen gedrückt halten, um zu Layer 3 zu wechseln.', macroLibraryDescription: 'Eine Makrokarte auf eine Taste ziehen, um sie zuzuweisen. Mit dem Stift unten rechts den Bearbeitungsmodus öffnen.', macroLibraryCount: 'Bis zu 16 Plätze', padMarker: 'Links · Trackpad', padMarkerDesc: 'Bewegungsskalierung unter DEVICE einstellen', ballMarker: 'Rechts · Trackball', ballMarkerDesc: 'CPI unter DEVICE einstellen' }
  };
  Object.keys(languageCatalog).forEach(function (language) { Object.assign(languageCatalog[language], languageExtras[language] || {}); });

  var transportCopy = {
    ja: { connection: '接続', log: '接続ログ', read: 'キーマップを読み込む', write: 'キーマップを保存', noticeTitle: '右側CentralをUSBまたは対応BLEで接続してください', noticeBody: 'USB編集は右側Centralだけに対応します。BLE編集は公式ZMK Studio GATTを含むファームウェアと対応ブラウザーが必要です。左側PeripheralをUSBで選ぶと警告して停止します。', connectionDescription: 'USBは右側CentralのCDC-ACM、BLEは公式ZMK Studio GATTを使って読み取りと保存を行います。', transportNote: 'USBは右側CentralのCDC-ACM、BLEは公式ZMK Studio GATTを使って読み取りと保存を行います。', logDescription: 'USB・BLEとRPC操作の前後状態をこのページ内に保持します。', rpcDescription: '接続後に実機の現在値を読み込み、公式ZMK Studio RPCでキーマップを保存して再読み込みで確認します。', usbConnect: 'USB接続', usbReconnect: '許可済みUSBに再接続', bleConnect: 'BLE接続', bleReconnect: '許可済みBLEに再接続', deviceProfile: '左右のポインティングデバイス', deviceProfileDescription: '実機のセンサー配置に合わせて左右の構成を選択します。', profileRightBall: '右：トラックボール / 左：トラックパッド', profileLeftBall: '左：トラックボール / 右：トラックパッド', scrollScale: 'スクロール量', deviceBuildNote: 'CPI・スクロール量・センサー配置はファームウェアのビルド設定です。自動スリープはダウンロードZIP内のsleep-*フォルダから選択してください。公式ZMK Studioの標準RPCはキーマップ用です。' },
    en: { connection: 'Connection', log: 'Connection log', read: 'Read keymap', write: 'Save keymap', noticeTitle: 'Connect the right Central by USB or supported BLE', noticeBody: 'USB editing is supported only on the right Central. BLE editing requires firmware with the official ZMK Studio GATT transport and a supported browser. Selecting the left Peripheral over USB is rejected.', connectionDescription: 'USB uses the right Central CDC-ACM endpoint; BLE uses the official ZMK Studio GATT service for reading and saving.', transportNote: 'USB uses the right Central CDC-ACM endpoint; BLE uses the official ZMK Studio GATT service for reading and saving.', logDescription: 'Keeps USB, BLE and RPC state before and after each operation.', rpcDescription: 'Read the device after connecting, save the keymap through the official ZMK Studio RPC, then read it again for verification.', usbConnect: 'USB connection', usbReconnect: 'Reconnect authorized USB', bleConnect: 'BLE connection', bleReconnect: 'Reconnect authorized BLE', deviceProfile: 'Pointing-device layout', deviceProfileDescription: 'Choose the left/right sensor arrangement used by the hardware.', profileRightBall: 'Right: trackball / Left: trackpad', profileLeftBall: 'Left: trackball / Right: trackpad', scrollScale: 'Scroll amount', deviceBuildNote: 'CPI, scroll amount and sensor placement are firmware build settings. Choose automatic sleep from the sleep-* folder in the downloaded ZIP. Official ZMK Studio RPC handles keymaps.' },
    'zh-CN': { connection: '连接', log: '连接日志', read: '读取键位', write: '保存键位', noticeTitle: '请通过 USB 或支持的 BLE 连接右侧 Central', noticeBody: 'USB 编辑仅支持右侧 Central。BLE 编辑需要包含官方 ZMK Studio GATT 传输的固件和兼容浏览器。选择左侧 Peripheral 时会停止并显示警告。', connectionDescription: 'USB 使用右侧 Central CDC-ACM；BLE 使用官方 ZMK Studio GATT 服务读取和保存。', transportNote: 'USB 使用右侧 Central CDC-ACM；BLE 使用官方 ZMK Studio GATT 服务读取和保存。', logDescription: '保留 USB、BLE 和 RPC 操作前后的状态。', rpcDescription: '连接后读取设备，通过官方 ZMK Studio RPC 保存键位，再次读取进行确认。', usbConnect: 'USB 连接', usbReconnect: '重新连接已授权 USB', bleConnect: 'BLE 连接', bleReconnect: '重新连接已授权 BLE', deviceProfile: '指针设备布局', deviceProfileDescription: '选择硬件实际使用的左右传感器配置。', profileRightBall: '右：轨迹球 / 左：触控板', profileLeftBall: '左：轨迹球 / 右：触控板', scrollScale: '滚动量', deviceBuildNote: 'CPI、滚动量和传感器位置属于固件构建设置。官方 ZMK Studio RPC 用于键位映射，修改后请重新构建所选配置。' },
    ko: { connection: '연결', log: '연결 로그', read: '키맵 읽기', write: '키맵 저장', noticeTitle: '오른쪽 Central을 USB 또는 지원되는 BLE로 연결하세요', noticeBody: 'USB 편집은 오른쪽 Central만 지원합니다. BLE 편집에는 공식 ZMK Studio GATT 전송을 포함한 펌웨어와 지원 브라우저가 필요합니다. 왼쪽 Peripheral을 USB로 선택하면 경고 후 중지합니다.', connectionDescription: 'USB는 오른쪽 Central CDC-ACM을, BLE는 공식 ZMK Studio GATT 서비스를 사용합니다.', transportNote: 'USB는 오른쪽 Central CDC-ACM을, BLE는 공식 ZMK Studio GATT 서비스를 사용합니다.', logDescription: 'USB·BLE·RPC 동작 전후 상태를 보관합니다.', rpcDescription: '연결 후 장치를 읽고 공식 ZMK Studio RPC로 키맵을 저장한 다음 다시 읽어 확인합니다.', usbConnect: 'USB 연결', usbReconnect: '허가된 USB 다시 연결', bleConnect: 'BLE 연결', bleReconnect: '허가된 BLE 다시 연결', deviceProfile: '포인팅 장치 배열', deviceProfileDescription: '하드웨어의 좌우 센서 구성을 선택합니다.', profileRightBall: '오른쪽: 트랙볼 / 왼쪽: 트랙패드', profileLeftBall: '왼쪽: 트랙볼 / 오른쪽: 트랙패드', scrollScale: '스크롤 양', deviceBuildNote: 'CPI, 스크롤 양과 센서 배치는 펌웨어 빌드 설정입니다. 공식 RPC는 키맵용이므로 변경 후 선택한 프로필을 다시 빌드하세요.' },
    th: { connection: 'การเชื่อมต่อ', log: 'บันทึกการเชื่อมต่อ', read: 'อ่านคีย์แมป', write: 'บันทึกคีย์แมป', noticeTitle: 'เชื่อมต่อ Central ด้านขวาด้วย USB หรือ BLE ที่รองรับ', noticeBody: 'การแก้ไขผ่าน USB รองรับเฉพาะ Central ด้านขวา การแก้ไขผ่าน BLE ต้องใช้เฟิร์มแวร์ที่มี GATT transport ของ ZMK Studio และเบราว์เซอร์ที่รองรับ หากเลือก Peripheral ด้านซ้ายจะหยุดพร้อมแจ้งเตือน', connectionDescription: 'USB ใช้ CDC-ACM ของ Central ด้านขวา ส่วน BLE ใช้บริการ GATT ของ ZMK Studio อย่างเป็นทางการ', transportNote: 'USB ใช้ CDC-ACM ของ Central ด้านขวา ส่วน BLE ใช้บริการ GATT ของ ZMK Studio อย่างเป็นทางการ', logDescription: 'เก็บสถานะก่อนและหลังการทำงานของ USB, BLE และ RPC', rpcDescription: 'อ่านอุปกรณ์หลังเชื่อมต่อ บันทึกคีย์แมปผ่าน RPC ของ ZMK Studio แล้วอ่านซ้ำเพื่อตรวจสอบ', usbConnect: 'เชื่อมต่อ USB', usbReconnect: 'เชื่อมต่อ USB ที่อนุญาตอีกครั้ง', bleConnect: 'เชื่อมต่อ BLE', bleReconnect: 'เชื่อมต่อ BLE ที่อนุญาตอีกครั้ง', deviceProfile: 'เลย์เอาต์อุปกรณ์ชี้ตำแหน่ง', deviceProfileDescription: 'เลือกการจัดวางเซนเซอร์ซ้ายและขวาตามฮาร์ดแวร์', profileRightBall: 'ขวา: แทร็กบอล / ซ้าย: แทร็กแพด', profileLeftBall: 'ซ้าย: แทร็กบอล / ขวา: แทร็กแพด', scrollScale: 'ปริมาณการเลื่อน', deviceBuildNote: 'CPI ปริมาณการเลื่อน และตำแหน่งเซนเซอร์เป็นค่าตอนบิลด์เฟิร์มแวร์ RPC มาตรฐานของ ZMK Studio ใช้กับคีย์แมป จึงต้องบิลด์โปรไฟล์ใหม่หลังเปลี่ยนค่า' },
    es: { connection: 'Conexión', log: 'Registro de conexión', read: 'Leer mapa de teclas', write: 'Guardar mapa de teclas', noticeTitle: 'Conecta el Central derecho por USB o BLE compatible', noticeBody: 'La edición por USB solo admite el Central derecho. La edición BLE requiere firmware con el transporte GATT oficial de ZMK Studio y un navegador compatible. Si eliges el Peripheral izquierdo, se mostrará una advertencia y se detendrá.', connectionDescription: 'USB usa el CDC-ACM del Central derecho; BLE usa el servicio GATT oficial de ZMK Studio.', transportNote: 'USB usa el CDC-ACM del Central derecho; BLE usa el servicio GATT oficial de ZMK Studio.', logDescription: 'Conserva el estado antes y después de las operaciones USB, BLE y RPC.', rpcDescription: 'Lee el dispositivo tras conectarlo, guarda el mapa mediante el RPC oficial de ZMK Studio y vuelve a leerlo para verificar.', usbConnect: 'Conectar USB', usbReconnect: 'Reconectar USB autorizado', bleConnect: 'Conectar BLE', bleReconnect: 'Reconectar BLE autorizado', deviceProfile: 'Distribución de dispositivos apuntadores', deviceProfileDescription: 'Elige la disposición izquierda/derecha de los sensores del hardware.', profileRightBall: 'Derecha: trackball / Izquierda: trackpad', profileLeftBall: 'Izquierda: trackball / Derecha: trackpad', scrollScale: 'Cantidad de desplazamiento', deviceBuildNote: 'El CPI, la cantidad de desplazamiento y la posición de los sensores son ajustes de compilación. El RPC oficial de ZMK Studio gestiona mapas, así que recompila el perfil elegido después de cambiarlos.' },
    de: { connection: 'Verbindung', log: 'Verbindungsprotokoll', read: 'Keymap lesen', write: 'Keymap speichern', noticeTitle: 'Rechtes Central per USB oder unterstütztem BLE verbinden', noticeBody: 'USB-Bearbeitung unterstützt nur das rechte Central. Für BLE sind Firmware mit dem offiziellen ZMK-Studio-GATT-Transport und ein unterstützter Browser nötig. Das linke Peripheral wird per USB abgewiesen.', connectionDescription: 'USB verwendet den CDC-ACM-Port des rechten Central; BLE verwendet den offiziellen ZMK-Studio-GATT-Dienst.', transportNote: 'USB verwendet den CDC-ACM-Port des rechten Central; BLE verwendet den offiziellen ZMK-Studio-GATT-Dienst.', logDescription: 'Bewahrt Zustände vor und nach USB-, BLE- und RPC-Aktionen auf.', rpcDescription: 'Gerät nach dem Verbinden lesen, Keymap über das offizielle ZMK-Studio-RPC speichern und zur Prüfung erneut lesen.', usbConnect: 'USB verbinden', usbReconnect: 'Autorisiertes USB erneut verbinden', bleConnect: 'BLE verbinden', bleReconnect: 'Autorisiertes BLE erneut verbinden', deviceProfile: 'Zeigegeräte-Layout', deviceProfileDescription: 'Linke/rechte Sensoranordnung der Hardware auswählen.', profileRightBall: 'Rechts: Trackball / Links: Trackpad', profileLeftBall: 'Links: Trackball / Rechts: Trackpad', scrollScale: 'Scrollmenge', deviceBuildNote: 'CPI, Scrollmenge und Sensorposition sind Firmware-Build-Einstellungen. Das offizielle ZMK-Studio-RPC bearbeitet Keymaps; nach Änderungen das gewählte Profil neu bauen.' }
  };
  var usbOnlyTransportCopy = {
    ja: { noticeTitle: '右側CentralをUSBで接続してください', noticeBody: 'このページの実機編集経路はWeb Serial（USB/COM）だけです。左右分割間の通信はファームウェア側で維持します。ChromeまたはEdgeで右側をUSB接続し、USB接続を選択してください。', connectionDescription: '右側CentralのUSB CDC-ACMをWeb Serialで開き、公式ZMK Studio RPCを使って読み取り・保存します。', transportNote: '右側CentralのUSB CDC-ACMをWeb Serialで開き、公式ZMK Studio RPCを使って読み取り・保存します。', logDescription: 'USB接続、RPC読み取り・保存の前後状態をこのページ内に保持します。', usbConnect: '右側USB / COM接続', usbReconnect: '許可済みUSBに再接続', bleConnect: '', bleReconnect: '' },
    en: { noticeTitle: 'Connect the right Central module by USB', noticeBody: 'This editor uses Web Serial (USB/COM) for device editing. Split communication remains in the firmware. In Chrome or Edge, connect the right module by USB and choose USB connection.', connectionDescription: 'Opens the right Central USB CDC-ACM port with Web Serial and uses the official ZMK Studio RPC for reading and saving.', transportNote: 'Opens the right Central USB CDC-ACM port with Web Serial and uses the official ZMK Studio RPC for reading and saving.', logDescription: 'Keeps the before-and-after state of USB and RPC operations in this page.', usbConnect: 'Connect right USB / COM', usbReconnect: 'Reconnect authorized USB', bleConnect: '', bleReconnect: '' },
    'zh-CN': { noticeTitle: '请通过 USB 连接右侧 Central 模块', noticeBody: '本编辑器仅使用 Web Serial（USB/COM）编辑设备。左右分体通信由固件保持。请在 Chrome 或 Edge 中通过 USB 连接右侧模块，然后选择 USB 连接。', connectionDescription: '通过 Web Serial 打开右侧 Central 的 USB CDC-ACM，并使用官方 ZMK Studio RPC 读取和保存。', transportNote: '通过 Web Serial 打开右侧 Central 的 USB CDC-ACM，并使用官方 ZMK Studio RPC 读取和保存。', logDescription: '在本页面保留 USB 和 RPC 操作前后的状态。', usbConnect: '连接右侧 USB / COM', usbReconnect: '重新连接已授权 USB', bleConnect: '', bleReconnect: '' },
    ko: { noticeTitle: '오른쪽 Central 모듈을 USB로 연결하세요', noticeBody: '이 편집기는 Web Serial(USB/COM)로 장치를 편집합니다. 분할 통신은 펌웨어가 유지합니다. Chrome 또는 Edge에서 오른쪽 모듈을 USB로 연결한 뒤 USB 연결을 선택하세요.', connectionDescription: 'Web Serial로 오른쪽 Central의 USB CDC-ACM을 열고 공식 ZMK Studio RPC로 읽기와 저장을 수행합니다.', transportNote: 'Web Serial로 오른쪽 Central의 USB CDC-ACM을 열고 공식 ZMK Studio RPC로 읽기와 저장을 수행합니다.', logDescription: 'USB 및 RPC 작업 전후 상태를 이 페이지에 보관합니다.', usbConnect: '오른쪽 USB / COM 연결', usbReconnect: '허가된 USB 다시 연결', bleConnect: '', bleReconnect: '' },
    th: { noticeTitle: 'เชื่อมต่อโมดูล Central ด้านขวาด้วย USB', noticeBody: 'ตัวแก้ไขนี้ใช้ Web Serial (USB/COM) สำหรับแก้ไขอุปกรณ์ การสื่อสารระหว่างสองฝั่งยังอยู่ในเฟิร์มแวร์ ให้เชื่อมต่อโมดูลด้านขวาด้วย USB ใน Chrome หรือ Edge แล้วเลือกการเชื่อมต่อ USB', connectionDescription: 'เปิด USB CDC-ACM ของ Central ด้านขวาด้วย Web Serial และใช้ ZMK Studio RPC อย่างเป็นทางการเพื่ออ่านและบันทึก', transportNote: 'เปิด USB CDC-ACM ของ Central ด้านขวาด้วย Web Serial และใช้ ZMK Studio RPC อย่างเป็นทางการเพื่ออ่านและบันทึก', logDescription: 'เก็บสถานะก่อนและหลังการทำงานของ USB และ RPC ในหน้านี้', usbConnect: 'เชื่อมต่อ USB ด้านขวา / COM', usbReconnect: 'เชื่อมต่อ USB ที่อนุญาตอีกครั้ง', bleConnect: '', bleReconnect: '' },
    es: { noticeTitle: 'Conecta el módulo Central derecho por USB', noticeBody: 'Este editor usa Web Serial (USB/COM) para editar el dispositivo. La comunicación entre mitades permanece en el firmware. En Chrome o Edge, conecta el módulo derecho por USB y elige la conexión USB.', connectionDescription: 'Abre el CDC-ACM USB del Central derecho con Web Serial y usa el RPC oficial de ZMK Studio para leer y guardar.', transportNote: 'Abre el CDC-ACM USB del Central derecho con Web Serial y usa el RPC oficial de ZMK Studio para leer y guardar.', logDescription: 'Conserva en esta página el estado anterior y posterior de las operaciones USB y RPC.', usbConnect: 'Conectar USB derecho / COM', usbReconnect: 'Reconectar USB autorizado', bleConnect: '', bleReconnect: '' },
    de: { noticeTitle: 'Rechtes Central-Modul per USB verbinden', noticeBody: 'Dieser Editor verwendet Web Serial (USB/COM) zur Gerätebearbeitung. Die Kommunikation zwischen den Hälften bleibt in der Firmware. Das rechte Modul per USB in Chrome oder Edge verbinden und USB-Verbindung wählen.', connectionDescription: 'Öffnet den USB-CDC-ACM-Port des rechten Central mit Web Serial und verwendet das offizielle ZMK-Studio-RPC zum Lesen und Speichern.', transportNote: 'Öffnet den USB-CDC-ACM-Port des rechten Central mit Web Serial und verwendet das offizielle ZMK-Studio-RPC zum Lesen und Speichern.', logDescription: 'Bewahrt den Zustand vor und nach USB- und RPC-Aktionen auf dieser Seite.', usbConnect: 'Rechtes USB / COM verbinden', usbReconnect: 'Autorisiertes USB erneut verbinden', bleConnect: '', bleReconnect: '' }
  };
  Object.keys(usbOnlyTransportCopy).forEach(function (language) { Object.assign(transportCopy[language], usbOnlyTransportCopy[language]); });

  var physicalCopy = {
    ja: { leftModule: '左モジュール', rightModule: '右モジュール', ballShort: 'トラックボール', padShort: 'トラックパッド', noneShort: 'NONE' },
    en: { leftModule: 'LEFT MODULE', rightModule: 'RIGHT MODULE', ballShort: 'TRACKBALL', padShort: 'TRACKPAD', noneShort: 'NONE' },
    'zh-CN': { leftModule: '左侧模块', rightModule: '右侧模块', ballShort: '轨迹球', padShort: '触控板', noneShort: 'NONE' },
    ko: { leftModule: '왼쪽 모듈', rightModule: '오른쪽 모듈', ballShort: '트랙볼', padShort: '트랙패드', noneShort: 'NONE' },
    th: { leftModule: 'โมดูลซ้าย', rightModule: 'โมดูลขวา', ballShort: 'แทร็กบอล', padShort: 'แทร็กแพด', noneShort: 'NONE' },
    es: { leftModule: 'MÓDULO IZQUIERDO', rightModule: 'MÓDULO DERECHO', ballShort: 'TRACKBALL', padShort: 'TRACKPAD', noneShort: 'NONE' },
    de: { leftModule: 'LINKES MODUL', rightModule: 'RECHTES MODUL', ballShort: 'TRACKBALL', padShort: 'TRACKPAD', noneShort: 'NONE' }
  };
  var deviceCopy = {
    ja: { readCurrent: '現在のレイアウトを読み込む', moduleLayout: 'モジュール配置', moduleDescription: '左・右を個別に選択できます。ブランクのダミーモジュールは None を選んでください。', leftModule: '左モジュール', rightModule: '右モジュール', none: 'None（ダミー）', trackball: 'トラックボール', trackpad: 'トラックパッド', encoderTitle: 'ロータリーエンコーダー', encoderLeft: '左回転', encoderRight: '右回転', encoderAssignment: '割り当て', encoderRuntimeNote: '左右回転へ通常キーやデバイス操作を割り当て、JSONへ保存できます。現在のファームウェアのsensor-bindingsへ実機反映するには再ビルドが必要です。', scrollUp: '上下スクロール（上）', scrollDown: '上下スクロール（下）', scrollLeft: '左右スクロール（左）', scrollRight: '左右スクロール（右）', encoderNone: '未設定' },
    en: { readCurrent: 'Load current layout', moduleLayout: 'Module layout', moduleDescription: 'Choose each side independently. Select None for a blank dummy module.', leftModule: 'Left module', rightModule: 'Right module', none: 'None (dummy)', trackball: 'Trackball', trackpad: 'Trackpad', encoderTitle: 'Rotary encoder', encoderLeft: 'Counter-clockwise', encoderRight: 'Clockwise', encoderAssignment: 'Assignment', encoderRuntimeNote: 'Assign normal keys or device actions to either rotation and save them to JSON. Rebuilding is required to apply them to the current firmware sensor bindings.', scrollUp: 'Vertical scroll (up)', scrollDown: 'Vertical scroll (down)', scrollLeft: 'Horizontal scroll (left)', scrollRight: 'Horizontal scroll (right)', encoderNone: 'Unassigned' },
    'zh-CN': { readCurrent: '读取当前布局', moduleLayout: '模块布局', moduleDescription: '可以分别选择左右模块。空白占位模块请选择 None。', leftModule: '左侧模块', rightModule: '右侧模块', none: 'None（占位）', trackball: '轨迹球', trackpad: '触控板', encoderTitle: '旋转编码器', encoderLeft: '逆时针', encoderRight: '顺时针', encoderAssignment: '分配', encoderRuntimeNote: '可为左右旋转分配普通按键或设备操作，并保存到 JSON。要写入当前固件的传感器绑定，需要重新构建固件。', scrollUp: '垂直滚动（上）', scrollDown: '垂直滚动（下）', scrollLeft: '水平滚动（左）', scrollRight: '水平滚动（右）', encoderNone: '未设置' },
    ko: { readCurrent: '현재 레이아웃 불러오기', moduleLayout: '모듈 배열', moduleDescription: '왼쪽과 오른쪽을 개별로 선택합니다. 빈 더미 모듈은 None을 선택하세요.', leftModule: '왼쪽 모듈', rightModule: '오른쪽 모듈', none: 'None(더미)', trackball: '트랙볼', trackpad: '트랙패드', encoderTitle: '로터리 인코더', encoderLeft: '반시계 방향', encoderRight: '시계 방향', encoderAssignment: '할당', encoderRuntimeNote: '양쪽 회전에 일반 키나 장치 동작을 지정하고 JSON으로 저장할 수 있습니다. 현재 펌웨어의 센서 바인딩에 적용하려면 다시 빌드해야 합니다.', scrollUp: '세로 스크롤(위)', scrollDown: '세로 스크롤(아래)', scrollLeft: '가로 스크롤(왼쪽)', scrollRight: '가로 스크롤(오른쪽)', encoderNone: '미설정' },
    th: { readCurrent: 'โหลดเลย์เอาต์ปัจจุบัน', moduleLayout: 'การจัดวางโมดูล', moduleDescription: 'เลือกแต่ละด้านแยกกัน หากเป็นโมดูลว่างให้เลือก None', leftModule: 'โมดูลซ้าย', rightModule: 'โมดูลขวา', none: 'None (โมดูลว่าง)', trackball: 'แทร็กบอล', trackpad: 'แทร็กแพด', encoderTitle: 'โรตารีเอนโคเดอร์', encoderLeft: 'ทวนเข็มนาฬิกา', encoderRight: 'ตามเข็มนาฬิกา', encoderAssignment: 'การกำหนดค่า', encoderRuntimeNote: 'กำหนดปุ่มปกติหรือการทำงานของอุปกรณ์ให้กับการหมุนแต่ละทิศทางและบันทึกเป็น JSON ต้องสร้างเฟิร์มแวร์ใหม่เพื่อใช้กับ sensor binding ปัจจุบัน', scrollUp: 'เลื่อนแนวตั้ง (ขึ้น)', scrollDown: 'เลื่อนแนวตั้ง (ลง)', scrollLeft: 'เลื่อนแนวนอน (ซ้าย)', scrollRight: 'เลื่อนแนวนอน (ขวา)', encoderNone: 'ยังไม่ตั้งค่า' },
    es: { readCurrent: 'Cargar distribución actual', moduleLayout: 'Distribución de módulos', moduleDescription: 'Elige cada lado por separado. Selecciona None para un módulo vacío.', leftModule: 'Módulo izquierdo', rightModule: 'Módulo derecho', none: 'None (vacío)', trackball: 'Trackball', trackpad: 'Trackpad', encoderTitle: 'Encoder rotatorio', encoderLeft: 'Antihorario', encoderRight: 'Horario', encoderAssignment: 'Asignación', encoderRuntimeNote: 'Asigna teclas normales o acciones de dispositivo a cada giro y guárdalas en JSON. Se requiere recompilar para aplicarlas a los bindings de sensores del firmware actual.', scrollUp: 'Desplazamiento vertical (arriba)', scrollDown: 'Desplazamiento vertical (abajo)', scrollLeft: 'Desplazamiento horizontal (izquierda)', scrollRight: 'Desplazamiento horizontal (derecha)', encoderNone: 'Sin asignar' },
    de: { readCurrent: 'Aktuelles Layout laden', moduleLayout: 'Modullayout', moduleDescription: 'Linke und rechte Seite getrennt auswählen. Für ein leeres Dummy-Modul None wählen.', leftModule: 'Linkes Modul', rightModule: 'Rechtes Modul', none: 'None (Dummy)', trackball: 'Trackball', trackpad: 'Trackpad', encoderTitle: 'Drehencoder', encoderLeft: 'Gegen den Uhrzeigersinn', encoderRight: 'Im Uhrzeigersinn', encoderAssignment: 'Zuordnung', encoderRuntimeNote: 'Weise jeder Drehrichtung normale Tasten oder Geräteaktionen zu und speichere sie als JSON. Für die aktuelle Sensorbindung der Firmware ist ein Neubau erforderlich.', scrollUp: 'Vertikales Scrollen (auf)', scrollDown: 'Vertikales Scrollen (ab)', scrollLeft: 'Horizontales Scrollen (links)', scrollRight: 'Horizontales Scrollen (rechts)', encoderNone: 'Nicht zugewiesen' }
  };

  function storedLanguage() {
    try {
      var value = localStorage.getItem('sosho-language-v1') || 'ja';
      return Object.prototype.hasOwnProperty.call(languageCatalog, value) ? value : 'ja';
    } catch (error) {
      return 'ja';
    }
  }

  function textFor(language, key) {
    return languageCatalog[language] && languageCatalog[language][key] || languageCatalog.ja[key];
  }

  var rpcVerificationCatalog = {
    ja: { title: '実機への書き込み確認', description: '保存後に実機を再読み取りし、送信した内容と一致した場合だけ成功と判定します。', prepare: '変更を準備', write: '書き込み送信', save: '保存応答', verify: '実機再読み取り', idle: '待機中', running: '実行中', success: '成功', failure: '失敗', resultIdle: '未実行', resultRunning: '確認中', resultSuccess: '実機反映成功', resultFailure: '実機反映を確認できません' },
    en: { title: 'Device write verification', description: 'The device is read again after saving. Success is shown only when the values match.', prepare: 'Prepare changes', write: 'Send write', save: 'Save response', verify: 'Read device again', idle: 'Waiting', running: 'Running', success: 'Success', failure: 'Failed', resultIdle: 'Not run', resultRunning: 'Verifying', resultSuccess: 'Device updated', resultFailure: 'Device update not verified' },
    'zh-CN': { title: '验证设备写入', description: '保存后再次读取设备，只有发送内容与设备内容一致时才显示成功。', prepare: '准备更改', write: '发送写入', save: '保存响应', verify: '再次读取设备', idle: '等待中', running: '执行中', success: '成功', failure: '失败', resultIdle: '未执行', resultRunning: '验证中', resultSuccess: '设备已更新', resultFailure: '未验证设备更新' },
    ko: { title: '장치 쓰기 확인', description: '저장 후 장치를 다시 읽고 전송한 값과 일치할 때만 성공으로 표시합니다.', prepare: '변경 준비', write: '쓰기 전송', save: '저장 응답', verify: '장치 다시 읽기', idle: '대기 중', running: '실행 중', success: '성공', failure: '실패', resultIdle: '실행 안 됨', resultRunning: '확인 중', resultSuccess: '장치 반영 성공', resultFailure: '장치 반영 미확인' },
    th: { title: 'ยืนยันการเขียนลงอุปกรณ์', description: 'หลังบันทึกจะอ่านอุปกรณ์อีกครั้ง และจะแสดงว่าสำเร็จเมื่อค่าตรงกันเท่านั้น', prepare: 'เตรียมการเปลี่ยนแปลง', write: 'ส่งการเขียน', save: 'การตอบกลับการบันทึก', verify: 'อ่านอุปกรณ์อีกครั้ง', idle: 'รอดำเนินการ', running: 'กำลังทำงาน', success: 'สำเร็จ', failure: 'ล้มเหลว', resultIdle: 'ยังไม่ทำงาน', resultRunning: 'กำลังตรวจสอบ', resultSuccess: 'อัปเดตอุปกรณ์แล้ว', resultFailure: 'ยังยืนยันการอัปเดตไม่ได้' },
    es: { title: 'Verificación de escritura', description: 'Después de guardar se vuelve a leer el dispositivo; solo se muestra éxito si los valores coinciden.', prepare: 'Preparar cambios', write: 'Enviar escritura', save: 'Respuesta de guardado', verify: 'Leer dispositivo otra vez', idle: 'En espera', running: 'En curso', success: 'Correcto', failure: 'Fallido', resultIdle: 'No ejecutado', resultRunning: 'Verificando', resultSuccess: 'Dispositivo actualizado', resultFailure: 'Actualización no verificada' },
    de: { title: 'Schreibprüfung des Geräts', description: 'Nach dem Speichern wird das Gerät erneut gelesen. Erfolg wird nur bei übereinstimmenden Werten angezeigt.', prepare: 'Änderungen vorbereiten', write: 'Schreiben senden', save: 'Speicherantwort', verify: 'Gerät erneut lesen', idle: 'Wartend', running: 'Läuft', success: 'Erfolgreich', failure: 'Fehlgeschlagen', resultIdle: 'Nicht ausgeführt', resultRunning: 'Prüfung läuft', resultSuccess: 'Gerät aktualisiert', resultFailure: 'Geräteänderung nicht bestätigt' }
  };

  function applyLanguage(language) {
    language = Object.prototype.hasOwnProperty.call(languageCatalog, language) ? language : 'ja';
    var copy = Object.assign({}, languageCatalog.ja, languageCatalog[language], transportCopy[language] || transportCopy.en, physicalCopy[language] || physicalCopy.en, deviceCopy[language] || deviceCopy.en);
    window.soshoCurrentCopy = copy;
    var verificationCopy = rpcVerificationCatalog[language] || rpcVerificationCatalog.ja;
    window.soshoRpcVerificationLabels = verificationCopy;
    document.documentElement.lang = language;
    document.title = copy.title;
    function setText(selector, value) {
      if (typeof value !== 'string') return;
      document.querySelectorAll(selector).forEach(function (element) { element.textContent = value; });
    }
    function setFirstText(selector, value) {
      if (typeof value !== 'string') return;
      document.querySelectorAll(selector).forEach(function (element) {
        if (element.firstChild && element.firstChild.nodeType === 3) element.firstChild.nodeValue = value + ' ';
        else element.textContent = value;
      });
    }
    function setLastText(selector, value) {
      if (typeof value !== 'string') return;
      document.querySelectorAll(selector).forEach(function (element) {
        var last = element.lastChild;
        if (last && last.nodeType === 3) last.nodeValue = ' ' + value;
        else element.appendChild(document.createTextNode(' ' + value));
      });
    }
    var selector = document.getElementById('language-select');
    if (selector) selector.value = language;
    var wordmark = document.querySelector('.studio-wordmark');
    if (wordmark) wordmark.textContent = copy.wordmark;
    var diagnostics = document.querySelector('.studio-diagnostics > summary');
    if (diagnostics) diagnostics.textContent = copy.diagnostics;
    var sidebarHeadings = document.querySelectorAll('.studio-sidebar-heading');
    if (sidebarHeadings[0]) sidebarHeadings[0].textContent = copy.layout;
    if (sidebarHeadings[1]) sidebarHeadings[1].textContent = copy.layers;
    var sidebar = document.querySelector('.studio-sidebar');
    if (sidebar) sidebar.setAttribute('aria-label', copy.navigation);
    var state = document.querySelector('[data-studio-device-state]');
    if (state && /^(USB未接続|USB disconnected|USB desconectado|USB getrennt|未连接 USB|USB 연결 안 됨|ไม่ได้เชื่อมต่อ USB)$/.test(state.textContent)) {
      state.textContent = ({
        ja: 'USB未接続', en: 'USB disconnected', 'zh-CN': 'USB 未连接', ko: 'USB 연결 안 됨', th: 'ไม่ได้เชื่อมต่อ USB', es: 'USB desconectado', de: 'USB getrennt'
      })[language] || 'USB未接続';
    }
    var editorHeading = document.getElementById('keyboard-heading');
    if (editorHeading) editorHeading.textContent = copy.editor;
    setFirstText('.layout-selector', copy.layout);
    setText('.studio-layer-controls > span', copy.layerControl);
    setFirstText('.studio-zoom-control', copy.zoom);
    var layerDescription = document.querySelector('.layer-description');
    if (layerDescription && /通常入力|Normal input|普通输入|일반 입력|การป้อนข้อมูลปกติ|Entrada normal|Normale Eingabe/.test(layerDescription.textContent)) layerDescription.textContent = copy.layerDescription;
    var connectionHeading = document.getElementById('connection-heading');
    if (connectionHeading) connectionHeading.textContent = copy.connection;
    var logHeading = document.getElementById('connection-log-heading');
    if (logHeading) logHeading.textContent = copy.log;
    var rpcHeading = document.getElementById('rpc-heading');
    if (rpcHeading) rpcHeading.textContent = copy.connection + ' / ZMK Studio RPC ' + copy.editor;
    var read = document.getElementById('read-keymap');
    if (read) read.textContent = copy.readCurrent || copy.read;
    var write = document.getElementById('write-keymap');
    if (write) write.textContent = copy.write;
    var macro = document.getElementById('macro-heading');
    if (macro) macro.textContent = copy.macro;
    var addMacro = document.getElementById('add-macro');
    if (addMacro) addMacro.textContent = copy.addMacro;
    var connect = document.getElementById('connect-usb');
    if (connect) connect.textContent = copy.usbConnect;
    var reconnect = document.getElementById('connect-usb-authorized');
    if (reconnect) reconnect.textContent = copy.usbReconnect;
    var connectBle = document.getElementById('connect-ble');
    if (connectBle) connectBle.remove();
    var reconnectBle = document.getElementById('connect-ble-authorized');
    if (reconnectBle) reconnectBle.remove();
    var disconnect = document.getElementById('disconnect');
    if (disconnect) disconnect.textContent = ({ja:'切断', en:'Disconnect', 'zh-CN':'断开', ko:'연결 해제', th:'ตัดการเชื่อมต่อ', es:'Desconectar', de:'Trennen'})[language] || '切断';
    var copyLog = document.getElementById('connection-log-copy');
    if (copyLog) copyLog.textContent = ({ja:'ログをコピー', en:'Copy log', 'zh-CN':'复制日志', ko:'로그 복사', th:'คัดลอกบันทึก', es:'Copiar registro', de:'Protokoll kopieren'})[language] || 'ログをコピー';
    var clearLog = document.getElementById('connection-log-clear');
    if (clearLog) clearLog.textContent = ({ja:'クリア', en:'Clear', 'zh-CN':'清除', ko:'지우기', th:'ล้าง', es:'Borrar', de:'Löschen'})[language] || 'クリア';
    var shellPrimary = document.querySelector('.studio-primary-action');
    if (shellPrimary) { shellPrimary.textContent = copy.save; shellPrimary.title = copy.saveTitle; shellPrimary.setAttribute('aria-label', copy.saveTitle); }
    var shellButtons = document.querySelectorAll('.studio-shell-actions .studio-icon-button');
    if (shellButtons[3]) { shellButtons[3].textContent = copy.discard; shellButtons[3].title = copy.discardTitle; shellButtons[3].setAttribute('aria-label', copy.discardTitle); }
    var languageLabel = document.querySelector('.studio-language-picker span');
    if (languageLabel) languageLabel.textContent = copy.language;

    setText('#site-subtitle', copy.subtitle);
    setLastText('#firmware-link-line a', copy.firmwareLink);
    setText('#notice-title', copy.noticeTitle);
    setText('#notice-body', copy.noticeBody);
    setText('#transport-note', copy.transportNote);
    setText('#connection-log-description', copy.logDescription);
    setText('#rpc-description', copy.rpcDescription);
    setText('#rpc-verification-title', verificationCopy.title);
    setText('#rpc-verification-description', verificationCopy.description);
    document.querySelectorAll('[data-rpc-verify-label]').forEach(function (element) {
      var key = element.getAttribute('data-rpc-verify-label');
      if (verificationCopy[key]) element.textContent = verificationCopy[key];
    });
    if (typeof window.soshoRefreshRpcVerification === 'function') window.soshoRefreshRpcVerification();
    setText('#editor-hint', copy.editorHint);
    setFirstText('#reference-note', copy.referenceNote);
    setText('.layout-badge', copy.layoutBadge);
    setLastText('.legend-selected', copy.selectedLegend);
    setLastText('.legend-assigned', copy.assignedLegend);
    setLastText('.legend-unassigned', copy.unassignedLegend);
    setText('#palette-heading', copy.paletteHeading);
    setText('#inspector-heading', copy.inspector);
    setFirstText('.inspector > .label:nth-of-type(1)', copy.selectedPosition);
    setFirstText('.inspector > .label:nth-of-type(2)', copy.currentAction);
    setText('#default-settings-heading', copy.defaultHeading);
    setText('#default-settings-description', copy.defaultDescription);
    setText('#save-current-as-default', copy.saveDefault);
    setText('#restore-firmware-defaults', copy.restoreDefaults);
    setText('#default-settings-status', copy.defaultStatus);
    setText('.inspector > .footer-note', copy.footerNote);
    setText('#clear-selected', copy.clearSelected);
    setText('#reset', copy.resetSaved);
    setText('#macro-description', copy.macroDescription);
    var macroContract = document.querySelector('.macro-contract');
    var macroTransportCopy = {
      ja: { label: 'USB専用の反映範囲:', body: 'キーマップは右側USBの公式ZMK Studio RPCで保存します。マクロはJSONとブラウザーに保存されます。実機へのマクロ反映は対応ファームウェアの仕様を確認してください。' },
      en: { label: 'USB write scope:', body: 'Keymaps are saved through the official ZMK Studio RPC over right-side USB. Macro edits are saved to JSON and this browser. Check the firmware specification before writing macros to the device.' },
      'zh-CN': { label: 'USB 写入范围：', body: '键位通过右侧 USB 的官方 ZMK Studio RPC 保存。宏会保存到 JSON 和浏览器。将宏写入设备前，请确认固件规格。' },
      ko: { label: 'USB 기록 범위:', body: '키맵은 오른쪽 USB의 공식 ZMK Studio RPC로 저장합니다. 매크로 편집은 JSON과 브라우저에 저장됩니다. 장치에 매크로를 기록하기 전에 펌웨어 사양을 확인하세요.' },
      th: { label: 'ขอบเขตการเขียนผ่าน USB:', body: 'คีย์แมปจะบันทึกผ่าน ZMK Studio RPC อย่างเป็นทางการทาง USB ด้านขวา การแก้ไขมาโครจะบันทึกไว้ใน JSON และเบราว์เซอร์ โปรดตรวจสอบข้อกำหนดของเฟิร์มแวร์ก่อนเขียนมาโครลงอุปกรณ์' },
      es: { label: 'Ámbito de escritura USB:', body: 'El mapa se guarda mediante el RPC oficial de ZMK Studio por USB derecho. Las ediciones de macros se guardan en JSON y en este navegador. Comprueba las especificaciones del firmware antes de escribir macros en el dispositivo.' },
      de: { label: 'USB-Schreibumfang:', body: 'Keymaps werden über das offizielle ZMK-Studio-RPC per rechtem USB gespeichert. Makroänderungen werden als JSON und im Browser gespeichert. Vor dem Schreiben von Makros auf das Gerät die Firmware-Spezifikation prüfen.' }
    };
    var macroScope = macroTransportCopy[language] || macroTransportCopy.en;
    if (macroContract) macroContract.innerHTML = '<strong>' + macroScope.label + '</strong> ' + macroScope.body;
    setText('.download-card strong', copy.downloadHeading);
    setText('.download-card > div:first-child span', copy.downloadDescription);
    /* Touch-named firmware variants were removed from the build matrix. Keep
     * older translation entries from advertising files that no longer exist. */
    var downloadDescription = {
      ja: 'ZIP内にsleep-5m / 15m / 30m / 60m / offのフォルダと全モジュール構成を収録しています。自動スリープはフォルダを選び、右側トラックパッドはX/Yを反転します。',
      en: 'The ZIP contains sleep-5m / 15m / 30m / 60m / off folders and all module profiles. Choose the sleep folder in the ZIP; right-side trackpads invert X/Y.',
      'zh-CN': 'ZIP 包含 sleep-5m / 15m / 30m / 60m / off 文件夹和全部模块配置。请在 ZIP 中选择休眠文件夹；右侧触控板会反转 X/Y。',
      ko: 'ZIP에는 sleep-5m / 15m / 30m / 60m / off 폴더와 모든 모듈 프로필이 포함됩니다. ZIP에서 절전 폴더를 선택하며 오른쪽 트랙패드는 X/Y를 반전합니다.',
      th: 'ZIP มีโฟลเดอร์ sleep-5m / 15m / 30m / 60m / off และโปรไฟล์โมดูลทั้งหมด ให้เลือกโฟลเดอร์สลีปใน ZIP โดยแทร็กแพดด้านขวาจะกลับแกน X/Y',
      es: 'El ZIP incluye carpetas sleep-5m / 15m / 30m / 60m / off y todos los perfiles de módulos. Elige la carpeta de suspensión en el ZIP; el trackpad derecho invierte X/Y.',
      de: 'Das ZIP enthält die Ordner sleep-5m / 15m / 30m / 60m / off und alle Modulprofile. Wähle den Schlafordner im ZIP; das rechte Trackpad invertiert X/Y.'
    }[language];
    setText('.download-card > div:first-child span', downloadDescription || copy.downloadDescription);
    setText('.download-actions a:first-child', copy.latestZip);
    var bootloaderCopy = ({
      ja: { heading: 'ブートローダー書き込み', description: 'ブートローダー中はキーマップRPCを使わず、UF2を専用ドライブへ書き込みます。', help: '先にZIPを展開してUF2を選択し、次にXIAOのブートローダードライブを選択してください。', selectFile: 'UF2を選択', selectDrive: 'ドライブを選択', write: 'UF2を書き込む', file: 'UF2: 未選択', drive: 'ドライブ: 未選択', idle: 'UF2ファイルとブートローダードライブを選択してください。' },
      en: { heading: 'Bootloader writer', description: 'Bootloader mode is a USB mass-storage drive, not a keymap RPC connection. Write a UF2 to that drive.', help: 'Extract the ZIP, select a UF2, then select the XIAO bootloader drive.', selectFile: 'Select UF2', selectDrive: 'Select drive', write: 'Write UF2', file: 'UF2: not selected', drive: 'Drive: not selected', idle: 'Select a UF2 file and the bootloader drive.' },
      'zh-CN': { heading: '引导加载程序写入', description: '引导加载程序模式是 USB 存储驱动器，不是键位 RPC 连接。请将 UF2 写入该驱动器。', help: '解压 ZIP，选择 UF2，然后选择 XIAO 引导加载程序驱动器。', selectFile: '选择 UF2', selectDrive: '选择驱动器', write: '写入 UF2', file: 'UF2：未选择', drive: '驱动器：未选择', idle: '请选择 UF2 文件和引导加载程序驱动器。' },
      ko: { heading: '부트로더 기록', description: '부트로더 모드는 키맵 RPC 연결이 아닌 USB 저장 드라이브입니다. UF2를 드라이브에 기록하세요.', help: 'ZIP을 압축 해제하고 UF2를 선택한 다음 XIAO 부트로더 드라이브를 선택하세요.', selectFile: 'UF2 선택', selectDrive: '드라이브 선택', write: 'UF2 기록', file: 'UF2: 미선택', drive: '드라이브: 미선택', idle: 'UF2 파일과 부트로더 드라이브를 선택하세요.' },
      th: { heading: 'เขียนบูตโหลดเดอร์', description: 'โหมดบูตโหลดเดอร์เป็นไดรฟ์ USB ไม่ใช่การเชื่อมต่อ RPC ของคีย์แมป ให้เขียน UF2 ลงไดรฟ์นี้', help: 'แตกไฟล์ ZIP เลือก UF2 แล้วเลือกไดรฟ์บูตโหลดเดอร์ของ XIAO', selectFile: 'เลือก UF2', selectDrive: 'เลือกไดรฟ์', write: 'เขียน UF2', file: 'UF2: ยังไม่ได้เลือก', drive: 'ไดรฟ์: ยังไม่ได้เลือก', idle: 'เลือกไฟล์ UF2 และไดรฟ์บูตโหลดเดอร์' },
      es: { heading: 'Escritor del bootloader', description: 'El modo bootloader es una unidad USB, no una conexión RPC de mapas. Escribe un UF2 en esa unidad.', help: 'Extrae el ZIP, selecciona un UF2 y después la unidad bootloader de XIAO.', selectFile: 'Seleccionar UF2', selectDrive: 'Seleccionar unidad', write: 'Escribir UF2', file: 'UF2: no seleccionado', drive: 'Unidad: no seleccionada', idle: 'Selecciona un archivo UF2 y la unidad bootloader.' },
      de: { heading: 'Bootloader-Schreiber', description: 'Der Bootloader ist ein USB-Laufwerk, keine Keymap-RPC-Verbindung. Schreibe eine UF2-Datei auf dieses Laufwerk.', help: 'ZIP entpacken, UF2 auswählen und anschließend das XIAO-Bootloader-Laufwerk wählen.', selectFile: 'UF2 auswählen', selectDrive: 'Laufwerk auswählen', write: 'UF2 schreiben', file: 'UF2: nicht ausgewählt', drive: 'Laufwerk: nicht ausgewählt', idle: 'UF2-Datei und Bootloader-Laufwerk auswählen.' }
    })[language] || null;
    if (bootloaderCopy) {
      setText('#bootloader-heading', bootloaderCopy.heading);
      setText('#bootloader-description', bootloaderCopy.description);
      setText('#bootloader-help', bootloaderCopy.help);
      setText('[data-bootloader-select-file]', bootloaderCopy.selectFile);
      setText('[data-bootloader-select-drive]', bootloaderCopy.selectDrive);
      setText('[data-bootloader-write]', bootloaderCopy.write);
      var bootFile = document.querySelector('#bootloader-file-name');
      var bootDrive = document.querySelector('#bootloader-drive-name');
      var bootStatus = document.querySelector('#bootloader-status');
      if (bootFile && !bootFile.dataset.selected) bootFile.textContent = bootloaderCopy.file;
      if (bootDrive && !bootDrive.dataset.selected) bootDrive.textContent = bootloaderCopy.drive;
      if (bootStatus && (!bootStatus.dataset.state || bootStatus.dataset.state === 'idle')) bootStatus.textContent = bootloaderCopy.idle;
    }
    setText('.map-transfer h3', copy.mapTransferHeading || copy.defaultHeading);
    setText('.map-transfer p', copy.mapTransferDescription || copy.defaultDescription);
    setText('[data-export-map]', copy.mapExport || copy.save);
    setText('[data-import-map]', copy.mapImport || copy.read);
    setText('.map-transfer-status', copy.mapTransferStatus || copy.footerNote);
    setText('.macro-drag-palette h3', copy.macroPaletteHeading);
    var macroPaletteHint = ({
      ja: 'Remapと同じように、キーコードを下の手順欄へドラッグしてください。クリックでも選択中のマクロへ追加できます。',
      en: 'Drag keycodes into the sequence area like Remap. Clicking also adds the key to the selected macro.',
      'zh-CN': '像 Remap 一样将键码拖入步骤区域。点击也可以将按键添加到当前宏。',
      ko: 'Remap처럼 키코드를 순서 영역으로 드래그하세요. 클릭으로도 선택한 매크로에 추가할 수 있습니다.',
      th: 'ลากคีย์โค้ดไปยังพื้นที่ลำดับเหมือน Remap หรือคลิกเพื่อเพิ่มลงในมาโครที่เลือก',
      es: 'Arrastra códigos al área de pasos como en Remap. También puedes hacer clic para añadirlos a la macro seleccionada.',
      de: 'Ziehe Keycodes wie bei Remap in den Schrittbereich. Ein Klick fügt die Taste ebenfalls zum ausgewählten Makro hinzu.'
    })[language] || copy.macroPaletteDescription;
    setText('.macro-drag-palette > p', macroPaletteHint);
    setText('.macro-library-head h3', copy.macro);
    setText('.macro-library-head p', copy.macroLibraryDescription);
    setText('.macro-library-count', copy.macroLibraryCount);
    setText('.palette-help', copy.paletteHelp);
    setText('[data-pointer-profile-title]', copy.moduleLayout);
    setText('[data-pointer-profile-description]', copy.moduleDescription);
    setText('[data-module-layout-title]', copy.moduleLayout);
    setText('[data-module-layout-description]', copy.moduleDescription);
    setText('[data-left-module-label]', copy.leftModule);
    setText('[data-right-module-label]', copy.rightModule);
    setText('[data-encoder-title]', copy.encoderTitle);
    setText('[data-encoder-assignment-label]', copy.encoderAssignment);
    setText('[data-encoder-runtime-note]', copy.encoderRuntimeNote);
    var moduleOptions = document.querySelectorAll('[data-left-module] option, [data-right-module] option');
    moduleOptions.forEach(function (option) { option.textContent = option.value === 'none' ? copy.none : option.value === 'trackball' ? copy.trackball : copy.trackpad; });
    var encoderOptions = document.querySelectorAll('[data-encoder-left-ccw] option, [data-encoder-left-cw] option, [data-encoder-right-ccw] option, [data-encoder-right-cw] option');
    encoderOptions.forEach(function (option) { var labels = { 'scroll-up': copy.scrollUp, 'scroll-down': copy.scrollDown, 'scroll-left': copy.scrollLeft, 'scroll-right': copy.scrollRight, none: copy.encoderNone }; option.textContent = labels[option.value] || option.value; });
    setText('[data-device-ball-title]', copy.deviceBall);
    setText('[data-device-ball-description]', copy.deviceBallDesc);
    setText('[data-device-pad-title]', copy.devicePad);
    setText('[data-device-pad-description]', copy.devicePadDesc);
    setText('[data-auto-mouse-card] h4', copy.autoMouse);
    setText('[data-auto-mouse-card] p', copy.autoMouseDesc);
    setText('[data-scroll-card] h4', copy.scrollMode);
    setText('[data-scroll-card] p', copy.scrollDesc);
    setText('.device-setting-note', copy.deviceBuildNote || copy.deviceNote);
    setText('[data-scroll-scale-label]', copy.scrollScale);
    if (typeof window.soshoRefreshPhysicalTitles === 'function') window.soshoRefreshPhysicalTitles(copy);
    var leftMarker = document.querySelector('#keyboard .half.left .device-marker');
    var rightMarker = document.querySelector('#keyboard .half.right .device-marker');
    if (leftMarker || rightMarker) {
      if (typeof window.soshoRefreshDeviceMarkers === 'function') window.soshoRefreshDeviceMarkers(copy);
    }
    setText('.macro-modifiers > span', copy.macroModifiers || 'Modifiers:');
    setFirstText('.macro-latency', copy.macroLatency || 'Delay per added step (ms)');
    setText('.macro-drop-zone', copy.macroDropZone || 'Drag a key here to add it');
    setText('.macro-builder > small', copy.macroStepHelp || 'The number at the end of each row is that step delay.');
    setText('.palette-group:nth-of-type(1) summary', copy.groupBasic);
    setText('.palette-group:nth-of-type(2) summary', copy.groupJis);
    setText('.palette-group:nth-of-type(3) summary', copy.groupLayer);
    setText('.palette-group:nth-of-type(4) summary', copy.groupSpecial);
    setText('.palette-group:nth-of-type(5) summary', copy.groupAscii);
    setText('.palette-group:nth-of-type(6) summary', copy.groupTapDance);
    var footer = document.querySelector('.studio-footer');
    if (footer) {
      var footerLinks = footer.querySelectorAll('a');
      if (footerLinks[0]) footerLinks[0].textContent = copy.footerZmk;
      if (footerLinks[1]) footerLinks[1].textContent = copy.footerLicense;
    }
  }

  window.soshoUiText = function (key, fallback) {
    return textFor(storedLanguage(), key) || fallback || '';
  };

  function installLanguagePicker(shellActions) {
    if (!shellActions || shellActions.querySelector('.studio-language-picker')) return;
    var wrapper = document.createElement('label');
    wrapper.className = 'studio-language-picker';
    wrapper.innerHTML = '<span>Language</span><select id="language-select" aria-label="Language"><option value="ja">日本語</option><option value="en">English</option><option value="zh-CN">简体中文</option><option value="ko">한국어</option><option value="th">ไทย</option><option value="es">Español</option><option value="de">Deutsch</option></select>';
    var selector = wrapper.querySelector('select');
    selector.value = storedLanguage();
    selector.addEventListener('change', function () {
      var language = Object.prototype.hasOwnProperty.call(languageCatalog, selector.value) ? selector.value : 'ja';
      try { localStorage.setItem('sosho-language-v1', language); } catch (error) {}
      applyLanguage(language);
    });
    shellActions.appendChild(wrapper);
  }

  var notice = document.querySelector('.notice');
  var subtitle = document.querySelector('.subtitle');
  if (subtitle) subtitle.textContent = 'SO-SHO実機配列に合わせたキーマップ・マクロ編集ページ';
  var firmwareRepoLink = document.querySelector('a[href="https://github.com/robo1129-ops/sosho-firmware"]');
  var firmwareZipUrl = 'https://github.com/robo1129-ops/sosho-firmware/releases/download/latest/sosho-firmware-latest.zip';
  if (firmwareRepoLink) {
    firmwareRepoLink.href = firmwareZipUrl;
    firmwareRepoLink.textContent = 'カスタムファームウェアZIPを直接ダウンロード';
    firmwareRepoLink.setAttribute('download', 'sosho-firmware-latest.zip');
  }
  if (notice) {
    var card = document.createElement('section');
    card.className = 'download-card';
    card.setAttribute('aria-labelledby', 'firmware-download-heading');
    card.innerHTML = '' +
      '<div><strong id="firmware-download-heading">カスタムファームウェア（全パターン）</strong>' +
      '<span>全スリープ設定・全モジュール構成を含むZIPです。右側トラックパッドはX/Yを反転します。</span></div>' +
      '<div class="download-actions">' +
      '<a href="' + firmwareZipUrl + '" download="sosho-firmware-latest.zip" rel="noopener">最新ZIPをダウンロード</a>' +
      '</div>';
    notice.insertAdjacentElement('afterend', card);
  }

  /* A UF2 bootloader is a USB mass-storage volume, not a Web Serial/RPC
   * endpoint. Keep its workflow separate from keymap editing so selecting a
   * bootloader drive cannot be mistaken for a failed Studio connection. */
  function setupBootloaderWriter() {
    if (document.querySelector('.bootloader-card')) return;
    var card = document.createElement('section');
    card.className = 'bootloader-card card';
    card.setAttribute('aria-labelledby', 'bootloader-heading');
    card.innerHTML = '' +
      '<div class="bootloader-copy">' +
        '<strong id="bootloader-heading">ブートローダー書き込み</strong>' +
        '<span id="bootloader-description">ブートローダー中はキーマップRPCを使わず、UF2を専用ドライブへ書き込みます。</span>' +
        '<small id="bootloader-help">先にZIPを展開してUF2を選択し、次にXIAOのブートローダードライブを選択してください。</small>' +
      '</div>' +
      '<div class="bootloader-actions">' +
        '<button type="button" data-bootloader-select-file>UF2を選択</button>' +
        '<button type="button" data-bootloader-select-drive>ドライブを選択</button>' +
        '<button type="button" data-bootloader-write disabled>UF2を書き込む</button>' +
      '</div>' +
      '<div class="bootloader-selection"><span id="bootloader-file-name">UF2: 未選択</span><span id="bootloader-drive-name">ドライブ: 未選択</span></div>' +
      '<input type="file" accept=".uf2,application/octet-stream" data-bootloader-file-input hidden>' +
      '<span id="bootloader-status" class="bootloader-status" role="status" aria-live="polite">UF2ファイルとブートローダードライブを選択してください。</span>';
    var download = document.querySelector('.download-card');
    var workspace = document.querySelector('.workspace');
    if (download) download.insertAdjacentElement('afterend', card);
    else if (workspace) workspace.insertAdjacentElement('beforebegin', card);
    else document.body.appendChild(card);

    var state = { file: null, directory: null, writing: false };
    var selectFile = card.querySelector('[data-bootloader-select-file]');
    var selectDrive = card.querySelector('[data-bootloader-select-drive]');
    var writeButton = card.querySelector('[data-bootloader-write]');
    var fallbackInput = card.querySelector('[data-bootloader-file-input]');
    var fileName = card.querySelector('#bootloader-file-name');
    var driveName = card.querySelector('#bootloader-drive-name');
    var status = card.querySelector('#bootloader-status');
    var selectedFileLabel = { ja: 'UF2: 選択済み', en: 'UF2: selected', 'zh-CN': 'UF2：已选择', ko: 'UF2: 선택됨', th: 'UF2: เลือกแล้ว', es: 'UF2: seleccionado', de: 'UF2: ausgewählt' };
    var selectedDriveLabel = { ja: 'ブートローダードライブ: 選択済み', en: 'Bootloader drive: selected', 'zh-CN': '引导加载程序驱动器：已选择', ko: '부트로더 드라이브: 선택됨', th: 'ไดรฟ์บูตโหลดเดอร์: เลือกแล้ว', es: 'Unidad de arranque: seleccionada', de: 'Bootloader-Laufwerk: ausgewählt' };
    function language() { return storedLanguage(); }
    function localized(map, fallback) { return map[language()] || map.en || fallback; }
    function setStatus(message, stateName) {
      status.textContent = message;
      status.dataset.state = stateName || 'idle';
    }
    function updateWriteButton() {
      writeButton.disabled = state.writing || !state.file || !state.directory;
    }
    function errorMessage(error, fallback) {
      if (error && error.name === 'AbortError') return '';
      return error && error.message ? error.message : fallback;
    }
    async function validateUf2(file) {
      if (!file || !/\.uf2$/i.test(file.name || '')) throw new Error('UF2ファイルを選択してください。');
      if (!file.size || file.size < 512 || file.size % 512 !== 0) throw new Error('UF2のサイズが正しくありません。');
      var bytes = new Uint8Array(await file.slice(0, 512).arrayBuffer());
      var view = new DataView(bytes.buffer);
      if (view.getUint32(0, true) !== 0x0A324655 || view.getUint32(4, true) !== 0x9E5D5157 || view.getUint32(508, true) !== 0x0AB16F30) {
        throw new Error('UF2のヘッダーを確認できません。XIAO nRF52840用のUF2を選択してください。');
      }
      return file;
    }
    async function selectUf2File(file) {
      try {
        state.file = await validateUf2(file);
        fileName.dataset.selected = 'true';
        fileName.textContent = localized(selectedFileLabel, 'UF2: selected') + ' (' + state.file.name + ', ' + state.file.size.toLocaleString() + ' bytes)';
        setStatus(localized({ ja: 'UF2を確認しました。ドライブを選択してください。', en: 'UF2 validated. Select the bootloader drive.', 'zh-CN': 'UF2 已验证。请选择引导加载程序驱动器。', ko: 'UF2를 확인했습니다. 부트로더 드라이브를 선택하세요.', th: 'ตรวจสอบ UF2 แล้ว เลือกไดรฟ์บูตโหลดเดอร์', es: 'UF2 validado. Selecciona la unidad de arranque.', de: 'UF2 geprüft. Bootloader-Laufwerk auswählen.' }, 'UF2 validated. Select the bootloader drive.'), 'ok');
      } catch (error) {
        state.file = null;
        fileName.dataset.selected = '';
        fileName.textContent = localized({ ja: 'UF2: 未選択', en: 'UF2: not selected', 'zh-CN': 'UF2：未选择', ko: 'UF2: 미선택', th: 'UF2: ยังไม่ได้เลือก', es: 'UF2: no seleccionado', de: 'UF2: nicht ausgewählt' }, 'UF2: not selected');
        var message = errorMessage(error, 'UF2を確認できません。');
        if (message) setStatus(message, 'error');
      }
      updateWriteButton();
    }
    selectFile.addEventListener('click', async function () {
      try {
        if (typeof window.showOpenFilePicker === 'function') {
          var handles = await window.showOpenFilePicker({ multiple: false, types: [{ description: 'UF2 firmware', accept: { 'application/octet-stream': ['.uf2'] } }] });
          if (handles && handles[0]) await selectUf2File(await handles[0].getFile());
        } else {
          fallbackInput.click();
        }
      } catch (error) {
        var message = errorMessage(error, 'UF2の選択に失敗しました。');
        if (message) setStatus(message, 'error');
      }
    });
    fallbackInput.addEventListener('change', function () {
      var file = fallbackInput.files && fallbackInput.files[0];
      if (file) selectUf2File(file);
      fallbackInput.value = '';
    });
    selectDrive.addEventListener('click', async function () {
      if (typeof window.showDirectoryPicker !== 'function') {
        setStatus(localized({ ja: 'このブラウザーはドライブ選択に対応していません。ChromeまたはEdgeの最新版で開いてください。', en: 'This browser cannot select a drive. Use the latest Chrome or Edge.', 'zh-CN': '此浏览器不支持选择驱动器。请使用最新版 Chrome 或 Edge。', ko: '이 브라우저는 드라이브 선택을 지원하지 않습니다. 최신 Chrome 또는 Edge를 사용하세요.', th: 'เบราว์เซอร์นี้ไม่รองรับการเลือกไดรฟ์ ใช้ Chrome หรือ Edge รุ่นล่าสุด', es: 'Este navegador no permite seleccionar una unidad. Usa Chrome o Edge actualizado.', de: 'Dieser Browser unterstützt keine Laufwerksauswahl. Aktuelles Chrome oder Edge verwenden.' }, 'This browser cannot select a drive.'), 'error');
        return;
      }
      try {
        var directory = await window.showDirectoryPicker({ mode: 'readwrite' });
        var names = [];
        for await (var entry of directory.values()) names.push(String(entry.name || '').toUpperCase());
        if (!names.some(function (name) { return name === 'INFO_UF2.TXT' || name === 'INDEX.HTM'; })) throw new Error('UF2ブートローダードライブではありません。INFO_UF2.TXT または INDEX.HTM が見つかりません。');
        state.directory = directory;
        driveName.dataset.selected = 'true';
        driveName.textContent = localized(selectedDriveLabel, 'Bootloader drive: selected');
        setStatus(localized({ ja: 'ブートローダードライブを確認しました。UF2を書き込めます。', en: 'Bootloader drive validated. The UF2 is ready to write.', 'zh-CN': '已确认引导加载程序驱动器。可以写入 UF2。', ko: '부트로더 드라이브를 확인했습니다. UF2를 기록할 수 있습니다.', th: 'ยืนยันไดรฟ์บูตโหลดเดอร์แล้ว พร้อมเขียน UF2', es: 'Unidad de arranque validada. UF2 listo para escribir.', de: 'Bootloader-Laufwerk geprüft. UF2 kann geschrieben werden.' }, 'Bootloader drive validated. The UF2 is ready to write.'), 'ok');
      } catch (error) {
        state.directory = null;
        driveName.dataset.selected = '';
        driveName.textContent = localized({ ja: 'ドライブ: 未選択', en: 'Drive: not selected', 'zh-CN': '驱动器：未选择', ko: '드라이브: 미선택', th: 'ไดรฟ์: ยังไม่ได้เลือก', es: 'Unidad: no seleccionada', de: 'Laufwerk: nicht ausgewählt' }, 'Drive: not selected');
        var message = errorMessage(error, 'ブートローダードライブの選択に失敗しました。');
        if (message) setStatus(message, 'error');
      }
      updateWriteButton();
    });
    async function verifyPermission(directory) {
      if (!directory || typeof directory.queryPermission !== 'function') return true;
      var options = { mode: 'readwrite' };
      if (await directory.queryPermission(options) === 'granted') return true;
      return typeof directory.requestPermission === 'function' && await directory.requestPermission(options) === 'granted';
    }
    writeButton.addEventListener('click', async function () {
      if (state.writing || !state.file || !state.directory) return;
      state.writing = true;
      updateWriteButton();
      var writable = null;
      try {
        if (!await verifyPermission(state.directory)) throw new Error('ブートローダードライブへの書き込み許可がありません。');
        setStatus(localized({ ja: 'UF2を書き込み中です。ドライブを抜かないでください。', en: 'Writing UF2. Do not disconnect the drive.', 'zh-CN': '正在写入 UF2。请勿断开驱动器。', ko: 'UF2를 기록하는 중입니다. 드라이브를 분리하지 마세요.', th: 'กำลังเขียน UF2 อย่าถอดไดรฟ์', es: 'Escribiendo UF2. No desconectes la unidad.', de: 'UF2 wird geschrieben. Laufwerk nicht trennen.' }, 'Writing UF2. Do not disconnect the drive.'), 'working');
        var target = await state.directory.getFileHandle('SO-SHO-UPDATE.UF2', { create: true });
        writable = await target.createWritable();
        await writable.write(state.file);
        await writable.close();
        writable = null;
        setStatus(localized({ ja: '書き込みを開始しました。ブートローダードライブが切断され、キーボードが再起動すれば完了です。', en: 'The write started. It is complete when the bootloader drive disconnects and the keyboard restarts.', 'zh-CN': '已开始写入。引导加载程序驱动器断开且键盘重启后即完成。', ko: '기록을 시작했습니다. 부트로더 드라이브가 연결 해제되고 키보드가 재시작되면 완료됩니다.', th: 'เริ่มเขียนแล้ว จะเสร็จเมื่อไดรฟ์บูตโหลดเดอร์ตัดการเชื่อมต่อและคีย์บอร์ดรีสตาร์ท', es: 'La escritura comenzó. Finaliza cuando la unidad se desconecte y el teclado se reinicie.', de: 'Schreiben gestartet. Fertig, wenn das Bootloader-Laufwerk getrennt wird und die Tastatur neu startet.' }, 'The write started. Wait for reboot.'), 'ok');
      } catch (error) {
        if (writable) try { await writable.abort(); } catch (abortError) {}
        var message = errorMessage(error, 'UF2の書き込みに失敗しました。');
        setStatus(message || localized({ ja: 'UF2の書き込みをキャンセルしました。', en: 'UF2 write cancelled.', 'zh-CN': '已取消 UF2 写入。', ko: 'UF2 기록을 취소했습니다.', th: 'ยกเลิกการเขียน UF2 แล้ว', es: 'Escritura UF2 cancelada.', de: 'UF2-Schreiben abgebrochen.' }, 'UF2 write cancelled.'), 'error');
      }
      state.writing = false;
      updateWriteButton();
    });
    window.soshoBootloaderWriter = { getState: function () { return { hasFile: !!state.file, hasDrive: !!state.directory, writing: state.writing }; } };
  }

  function readJsonStorage(key, fallback) {
    try {
      var value = JSON.parse(localStorage.getItem(key) || 'null');
      return value === null ? fallback : value;
    } catch (error) {
      return fallback;
    }
  }

  function writeJsonStorage(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
  }

  function stringValue(value, fallback, maxLength) {
    if (typeof value !== 'string') return fallback;
    return value.slice(0, maxLength);
  }

  function validKeymap(value) {
    if (!value || typeof value !== 'object' || Array.isArray(value)) return {};
    var result = {};
    Object.keys(value).slice(0, 256).forEach(function (key) {
      if (typeof value[key] === 'string') result[String(key).slice(0, 128)] = value[key].slice(0, 160);
    });
    return result;
  }

  function validMacros(value) {
    if (!Array.isArray(value)) return [];
    return value.slice(0, 32).filter(function (macro) {
      return macro && typeof macro === 'object' && !Array.isArray(macro);
    }).map(function (macro) {
      return {
        name: stringValue(macro.name, '新しいマクロ', 100),
        target: stringValue(macro.target, '', 128),
        steps: stringValue(macro.steps, 'A|tap|1', 8000)
      };
    });
  }

  function validTapDance(value) {
    if (!Array.isArray(value)) return [];
    return value.slice(0, 64).filter(function (definition) {
      return definition && typeof definition === 'object' && !Array.isArray(definition);
    }).map(function (definition) {
      return {
        name: stringValue(definition.name, 'TD', 100),
        term: Math.max(50, Math.min(1000, Number(definition.term) || 200)),
        single: stringValue(definition.single, '', 80),
        double: stringValue(definition.double, '', 80),
        triple: stringValue(definition.triple, '', 80),
        hold: stringValue(definition.hold, '', 80)
      };
    });
  }

  function validDeviceSettings(value) {
    value = value && typeof value === 'object' && !Array.isArray(value) ? value : {};
    var timeout = Number(value.autoMouseTimeoutMs);
    if (!Number.isFinite(timeout)) timeout = 300;
    var legacyReverse = value.pointerProfile === 'left-ball-right-pad';
    function moduleValue(input, fallback) {
      return ['trackpad', 'trackball', 'none'].indexOf(input) >= 0 ? input : fallback;
    }
    var leftModule = moduleValue(value.leftModule, legacyReverse ? 'trackball' : 'trackpad');
    var rightModule = moduleValue(value.rightModule, legacyReverse ? 'trackpad' : 'trackball');
    function encoderValue(input, fallback) {
      return ['scroll-up', 'scroll-down', 'scroll-left', 'scroll-right', 'none'].indexOf(input) >= 0 ? input : fallback;
    }
    var scrollScale = Number(value.scrollScalePercent);
    if (!Number.isFinite(scrollScale)) scrollScale = 35;
    return {
      pointerProfile: leftModule === 'trackball' && rightModule === 'trackpad' ? 'left-ball-right-pad' : 'right-ball-left-pad',
      leftModule: leftModule,
      rightModule: rightModule,
      encoderLeftCcw: encoderValue(value.encoderLeftCcw, 'scroll-left'),
      encoderLeftCw: encoderValue(value.encoderLeftCw, 'scroll-right'),
      encoderRightCcw: encoderValue(value.encoderRightCcw, 'scroll-down'),
      encoderRightCw: encoderValue(value.encoderRightCw, 'scroll-up'),
      trackballCpi: Math.max(200, Math.min(1200, Number(value.trackballCpi) || 200)),
      trackpadScale: Math.max(.5, Math.min(2, Number(value.trackpadScale) || 1)),
      autoMouseEnabled: value.autoMouseEnabled !== false,
      autoMouseLayer: Math.max(0, Math.min(3, Number.isInteger(Number(value.autoMouseLayer)) ? Number(value.autoMouseLayer) : 1)),
      autoMouseTimeoutMs: Math.max(0, Math.min(60000, timeout)),
      scrollMode: 'hold',
      scrollDiagonal: value.scrollDiagonal !== false,
      scrollAxisLock: value.scrollAxisLock !== false,
      scrollAxisThreshold: Math.max(1.1, Math.min(4, Number(value.scrollAxisThreshold) || 1.8)),
      scrollDivider: Math.max(1, Math.min(16, Number(value.scrollDivider) || 4)),
      scrollScalePercent: Math.max(5, Math.min(100, Math.round(scrollScale)))
    };
  }

  function setupJsonTransfer() {
    var inspector = document.querySelector('.inspector');
    if (!inspector) return;
    var transfer = document.createElement('section');
    transfer.className = 'map-transfer';
    transfer.innerHTML = '<h3>設定ファイル</h3><p>キーマップ、マクロ、タップダンス、デバイス設定を1つのJSONに保存できます。</p><div class="map-transfer-actions"><button type="button" data-export-map>JSONをダウンロード</button><button type="button" data-import-map>JSONを読み込む</button></div><input type="file" accept="application/json,.json" data-import-map-file hidden><span class="map-transfer-status" role="status" aria-live="polite">ブラウザー内にも自動保存されます。</span>';
    inspector.insertBefore(transfer, inspector.querySelector('.footer-note'));
    var exportButton = transfer.querySelector('[data-export-map]');
    var importButton = transfer.querySelector('[data-import-map]');
    var fileInput = transfer.querySelector('[data-import-map-file]');
    var status = transfer.querySelector('.map-transfer-status');

    exportButton.addEventListener('click', function () {
      var payload = {
        format: 'sosho-keymap',
        schemaVersion: 2,
        layout: 'sosho-44',
        exportedAt: new Date().toISOString(),
        keymap: validKeymap(readJsonStorage('sosho-local-keymap-v1', {})),
        defaultKeymap: validKeymap(readJsonStorage('sosho-default-keymap-v1', {})),
        macros: validMacros(readJsonStorage('sosho-local-macros-v1', [])),
        tapDance: validTapDance(readJsonStorage('sosho-tap-dance-v1', [])),
        deviceSettings: validDeviceSettings(readJsonStorage('sosho-device-settings-v1', {}))
      };
      var blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json;charset=utf-8' });
      var url = URL.createObjectURL(blob);
      var link = document.createElement('a');
      link.href = url;
      link.download = 'sosho-keymap-' + new Date().toISOString().slice(0, 10) + '.json';
      document.body.appendChild(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(url);
      status.textContent = 'JSONをダウンロードしました。';
    });

    importButton.addEventListener('click', function () { fileInput.click(); });
    fileInput.addEventListener('change', function () {
      var file = fileInput.files && fileInput.files[0];
      if (!file) return;
      file.text().then(function (text) {
        var payload = JSON.parse(text);
        if (!payload || payload.format !== 'sosho-keymap' || ![1, 2].includes(Number(payload.schemaVersion))) {
          throw new Error('SO-SHO用のJSONではありません');
        }
        writeJsonStorage('sosho-local-keymap-v1', validKeymap(payload.keymap || payload.assignments));
        writeJsonStorage('sosho-default-keymap-v1', validKeymap(payload.defaultKeymap));
        writeJsonStorage('sosho-local-macros-v1', validMacros(payload.macros));
        writeJsonStorage('sosho-tap-dance-v1', validTapDance(payload.tapDance));
        writeJsonStorage('sosho-device-settings-v1', validDeviceSettings(payload.deviceSettings));
        status.textContent = 'JSONを読み込みました。画面を更新します。';
        window.setTimeout(function () { window.location.reload(); }, 250);
      }).catch(function (error) {
        status.textContent = '読み込み失敗: ' + (error && error.message ? error.message : 'JSONを確認してください');
      }).then(function () { fileInput.value = ''; });
    });
  }

  setupJsonTransfer();

  function setupMacroDragBuilder() {
    var macroPanel = document.querySelector('.macro-panel');
    var macroList = document.getElementById('macro-list');
    if (!macroPanel || !macroList || macroPanel.dataset.macroBuilderReady) return;
    macroPanel.dataset.macroBuilderReady = 'true';

    var palette = document.createElement('section');
    palette.className = 'macro-drag-palette';
    palette.innerHTML = '<h3>ドラッグでマクロを作成</h3><p>Remapと同じように、キーコードを下の手順欄へドラッグしてください。クリックでも選択中のマクロへ追加できます。</p><div class="macro-palette-tabs"><button type="button" data-macro-palette-tab="basic" aria-pressed="true">BASIC</button><button type="button" data-macro-palette-tab="functions" aria-pressed="false">FUNCTIONS</button><button type="button" data-macro-palette-tab="device" aria-pressed="false">DEVICE</button><button type="button" data-macro-palette-tab="special" aria-pressed="false">SPECIAL</button><button type="button" data-macro-palette-tab="ascii" aria-pressed="false">ASCII</button><input type="search" data-macro-palette-search placeholder="検索" aria-label="マクロキーコード検索"></div><div class="macro-palette-panel" data-macro-palette-panel="basic"><div class="macro-key-chips" data-macro-key-chips></div></div><div class="macro-palette-panel" data-macro-palette-panel="functions" hidden><div class="macro-key-chips" data-macro-functions></div></div><div class="macro-palette-panel" data-macro-palette-panel="device" hidden><div class="macro-key-chips" data-macro-device></div></div><div class="macro-palette-panel" data-macro-palette-panel="special" hidden><div class="macro-key-chips" data-macro-special></div></div><div class="macro-palette-panel" data-macro-palette-panel="ascii" hidden><div class="macro-key-chips" data-macro-ascii></div></div>';
    macroList.insertAdjacentElement('afterend', palette);

    var keyEntries = [
      ['A','A'], ['B','B'], ['C','C'], ['D','D'], ['E','E'], ['F','F'], ['G','G'], ['H','H'], ['I','I'], ['J','J'], ['K','K'], ['L','L'], ['M','M'], ['N','N'], ['O','O'], ['P','P'], ['Q','Q'], ['R','R'], ['S','S'], ['T','T'], ['U','U'], ['V','V'], ['W','W'], ['X','X'], ['Y','Y'], ['Z','Z'],
      ['0','0'], ['1','1'], ['2','2'], ['3','3'], ['4','4'], ['5','5'], ['6','6'], ['7','7'], ['8','8'], ['9','9'],
      ['Enter','RET'], ['Backspace','BSPC'], ['Tab','TAB'], ['Escape','ESC'], ['Space','SPACE'], ['←','LEFT'], ['→','RIGHT'], ['↑','UP'], ['↓','DOWN']
    ];
    function markMacroDragged() {
      window.__soshoMacroJustDragged = true;
      window.clearTimeout(window.__soshoMacroJustDraggedTimer);
      window.__soshoMacroJustDraggedTimer = window.setTimeout(function () {
        window.__soshoMacroJustDragged = false;
      }, 500);
    }
    function appendMacroKeyChip(container, entry) {
      var chip = document.createElement('button');
      chip.type = 'button';
      chip.className = 'macro-key-chip';
      chip.draggable = true;
      chip.textContent = entry[0];
      chip.title = entry[1] + 'をマクロへ追加';
      chip.dataset.macroKey = entry[1];
      chip.addEventListener('dragstart', function (event) {
        window.__soshoMacroDragKey = entry[1];
        markMacroDragged();
        event.dataTransfer.setData('text/plain', 'macro-key:' + entry[1]);
      });
      chip.addEventListener('pointerdown', function () {
        window.__soshoMacroDragKey = entry[1];
        window.__soshoMacroPointerMoved = false;
        chip.classList.add('macro-dragging');
      });
      chip.addEventListener('mousedown', function () {
        window.__soshoMacroDragKey = entry[1];
        window.__soshoMacroMouseMoved = false;
        chip.classList.add('macro-dragging');
      });
      chip.addEventListener('pointermove', function () { window.__soshoMacroPointerMoved = true; });
      chip.addEventListener('mousemove', function () { window.__soshoMacroMouseMoved = true; });
      chip.addEventListener('dragend', function () {
        window.__soshoMacroDragKey = '';
        chip.classList.remove('macro-dragging');
      });
      chip.addEventListener('click', function () {
        if (window.__soshoMacroJustDragged || window.__soshoMacroPointerMoved || window.__soshoMacroMouseMoved) {
          window.__soshoMacroJustDragged = false;
          window.__soshoMacroPointerMoved = false;
          window.__soshoMacroMouseMoved = false;
          return;
        }
        window.__soshoMacroDragKey = '';
        chip.classList.toggle('palette-selected');
        var activeItem = macroList.querySelector('.macro-item[data-macro-builder-ready="true"]');
        var textarea = activeItem && activeItem.querySelector('[data-macro-steps]');
        if (!textarea) return;
        appendMacroStep(textarea, entry[1]);
        var feedback = activeItem.querySelector('[data-macro-action-feedback]');
        if (feedback) feedback.textContent = macroReadableCode(entry[1]) + ' をクリックで追加しました。';
      });
      container.appendChild(chip);
    }
    var chipContainer = palette.querySelector('[data-macro-key-chips]');
    keyEntries.forEach(function (entry) { appendMacroKeyChip(chipContainer, entry); });
    [['Shift','LSHFT'],['Ctrl','LCTRL'],['Alt','LALT'],['GUI','LGUI'],['Enter','RET'],['Backspace','BSPC'],['Tab','TAB'],['Escape','ESC']].forEach(function (entry) { appendMacroKeyChip(palette.querySelector('[data-macro-functions]'), entry); });
    [['Mouse Left','LCLK'],['Mouse Right','RCLK'],['Mouse Middle','MCLK'],['Wheel Up','WH_U'],['Wheel Down','WH_D'],['Wheel Left','WH_L'],['Wheel Right','WH_R']].forEach(function (entry) { appendMacroKeyChip(palette.querySelector('[data-macro-device]'), entry); });
    [['RESET','RESET'],['BOOTLOADER','BOOT'],['Scroll Hold','SCROLL_HOLD'],['CPI −','CPI_DOWN'],['CPI ＋','CPI_UP']].forEach(function (entry) { appendMacroKeyChip(palette.querySelector('[data-macro-special]'), entry); });
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'.split('').forEach(function (character) { appendMacroKeyChip(palette.querySelector('[data-macro-ascii]'), [character, 'ASCII_' + character]); });
    palette.querySelectorAll('[data-macro-palette-tab]').forEach(function (tab) {
      tab.addEventListener('click', function () {
        var category = tab.dataset.macroPaletteTab;
        palette.querySelectorAll('[data-macro-palette-tab]').forEach(function (other) { other.setAttribute('aria-pressed', String(other === tab)); });
        palette.querySelectorAll('[data-macro-palette-panel]').forEach(function (panel) { panel.hidden = panel.dataset.macroPalettePanel !== category; });
      });
    });
    var paletteSearch = palette.querySelector('[data-macro-palette-search]');
    paletteSearch.addEventListener('input', function () {
      var query = paletteSearch.value.trim().toLowerCase();
      palette.querySelectorAll('.macro-key-chip').forEach(function (chip) { chip.style.display = !query || chip.textContent.toLowerCase().indexOf(query) >= 0 ? '' : 'none'; });
    });

    var modifierNames = [['Shift', 'LSHFT'], ['Ctrl', 'LCTRL'], ['Alt', 'LALT'], ['GUI', 'LGUI']];
    var macroCodeLabels = {
      RET: 'Enter', BSPC: 'Backspace', TAB: 'Tab', ESC: 'Escape', SPACE: 'Space',
      LEFT: '← Left', RIGHT: '→ Right', UP: '↑ Up', DOWN: '↓ Down',
      LCLK: 'Mouse Left', RCLK: 'Mouse Right', MCLK: 'Mouse Middle',
      WH_U: 'Wheel Up', WH_D: 'Wheel Down', WH_L: 'Wheel Left', WH_R: 'Wheel Right'
    };
    function macroReadableCode(code) {
      return macroCodeLabels[code] || code.replace(/^L(SHFT|CTRL|ALT|GUI)$/, function (_, name) {
        return ({SHFT: 'Shift', CTRL: 'Ctrl', ALT: 'Alt', GUI: 'GUI'})[name] || code;
      });
    }
    function parseMacroSteps(text) {
      return String(text || '').split(/\r?\n/).filter(Boolean).map(function (line) {
        var parts = line.split('|');
        var mode = ['tap', 'press', 'release'].indexOf((parts[1] || 'tap').toLowerCase()) >= 0 ? (parts[1] || 'tap').toLowerCase() : 'tap';
        var wait = Number(parts.length > 2 && parts[2] !== '' ? parts[2] : 1);
        if (!Number.isInteger(wait) || wait < 0) wait = 1;
        return { code: (parts[0] || '').trim() || 'NO', mode: mode, wait: Math.min(60000, wait) };
      });
    }
    function macroStepText(step) {
      var action = macroReadableCode(step.code);
      return step.mode === 'press' ? action + ' を押す' : step.mode === 'release' ? action + ' を離す' : action + ' をタップ';
    }
    function updateMacroBytes(item, textarea) {
      var bytes = item.querySelector('.macro-bytes-remaining');
      if (bytes) bytes.textContent = Math.max(0, 496 - String(textarea.value || '').length) + ' 残りバイト';
    }
    function renderMacroSteps(item, textarea, stepList) {
      if (!stepList) return;
      var steps = parseMacroSteps(textarea.value);
      stepList.innerHTML = '';
      if (!steps.length) {
        var empty = document.createElement('p');
        empty.className = 'macro-step-empty';
        empty.textContent = 'まだ手順がありません。キーをドラッグするとここに追加されます。';
        stepList.appendChild(empty);
        return;
      }
      steps.forEach(function (step, index) {
        var row = document.createElement('div');
        row.className = 'macro-step-row';
        row.dataset.macroStepIndex = String(index);
        var number = document.createElement('span');
        number.className = 'macro-step-number';
        number.textContent = String(index + 1).padStart(2, '0');
        var description = document.createElement('span');
        description.className = 'macro-step-description';
        description.textContent = macroStepText(step);
        var code = document.createElement('code');
        code.className = 'macro-step-code';
        code.textContent = step.code + '|' + step.mode;
        var mode = document.createElement('select');
        mode.className = 'macro-step-mode';
        mode.setAttribute('aria-label', '手順 ' + (index + 1) + ' の操作');
        [['tap', 'タップ'], ['press', '押す'], ['release', '離す']].forEach(function (option) {
          var itemOption = document.createElement('option');
          itemOption.value = option[0];
          itemOption.textContent = option[1];
          itemOption.selected = option[0] === step.mode;
          mode.appendChild(itemOption);
        });
        var waitLabel = document.createElement('label');
        waitLabel.className = 'macro-step-wait';
        waitLabel.textContent = '待機(ms)';
        var wait = document.createElement('input');
        wait.type = 'number';
        wait.min = '0';
        wait.max = '60000';
        wait.step = '1';
        wait.value = String(step.wait);
        wait.setAttribute('aria-label', '手順 ' + (index + 1) + ' の待機時間（ミリ秒）');
        waitLabel.appendChild(wait);
        var remove = document.createElement('button');
        remove.type = 'button';
        remove.className = 'macro-step-remove';
        remove.textContent = '削除';
        remove.setAttribute('aria-label', '手順 ' + (index + 1) + ' を削除');
        function commit() {
          var next = parseMacroSteps(textarea.value);
          next[index].mode = mode.value;
          next[index].wait = Math.max(0, Math.min(60000, Number(wait.value) || 0));
          wait.value = String(next[index].wait);
          textarea.value = next.map(function (entry) { return entry.code + '|' + entry.mode + '|' + entry.wait; }).join('\n');
          textarea.dispatchEvent(new Event('change', { bubbles: true }));
        }
        mode.addEventListener('change', commit);
        wait.addEventListener('change', commit);
        remove.addEventListener('click', function () {
          var next = parseMacroSteps(textarea.value).filter(function (_, entryIndex) { return entryIndex !== index; });
          textarea.value = next.map(function (entry) { return entry.code + '|' + entry.mode + '|' + entry.wait; }).join('\n') || 'A|tap|1';
          textarea.dispatchEvent(new Event('change', { bubbles: true }));
        });
        row.appendChild(number);
        row.appendChild(description);
        row.appendChild(code);
        row.appendChild(mode);
        row.appendChild(waitLabel);
        row.appendChild(remove);
        stepList.appendChild(row);
      });
    }
    function updateMacroCombinationPreview(builder) {
      var preview = builder.querySelector('[data-macro-combo-preview]');
      if (!preview) return;
      var selected = Array.prototype.slice.call(builder.querySelectorAll('[data-macro-modifier]:checked')).map(function (input) {
        return input.parentElement.textContent.trim();
      });
      preview.textContent = selected.length ? selected.join(' + ') + ' + ドロップしたキー' : '修飾キーなし（キーだけを追加）';
    }
    function appendMacroStep(textarea, key) {
      var editorSteps = textarea.closest('.macro-editor-steps');
      var builder = editorSteps && editorSteps.querySelector('.macro-builder');
      if (!builder) return { modifiers: [], latency: 1 };
      var latencyInput = builder.querySelector('[data-macro-latency]');
      var latency = Math.max(0, Math.min(60000, Number(latencyInput.value) || 1));
      latencyInput.value = latency;
      var modifiers = Array.prototype.slice.call(builder.querySelectorAll('[data-macro-modifier]:checked')).map(function (input) { return input.value; });
      var lines = [];
      if (modifiers.length) {
        modifiers.forEach(function (modifier) { lines.push(modifier + '|press|' + latency); });
        lines.push(key + '|tap|' + latency);
        modifiers.slice().reverse().forEach(function (modifier) { lines.push(modifier + '|release|' + latency); });
      } else {
        lines.push(key + '|tap|' + latency);
      }
      var current = textarea.value.trim();
      textarea.value = current ? current + '\n' + lines.join('\n') : lines.join('\n');
      textarea.dispatchEvent(new Event('change', { bubbles: true }));
      return { modifiers: modifiers, latency: latency };
    }

    function enhanceMacroItem(item) {
      if (item.dataset.macroBuilderReady === 'true') return;
      var textarea = item.querySelector('textarea');
      var stepsLabel = textarea && textarea.closest('label');
      if (!textarea || !stepsLabel) return;
      item.dataset.macroBuilderReady = 'true';
      var stepList = document.createElement('div');
      stepList.className = 'macro-step-list';
      stepList.setAttribute('data-macro-step-summary', 'true');
      stepList.setAttribute('aria-label', 'マクロ手順一覧');
      stepsLabel.insertBefore(stepList, textarea);
      var builder = document.createElement('div');
      builder.className = 'macro-builder';
      builder.innerHTML = '<div class="macro-combo-builder"><strong>組み合わせキー</strong><span data-macro-combo-preview>修飾キーなし（キーだけを追加）</span><small>Ctrl・Alt・Shift・GUIを選んでからキーをドロップすると、押す→キー→離すの順で追加されます。</small></div><div class="macro-modifiers"><span>修飾キー:</span>' + modifierNames.map(function (entry) { return '<label><input type="checkbox" data-macro-modifier value="' + entry[1] + '">' + entry[0] + '</label>'; }).join('') + '</div><label class="macro-latency">追加時の待ち時間(ms)<input type="number" data-macro-latency min="0" max="60000" step="1" value="1"></label><div class="macro-drop-zone" data-macro-drop-zone><strong data-macro-drop-label>ここへキーをドラッグして追加</strong><span data-macro-drop-status>ドロップすると、下の一覧に操作が追加されます。</span></div><div class="macro-action-feedback" data-macro-action-feedback aria-live="polite">待機時間の初期値は1msです。</div><small>下の一覧で各操作の種類と待機時間を1行ずつ変更できます。</small>';
      stepsLabel.appendChild(builder);
      function refreshSteps() {
        renderMacroSteps(item, textarea, stepList);
        updateMacroBytes(item, textarea);
      }
      refreshSteps();
      var dropZone = builder.querySelector('[data-macro-drop-zone]');
      var dropLabel = builder.querySelector('[data-macro-drop-label]');
      var dropStatus = builder.querySelector('[data-macro-drop-status]');
      var feedback = builder.querySelector('[data-macro-action-feedback]');
      var comboModifiers = builder.querySelectorAll('[data-macro-modifier]');
      comboModifiers.forEach(function (input) { input.addEventListener('change', function () { updateMacroCombinationPreview(builder); }); });
      function appendDroppedKey(key) {
        if (!key) return false;
        var result = appendMacroStep(textarea, key);
        markMacroDragged();
        dropLabel.textContent = '追加しました: ' + macroReadableCode(key);
        dropStatus.textContent = (result.modifiers.length ? result.modifiers.map(macroReadableCode).join(' + ') + ' + ' : '') + macroReadableCode(key) + '（各操作 ' + result.latency + 'ms）';
        feedback.textContent = 'マクロ手順に追加しました。下の一覧で確認・編集できます。';
        return true;
      }
      function acceptMacroDrop(event) {
        event.preventDefault();
        dropZone.classList.remove('drop-ready');
        textarea.classList.remove('drop-ready');
        var data = event.dataTransfer.getData('text/plain');
        var key = data.indexOf('macro-key:') === 0 ? data.slice(10) : '';
        window.__soshoMacroDragKey = '';
        if (!appendDroppedKey(key)) {
          dropLabel.textContent = '追加できませんでした';
          dropStatus.textContent = 'BASIC / FUNCTIONS / DEVICE / SPECIAL のキーをドロップしてください。';
          feedback.textContent = '認識できないドラッグ操作でした。';
        }
      }
      function markDropReady(target) { return function (event) { event.preventDefault(); target.classList.add('drop-ready'); if (target === dropZone) { dropLabel.textContent = 'ここで離すと追加'; dropStatus.textContent = '組み合わせキーは選択中の修飾キーと一緒に追加されます。'; } }; }
      function clearDropReady(target) { return function () { target.classList.remove('drop-ready'); if (target === dropZone) { dropLabel.textContent = 'ここへキーをドラッグして追加'; dropStatus.textContent = 'ドロップすると、下の一覧に操作が追加されます。'; } }; }
      dropZone.addEventListener('dragover', markDropReady(dropZone));
      dropZone.addEventListener('dragleave', clearDropReady(dropZone));
      dropZone.addEventListener('drop', acceptMacroDrop);
      dropZone.addEventListener('pointerenter', function () { if (window.__soshoMacroDragKey) markDropReady(dropZone)({ preventDefault: function () {} }); });
      dropZone.addEventListener('pointerup', function () {
        if (appendDroppedKey(window.__soshoMacroDragKey)) {
          dropZone.classList.remove('drop-ready');
          window.__soshoMacroDragKey = '';
        }
      });
      dropZone.addEventListener('mouseenter', function () { if (window.__soshoMacroDragKey) markDropReady(dropZone)({ preventDefault: function () {} }); });
      dropZone.addEventListener('mouseup', function () {
        if (appendDroppedKey(window.__soshoMacroDragKey)) {
          dropZone.classList.remove('drop-ready');
          window.__soshoMacroDragKey = '';
        }
      });
      textarea.addEventListener('dragover', markDropReady(textarea));
      textarea.addEventListener('dragleave', clearDropReady(textarea));
      textarea.addEventListener('drop', acceptMacroDrop);
      textarea.addEventListener('pointerenter', function () { if (window.__soshoMacroDragKey) markDropReady(textarea)({ preventDefault: function () {} }); });
      textarea.addEventListener('pointerup', function () {
        if (appendDroppedKey(window.__soshoMacroDragKey)) {
          textarea.classList.remove('drop-ready');
          window.__soshoMacroDragKey = '';
        }
      });
      textarea.addEventListener('mouseenter', function () { if (window.__soshoMacroDragKey) markDropReady(textarea)({ preventDefault: function () {} }); });
      textarea.addEventListener('mouseup', function () {
        if (appendDroppedKey(window.__soshoMacroDragKey)) {
          textarea.classList.remove('drop-ready');
          window.__soshoMacroDragKey = '';
        }
      });
      textarea.addEventListener('input', refreshSteps);
      textarea.addEventListener('change', refreshSteps);
    }

    function enhanceAllMacroItems() {
      macroList.querySelectorAll('.macro-item').forEach(enhanceMacroItem);
    }
    enhanceAllMacroItems();
    if (typeof MutationObserver === 'function') {
      var macroObserverQueued = false;
      var observer = new MutationObserver(function () {
        if (macroObserverQueued) return;
        macroObserverQueued = true;
        window.setTimeout(function () {
          macroObserverQueued = false;
          enhanceAllMacroItems();
        }, 0);
      });
      observer.observe(macroList, { childList: true });
    }
  }

  setupMacroDragBuilder();

  var reference = document.querySelector('.reference-note');
  if (reference) {
    var badge = document.createElement('span');
    badge.className = 'layout-badge';
    badge.textContent = '実機レイアウト準拠';
    reference.appendChild(badge);
  }

  var layoutSelector = document.getElementById('layout-selector');
  if (layoutSelector) {
    layoutSelector.value = localStorage.getItem('sosho-layout-language-v1') || 'Japanese';
    layoutSelector.addEventListener('change', function () {
      localStorage.setItem('sosho-layout-language-v1', layoutSelector.value);
    });
  }

  var hint = document.querySelector('.hint');
  if (hint) {
    hint.textContent = '実機の12列×4行レイアウトに合わせて表示しています。キーを選択し、アクションをクリックまたはドラッグしてください。紫色の□は未設定キーです。';
  }

  var legendItems = document.querySelectorAll('.legend span');
  if (legendItems.length >= 3 && legendItems[2].lastChild) {
    legendItems[2].lastChild.textContent = '未設定キー';
  }

  var palette = document.querySelector('.palette');
  if (palette) {
    var additions = document.createElement('div');
    additions.className = 'palette-additions';
    additions.innerHTML = '<details class="palette-group" open><summary>通常キー <span>A / ENTER / 数字 / 記号</span></summary><div class="palette-grid" data-basic-palette></div><p class="palette-help">キーをつかんで、上の実機配列へドラッグ＆ドロップしてください。</p></details>' +
      '<details class="palette-group" open><summary>日本語 / JIS <span>かな・英数・変換</span></summary><div class="palette-grid" data-jis-palette></div><p class="palette-help">Windowsの日本語入力で使うLANG/INTキーです。</p></details>' +
      '<details class="palette-group" open><summary>レイヤー <span>TO / MO / TG / TT / OSL</span></summary><div class="palette-grid" data-layer-palette></div><p class="palette-help">レイヤー操作をキーへクリックまたはドラッグで割り当てます。</p></details>' +
      '<details class="palette-group" open><summary>特殊キー <span>RESET / BOOT / SCROLL</span></summary><div class="palette-grid" data-special-palette></div><p class="palette-help">デバイス操作や押下中スクロールを割り当てます。</p></details>' +
      '<details class="palette-group" open><summary>ASCII <span>文字コード</span></summary><div class="palette-grid" data-ascii-palette></div><p class="palette-help">ASCII文字をキーへ割り当てます。</p></details>' +
      '<details class="palette-group" open><summary>タップダンス <span>1回 / 2回 / 3回 / ホールド</span></summary><div data-tap-dance-list></div><div class="tap-dance-form"><label>名前<input data-td-name value="TD1"></label><label>判定時間(ms)<input data-td-term type="number" min="50" max="1000" step="10" value="200"></label><label>1回<select data-td-single></select></label><label>2回<select data-td-double></select></label><label>3回<select data-td-triple></select></label><label>ホールド<select data-td-hold></select></label><button class="chip wide" type="button" data-add-tap-dance>タップダンスを作成</button></div><p class="palette-help">作成した定義をドラッグすると、選択したキーに割り当てられます。</p></details>';
    palette.appendChild(additions);

    var basicKeys = 'A B C D E F G H I J K L M N O P Q R S T U V W X Y Z 0 1 2 3 4 5 6 7 8 9 Enter Backspace Tab Escape Space Minus Equal Comma Period Slash Semicolon Quote Left Right Up Down'.split(' ');
    var basicPalette = additions.querySelector('[data-basic-palette]');
    basicKeys.forEach(function (name) {
      var chip = document.createElement('button');
      chip.type = 'button';
      chip.className = 'chip';
      chip.draggable = true;
      chip.textContent = name;
      chip.title = name + 'をキーマップへドラッグ';
      chip.addEventListener('click', function () { chip.classList.toggle('palette-selected'); });
      chip.addEventListener('dragstart', function (event) {
        event.dataTransfer.setData('text/plain', 'action:' + name);
      });
      basicPalette.appendChild(chip);
    });

    var japaneseKeys = [
      ['かな', 'LANG1'],
      ['英数', 'LANG2'],
      ['全角/半角', 'LANG5'],
      ['カナ/かな', 'INT2'],
      ['変換', 'INT4'],
      ['無変換', 'INT5'],
      ['￥', 'INT3'],
      ['ろ', 'INT1']
    ];
    var jisPalette = additions.querySelector('[data-jis-palette]');
    japaneseKeys.forEach(function (entry) {
      var chip = document.createElement('button');
      chip.type = 'button';
      chip.className = 'chip jis-chip';
      chip.draggable = true;
      chip.textContent = entry[0];
      chip.title = entry[0] + ' (' + entry[1] + ') をキーマップへドラッグ';
      chip.addEventListener('click', function () { chip.classList.toggle('palette-selected'); });
      chip.addEventListener('dragstart', function (event) {
        event.dataTransfer.setData('text/plain', 'action:' + entry[1]);
      });
      jisPalette.appendChild(chip);
    });

    function appendActionChip(container, label, action, className) {
      var chip = document.createElement('button');
      chip.type = 'button';
      chip.className = 'chip' + (className ? ' ' + className : '');
      chip.textContent = label;
      chip.title = label + 'をキーマップへ割り当て';
      chip.addEventListener('click', function () { chip.classList.toggle('palette-selected'); });
      chip.draggable = true;
      chip.addEventListener('dragstart', function (event) { event.dataTransfer.setData('text/plain', 'action:' + action); });
      container.appendChild(chip);
    }

    /* paletteGroups is scoped to the inline editor bootstrap.  Reading that
     * private variable here raised a ReferenceError and stopped the Studio
     * shell before it could install its layout. */
    var shellFunctionActions = ['Ctrl', 'Shift', 'Alt', 'GUI', 'MO 0', 'MO 1', 'MO 2', 'MO 3', 'TO 0', 'TO 1', 'TO 2', 'TO 3', 'TG 0', 'TG 1', 'TG 2', 'TG 3', 'TT 0', 'TT 1', 'TT 2', 'TT 3', 'OSL 0', 'OSL 1', 'OSL 2', 'OSL 3', 'Tap Dance', 'Macro 0', 'Macro 1'];
    var shellDeviceActions = ['CPI −', 'CPI ＋', 'Trackpad −', 'Trackpad ＋', '押している間だけスクロール', 'スクロール切替', 'Auto Mouse ON/OFF', 'BT0', 'BT1', 'BT2', 'BT3', 'BT4', 'BT CLR', 'BT CLR ALL', 'Mouse Left', 'Mouse Right', 'Mouse Middle', 'Mouse Back', 'Mouse Forward', 'Wheel Up', 'Wheel Down', 'Wheel Left', 'Wheel Right'];

    /* Keep one action palette.  The first implementation left the legacy
     * renderPalette() toolbar inside #palette and then appended this enhanced
     * palette below it, which made BASIC/FUNCTIONS appear twice. */
    var functionsDetail = document.createElement('details');
    functionsDetail.className = 'palette-group';
    functionsDetail.dataset.paletteCategory = 'functions';
    functionsDetail.innerHTML = '<summary>ファンクション <span>修飾キー / レイヤー / マクロ</span></summary><div class="palette-grid" data-functions-palette></div><p class="palette-help">修飾キーやレイヤー、マクロをキーへドラッグ＆ドロップしてください。</p>';
    additions.insertBefore(functionsDetail, additions.querySelector('[data-layer-palette]').closest('.palette-group'));
    var functionsPalette = functionsDetail.querySelector('[data-functions-palette]');
    shellFunctionActions.forEach(function (name) { appendActionChip(functionsPalette, name, name, 'function-chip'); });

    var layerPalette = additions.querySelector('[data-layer-palette]');
    [['TO(0)', 'TO 0'], ['TO(1)', 'TO 1'], ['TO(2)', 'TO 2'], ['TO(3)', 'TO 3'], ['TG(0)', 'TG 0'], ['TG(1)', 'TG 1'], ['TG(2)', 'TG 2'], ['TG(3)', 'TG 3'], ['TT(0)', 'TT 0'], ['TT(1)', 'TT 1'], ['TT(2)', 'TT 2'], ['TT(3)', 'TT 3'], ['MO(0)', 'MO 0'], ['MO(1)', 'MO 1'], ['MO(2)', 'MO 2'], ['MO(3)', 'MO 3'], ['OSL(0)', 'OSL 0'], ['OSL(1)', 'OSL 1'], ['DF(0)', 'DF 0'], ['DF(1)', 'DF 1'], ['DF(2)', 'DF 2'], ['DF(3)', 'DF 3']].forEach(function (entry) { appendActionChip(layerPalette, entry[0], entry[1]); });

    var specialPalette = additions.querySelector('[data-special-palette]');
    [['押下中スクロール', 'SCROLL_HOLD'], ['スクロール切替', 'SCROLL_TOGGLE'], ['CPI −', 'CPI_DOWN'], ['CPI ＋', 'CPI_UP'], ['パッド倍率 −', 'TP_SCALE_DOWN'], ['パッド倍率 ＋', 'TP_SCALE_UP'], ['RESET', 'RESET'], ['BOOTLOADER', 'BOOTLOADER'], ['CapsLock', 'CAPSLOCK'], ['PrintScreen', 'PSCRN']].forEach(function (entry) { appendActionChip(specialPalette, entry[0], entry[1], 'special-chip'); });

    var asciiPalette = additions.querySelector('[data-ascii-palette]');
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'.split('').forEach(function (character) { appendActionChip(asciiPalette, character, 'ASCII_' + character, 'ascii-chip'); });

    var optionKeys = ['未設定'].concat(basicKeys).concat(['Ctrl', 'Shift', 'Alt', 'GUI', 'MO 1', 'MO 2', 'BT0', 'BT1', 'BT2', 'BT3', 'BT4']);
    var tapDanceState = [];
    try {
      tapDanceState = JSON.parse(localStorage.getItem('sosho-tap-dance-v1') || '[]') || [];
    } catch (error) {
      tapDanceState = [];
    }

    function makeOptionSelect(selector) {
      var select = additions.querySelector(selector);
      optionKeys.forEach(function (name) {
        var option = document.createElement('option');
        option.value = name === '未設定' ? '' : name;
        option.textContent = name;
        select.appendChild(option);
      });
      return select;
    }

    var single = makeOptionSelect('[data-td-single]');
    var double = makeOptionSelect('[data-td-double]');
    var triple = makeOptionSelect('[data-td-triple]');
    var hold = makeOptionSelect('[data-td-hold]');
    single.value = 'A';
    double.value = 'Enter';
    triple.value = 'Backspace';
    hold.value = 'Escape';

    function saveTapDance() {
      try {
        localStorage.setItem('sosho-tap-dance-v1', JSON.stringify(tapDanceState));
      } catch (error) {
        // Keep the editor usable even when browser storage is unavailable.
      }
    }

    function renderTapDanceDefinitions() {
      var list = additions.querySelector('[data-tap-dance-list]');
      list.innerHTML = '';
      if (!tapDanceState.length) {
        list.innerHTML = '<p class="palette-help">まだ定義がありません。</p>';
        return;
      }
      tapDanceState.forEach(function (definition, index) {
        var row = document.createElement('div');
        row.className = 'tap-dance-definition';
        var label = document.createElement('span');
        label.textContent = definition.name + ' · ' + (definition.single || '—') + ' / ' + (definition.double || '—') + ' / ' + (definition.triple || '—') + ' / hold ' + (definition.hold || '—') + ' · ' + definition.term + 'ms';
        var drag = document.createElement('button');
        drag.type = 'button';
        drag.draggable = true;
        drag.textContent = 'ドラッグして割当';
        drag.title = 'このタップダンスをキーマップへドラッグ';
        drag.addEventListener('dragstart', function (event) {
          event.dataTransfer.setData('text/plain', 'action:TapDance[' + definition.name + ']');
        });
        row.appendChild(label);
        row.appendChild(drag);
        list.appendChild(row);
      });
    }

    additions.querySelector('[data-add-tap-dance]').addEventListener('click', function () {
      var name = additions.querySelector('[data-td-name]').value.trim() || ('TD' + (tapDanceState.length + 1));
      tapDanceState.push({
        name: name,
        term: Math.max(50, Math.min(1000, Number(additions.querySelector('[data-td-term]').value) || 200)),
        single: single.value,
        double: double.value,
        triple: triple.value,
        hold: hold.value
      });
      saveTapDance();
      renderTapDanceDefinitions();
    });
    renderTapDanceDefinitions();

    var basicDetail = additions.querySelector('[data-basic-palette]').closest('.palette-group');
    var jisDetail = additions.querySelector('[data-jis-palette]').closest('.palette-group');
    var layerDetail = additions.querySelector('[data-layer-palette]').closest('.palette-group');
    var specialDetail = additions.querySelector('[data-special-palette]').closest('.palette-group');
    var asciiDetail = additions.querySelector('[data-ascii-palette]').closest('.palette-group');
    var tapDanceDetail = additions.querySelector('[data-tap-dance-list]').closest('.palette-group');
    basicDetail.dataset.paletteCategory = 'basic';
    jisDetail.dataset.paletteCategory = 'jis';
    layerDetail.dataset.paletteCategory = 'layer';
    specialDetail.dataset.paletteCategory = 'special';
    asciiDetail.dataset.paletteCategory = 'ascii';
    tapDanceDetail.dataset.paletteCategory = 'tap-dance';

    var actionPanel = document.getElementById('palette');
    /* The base editor still needs the legacy #palette node while it boots,
     * but it must never remain visible beside the enhanced palette.  Do not
     * rely on a particular parent relationship here: static hosting can
     * insert wrappers during hydration and that previously left a second
     * BASIC/FUNCTIONS menu visible in the deployed page. */
    if (actionPanel && actionPanel !== palette) {
      actionPanel.hidden = true;
      actionPanel.setAttribute('aria-hidden', 'true');
      actionPanel.replaceChildren();
    }
    var devicePanel = document.createElement('div');
    devicePanel.className = 'device-settings-panel';
    devicePanel.dataset.paletteCategory = 'device';
    devicePanel.innerHTML = '<section class="device-settings-card device-settings-card-wide"><h4 data-pointer-profile-title>左右のポインティングデバイス</h4><p data-pointer-profile-description>実機のセンサー配置に合わせて、左右のトラックボール／トラックパッド構成を選択します。</p><label>センサー配置<select data-pointer-profile><option value="right-ball-left-pad">右：トラックボール / 左：トラックパッド</option><option value="left-ball-right-pad">左：トラックボール / 右：トラックパッド</option></select></label></section>' +
      '<section class="device-settings-card"><h4 data-device-ball-title>トラックボール</h4><p data-device-ball-description>移動量のCPIを調整します。</p><div class="device-setting-actions"><button type="button" data-trackball-step="-100">CPI −</button><button type="button" data-trackball-step="0">標準</button><button type="button" data-trackball-step="100">CPI ＋</button><span class="device-setting-value" data-trackball-value></span></div></section>' +
      '<section class="device-settings-card"><h4 data-device-pad-title>トラックパッド</h4><p data-device-pad-description>カーソル移動倍率を調整します。</p><div class="device-setting-actions"><button type="button" data-trackpad-step="-0.25">移動倍率 −</button><button type="button" data-trackpad-step="0">標準</button><button type="button" data-trackpad-step="0.25">移動倍率 ＋</button><span class="device-setting-value" data-trackpad-value></span></div></section>' +
      '<section class="device-settings-card device-settings-card-wide"><h4>オートマウスレイヤー</h4><p>トラックボール／トラックパッドが動いている間と、停止後の指定時間だけ指定レイヤーを保持します。</p><div class="device-setting-form"><label class="device-setting-checkbox"><input type="checkbox" data-auto-mouse-enabled aria-label="オートマウス ON/OFF">オートマウス ON / OFF</label><label>保持するレイヤー<select data-auto-mouse-layer><option value="0">Layer 0</option><option value="1">Layer 1</option><option value="2">Layer 2</option><option value="3">Layer 3</option></select></label><label>停止後の保持時間(ms)<input type="number" data-auto-mouse-timeout min="0" max="60000" step="10"></label></div></section>' +
      '<section class="device-settings-card device-settings-card-wide"><h4>スクロールモード</h4><p>下のボタンをキーへドラッグして割り当てると、押している間だけトラックボール／トラックパッドをスクロールモードにします。</p><button type="button" class="device-action-chip" draggable="true" data-scroll-hold-action>押している間だけスクロール</button><div class="device-setting-form"><label class="device-setting-checkbox"><input type="checkbox" data-scroll-diagonal>斜めスクロールを許可</label><label class="device-setting-checkbox"><input type="checkbox" data-scroll-axis-lock>明確な縦横入力を軸ロック</label><label>軸ロック判定<select data-scroll-axis-threshold><option value="1.5">弱め (1.5×)</option><option value="1.8">標準 (1.8×)</option><option value="2.2">強め (2.2×)</option><option value="3">かなり強め (3×)</option></select></label><label><span data-scroll-scale-label>スクロール量</span><input type="range" data-scroll-scale min="5" max="100" step="5"><span class="device-setting-value" data-scroll-scale-value></span></label><div class="device-setting-actions"><button type="button" data-scroll-divider-step="-1">分割 −</button><button type="button" data-scroll-divider-step="0">標準</button><button type="button" data-scroll-divider-step="1">分割 ＋</button><span class="device-setting-value" data-scroll-divider-value></span></div></div></section>' +
      '<p class="device-setting-note">値はJSONとこのブラウザーへ保存します。CPI・スクロール量・左右センサー配置はファームウェアのビルド設定です。自動スリープはWebアプリでは変更せず、ダウンロードZIP内のsleep-*フォルダから選択してください。公式ZMK Studioの標準RPCはキーマップ編集用です。</p>';
    var deviceActions = document.createElement('section');
    deviceActions.className = 'device-settings-card device-settings-card-wide device-action-palette';
    deviceActions.innerHTML = '<h4>デバイスアクション</h4><p>マウスボタン、ホイール、CPI、スクロールモードをキーへ割り当てます。</p><div class="palette-grid" data-device-actions></div>';
    devicePanel.insertBefore(deviceActions, devicePanel.firstChild);
    shellDeviceActions.forEach(function (name) { appendActionChip(deviceActions.querySelector('[data-device-actions]'), name, name, 'device-chip'); });
    palette.appendChild(devicePanel);
    var legacyProfilePanel = devicePanel.querySelector('[data-pointer-profile-title]');
    if (legacyProfilePanel && legacyProfilePanel.parentElement) legacyProfilePanel.parentElement.hidden = true;
    var modulePanel = document.createElement('section');
    modulePanel.className = 'device-settings-card device-settings-card-wide';
    modulePanel.innerHTML = '<h4 data-module-layout-title>モジュール配置</h4><p data-module-layout-description>左・右を個別に選択できます。ブランクのダミーモジュールは None を選んでください。</p><div class="device-setting-form module-selection-grid"><label><span data-left-module-label>左モジュール</span><select data-left-module><option value="trackpad">トラックパッド</option><option value="trackball">トラックボール</option><option value="none">None（ダミー）</option></select></label><label><span data-right-module-label>右モジュール</span><select data-right-module><option value="trackball">トラックボール</option><option value="trackpad">トラックパッド</option><option value="none">None（ダミー）</option></select></label></div>';
    devicePanel.insertBefore(modulePanel, devicePanel.firstChild);
    var encoderPanel = document.createElement('section');
    encoderPanel.className = 'device-settings-card device-settings-card-wide';
    encoderPanel.innerHTML = '<h4 data-encoder-title>ロータリーエンコーダー</h4><p>ロータリーエンコーダーは回転方向ごとにアクションを設定します。</p><p data-encoder-runtime-note>左右回転へ通常キーやデバイス操作を割り当て、JSONへ保存できます。現在のファームウェアのsensor-bindingsへ実機反映するには再ビルドが必要です。</p><div class="encoder-settings-grid"><fieldset><legend data-left-module-label>左モジュール</legend><label><span>反時計回り</span><select data-encoder-left-ccw><option value="scroll-left">左右スクロール（左）</option><option value="scroll-right">左右スクロール（右）</option><option value="scroll-up">上下スクロール（上）</option><option value="scroll-down">上下スクロール（下）</option><option value="none">未設定</option></select></label><label><span>時計回り</span><select data-encoder-left-cw><option value="scroll-right">左右スクロール（右）</option><option value="scroll-left">左右スクロール（左）</option><option value="scroll-up">上下スクロール（上）</option><option value="scroll-down">上下スクロール（下）</option><option value="none">未設定</option></select></label></fieldset><fieldset><legend data-right-module-label>右モジュール</legend><label><span>反時計回り</span><select data-encoder-right-ccw><option value="scroll-down">上下スクロール（下）</option><option value="scroll-up">上下スクロール（上）</option><option value="scroll-left">左右スクロール（左）</option><option value="scroll-right">左右スクロール（右）</option><option value="none">未設定</option></select></label><label><span>時計回り</span><select data-encoder-right-cw><option value="scroll-up">上下スクロール（上）</option><option value="scroll-down">上下スクロール（下）</option><option value="scroll-left">左右スクロール（左）</option><option value="scroll-right">左右スクロール（右）</option><option value="none">未設定</option></select></label></fieldset></div>';
    devicePanel.insertBefore(encoderPanel, modulePanel.nextSibling);
    var autoMouseCard = devicePanel.querySelector('[data-auto-mouse-enabled]');
    if (autoMouseCard && autoMouseCard.closest) autoMouseCard.closest('section').dataset.autoMouseCard = 'true';
    var scrollCard = devicePanel.querySelector('[data-scroll-diagonal]');
    if (scrollCard && scrollCard.closest) scrollCard.closest('section').dataset.scrollCard = 'true';

    var tabBar = document.createElement('div');
    tabBar.className = 'palette-tabs';
    var categories = [
      ['basic', 'BASIC'],
      ['functions', 'FUNCTIONS'],
      ['layer', 'LAYER'],
      ['device', 'DEVICE'],
      ['special', 'SPECIAL'],
      ['ascii', 'ASCII'],
      ['jis', '日本語/JIS'],
      ['tap-dance', 'TAP DANCE']
    ];
    categories.forEach(function (entry) {
      var tab = document.createElement('button');
      tab.type = 'button';
      tab.className = 'palette-tab';
      tab.textContent = entry[1];
      tab.dataset.paletteTab = entry[0];
      tab.setAttribute('aria-pressed', 'false');
      tab.addEventListener('click', function () { showPaletteCategory(entry[0]); });
      tabBar.appendChild(tab);
    });
    palette.insertBefore(tabBar, additions);

    var search = document.createElement('input');
    search.type = 'search';
    search.className = 'palette-search';
    search.placeholder = 'キーコードを検索';
    search.setAttribute('aria-label', 'キーコードを検索');
    search.addEventListener('input', function () {
      var query = search.value.trim().toLowerCase();
      palette.querySelectorAll('.chip').forEach(function (chip) {
        chip.style.display = !query || chip.textContent.toLowerCase().indexOf(query) >= 0 ? '' : 'none';
      });
    });
    tabBar.appendChild(search);

    function showPaletteCategory(category) {
      [basicDetail, jisDetail, functionsDetail, layerDetail, specialDetail, asciiDetail, tapDanceDetail, devicePanel].forEach(function (panel) {
        panel.style.display = panel.dataset.paletteCategory === category ? '' : 'none';
      });
      tabBar.querySelectorAll('[data-palette-tab]').forEach(function (tab) {
        tab.setAttribute('aria-pressed', String(tab.dataset.paletteTab === category));
      });
    }

    var deviceSettings = {
      pointerProfile: 'right-ball-left-pad',
      leftModule: 'trackpad',
      rightModule: 'trackball',
      encoderLeftCcw: 'scroll-left',
      encoderLeftCw: 'scroll-right',
      encoderRightCcw: 'scroll-down',
      encoderRightCw: 'scroll-up',
      trackballCpi: 200,
      trackpadScale: 1,
      autoMouseEnabled: true,
      autoMouseLayer: 1,
      autoMouseTimeoutMs: 300,
      scrollMode: 'hold',
      scrollDiagonal: true,
      scrollAxisLock: true,
      scrollAxisThreshold: 1.8,
      scrollDivider: 4,
      scrollScalePercent: 35
    };
    try {
      deviceSettings = validDeviceSettings(Object.assign(deviceSettings, JSON.parse(localStorage.getItem('sosho-device-settings-v1') || '{}')));
    } catch (error) {
      // Use the safe defaults when localStorage contains invalid data.
    }
    function saveDeviceSettings() {
      deviceSettings = validDeviceSettings(deviceSettings);
      try { localStorage.setItem('sosho-device-settings-v1', JSON.stringify(deviceSettings)); } catch (error) {}
      devicePanel.querySelector('[data-pointer-profile]').value = deviceSettings.pointerProfile;
      devicePanel.querySelector('[data-left-module]').value = deviceSettings.leftModule;
      devicePanel.querySelector('[data-right-module]').value = deviceSettings.rightModule;
      devicePanel.querySelector('[data-encoder-left-ccw]').value = deviceSettings.encoderLeftCcw;
      devicePanel.querySelector('[data-encoder-left-cw]').value = deviceSettings.encoderLeftCw;
      devicePanel.querySelector('[data-encoder-right-ccw]').value = deviceSettings.encoderRightCcw;
      devicePanel.querySelector('[data-encoder-right-cw]').value = deviceSettings.encoderRightCw;
      devicePanel.querySelector('[data-trackball-value]').textContent = deviceSettings.trackballCpi + ' CPI';
      devicePanel.querySelector('[data-trackpad-value]').textContent = deviceSettings.trackpadScale.toFixed(2) + '×';
      devicePanel.querySelector('[data-auto-mouse-enabled]').checked = deviceSettings.autoMouseEnabled;
      devicePanel.querySelector('[data-auto-mouse-layer]').value = String(deviceSettings.autoMouseLayer);
      devicePanel.querySelector('[data-auto-mouse-timeout]').value = String(deviceSettings.autoMouseTimeoutMs);
      devicePanel.querySelector('[data-scroll-diagonal]').checked = deviceSettings.scrollDiagonal;
      devicePanel.querySelector('[data-scroll-axis-lock]').checked = deviceSettings.scrollAxisLock;
      devicePanel.querySelector('[data-scroll-axis-threshold]').value = String(deviceSettings.scrollAxisThreshold);
      devicePanel.querySelector('[data-scroll-scale]').value = String(deviceSettings.scrollScalePercent);
      devicePanel.querySelector('[data-scroll-scale-value]').textContent = deviceSettings.scrollScalePercent + '%';
      devicePanel.querySelector('[data-scroll-divider-value]').textContent = '分割 ' + deviceSettings.scrollDivider;
      devicePanel.querySelector('[data-device-ball-title]').textContent = 'トラックボール';
      devicePanel.querySelector('[data-device-pad-title]').textContent = 'トラックパッド';
      if (typeof window.soshoRefreshPhysicalTitles === 'function') window.soshoRefreshPhysicalTitles(window.soshoCurrentCopy);
      if (typeof window.soshoRefreshDeviceMarkers === 'function') window.soshoRefreshDeviceMarkers(window.soshoCurrentCopy);
      document.querySelectorAll('.encoder-target').forEach(function (button) { renderEncoderAssignment(button, button.dataset.target); });
    }
    devicePanel.querySelector('[data-pointer-profile]').addEventListener('change', function (event) {
      deviceSettings.pointerProfile = event.target.value;
      saveDeviceSettings();
      createEncoderTargets();
    });
    ['left', 'right'].forEach(function (side) {
      devicePanel.querySelector('[data-' + side + '-module]').addEventListener('change', function (event) {
        deviceSettings[side + 'Module'] = event.target.value;
        saveDeviceSettings();
        createEncoderTargets();
      });
    });
    [['left', 'ccw'], ['left', 'cw'], ['right', 'ccw'], ['right', 'cw']].forEach(function (entry) {
      var field = 'encoder' + entry[0].charAt(0).toUpperCase() + entry[0].slice(1) + entry[1].charAt(0).toUpperCase() + entry[1].slice(1);
      devicePanel.querySelector('[data-encoder-' + entry[0] + '-' + entry[1] + ']').addEventListener('change', function (event) {
        deviceSettings[field] = event.target.value;
        saveDeviceSettings();
        createEncoderTargets();
      });
    });
    devicePanel.querySelectorAll('[data-trackball-step]').forEach(function (button) {
      button.addEventListener('click', function () {
        var step = Number(button.dataset.trackballStep);
        deviceSettings.trackballCpi = step === 0 ? 600 : Math.max(200, Math.min(1200, deviceSettings.trackballCpi + step));
        saveDeviceSettings();
      });
    });
    devicePanel.querySelectorAll('[data-trackpad-step]').forEach(function (button) {
      button.addEventListener('click', function () {
        var step = Number(button.dataset.trackpadStep);
        deviceSettings.trackpadScale = step === 0 ? 1 : Math.max(.5, Math.min(2, Number((deviceSettings.trackpadScale + step).toFixed(2))));
        saveDeviceSettings();
      });
    });
    devicePanel.querySelector('[data-auto-mouse-enabled]').addEventListener('change', function (event) {
      deviceSettings.autoMouseEnabled = event.target.checked;
      saveDeviceSettings();
    });
    devicePanel.querySelector('[data-auto-mouse-layer]').addEventListener('change', function (event) {
      deviceSettings.autoMouseLayer = Number(event.target.value);
      saveDeviceSettings();
    });
    devicePanel.querySelector('[data-auto-mouse-timeout]').addEventListener('change', function (event) {
      deviceSettings.autoMouseTimeoutMs = Number(event.target.value);
      saveDeviceSettings();
    });
    devicePanel.querySelector('[data-scroll-diagonal]').addEventListener('change', function (event) {
      deviceSettings.scrollDiagonal = event.target.checked;
      saveDeviceSettings();
    });
    devicePanel.querySelector('[data-scroll-axis-lock]').addEventListener('change', function (event) {
      deviceSettings.scrollAxisLock = event.target.checked;
      saveDeviceSettings();
    });
    devicePanel.querySelector('[data-scroll-axis-threshold]').addEventListener('change', function (event) {
      deviceSettings.scrollAxisThreshold = Number(event.target.value);
      saveDeviceSettings();
    });
    devicePanel.querySelector('[data-scroll-scale]').addEventListener('input', function (event) {
      deviceSettings.scrollScalePercent = Number(event.target.value);
      saveDeviceSettings();
    });
    devicePanel.querySelectorAll('[data-scroll-divider-step]').forEach(function (button) {
      button.addEventListener('click', function () {
        var step = Number(button.dataset.scrollDividerStep);
        deviceSettings.scrollDivider = step === 0 ? 4 : Math.max(1, Math.min(16, deviceSettings.scrollDivider + step));
        saveDeviceSettings();
      });
    });
    var scrollHoldAction = devicePanel.querySelector('[data-scroll-hold-action]');
    scrollHoldAction.addEventListener('dragstart', function (event) {
      event.dataTransfer.setData('text/plain', 'action:SCROLL_HOLD');
    });
    window.soshoDeviceSettings = {
      get: function () { return Object.assign({}, deviceSettings); },
      setEncoder: function (side, direction, value) {
        var field = 'encoder' + String(side).charAt(0).toUpperCase() + String(side).slice(1) + String(direction).charAt(0).toUpperCase() + String(direction).slice(1);
        if (Object.prototype.hasOwnProperty.call(deviceSettings, field)) {
          deviceSettings[field] = value;
          saveDeviceSettings();
        }
      }
    };
    saveDeviceSettings();
    showPaletteCategory('basic');
  }

  function readAssignments() {
    try { return JSON.parse(localStorage.getItem('sosho-local-keymap-v1') || '{}') || {}; } catch (error) { return {}; }
  }

  function writeAssignments(assignments) {
    try { localStorage.setItem('sosho-local-keymap-v1', JSON.stringify(assignments)); } catch (error) {}
  }

  function activeLayerIndex() {
    var buttons = document.querySelectorAll('.layer-button');
    for (var i = 0; i < buttons.length; i++) if (buttons[i].getAttribute('aria-pressed') === 'true') return i;
    return 0;
  }

  function updateInspector(target, value) {
    var position = document.getElementById('selected-position');
    var action = document.getElementById('selected-action');
    if (position) position.textContent = textFor(storedLanguage(), 'selectedPosition') + ': ' + target;
    if (action) action.textContent = value || textFor(storedLanguage(), 'unassignedLegend');
  }

  function createEncoderTargets() {
    var layer = activeLayerIndex();
    var changed = false;
    document.querySelectorAll('#keyboard .half').forEach(function (half) {
      var existing = half.querySelector('.encoder-cluster');
      if (existing && existing.dataset.layer === String(layer)) return;
      if (existing) existing.remove();
      var oldMarker = half.querySelector('.device-marker');
      if (oldMarker) oldMarker.remove();
      changed = true;
      var side = half.classList.contains('left') ? 'left' : 'right';
      var cluster = document.createElement('div');
      cluster.className = 'encoder-cluster';
      cluster.dataset.layer = String(layer);
      cluster.innerHTML = '<span class="encoder-title">ロータリーエンコーダー</span>';
      [['ccw', '↺ 左回転'], ['cw', '↻ 右回転']].forEach(function (entry) {
        var target = 'l' + layer + '-' + side + '-encoder-' + entry[0];
        var button = document.createElement('button');
        button.type = 'button';
        button.className = 'encoder-target';
        button.dataset.target = target;
        button.innerHTML = entry[1] + '<span class="encoder-assignment"></span>';
        button.addEventListener('click', function () {
          var assignments = readAssignments();
          updateInspector(target, assignments[target] || encoderSetting(side, entry[0]));
          if (typeof window.soshoOpenKeyPopover === 'function') window.soshoOpenKeyPopover(target);
        });
        button.addEventListener('dragover', function (event) {
          event.preventDefault();
          button.classList.add('drop-ready');
        });
        button.addEventListener('dragleave', function () { button.classList.remove('drop-ready'); });
        button.addEventListener('drop', function (event) {
          event.preventDefault();
          button.classList.remove('drop-ready');
          var data = event.dataTransfer.getData('text/plain');
          var assignments = readAssignments();
          var action = data.indexOf('action:') === 0 ? data.slice(7) : data.indexOf('macro:') === 0 ? 'Macro ' + data.slice(6) : '';
          if (action) {
            assignments[target] = action;
            writeAssignments(assignments);
          } else {
            delete assignments[target];
            writeAssignments(assignments);
          }
          renderEncoderAssignment(button, target);
          updateInspector(target, action || assignments[target] || encoderSetting(side, entry[0]));
        });
        cluster.appendChild(button);
        renderEncoderAssignment(button, target);
      });
      half.appendChild(cluster);

      var marker = document.createElement('div');
      marker.className = 'device-marker';
      marker.dataset.deviceMarkerSide = side;
      marker.innerHTML = '<strong></strong><span></span>';
      half.appendChild(marker);
    });
    if (changed && typeof window.soshoRefreshDeviceMarkers === 'function') window.soshoRefreshDeviceMarkers();
  }

  function encoderSetting(side, direction) {
    var settings = window.soshoDeviceSettings && typeof window.soshoDeviceSettings.get === 'function' ? window.soshoDeviceSettings.get() : {};
    var field = 'encoder' + String(side).charAt(0).toUpperCase() + String(side).slice(1) + String(direction).charAt(0).toUpperCase() + String(direction).slice(1);
    return settings[field] || '未設定';
  }

  function renderEncoderAssignment(button, target) {
    var assignments = readAssignments();
    var value = button.querySelector('.encoder-assignment');
    var match = /^l\d+-(left|right)-encoder-(ccw|cw)$/.exec(target);
    var loaded = !window.soshoEditor || typeof window.soshoEditor.isKeymapLoaded !== 'function' || window.soshoEditor.isKeymapLoaded();
    if (value) value.textContent = loaded ? (assignments[target] || (match ? encoderActionLabel(encoderSetting(match[1], match[2])) : '未設定')) : '';
  }

  function encoderActionLabel(value) {
    return ({ 'scroll-up': 'Wheel Up', 'scroll-down': 'Wheel Down', 'scroll-left': 'Wheel Left', 'scroll-right': 'Wheel Right', none: '未設定' })[value] || value || '未設定';
  }

  window.soshoRefreshEncoderTargets = function () {
    document.querySelectorAll('.encoder-target').forEach(function (button) { renderEncoderAssignment(button, button.dataset.target); });
  };

  function setupZmkStudioShell() {
    var app = document.querySelector('.app');
    var topbar = document.querySelector('.topbar');
    var workspace = document.querySelector('.workspace');
    if (!app || !topbar || !workspace || topbar.dataset.studioShellReady === 'true') return;

    topbar.dataset.studioShellReady = 'true';
    document.title = 'SO-SHO キーマップエディター';

    var connectionActions = document.querySelector('.connection-actions');
    var connectButton = document.getElementById('connect-usb');
    var reconnectButton = document.getElementById('connect-usb-authorized');
    var disconnectButton = document.getElementById('disconnect');
    var connectionStatus = document.getElementById('connection-status');
    var connectionSection = document.querySelector('.connection');
    var connectionLog = document.querySelector('.connection-log');
    var writeCard = document.querySelector('.write-card');
    var noticeCard = document.querySelector('.notice');
    var downloadCard = document.querySelector('.download-card');

    if (connectButton) connectButton.textContent = 'USB接続';
    if (reconnectButton) reconnectButton.textContent = '再接続';
    if (disconnectButton) disconnectButton.textContent = '切断';

    topbar.innerHTML = '' +
      '<div class="studio-shell-left" aria-label="ZMK Studio">' +
        '<span class="studio-logo" aria-hidden="true">ZMK</span>' +
        '<span class="studio-wordmark">Studio</span>' +
      '</div>' +
      '<div class="studio-device-menu" role="status" aria-live="polite" aria-label="接続デバイス">' +
        '<span class="studio-device-name">sosho</span>' +
        '<span class="studio-device-state"><i></i><span data-studio-device-state>USB未接続</span></span>' +
      '</div>' +
      '<div class="studio-shell-actions" aria-label="Studio操作"></div>';

    var shellActions = topbar.querySelector('.studio-shell-actions');
    function addHeaderAction(label, title, handler, disabled) {
      var button = document.createElement('button');
      button.type = 'button';
      button.className = 'studio-icon-button';
      button.title = title;
      button.setAttribute('aria-label', title);
      button.textContent = label;
      button.disabled = Boolean(disabled);
      if (handler) button.addEventListener('click', handler);
      shellActions.appendChild(button);
      return button;
    }
    addHeaderAction('↶', 'Undo（この版では未実装）', null, true);
    addHeaderAction('↷', 'Redo（この版では未実装）', null, true);
    var saveButton = addHeaderAction('保存', 'キーマップをUSBへ保存', function () {
      var write = document.getElementById('write-keymap');
      if (write) write.click();
    });
    saveButton.classList.add('studio-primary-action');
    addHeaderAction('破棄', '未保存の編集をデフォルトへ戻す', function () {
      var reset = document.getElementById('reset');
      if (reset) reset.click();
    });
    if (connectionActions) {
      connectionActions.classList.add('studio-connection-actions');
      shellActions.appendChild(connectionActions);
    }
    installLanguagePicker(shellActions);

    var diagnostics = document.createElement('details');
    diagnostics.className = 'studio-diagnostics';
    diagnostics.open = false;
    diagnostics.innerHTML = '<summary>デバイス・ファームウェア・診断</summary><div class="studio-diagnostics-body"></div>';
    var diagnosticsBody = diagnostics.querySelector('.studio-diagnostics-body');
    /* The connection guidance banner is redundant in the Studio shell. */
    if (noticeCard) noticeCard.remove();
    [connectionSection, connectionLog, writeCard].forEach(function (element) {
      if (element && element !== diagnostics) diagnosticsBody.appendChild(element);
    });
    topbar.insertAdjacentElement('afterend', diagnostics);
    if (downloadCard) workspace.insertAdjacentElement('beforebegin', downloadCard);
    setupBootloaderWriter();

    var sidebar = document.createElement('aside');
    sidebar.className = 'studio-sidebar';
    sidebar.setAttribute('aria-label', 'キーマップナビゲーション');
    sidebar.innerHTML = '<div class="studio-sidebar-heading">配列:</div><div class="studio-layout-name">sosho</div><div class="studio-sidebar-heading studio-layers-heading">レイヤー:</div><div class="studio-layer-controls"><span>レイヤー</span><button type="button" data-studio-layer-minus aria-label="レイヤー数を減らす">−</button><button type="button" data-studio-layer-plus aria-label="レイヤー数を増やす">＋</button></div><div class="studio-sidebar-content"></div>';
    var sidebarContent = sidebar.querySelector('.studio-sidebar-content');
    var layoutSelector = document.querySelector('.layout-selector');
    var layerPanel = document.getElementById('layer-panel');
    if (layoutSelector) sidebarContent.appendChild(layoutSelector);
    if (layerPanel) sidebarContent.appendChild(layerPanel);
    workspace.insertBefore(sidebar, workspace.firstChild);

    var editor = workspace.querySelector('.editor');
    if (editor) {
      editor.dataset.studioEditor = 'true';
      var heading = editor.querySelector('.editor-heading-row');
      if (heading) heading.setAttribute('hidden', 'hidden');
      var zoom = document.createElement('label');
      zoom.className = 'studio-zoom-control';
      zoom.innerHTML = 'ズーム <select aria-label="キーボード表示倍率"><option>Auto</option><option>90%</option><option>110%</option><option>125%</option></select>';
      editor.insertBefore(zoom, editor.querySelector('#keyboard'));
    }

    var footer = document.createElement('footer');
    footer.className = 'studio-footer';
    footer.innerHTML = '© 2024 - The ZMK Contributors · <a href="https://zmk.dev/docs/features/studio" target="_blank" rel="noopener">ZMK Studio公式ドキュメント</a> · <a href="https://github.com/zmkfirmware/zmk-studio/blob/main/LICENSE" target="_blank" rel="noopener">ライセンス</a>';
    app.appendChild(footer);

    var stateNode = topbar.querySelector('[data-studio-device-state]');
    function syncState() {
      if (!stateNode) return;
      var text = connectionStatus ? connectionStatus.textContent : '未接続';
      var connected = /^USB接続済み/.test(text) || text === '接続済み';
      stateNode.textContent = connected ? 'USB接続済み' : '未接続';
      topbar.classList.toggle('studio-connected', connected);
    }
    if (connectionStatus && typeof MutationObserver === 'function') {
      new MutationObserver(syncState).observe(connectionStatus, { childList: true, characterData: true, subtree: true });
    }
    syncState();

    var minus = sidebar.querySelector('[data-studio-layer-minus]');
    var plus = sidebar.querySelector('[data-studio-layer-plus]');
    function setLayerCountMessage(message) {
      var layerDescription = document.querySelector('.layer-description');
      if (layerDescription && message) layerDescription.dataset.studioMessage = message;
    }
    if (minus) minus.addEventListener('click', function () { setLayerCountMessage('レイヤー数はファームウェア定義のため、このUIでは固定です。'); });
    if (plus) plus.addEventListener('click', function () { setLayerCountMessage('レイヤー数はファームウェア定義のため、このUIでは固定です。'); });
  }

  var keyboard = document.getElementById('keyboard');
  if (keyboard && typeof MutationObserver === 'function') {
    var encoderObserverQueued = false;
    var observer = new MutationObserver(function () {
      if (encoderObserverQueued) return;
      encoderObserverQueued = true;
      window.setTimeout(function () {
        encoderObserverQueued = false;
        createEncoderTargets();
      }, 0);
    });
    observer.observe(keyboard, { childList: true, subtree: true });
  }
  createEncoderTargets();
  setupZmkStudioShell();
  applyLanguage(storedLanguage());
})();
