@echo off

call helpers\environment.bat
call helpers\git.bat
call helpers\python.bat

echo Git Version:
git --version
echo.

echo Python Version:
python --version
echo.

echo Pip Version:
pip --version
echo.