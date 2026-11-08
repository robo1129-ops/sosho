@echo off
setlocal
set "SCRIPT=%~dp0install-embedded.ps1"
powershell.exe -NoLogo -NoProfile -NonInteractive -ExecutionPolicy Bypass -File "%SCRIPT%"
set "EXITCODE=%ERRORLEVEL%"
if not "%EXITCODE%"=="0" echo INSTALL_FAILED. See %TEMP%\sosho-windows-ble-bridge-install.log
exit /b %EXITCODE%
