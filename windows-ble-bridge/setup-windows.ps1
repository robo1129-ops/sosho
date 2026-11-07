$ErrorActionPreference = 'Stop'
$bridgeRoot = Split-Path -Parent $MyInvocation.MyCommand.Path
$venv = Join-Path $bridgeRoot '.venv'
if (-not (Test-Path $venv)) {
  $launcher = Get-Command py -ErrorAction SilentlyContinue
  if ($launcher) { & $launcher.Source -3 -m venv $venv }
  else { & python -m venv $venv }
}
$python = Join-Path $venv 'Scripts\python.exe'
& $python -m pip install --upgrade pip
& $python -m pip install -r (Join-Path $bridgeRoot 'requirements.txt')
Write-Host "SO-SHO Windows BLE bridge is ready. Start it with:" -ForegroundColor Green
Write-Host "  $python $bridgeRoot\windows_ble_bridge.py" -ForegroundColor Cyan
