param(
  [string]$PayloadRoot = (Split-Path -Parent $MyInvocation.MyCommand.Path),
  [string]$InstallRoot = (Join-Path $env:LOCALAPPDATA 'SO-SHO\windows-ble-bridge')
)

$ErrorActionPreference = 'Stop'
Set-StrictMode -Version Latest
$logPath = Join-Path $env:TEMP 'sosho-windows-ble-bridge-install.log'

function Write-InstallLog {
  param([string]$Message)
  $Message | Out-File -LiteralPath $logPath -Append -Encoding ASCII
  Write-Host $Message
}

try {
  Write-InstallLog 'SO-SHO Windows BLE bridge setup started.'

  if ([string]::IsNullOrWhiteSpace($env:LOCALAPPDATA)) {
    throw 'LOCALAPPDATA is not available for this user.'
  }

  $bridgeExe = Join-Path $PayloadRoot 'sosho_ble_bridge.exe'
  if (-not (Test-Path -LiteralPath $bridgeExe)) {
    throw 'The bridge executable is missing from the installer payload.'
  }

  $installedExe = Join-Path $InstallRoot 'sosho_ble_bridge.exe'
  $existing = Get-Process -Name 'sosho_ble_bridge' -ErrorAction SilentlyContinue
  foreach ($process in $existing) {
    try {
      if ($process.Path -eq $installedExe) {
        $process | Stop-Process -Force
      }
    } catch {
      # A process from another user must not block installation.
    }
  }
  Start-Sleep -Milliseconds 500

  New-Item -ItemType Directory -Force -Path $InstallRoot | Out-Null
  Copy-Item -LiteralPath $bridgeExe -Destination $installedExe -Force

  $uninstall = @'
param([string]$InstallRoot = (Join-Path $env:LOCALAPPDATA 'SO-SHO\windows-ble-bridge'))
$ErrorActionPreference = 'SilentlyContinue'
$startupShortcut = Join-Path $env:APPDATA 'Microsoft\Windows\Start Menu\Programs\Startup\SO-SHO Windows BLE Bridge.lnk'
if (Test-Path -LiteralPath $startupShortcut) { Remove-Item -LiteralPath $startupShortcut -Force }
$installedExe = Join-Path $InstallRoot 'sosho_ble_bridge.exe'
Get-Process -Name 'sosho_ble_bridge' -ErrorAction SilentlyContinue | ForEach-Object {
  try { if ($_.Path -eq $installedExe) { $_ | Stop-Process -Force } } catch {}
}
if (Test-Path -LiteralPath $InstallRoot) { Remove-Item -LiteralPath $InstallRoot -Recurse -Force }
Write-Host 'SO-SHO Windows BLE bridge was uninstalled.'
'@
  Set-Content -LiteralPath (Join-Path $InstallRoot 'uninstall-windows.ps1') -Value $uninstall -Encoding ASCII

  $startupDir = Join-Path $env:APPDATA 'Microsoft\Windows\Start Menu\Programs\Startup'
  New-Item -ItemType Directory -Force -Path $startupDir | Out-Null
  $shortcutPath = Join-Path $startupDir 'SO-SHO Windows BLE Bridge.lnk'
  $shell = New-Object -ComObject WScript.Shell
  $shortcut = $shell.CreateShortcut($shortcutPath)
  $shortcut.TargetPath = $installedExe
  $shortcut.Arguments = '--host 127.0.0.1 --port 8765'
  $shortcut.WorkingDirectory = $InstallRoot
  $shortcut.WindowStyle = 7
  $shortcut.Description = 'SO-SHO Windows BLE bridge'
  $shortcut.Save()

  Start-Process -FilePath $installedExe -ArgumentList '--host 127.0.0.1 --port 8765' -WorkingDirectory $InstallRoot -WindowStyle Hidden
  Start-Sleep -Seconds 2
  $running = Get-Process -Name 'sosho_ble_bridge' -ErrorAction SilentlyContinue | Where-Object {
    try { $_.Path -eq $installedExe } catch { $false }
  }
  if (-not $running) {
    throw 'The bridge process did not start. Check the install log and Windows security history.'
  }

  Write-InstallLog 'Installation completed successfully.'
  Write-InstallLog ("Install folder: " + $InstallRoot)
  Write-InstallLog ("Startup shortcut: " + $shortcutPath)
  Write-InstallLog ("Log file: " + $logPath)
  exit 0
} catch {
  $message = 'INSTALL_FAILED: ' + $_.Exception.Message
  Write-InstallLog $message
  Write-InstallLog ("Log file: " + $logPath)
  exit 1
}
