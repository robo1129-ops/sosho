param(
  [string]$PayloadRoot = (Split-Path -Parent $MyInvocation.MyCommand.Path),
  [string]$InstallRoot = (Join-Path $env:LOCALAPPDATA 'SO-SHO\windows-ble-bridge')
)

$ErrorActionPreference = 'Stop'
Set-StrictMode -Version Latest

if ([string]::IsNullOrWhiteSpace($env:LOCALAPPDATA)) {
  throw 'ユーザー用のLocalAppDataフォルダーを取得できませんでした。'
}

$bridgeExe = Join-Path $PayloadRoot 'sosho_ble_bridge.exe'
if (-not (Test-Path -LiteralPath $bridgeExe)) {
  throw 'セットアップに必要なブリッジ本体が見つかりません。'
}

New-Item -ItemType Directory -Force -Path $InstallRoot | Out-Null
Copy-Item -LiteralPath $bridgeExe -Destination (Join-Path $InstallRoot 'sosho_ble_bridge.exe') -Force

$uninstall = @'
param([string]$InstallRoot = (Join-Path $env:LOCALAPPDATA 'SO-SHO\windows-ble-bridge'))
$ErrorActionPreference = 'SilentlyContinue'
$startupShortcut = Join-Path $env:APPDATA 'Microsoft\Windows\Start Menu\Programs\Startup\SO-SHO Windows BLE Bridge.lnk'
Remove-Item -LiteralPath $startupShortcut -Force
Get-Process -Name 'sosho_ble_bridge' -ErrorAction SilentlyContinue | Stop-Process -Force
Remove-Item -LiteralPath $InstallRoot -Recurse -Force
Write-Host 'SO-SHO Windows BLEブリッジをアンインストールしました。'
'@
Set-Content -LiteralPath (Join-Path $InstallRoot 'uninstall-windows.ps1') -Value $uninstall -Encoding Unicode

$startupDir = Join-Path $env:APPDATA 'Microsoft\Windows\Start Menu\Programs\Startup'
New-Item -ItemType Directory -Force -Path $startupDir | Out-Null
$shortcutPath = Join-Path $startupDir 'SO-SHO Windows BLE Bridge.lnk'
$shell = New-Object -ComObject WScript.Shell
$shortcut = $shell.CreateShortcut($shortcutPath)
$shortcut.TargetPath = Join-Path $InstallRoot 'sosho_ble_bridge.exe'
$shortcut.Arguments = '--host 127.0.0.1 --port 8765'
$shortcut.WorkingDirectory = $InstallRoot
$shortcut.WindowStyle = 7
$shortcut.Description = 'SO-SHO Windows BLE bridge'
$shortcut.Save()

Get-Process -Name 'sosho_ble_bridge' -ErrorAction SilentlyContinue | Stop-Process -Force
Start-Process -FilePath (Join-Path $InstallRoot 'sosho_ble_bridge.exe') -ArgumentList '--host 127.0.0.1 --port 8765' -WorkingDirectory $InstallRoot -WindowStyle Hidden

Write-Host 'SO-SHO Windows BLEブリッジをインストールしました。' -ForegroundColor Green
Write-Host "インストール先: $InstallRoot"
Write-Host '管理者権限は使用していません。Windows起動時に自動起動します。'
Write-Host 'SO-SHO Webアプリで「Windows BLE接続（広告不要）」を押してください。'
