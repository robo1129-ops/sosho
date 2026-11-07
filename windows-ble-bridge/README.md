# SO-SHO Windows BLE bridge

Windows版ChromeのWeb Bluetooth制約を回避するためのローカル接続ブリッジです。Chromeの公開ページは `ws://127.0.0.1:8765` に接続し、このプロセスがWindows BLE GATTでSO-SHOへ接続します。ZMK Studioの公式Service/Characteristic UUIDとフレーミングをそのまま中継します。

## 初回セットアップ

PowerShellでこのフォルダーの `setup-windows.ps1` を一度実行してください。Python 3.10以降とWindowsのBluetooth LEが必要です。

## 起動

`start-windows.ps1` を実行したまま、ChromeでSO-SHOページを開き、`Windows BLEブリッジ` を押します。まず広告中のSO-SHOを探し、WindowsがHID接続中で広告を隠している場合は、Windowsのペアリング済みデバイス情報からSO-SHOのアドレスを取得してWinRTへ直接GATT接続します。したがって、通常はWindowsのBluetooth接続を切断する必要はありません。

ブリッジは `127.0.0.1` のみに待ち受け、公開ページOrigin以外からの接続を拒否します。終了はPowerShellで `Ctrl+C` です。

## 重要な制約

これはWindows ChromeへBLE APIを追加するものではありません。Windows側のWinRT BLE GATTをローカルプロセスで利用し、Chromeとはlocalhost WebSocketで接続します。Windowsのペアリング情報から公式ZMK Studioサービスを持つSO-SHOを直接解決できるため、広告スキャンに見えないHID接続中でも接続できます。ペアリング情報にも見つからない場合だけ、WindowsのBluetooth設定でキーボード接続を一度切断し、SO-SHOを広告状態にしてから再試行してください。
