# sosho

SO-SHO向けの非公開ブラウザエディタです。想定する物理構成は、右側 = Central / トラックボール、左側 = Peripheral / トラックパッドです。

## 実装済み

- SO-SHO 44キー、4レイヤーのレイアウト確認とローカル編集
- キーマップ割り当てとマクロのブラウザー localStorage 保存
- 既存のUSB Web Serial接続とZMK Studioフレーム受信を維持
- Web Bluetooth GATT transportを追加
- BLE接続、切断、再接続、受信通知、フレーム送信、タイムアウト、状態表示

BLEは公式Studio GATT UUIDを使用します。

- Service: 00000000-0196-6107-c967-c5cfb1c2482a
- Characteristic: 00000001-0196-6107-c967-c5cfb1c2482a

BLEのrequestDevice()は「BLE接続」ボタンを押したユーザー操作からだけ呼び出します。USB経路は削除していません。

## BLEの前提

GitHub PagesなどのHTTPS、またはlocalhostでChrome/Edgeを使用してください。ブラウザーのデバイス選択画面でキーボードを許可し、ファームウェア側でBLE GATT Studio transportが有効になっている必要があります。初回のファームウェア導入には一度USBフラッシュが必要です。接続後はキーボード側のstudio_unlock bindingを実行してください。

## キーマップRPCの状態

公式のフレーム方式と、studio.proto / keymap.proto の構造は確認済みです。ただし、実機からのkeymap read/write応答、protobufの実装、unlock後の動作はまだ検証できていません。そのため「キーマップを読む」「変更を保存」「USBへ送信」は無効化し、推測したpayloadは送信しません。現時点のBLE/USB実装は transport 段階です。

マクロのRPCは実装しておらず、マクロはブラウザー内だけに保存されます。

## 操作上の注意

紫色の□は物理位置の凡例が未確定なキーです。自動的にBackspaceなどへ割り当てません。位置を変更する場合はページの行・列インスペクターを確認してください。

## 公式資料

- [ZMK Studio RPC protocol](https://github.com/zmkfirmware/zmk/blob/main/docs/docs/development/studio-rpc-protocol.md)
- [studio.proto](https://github.com/zmkfirmware/zmk-studio-messages/blob/main/proto/zmk/studio.proto)
- [keymap.proto](https://github.com/zmkfirmware/zmk-studio-messages/blob/main/proto/zmk/keymap.proto)

このリポジトリの更新では、物理キーボードの操作や再フラッシュは行っていません。
