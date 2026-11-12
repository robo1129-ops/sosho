# SO-SHO Windows BLE bridge

SO-SHO WebアプリとWindowsのBluetooth接続を仲介する補助アプリです。通常のChromeのBLE一覧にSO-SHOが表示されない場合でも、ペアリング済みのSO-SHOを使ってWebアプリから接続できます。

## 初回セットアップ（推奨）

公開ページの「Windows BLEブリッジをセットアップ」から `sosho-windows-ble-bridge-setup.exe` をダウンロードして実行してください。ユーザー用フォルダーだけを使うため、管理者権限は不要です。Python、仮想環境、pip、PowerShellの実行は必要ありません。

セットアップは次を自動で行います。

- BLEブリッジ本体を `%LOCALAPPDATA%\SO-SHO\windows-ble-bridge` に配置
- Windowsログオン時に起動するショートカットをユーザー用スタートアップへ登録
- ブリッジをバックグラウンドで起動

インストール後、SO-SHO Webアプリで「Windows BLE接続（広告不要）」を押してください。セットアップ完了後は、通常は手動で補助アプリを起動する必要はありません。

インストールに失敗した場合は、画面に表示される英数字のエラーを確認してください。詳細ログは `%TEMP%\sosho-windows-ble-bridge-install.log` に保存されます。インストーラーはWindowsの表示言語やコードページに依存しない形式です。

### 終了・再起動

ブリッジを一時的に終了する場合は、タスクマネージャーで「sosho_ble_bridge」を終了してください。次回のWindowsログオン時には、ユーザー用スタートアップ登録から自動的に再起動します。完全に削除する場合は、導入先の `uninstall-windows.ps1` を実行してください。

### 手動セットアップ（開発者向け）

Python環境を自分で管理する場合だけ、次の従来手順を利用できます。

```powershell
Set-Location $env:USERPROFILE
git clone https://github.com/robo1129-ops/sosho.git
Set-Location .\sosho\windows-ble-bridge
Set-ExecutionPolicy -Scope Process Bypass
.\setup-windows.ps1
```

Python 3.10以降とWindowsのBluetooth LEが必要です。すでに `sosho` を取得済みの場合は、`sosho\windows-ble-bridge` に移動してから実行してください。

## 起動

セットアップを実行した後、ChromeでSO-SHOページを開き、`Windows BLE接続（広告不要）` を押します。WindowsがHID接続中で広告を隠している場合でも、先にWindowsのBluetooth接続を切断する必要はありません。Chromeの通常のWeb Bluetooth一覧にSO-SHOが出ない場合も、このボタンが正しい接続経路です。

キーマップの書き込みは右側CentralのUSB/COMを優先してください。Windows BLEブリッジはBLE接続を維持したままの編集・読み取り用に残しています。

ブリッジは外部公開せず、SO-SHO Webアプリからの接続だけを受け付けます。終了や再インストールが必要な場合は、導入先に作成されるアンインストール用スクリプトを使用してください。

## 重要な制約

これはWindowsのBluetooth接続を使って、SO-SHO Webアプリから公式ZMK Studioサービスへ接続するための補助アプリです。Windowsのペアリング情報からSO-SHOを解決するため、広告スキャンに表示されない場合でも接続できます。ペアリング情報にも見つからない場合だけ、WindowsのBluetooth設定でキーボード接続を一度切断し、SO-SHOを広告状態にしてから再試行してください。
