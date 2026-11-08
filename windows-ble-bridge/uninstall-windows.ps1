$ErrorActionPreference = 'Stop'
Set-StrictMode -Version Latest
$installRoot = Join-Path $env:LOCALAPPDATA 'SO-SHO\windows-ble-bridge'
$shortcutPath = Join-Path $env:APPDATA 'Microsoft\Windows\Start Menu\Programs\Startup\SO-SHO Windows BLE Bridge.lnk'
if (Test-Path -LiteralPath $shortcutPath) { Remove-Item -LiteralPath $shortcutPath -Force }
if (Test-Path -LiteralPath $installRoot) { Remove-Item -LiteralPath $installRoot -Recurse -Force }
Write-Host 'SO-SHO Windows BLEブリッジと自動起動設定を削除しました。' -ForegroundColor Green
