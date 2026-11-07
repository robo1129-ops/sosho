$ErrorActionPreference = 'Stop'
$bridgeRoot = Split-Path -Parent $MyInvocation.MyCommand.Path
$python = Join-Path $bridgeRoot '.venv\Scripts\python.exe'
if (-not (Test-Path $python)) { & (Join-Path $bridgeRoot 'setup-windows.ps1') }
& $python (Join-Path $bridgeRoot 'windows_ble_bridge.py')
