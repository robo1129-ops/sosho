# SO-SHO wireless editor

公開済みのブラウザー編集画面です。想定する日常構成は、右Central側がトラックボール、左Peripheral側がトラックパッドです。

## できること

- 物理位置を選択して、通常アクションをクリックまたはドラッグ＆ドロップで割り当てる
- キー、修飾キー、MOレイヤー操作、Bluetooth操作の候補を選ぶ
- マクロを作成・改名・削除し、レイヤーと物理位置へ割り当てる
- マクロ手順を `KEY|MODE|WAIT_MS` で編集する。MODEは `tap` / `press` / `release`、待ち時間は整数ミリ秒で保存する
- 編集値をブラウザーのlocalStorageへ保存する
- BLE接続後、専用サービスへマクロを保存・読み戻し・実行する

## マクロの反映範囲

公式Studio keymap schemaにはマクロ定義の作成・編集・削除RPCがないため、`sosho-firmware`に専用BLE GATTサービスを実装しています。初回だけBLE対応版ファームウェアをUSBで導入し、その後のマクロ編集はWeb Bluetoothから実行時に保存するため、編集のたびの再ビルドは不要です。

マクロは最大8個、各マクロ最大8ステップです。手順は `KEY|MODE|WAIT_MS`、MODEは `tap` / `press` / `release`、待ち時間は0〜60000ミリ秒です。保存にはバージョン、長さ、CRC、応答ステータス、暗号化BLEリンクを使い、ファームウェアのZephyr Settingsへ保存します。MIDIは対象外です。

## 接続とStudio

- BLEはWeb Bluetooth、USBはWeb Serialの接続UIを備える
- HTTPSまたはlocalhost、Chrome/Edge、ユーザー操作による接続許可が必要
- 初回はStudio対応ファームウェアをUSBで一度書き込む必要がある
- キーボード側の `studio_unlock` を実行してからStudio接続を試す
- BLE接続後に、マクロサービスの検出、暗号化リンク、送信・読み戻し・実行の状態を表示する
- 公式Studio keymap RPCは、未検証のpayloadを送信しないため対象外

## 検証と公開の受け入れ条件

1. GitHub Actionsで右Centralトラックボール / 左Peripheralトラックパッドのビルド成果物を確認する
2. USBで初回導入し、Bluetoothペアリングと暗号化BLE接続を確認する
3. Web editorからマクロを保存、読み戻し、実行し、電源再投入後も保持されることを確認する
4. 不具合時は直前のUF2へ戻せることを確認する

ソース変更とActionsビルド以外の物理キーボード操作、ペアリング、再フラッシュはこの編集作業では行っていません。実機でのBLE動作確認は初回ファームウェア導入後に必要です。
