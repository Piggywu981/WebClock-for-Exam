# 设置默认端口号
$PORT = 8000

# 检查是否以管理员权限运行
Write-Host "Checking for administrator privileges..."
if (-NOT ([Security.Principal.WindowsPrincipal][Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole([Security.Principal.WindowsBuiltInRole] "Administrator"))
{
    Write-Host "Please run this script as an administrator."
    pause
    exit
}
else
{
    Write-Host "Administrator privileges confirmed."
}

# 添加防火墙规则
Write-Host "Adding firewall rule for Python HTTP Server on port $PORT..."
netsh advfirewall firewall add rule name="Python HTTP Server" dir=in action=allow protocol=TCP localport=$PORT

# 获取脚本所在的目录
$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Definition
Set-Location -Path $scriptDir

# 启动 Python HTTP 服务器
Write-Host "Server starting on port $PORT..."
Start-Process -NoNewWindow "python" "-m http.server $PORT"
Start-Process "http://localhost:$PORT/index.html"
Write-Host "Server started on port $PORT."