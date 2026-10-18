# SO-SHO wireless editor

公開済みのブラウザー編集画面です。想定する日常構成は、右Central側がトラックボール、左Peripheral側がトラックパッドです。

## できること

- 物理位置を選択して、通常アクションをクリックまたはドラッグ＆ドロップで割り当てる
- キー、修飾キー、MOレイヤー操作、Bluetooth操作の候補を選ぶ
- マクロを作成・改名・削除し、レイヤーと物理位置へ割り当てる
- Remap風のMACROカード一覧（Macro 0〜15）から、右下の鉛筆ボタンで1件ずつ編集画面を開く
- マクロカード自体を実機配列のキーへドラッグして割り当てる
- キーマップ下部のパレットをBASIC / FUNCTIONS / LAYER / DEVICE / SPECIAL / ASCII / 日本語JIS / TAP DANCEに切り替え、検索してクリックまたはドラッグで割り当てる
- パレットのクリックは選択表示、実際の割り当てはRemapと同じドラッグ＆ドロップ。キーをクリックすると「キー / ホールド・タップ / カスタム」編集ポップオーバーを開く
- マクロ編集欄へキーコードをドラッグ、またはテキストを直接入力し、Macro 0〜15・動的マクロ操作・残りバイト数を確認できる
- A〜Z、数字、記号、かな/英数/変換/無変換などの日本語JISキーをドラッグ＆ドロップで割り当てる
- 1回/2回/3回/ホールドを持つタップダンス定義を作成し、キーへドラッグして保存する
- 右モジュール・左モジュールそれぞれのロータリーエンコーダー（左回転/右回転）へアクションやマクロをドラッグして割り当てる
- DEVICEタブから右トラックボールのCPIと左トラックパッドの移動倍率を調整する
- DEVICEタブからトラックボールのCPI上下、トラックパッドの移動倍率上下、オートマウス層、停止後タイムアウトを設定する
- DEVICEタブの「押している間だけスクロール」をキーへドラッグし、斜めスクロール、明確な縦横の軸ロック、スクロール分割を設定する
- マクロ手順を `KEY|MODE|WAIT_MS` で編集する。MODEは `tap` / `press` / `release`、待ち時間は整数ミリ秒で保存する
- 編集値をブラウザーのlocalStorageへ保存する
- キーマップ、マクロ、タップダンス、デバイス設定を1つのJSONファイルとしてダウンロード／読み込みする
- マクロ作成用のキーをドラッグして手順へ追加し、Shift＋Sなどの修飾キー組み合わせを作る。追加操作の待ち時間は初期1msで、手順ごとに変更する
- BLE接続後、専用サービスへマクロを保存・読み戻し・実行する

## ファームウェアのダウンロード

- [全パターン入りの最新ZIP](https://github.com/robo1129-ops/sosho-firmware/releases/download/latest/sosho-firmware-latest.zip)
- [ビルド履歴とZIP生成](https://github.com/robo1129-ops/sosho-firmware/actions/workflows/package-firmware.yml)

ZIPには、右/左のトラックボール・トラックパッド構成と `settings_reset` を含む全5イメージが入ります。通常構成は右Centralトラックボール + 左Peripheralトラックパッドです。

Webページの「カスタムファームウェアZIPを直接ダウンロード」または「最新ZIPをダウンロード」から、同じリリースZIPを直接取得できます。

キーマップ画面は `sosho.layout.json` / `sosho-layouts.dtsi` の実機配置に合わせ、左右各22キーの12列×4行で表示します。最下段は左右それぞれ外側2列・内側2列にキーを置き、中央の2列分の空きを実機どおりに表現します。左右のロータリーエンコーダーと、左トラックパッド/右トラックボールの位置も各モジュール内に表示します。

ロータリーエンコーダーへの割り当てとDEVICEタブの数値は、現在ブラウザーの編集状態として保存されます。実機のエンコーダー入力とCPI/移動倍率へ反映するには、対応するZMKのセンサー割り当て・デバイス設定通信を有効にしたファームウェアが必要です。未反映の値を反映済みとは表示しません。

オートマウスは、ポインティングデバイスの移動中と停止後の設定時間だけ指定レイヤーを保持する設定モデルです。スクロールは押下中だけ有効にするアクションを用意し、斜め入力を許可しつつ、縦または横が明確な入力は軸ロックするしきい値を設定できます。これらはKeyballのオートマウス層、スクロールモード、軸方向判定の考え方を参考にしています。現在のWebページは設定をJSON/localStorageへ保存しますが、実機へ適用するには同じ設定を受け取るファームウェア側の実装が必要です。

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

参考実装: [Keyball keycodes](https://github.com/Yowkees/keyball/blob/main/qmk_firmware/keyboards/keyball/lib/keyball/keycodes.md)、[Keyball firmware implementation](https://github.com/Yowkees/keyball/blob/main/qmk_firmware/keyboards/keyball/lib/keyball/keyball.c)

## BLE検出について

BLE検出はGATTサービスUUIDだけに限定せず、`sosho` / `soho` / `SO-SHO` / `SOHO` / `ZMK` のデバイス名プレフィックスも対象にしています。対応ブラウザーでは、このページへ許可済みのデバイスへの再接続も試みます。

WindowsのBluetooth設定でペアリング済みでも、Web Bluetoothから利用するには、キーボードがBLE広告中であることと、ブラウザー側の接続許可が必要です。今回の調整はWebアプリ側だけで行い、ファームウェアは変更していません。

## 検証と公開の受け入れ条件

1. GitHub Actionsで右Centralトラックボール / 左Peripheralトラックパッドのビルド成果物を確認する
2. USBで初回導入し、Bluetoothペアリングと暗号化BLE接続を確認する
3. Web editorからマクロを保存、読み戻し、実行し、電源再投入後も保持されることを確認する
4. 不具合時は直前のUF2へ戻せることを確認する

ソース変更とActionsビルド以外の物理キーボード操作、ペアリング、再フラッシュはこの編集作業では行っていません。実機でのBLE動作確認は初回ファームウェア導入後に必要です。
