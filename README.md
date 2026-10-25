# SO-SHO USB keymap editor

公開済みのブラウザー編集画面です。右CentralをUSB接続してキーマップを編集します。PCとのBLE編集は使用せず、左右分割間の通信だけファームウェア側で維持します。

## ZMK Studioベースの画面構成

画面の基本構成は、公開されている公式ZMK Studioの実装と画面を参考にしています。ヘッダー、デバイス表示、Undo/Redo・保存・破棄の操作列、左側のレイヤー一覧、中央のキーボード編集領域、診断パネル、フッターの配置をSO-SHO向けに組み込みました。SO-SHO固有の44キー配列、左右のロータリーエンコーダー、USB/RPC、JSON、マクロ、トラックパッド／トラックボール設定は既存機能として保持しています。

公式ソースは [zmkfirmware/zmk-studio](https://github.com/zmkfirmware/zmk-studio)（Apache License 2.0）です。公式のライセンス表示とNOTICEへのリンクは画面フッターにも表示しています。SO-SHO側では公式ソースを無断で再配布せず、公開実装の構成を参考に既存の静的Webアプリへ統合しています。

## できること

- 物理位置を選択して、通常アクションをクリックまたはドラッグ＆ドロップで割り当てる
- キー、修飾キー、MOレイヤー操作、USB専用の編集候補を選ぶ
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
- Layer 0の右手親指にLayer 3のMO(3)を初期配置し、インスペクターの「デフォルト設定」から現在の編集内容を初期設定として保存・復元する
- マクロ手順を `KEY|MODE|WAIT_MS` で編集する。MODEは `tap` / `press` / `release`、待ち時間は整数ミリ秒で保存する
- 編集値とデフォルト設定をブラウザーのlocalStorageへ保存する
- キーマップ、デフォルトキーマップ、マクロ、タップダンス、デバイス設定を1つのJSONファイルとしてダウンロード／読み込みする
- マクロ作成用のキーをドラッグして手順へ追加し、Shift＋Sなどの修飾キー組み合わせを作る。追加操作の待ち時間は初期1msで、手順ごとに変更する
- マクロをJSON/localStorageへ保存し、未実装の実機送信を成功扱いにしない

## ファームウェアのダウンロード

- [全スリープ設定・全モジュール構成を含む最新ZIP](https://github.com/robo1129-ops/sosho-firmware/releases/download/latest/sosho-firmware-latest.zip)
- [ビルド履歴とZIP生成](https://github.com/robo1129-ops/sosho-firmware/actions/workflows/package-firmware.yml)

ZIPには、5分・15分・30分・1時間・スリープなしの各フォルダと、右/左のトラックボール・トラックパッド・None構成、`settings_reset` が入ります。通常構成は右Centralトラックボール + 左Peripheralトラックパッドです。右側にトラックパッドを配置する構成はX/Yを反転します。トラックパッドは一次タップとダブルクリックに対応し、右クリックと外周スクロールは含みません。

Webページの「カスタムファームウェアZIPを直接ダウンロード」または「最新ZIPをダウンロード」から、同じリリースZIPを直接取得できます。

## USB接続

右側Central（トラックボール側）をUSB接続し、ページの「右側USB / COM接続」を押してください。ChromeまたはEdgeのWeb SerialでUSB CDC-ACMを開き、「USBからキーマップを読み込む」→編集→「USBへキーマップを保存」の順に操作します。一度許可したポートは「許可済みUSBに再接続」で再利用できます。左右分割間の通信はファームウェア側で維持されます。

キーマップ画面は `sosho.layout.json` / `sosho-layouts.dtsi` の実機配置に合わせ、左右各22キーの12列×4行で表示します。最下段は左右それぞれ外側2列・内側2列にキーを置き、中央の2列分の空きを実機どおりに表現します。左右のロータリーエンコーダーと、左トラックパッド/右トラックボールの位置も各モジュール内に表示します。

ロータリーエンコーダーへの割り当てとDEVICEタブの数値は、現在ブラウザーの編集状態として保存されます。実機のエンコーダー入力とCPI/移動倍率へ反映するには、対応するZMKのセンサー割り当て・デバイス設定通信を有効にしたファームウェアが必要です。未反映の値を反映済みとは表示しません。

オートマウスは、ポインティングデバイスの移動中と停止後の設定時間だけ指定レイヤーを保持する設定モデルです。スクロールは押下中だけ有効にするアクションを用意し、斜め入力を許可しつつ、縦または横が明確な入力は軸ロックするしきい値を設定できます。これらはKeyballのオートマウス層、スクロールモード、軸方向判定の考え方を参考にしています。現在のWebページは設定をJSON/localStorageへ保存しますが、実機へ適用するには同じ設定を受け取るファームウェア側の実装が必要です。

## マクロの反映範囲

公式Studio keymap schemaにはマクロ定義の作成・編集・削除RPCがありません。現在のUSB専用Webアプリでは、マクロをJSONとブラウザーへ保存し、未実装のUSBマクロRPCを成功扱いにしません。実機でマクロを動かす場合は、マクロを組み込んだファームウェアをビルドして書き込む必要があります。

マクロは最大8個、各マクロ最大8ステップです。手順は `KEY|MODE|WAIT_MS`、MODEは `tap` / `press` / `release`、待ち時間は0〜60000ミリ秒です。保存形式はJSONとlocalStorageです。MIDIは対象外です。

## 接続とStudio

- USBはWeb Serialの接続UIだけを公開し、右側Centralを公式ZMK Studio RPCの終端にする
- USB接続には「右側USB / COM接続」と、ブラウザーが一度許可したポートを選択画面なしで開く「許可済みUSBに再接続」を用意する。右側USBで接続した場合も、キーマップの読み取り・Studio unlock確認・保存・再読み取り検証は同じ画面で行う
- HTTPSまたはlocalhost、Chrome/Edge、ユーザー操作によるUSBポート許可が必要
- 初回はStudio対応ファームウェアを右側USBで書き込む必要がある
- キーボード側の `studio_unlock` を実行してからStudio接続を試す
- 公式Studio RPCのprotobufフレームを実装し、接続後にデバイス情報・ロック状態・キーマップ・使用中behaviorを読み取る。変更時は`set_layer_binding`→`save_changes`→再読み取りで検証する

参考実装: [Keyball keycodes](https://github.com/Yowkees/keyball/blob/main/qmk_firmware/keyboards/keyball/lib/keyball/keycodes.md)、[Keyball firmware implementation](https://github.com/Yowkees/keyball/blob/main/qmk_firmware/keyboards/keyball/lib/keyball/keyball.c)

## 過去のBLE診断について

BLE検出のコードと拡張機能は過去の切り分け用として残していますが、USB専用の公開ページからは読み込みません。

WindowsのBluetooth設定やWeb Bluetoothは、USB専用ページの編集経路には使用しません。診断拡張は過去の調査資料として残しています。

## RPCの自動テスト

公式Studioのprotobufフレーム生成・SOF/ESC/EOFエスケープ・応答デコードは、Node.jsで次を実行して確認できます。

```text
node tests/zmk-studio-rpc-smoke.js
```

## Chrome拡張によるBLE診断

`chrome-extension/` に、公開ページと独立してWeb Bluetoothの検出・GATT接続を確認するManifest V3拡張を収録しています。WindowsのネイティブBluetoothスタックを置き換えるものではなく、公開ページのOriginやページ状態に依存しない切り分け用です。

1. `chrome://extensions` を開く
2. デベロッパーモードを有効にする
3. 「パッケージ化されていない拡張機能を読み込む」で、リポジトリの `chrome-extension` フォルダーを選ぶ
4. 拡張のポップアップで「ブラウザー診断」を実行し、「soshoへ接続」を押す
5. Device PickerでSO-SHOを選び、公式StudioサービスとCharacteristicの検出結果をログで確認する

Windowsでは `chrome.bluetoothLowEnergy` が提供されないため、この拡張もWeb Bluetoothのユーザー許可とOS側のBLE可視性が必要です。拡張で検出できない場合は、Webサイトの実装だけでWindowsのBLE制限を回避できたとは扱いません。

拡張の静的検証は次で実行します。

```text
node tests/chrome-extension-smoke.js
```

## 検証と公開の受け入れ条件

1. GitHub Actionsで右Centralトラックボール / 左Peripheralトラックパッドのビルド成果物を確認する
2. 右側USBで初回導入し、Web Serialで右側Centralを選択できることを確認する
3. Web editorからキーマップを読み込み、保存し、再読み込みで一致することを確認する
4. 不具合時は直前のUF2へ戻せることを確認する

ソース変更とActionsビルド以外の物理キーボード操作、再フラッシュはこの編集作業では行っていません。実機でのUSB RPC動作確認は新しいファームウェア導入後に必要です。
