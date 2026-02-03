@echo off
setlocal enabledelayedexpansion

echo.
echo ========================================
echo   HeartMatch - Local Development Server
echo ========================================
echo.

REM Check if Node.js is installed
node --version >nul 2>&1
if errorlevel 1 (
    echo [ERROR] Node.js is not installed!
    echo.
    echo Please install Node.js from: https://nodejs.org/
    echo.
    pause
    exit /b 1
)

echo [OK] Node.js version:
node --version

echo.
echo [OK] npm version:
npm --version

echo.
echo Checking project dependencies...

REM Check if node_modules exists
if not exist "node_modules" (
    echo [INFO] Installing dependencies...
    call npm install
    if errorlevel 1 (
        echo [ERROR] Failed to install dependencies
        pause
        exit /b 1
    )
) else (
    echo [OK] Dependencies already installed
)

echo.
echo ========================================
echo Starting development server...
echo ========================================
echo.
echo The app will open at: http://localhost:3000
echo.
echo Mobile testing: Get your IP with 'ipconfig'
echo Then access: http://YOUR_IP:3000
echo.
echo Press Ctrl+C to stop the server
echo.

start http://localhost:3000

call npm run dev

pause
