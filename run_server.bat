@echo off
setlocal

:: 设置默认端口号
set PORT=8000

:: 检查是否以管理员权限运行
echo Checking for administrator privileges...
net session >nul 2>&1
if %errorLevel% == 0 (
    echo Administrator privileges confirmed.
) else (
    echo Please run this script as an administrator.
    pause
    exit
)

:: 添加防火墙规则
echo Adding firewall rule for Python HTTP Server on port %PORT%...
netsh advfirewall firewall add rule name="Python HTTP Server" dir=in action=allow protocol=TCP localport=%PORT%

:: 启动 Python HTTP 服务器
echo Server starting on port %PORT%... Refresh to start
start http://localhost:%PORT%
python -m http.server %PORT%
echo Server started on port %PORT%.

endlocal