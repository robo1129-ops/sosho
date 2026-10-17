# sosho

SO-SHOの物理配置を確認しながら編集できる、非公開ブラウザプロトタイプです。

## 現在できること

- SO-SHO左右分割、各22キー、列スタガー、下段スクエア領域を表示
- Layer 0〜3の切り替え
- アクションパレットのクリック、キーへのドラッグ＆ドロップ
- キーマップ割り当てをlocalStorageへ保存、ローカルリセット
- Web SerialでUSBデバイスを選択し、ZMK Studioのフレーム受信を表示
- 明示的なUSB書き込みボタン。ただし未検証のRPCは送信せず安全に拒否
- ローカルマクロの名前、順序付きキー列、各ステップの待ち時間をlocalStorageへ保存・編集・削除

## USB書き込みの現状

公式プロトコルのフレーミングとcore/keymap protobufスキーマは確認済みです。フレームはZMK StudioのSoF 0xAB、エスケープ0xAC、EoF 0xAD方式で受信します。

ZMK Studioのunlockはキーボード側のStudio Unlock Behaviorを物理キーまたはコンボで実行する設計です。ページからのunlock RPCは確認できず、keymap更新RPCのbehavior bindingと実機応答も未検証です。そのため現在は通信と応答待ちの安全な土台だけを提供し、writeKeymapはunsupportedを返して推測したpayloadを送信しません。

公式keymap.protoにマクロRPCはないため、マクロはlocalStorage専用でUSB書き込み対象外です。実機接続・USB書き込みは未検証です。

## 使い方

1. index.htmlをWeb Serial対応ブラウザーで開く
2. 実機検証時のみConnect USB deviceでデバイスを選択する
3. レイヤーとキーを編集し、必要ならローカルマクロを追加・保存する
4. USBへ書き込むを明示的に押す。現状は未検証RPCとして送信されません

公式資料:

- [ZMK Studio RPC protocol](https://github.com/zmkfirmware/zmk/blob/main/docs/docs/development/studio-rpc-protocol.md)
- [zmk-studio-messages studio.proto](https://github.com/zmkfirmware/zmk-studio-messages/blob/main/proto/zmk/studio.proto)
- [zmk-studio-messages keymap.proto](https://github.com/zmkfirmware/zmk-studio-messages/blob/main/proto/zmk/keymap.proto)
- [ZMK Studio UnlockModal](https://github.com/zmkfirmware/zmk-studio/blob/main/src/UnlockModal.tsx)
