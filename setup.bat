@echo off
echo.
echo ========================================
echo   HeartMatch Dating App Setup
echo ========================================
echo.

REM Check if Node.js is installed
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js not found!
    echo Please install Node.js 18+ from https://nodejs.org
    pause
    exit /b 1
)

echo 🚀 Starting HeartMatch setup...
echo.

REM Run the setup script
node setup.js

if %errorlevel% equ 0 (
    echo.
    echo ✅ Setup completed successfully!
    echo.
    echo To start development:
    echo   npm run dev
    echo.
    echo Then open: http://localhost:3000
    echo.
) else (
    echo.
    echo ❌ Setup failed!
    echo Please check the error messages above.
    echo.
)

pause