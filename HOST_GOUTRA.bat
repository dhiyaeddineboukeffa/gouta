@echo off
title Goutra Auto-Host Manager
color 0B

echo ===================================================
echo           GOUTRA AUTO-HOST LAUNCHER
echo ===================================================
echo.

:: Detect root folder
set "APP_DIR=%~dp0"
if exist "%~dp0ecommerce-app\backend" (
    set "APP_DIR=%~dp0ecommerce-app"
)

if not exist "%APP_DIR%\backend" (
    echo [ERROR] Could not find backend folder!
    pause
    exit /b 1
)

echo [1/5] Cleaning up old processes...
taskkill /IM ngrok.exe /F >nul 2>&1
for /f "tokens=5" %%a in ('netstat -aon 2^>nul ^| findstr ":4000 :5173 :5174"') do (
    taskkill /F /PID %%a >nul 2>&1
)

echo [2/5] Starting Backend API on port 4000...
start "Goutra_Backend" /min cmd /c "cd /d "%APP_DIR%\backend" && npm run server"

echo [3/5] Starting Admin Panel on port 5174...
start "Goutra_Admin" /min cmd /c "cd /d "%APP_DIR%\admin" && npm run dev"

echo [4/5] Starting Frontend on port 5173...
start "Goutra_Frontend" /min cmd /c "cd /d "%APP_DIR%\frontend" && npm run dev"

echo Waiting for local services to initialize...
timeout /t 5 /nobreak >nul

echo [5/5] Launching Ngrok Tunnel...
start "Goutra_Ngrok" /min cmd /c "ngrok http 127.0.0.1:5173"

timeout /t 4 /nobreak >nul

cls
color 0A
echo ================================================================
echo           GOUTRA IS NOW ONLINE AND HOSTED!
echo ================================================================
echo.
echo   Local Services:
echo     - Backend API : http://localhost:4000
echo     - Admin Panel : http://localhost:5174/admin/
echo     - Frontend    : http://localhost:5173
echo.
echo   Public Ngrok Links:
echo     - Storefront  : https://unstiffly-overelliptical-elisha.ngrok-free.dev
echo     - Admin Panel : https://unstiffly-overelliptical-elisha.ngrok-free.dev/admin
echo.
echo ================================================================
echo   Opening live store in your browser...
echo ================================================================
echo.
start https://unstiffly-overelliptical-elisha.ngrok-free.dev

echo Keep this window open while hosting.
echo To STOP all servers, press any key below...
echo.
pause >nul

echo.
echo Stopping all Goutra services...
taskkill /IM ngrok.exe /F >nul 2>&1
for /f "tokens=5" %%a in ('netstat -aon 2^>nul ^| findstr ":4000 :5173 :5174"') do (
    taskkill /F /PID %%a >nul 2>&1
)
taskkill /FI "WINDOWTITLE eq Goutra_*" /F >nul 2>&1

echo All services stopped successfully.
timeout /t 2 /nobreak >nul
exit /b 0
