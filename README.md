# sosho

sosho は Remap のような ZMK エディタを目指す、最初の非公開ブラウザプロトタイプです。

## 現在できること

- キーボードを画面上で確認し、キー位置を選択
- アクションパレットをクリック、またはキーへドラッグ＆ドロップして割り当て
- 割り当てをブラウザーの localStorage に保存
- ローカルマップをリセット

この段階ではデバイス接続はありません。編集内容はブラウザー内だけで扱います。

## 次のフェーズ

1. Web Serial / Web Bluetooth と公式 ZMK Studio プロトコルによる通信
2. unlock 処理
3. GitHub Actions によるビルド
4. マクロ対応

公式プロトコル: [ZMK Studio RPC protocol](https://github.com/zmkfirmware/zmk/blob/main/docs/docs/development/studio-rpc-protocol.md)
