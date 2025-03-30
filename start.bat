@echo off
setlocal

:: Make sure the current directory is the same
:: as where the script is located.
cd /d %~dp0

set "USE_TSINGHUA=%~1"

if "%USE_TSINGHUA%"=="" (
    echo No mirror specified. Using default PyPI servers.
) else if "%USE_TSINGHUA%"=="1" (
    echo Using Tsinghua mirror...
) else (
    echo Invalid mirror option: %USE_TSINGHUA%
)

echo Checking requirements...

call helpers\ensure_requirements.bat

echo Requirements are met, starting the app...

.\run_server.bat

echo The ETS2LA launcher has closed.

pause