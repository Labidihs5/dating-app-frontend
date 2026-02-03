@echo off
setlocal enabledelayedexpansion

echo.
echo ========================================
echo   HeartMatch - Start All Modules
echo ========================================
echo.

REM Check Node.js
node --version >nul 2>&1
if errorlevel 1 (
    echo [ERROR] Node.js not installed!
    pause
    exit /b 1
)

echo [INFO] Starting HeartMatch modules...
echo.

REM Create logs directory
if not exist "logs" mkdir logs

REM Check if package.json exists
if not exist "package.json" (
    echo [ERROR] package.json not found! Run setup first.
    echo Run: npm run setup
    pause
    exit /b 1
)

REM Install dependencies if needed
if not exist "node_modules" (
    echo [INFO] Installing dependencies...
    call npm install
)

REM Start Frontend (Next.js)
echo [1/4] Starting Frontend Server...
start "HeartMatch Frontend" cmd /k "title HeartMatch Frontend && echo Starting Frontend on http://localhost:3000 && npm run dev"

REM Wait a moment
timeout /t 2 /nobreak >nul

REM Start Backend API (if exists)
if exist "backend" (
    echo [2/4] Starting Backend API...
    cd backend
    start "HeartMatch Backend" cmd /k "echo Backend API && npm run dev"
    cd ..
) else (
    echo [2/4] Backend not found - using mock API
    start "Mock Backend" cmd /k "echo Mock Backend on port 3001 && npx json-server --watch db.json --port 3001"
)

timeout /t 2 /nobreak >nul
 

timeout /t 2 /nobreak >nul

REM Start Redis (if available)
if exist "C:\Program Files\Redis\redis-server.exe" (
    echo [4/4] Starting Redis Cache...
    start "Redis" "C:\Program Files\Redis\redis-server.exe"
) else (
    echo [4/4] Redis not found - skipping cache
)

echo.
echo ========================================
echo   All modules started successfully!
echo ========================================
echo.
echo Services running:
echo • Frontend:  http://localhost:3000
echo • Backend:   http://localhost:3001
echo • Database:  localhost:5432
echo • Redis:     localhost:6379
echo.
echo Press any key to open the application...
pause >nul

start http://localhost:3000

echo.
echo Application opened in browser.
echo Keep this window open to monitor services.
echo Press any key to stop all services...
pause >nul

REM Stop all services
echo.
echo Stopping all services...
taskkill /f /im node.exe >nul 2>&1
taskkill /f /im redis-server.exe >nul 2>&1
docker stop heartmatch-db >nul 2>&1
docker rm heartmatch-db >nul 2>&1

echo All services stopped.
pause