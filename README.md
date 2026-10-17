# sosho

sosho は Remap のような ZMK エディタを目指す、最初の非公開ブラウザプロトタイプです。

## 現在できること

- キーボードを画面上で確認し、キー位置を選択
- アクションパレットをクリック、またはキーへドラッグ＆ドロップして割り当て
- 割り当てをブラウザーの localStorage に保存
- ローカルマップをリセット
- Web SerialでUSBデバイスを選択し、ZMK Studioフレームを受信

編集内容はブラウザー内だけで扱います。USB書き込みは現在行いません。

## USB書き込みフロー（現在は安全な未対応表示）

- 公式ZMK Studio protocolのフレーム（0xAB / 0xAC / 0xAD）、送信フレーム化、受信フレーム通知、応答待ちとタイムアウトの土台を実装しています。
- unlockとkeymap RPCのprotobufエンコーダーは未検証です。推測したpayloadは送信せず、「USBへ書き込む」は未接続時または未対応時に拒否します。
- 成功表示は、公式のデバイス応答を検証できる実装が追加された場合だけ行う想定です。現在は実機への書き込みを行いません。
- 実機検証、公式生成protobuf clientの導入、unlock/keymap RPCの厳密な実装は別途必要です。

## 使い方

1. HTTPS（GitHub Pages）でページを開き、「Connect USB device」を押してデバイスを選択します。
2. 受信フレーム表示と接続状態を確認します。
3. 「USBへ書き込む」は、現在は未対応表示になり、payloadを送信しません。

## 次のフェーズ

- 公式生成protobuf clientによるRPC実装
- キーボード側のStudio Unlock Behaviorを含むunlock手順の実機検証
- keymap変更、デバイス応答検証、BLE対応
- GitHub Actions によるビルドとマクロ対応

公式プロトコル: [ZMK Studio RPC protocol](https://github.com/zmkfirmware/zmk/blob/main/docs/docs/development/studio-rpc-protocol.md)
