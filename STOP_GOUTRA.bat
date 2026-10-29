@echo off
title Stop Goutra Services
color 0C

echo ===================================================
echo           STOPPING GOUTRA SERVICES
echo ===================================================
echo.
echo Terminating Ngrok and Node servers...

taskkill /IM ngrok.exe /F >nul 2>&1
for /f "tokens=5" %%a in ('netstat -aon 2^>nul ^| findstr ":4000 :5173 :5174"') do (
    taskkill /F /PID %%a >nul 2>&1
)
taskkill /FI "WINDOWTITLE eq Goutra_*" /F >nul 2>&1

echo.
echo All Goutra services and tunnels have been stopped.
timeout /t 2 /nobreak >nul
exit /b 0
