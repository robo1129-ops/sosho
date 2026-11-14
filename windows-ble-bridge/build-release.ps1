param(
  [ValidateSet('bridge','installer','verify')][string]$Phase = 'bridge',
  [string]$BridgePath,
  [string]$InstallerPath,
  [switch]$AllowUnsigned
)
$ErrorActionPreference = 'Stop'
Set-StrictMode -Version Latest
$repo = Split-Path -Parent $PSScriptRoot
$out = Join-Path $repo 'build\windows-ble-release'

function Assert-Signed([string]$Path) {
  $file = Get-Item -LiteralPath $Path -ErrorAction Stop
  $signature = Get-AuthenticodeSignature -LiteralPath $file.FullName
  if ($signature.Status -ne 'Valid' -or -not $signature.SignerCertificate) {
    throw "Release blocked: $($file.Name) signature is $($signature.Status)."
  }
  if (-not $signature.TimeStamperCertificate) {
    throw "Release blocked: $($file.Name) has no trusted timestamp."
  }
  Write-Output ("Verified publisher: " + $signature.SignerCertificate.Subject)
}

if ($Phase -eq 'verify') {
  if (-not $BridgePath -or -not $InstallerPath) { throw 'Both executable paths are required.' }
  Assert-Signed $BridgePath
  Assert-Signed $InstallerPath
  Get-FileHash -LiteralPath $BridgePath,$InstallerPath -Algorithm SHA256
  exit 0
}

$name = 'sosho_ble_bridge'
$entry = Join-Path $PSScriptRoot 'windows_ble_bridge.py'
$extra = @()
if ($Phase -eq 'installer') {
  if (-not $BridgePath) { throw 'A BridgePath is required.' }
  if ($AllowUnsigned) {
    Write-Warning 'Building an unsigned development installer. Do not describe this artifact as signed.'
  } else {
    Assert-Signed $BridgePath
  }
  $name = 'sosho-windows-ble-bridge-setup'
  $entry = Join-Path $PSScriptRoot 'installer.py'
  $extra = @('--add-data', ((Join-Path $PSScriptRoot 'install-embedded.ps1') + ';.'),
             '--add-data', ((Resolve-Path -LiteralPath $BridgePath).Path + ';.'))
}
$phaseOut = Join-Path $out $Phase
New-Item -ItemType Directory -Force -Path $phaseOut | Out-Null
$pyArgs = @('-m','PyInstaller','--noconfirm','--clean','--onefile','--noconsole','--noupx',
  '--name',$name,'--version-file',(Join-Path $PSScriptRoot 'release-version.txt'),
  '--distpath',(Join-Path $phaseOut 'dist'),'--workpath',(Join-Path $phaseOut 'work'),
  '--specpath',$phaseOut) + $extra + @($entry)
& python @pyArgs
if ($LASTEXITCODE -ne 0) { throw "PyInstaller failed: $LASTEXITCODE" }
Get-Item -LiteralPath (Join-Path $phaseOut "dist\$name.exe")
