# SO-SHO wireless editor

非公開のブラウザー編集画面です。想定する日常構成は、右Central側がトラックボール、左Peripheral側がトラックパッドです。

## できること

- 物理位置を選択して、通常アクションをクリックまたはドラッグ＆ドロップで割り当てる
- キー、修飾キー、MOレイヤー操作、Bluetooth操作の候補を選ぶ
- マクロを作成・改名・削除し、レイヤーと物理位置へ割り当てる
- マクロ手順を `KEY|MODE|WAIT_MS` で編集する。MODEは `tap` / `press` / `release`、待ち時間は整数ミリ秒で保存する
- すべての編集値をブラウザーのlocalStorageへ保存する

## マクロの反映範囲

現在の画面はマクロ定義をBLE/USBへ送信しません。公式Studio keymap schemaにはマクロ定義の作成・編集・削除RPCが確認できないため、未検証のpayloadは実機へ送らない設計です。

実機で動かすには、ZMKのcompile-time macro behaviorをkeymapへ定義し、対象ファームウェアをビルドして書き込む必要があります。ZMKの公式macro behaviorはtap / press / release、wait-ms、tap-ms、pause-for-releaseを扱えます。

待ち時間はUIで `0` から `4294967295` までの整数として正規化します。ZMK側の型は `uint32_t` です。公式ドキュメントはBLEのキー列で30ms以上のwait/tapを推奨し、既定値はwait 15ms、tap 30ms、キュー既定値は64です。実際のキー順序や体感はビルド後に検証が必要です。

## 接続とStudio

- BLEはWeb Bluetooth、USBはWeb Serialの接続UIを備える
- HTTPSまたはlocalhost、Chrome/Edge、ユーザー操作による接続許可が必要
- 初回はStudio対応ファームウェアをUSBで一度書き込む必要がある
- キーボード側の `studio_unlock` を実行してからStudio接続を試す
- BLE接続とStudio RPC応答は、この画面では実機未検証。keymap read/writeボタンは検証完了まで無効

## 検証と公開の受け入れ条件

1. GitHub Actionsで右Centralトラックボール / 左Peripheralトラックパッドのビルド成果物を確認する
2. USBで初回導入し、Studio unlock、BLE接続、実機の読み書き応答を確認する
3. マクロをZMK側へ定義して再ビルドし、tap / press / release、待ち時間、レイヤー操作、Bluetooth操作を確認する
4. 不具合時は直前のUF2へ戻せることを確認する

このリポジトリは確認が終わるまで非公開のままです。物理キーボードの操作や再フラッシュはこの編集作業では行いません。
