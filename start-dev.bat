@echo off
echo.
echo ========================================
echo   HeartMatch - Development Mode
echo ========================================
echo.

REM Check if package.json exists
if not exist "package.json" (
    echo [ERROR] Project not initialized!
    echo Please run: npm run setup
    pause
    exit /b 1
)

REM Check dependencies
if not exist "node_modules" (
    echo [INFO] Installing dependencies...
    call npm install
    if errorlevel 1 (
        echo [ERROR] Failed to install dependencies
        pause
        exit /b 1
    )
)

echo [INFO] Starting development server...
echo.
echo • Frontend: http://localhost:3000
echo • Hot reload enabled
echo • Press Ctrl+C to stop
echo.

REM Open browser after a short delay
start "" cmd /c "timeout /t 3 /nobreak >nul && start http://localhost:3000"

REM Start the development server
npm run dev

echo.
echo Development server stopped.
pause