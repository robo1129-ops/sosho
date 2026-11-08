param(
  [switch]$NoStart,
  [string]$InstallRoot = (Join-Path $env:LOCALAPPDATA 'SO-SHO\windows-ble-bridge')
)

$ErrorActionPreference = 'Stop'
Set-StrictMode -Version Latest

$repoRaw = 'https://raw.githubusercontent.com/robo1129-ops/sosho/main/windows-ble-bridge'
$startupDir = Join-Path $env:APPDATA 'Microsoft\Windows\Start Menu\Programs\Startup'
$shortcutPath = Join-Path $startupDir 'SO-SHO Windows BLE Bridge.lnk'
$files = @('windows_ble_bridge.py', 'requirements.txt', 'start-windows.ps1', 'setup-windows.ps1')

New-Item -ItemType Directory -Force -Path $InstallRoot | Out-Null
foreach ($file in $files) {
  Invoke-WebRequest -UseBasicParsing -Uri "$repoRaw/$file" -OutFile (Join-Path $InstallRoot $file)
}

function Get-PythonLauncher {
  $py = Get-Command py -ErrorAction SilentlyContinue
  if ($py) { return @{ Path = $py.Source; Args = @('-3') } }
  $python = Get-Command python -ErrorAction SilentlyContinue
  if ($python) { return @{ Path = $python.Source; Args = @() } }
  return $null
}

$launcher = Get-PythonLauncher
if (-not $launcher) {
  $winget = Get-Command winget -ErrorAction SilentlyContinue
  if (-not $winget) {
    throw 'Python 3.10以降が必要です。wingetが利用できないため、Pythonを会社PCの許可された方法でインストールしてから再実行してください。'
  }
  & $winget.Source install --id Python.Python.3.12 --scope user --silent --accept-source-agreements --accept-package-agreements
  if ($LASTEXITCODE -ne 0) { throw "Pythonのインストールに失敗しました (exit code $LASTEXITCODE)" }
  $launcher = Get-PythonLauncher
  if (-not $launcher) { throw 'Pythonをインストールしましたが、現在のPowerShellから見つかりません。PowerShellを開き直して再実行してください。' }
}

$venv = Join-Path $InstallRoot '.venv'
if (-not (Test-Path (Join-Path $venv 'Scripts\python.exe'))) {
  & $launcher.Path @($launcher.Args) -m venv $venv
  if ($LASTEXITCODE -ne 0) { throw "Python仮想環境の作成に失敗しました (exit code $LASTEXITCODE)" }
}
$python = Join-Path $venv 'Scripts\python.exe'
& $python -m pip install --upgrade pip
& $python -m pip install -r (Join-Path $InstallRoot 'requirements.txt')
if ($LASTEXITCODE -ne 0) { throw "BLEブリッジの依存パッケージのインストールに失敗しました (exit code $LASTEXITCODE)" }

New-Item -ItemType Directory -Force -Path $startupDir | Out-Null
$shell = New-Object -ComObject WScript.Shell
$shortcut = $shell.CreateShortcut($shortcutPath)
$shortcut.TargetPath = (Join-Path $env:SystemRoot 'System32\WindowsPowerShell\v1.0\powershell.exe')
$shortcut.Arguments = "-NoProfile -ExecutionPolicy Bypass -WindowStyle Hidden -File `"$(Join-Path $InstallRoot 'start-windows.ps1')`""
$shortcut.WorkingDirectory = $InstallRoot
$shortcut.WindowStyle = 7
$shortcut.Description = 'SO-SHO Windows BLE bridge'
$shortcut.Save()

if (-not $NoStart) {
  Start-Process -FilePath $shortcut.TargetPath -ArgumentList $shortcut.Arguments -WorkingDirectory $InstallRoot -WindowStyle Hidden
}

Write-Host 'SO-SHO Windows BLEブリッジを設定しました。' -ForegroundColor Green
Write-Host "インストール先: $InstallRoot"
Write-Host "自動起動: $shortcutPath"
Write-Host 'SO-SHO Webアプリで「Windows BLE接続（広告不要）」を押してください。'
