@echo off
echo Server starting
start http://localhost:8000
python -m http.server 8000
echo Server started
