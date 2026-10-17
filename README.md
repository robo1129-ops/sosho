# sosho

sosho は Remap のような ZMK エディタを目指す、最初の非公開ブラウザプロトタイプです。

## 現在できること

- キーボードを画面上で確認し、キー位置を選択
- アクションパレットをクリック、またはキーへドラッグ＆ドロップして割り当て
- 割り当てをブラウザーの localStorage に保存
- ローカルマップをリセット

この段階ではデバイス接続はありません。編集内容はブラウザー内だけで扱います。

## Current communication milestone

USBデバイスの選択と、ZMK Studioのフレーミングを受信する通信層をブラウザー上に scaffold しました。現時点ではデバイスへの書き込みやunlockは行いません。次は公式protobufメッセージ、unlock処理、キーマップの読み書きを実装し、その後BLE対応へ進みます。

このページは HTTPS（GitHub Pages）で配信する必要があり、利用時にはブラウザーのUSBアクセス許可を与えてください。

## 次のフェーズ

- Web Serial / Web Bluetooth と公式 ZMK Studio プロトコルによる通信
- unlock 処理
- GitHub Actions によるビルド
- マクロ対応

公式プロトコル: [ZMK Studio RPC protocol](https://github.com/zmkfirmware/zmk/blob/main/docs/docs/development/studio-rpc-protocol.md)
