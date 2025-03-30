@echo off
setlocal

:: 检查是否以管理员权限运行
echo Checking for administrator privileges...
net session >nul 2>&1
if %errorLevel% == 0 (
    echo Administrator privileges confirmed.
    goto run_ps1
) else (
    echo Requesting administrator privileges...
    powershell -Command "Start-Process cmd -ArgumentList '/c %~f0' -Verb RunAs"
    exit
)

:run_ps1
:: 获取当前脚本所在的目录
set "SCRIPT_DIR=%~dp0"
set "PS1_FILE=%SCRIPT_DIR%run_server.ps1"

:: 确保路径中的空格被正确处理
echo Running PowerShell script...
powershell -ExecutionPolicy Bypass -File "%PS1_FILE%"
pause
endlocal