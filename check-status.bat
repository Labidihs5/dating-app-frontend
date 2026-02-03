@echo off
echo.
echo ========================================
echo   HeartMatch - Project Diagnostic
echo ========================================
echo.

echo [CHECK] Node.js installation...
node --version >nul 2>&1
if errorlevel 1 (
    echo [ERROR] Node.js not found!
    echo Please install Node.js from: https://nodejs.org
) else (
    echo [OK] Node.js version: 
    node --version
)

echo.
echo [CHECK] npm installation...
npm --version >nul 2>&1
if errorlevel 1 (
    echo [ERROR] npm not found!
) else (
    echo [OK] npm version: 
    npm --version
)

echo.
echo [CHECK] Project files...
if exist "package.json" (
    echo [OK] package.json found
) else (
    echo [ERROR] package.json missing - run setup first!
)

if exist "node_modules" (
    echo [OK] Dependencies installed
) else (
    echo [WARNING] node_modules missing - run npm install
)

if exist ".env.local" (
    echo [OK] Environment file exists
) else (
    echo [WARNING] .env.local missing - run setup script
)

if exist "app" (
    echo [OK] Next.js app directory found
) else (
    echo [ERROR] Next.js app directory missing!
)

if exist "next.config.js" (
    echo [OK] Next.js config found
) else (
    echo [WARNING] next.config.js missing
)

echo.
echo [CHECK] Port availability...
netstat -an | find ":3000" >nul
if not errorlevel 1 (
    echo [WARNING] Port 3000 is already in use!
) else (
    echo [OK] Port 3000 available
)

netstat -an | find ":3001" >nul
if not errorlevel 1 (
    echo [WARNING] Port 3001 is already in use!
) else (
    echo [OK] Port 3001 available
)

echo.
echo ========================================
echo   Diagnostic Complete
echo ========================================
echo.

if not exist "package.json" (
    echo [SOLUTION] Run: npm run setup
    echo.
)

if not exist "node_modules" (
    echo [SOLUTION] Run: npm install
    echo.
)

echo Press any key to continue...
pause >nul