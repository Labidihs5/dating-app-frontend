@echo off
setlocal enabledelayedexpansion

echo.
echo ========================================
echo   HeartMatch - Telegram Bot Setup
echo ========================================
echo.

REM Get bot token from user
set /p bot_token="Enter your Telegram Bot Token: "

if "!bot_token!"=="" (
    echo [ERROR] Bot token is required!
    echo.
    echo To get a bot token:
    echo 1. Chat with @BotFather on Telegram
    echo 2. Send: /newbot
    echo 3. Follow the instructions
    echo 4. Copy the token provided
    echo.
    pause
    exit /b 1
)

REM Get app URL
set /p app_url="Enter your app URL (e.g., https://yourapp.vercel.app): "

if "!app_url!"=="" (
    echo [ERROR] App URL is required!
    pause
    exit /b 1
)

echo.
echo [INFO] Configuring Telegram Bot...
echo Bot Token: !bot_token!
echo App URL: !app_url!
echo.

REM Test bot token
echo [1/4] Testing bot token...
curl -s "https://api.telegram.org/bot!bot_token!/getMe" > bot_info.json
findstr "\"ok\":true" bot_info.json >nul
if errorlevel 1 (
    echo [ERROR] Invalid bot token!
    del bot_info.json >nul 2>&1
    pause
    exit /b 1
)

echo [OK] Bot token valid ✓

REM Get bot info
for /f "tokens=2 delims=:," %%a in ('findstr "username" bot_info.json') do (
    set bot_username=%%a
    set bot_username=!bot_username:"=!
    set bot_username=!bot_username: =!
)

echo Bot Username: @!bot_username!
del bot_info.json >nul 2>&1
echo.

REM Set webhook (optional for mini apps)
echo [2/4] Setting up webhook...
curl -s -X POST "https://api.telegram.org/bot!bot_token!/setWebhook" ^
     -H "Content-Type: application/json" ^
     -d "{\"url\":\"!app_url!/api/telegram/webhook\"}" > webhook_result.json

findstr "\"ok\":true" webhook_result.json >nul
if not errorlevel 1 (
    echo [OK] Webhook configured ✓
) else (
    echo [WARNING] Webhook setup failed (optional for mini apps)
)
del webhook_result.json >nul 2>&1
echo.

REM Set bot commands
echo [3/4] Setting bot commands...
curl -s -X POST "https://api.telegram.org/bot!bot_token!/setMyCommands" ^
     -H "Content-Type: application/json" ^
     -d "{\"commands\":[{\"command\":\"start\",\"description\":\"Start using HeartMatch 💕\"},{\"command\":\"help\",\"description\":\"Get help and support\"},{\"command\":\"settings\",\"description\":\"Manage preferences\"}]}" > commands_result.json

findstr "\"ok\":true" commands_result.json >nul
if not errorlevel 1 (
    echo [OK] Bot commands set ✓
) else (
    echo [WARNING] Failed to set commands
)
del commands_result.json >nul 2>&1
echo.

REM Generate configuration
echo [4/4] Generating configuration...

echo.
echo ========================================
echo   Manual Configuration Required
echo ========================================
echo.
echo Send these commands to @BotFather:
echo.
echo 1. SET MENU BUTTON:
echo    /setmenubutton
echo    @!bot_username!
echo    💕 Open HeartMatch
echo    !app_url!
echo.
echo 2. SET DESCRIPTION:
echo    /setdescription
echo    @!bot_username!
echo    Premium dating app for meaningful connections 💕 Find your perfect match!
echo.
echo 3. SET ABOUT TEXT:
echo    /setabouttext
echo    @!bot_username!
echo    HeartMatch - Where hearts connect. Premium features, real connections.
echo.
echo 4. SET SHORT DESCRIPTION:
echo    /setshortdescription
echo    @!bot_username!
echo    Premium dating app 💕
echo.

REM Update .env.local
echo Updating .env.local file...
if exist ".env.local" (
    powershell -Command "(Get-Content .env.local) -replace 'NEXT_PUBLIC_TELEGRAM_BOT_TOKEN=.*', 'NEXT_PUBLIC_TELEGRAM_BOT_TOKEN=!bot_token!' | Set-Content .env.local"
    powershell -Command "(Get-Content .env.local) -replace 'NEXT_PUBLIC_APP_URL=.*', 'NEXT_PUBLIC_APP_URL=!app_url!' | Set-Content .env.local"
    echo [OK] Environment file updated ✓
)

echo.
echo ========================================
echo   Configuration Complete! 🎉
echo ========================================
echo.
echo Your bot: t.me/!bot_username!
echo App URL: !app_url!
echo.
echo Next steps:
echo 1. Complete @BotFather configuration (see commands above)
echo 2. Test your bot by opening t.me/!bot_username!
echo 3. Click the menu button to open your app
echo.
echo Troubleshooting:
echo • Make sure your app is deployed and accessible
echo • Verify HTTPS is enabled (required for Telegram)
echo • Check bot token in .env.local
echo.

set /p open_bot="Open bot in browser? (y/n): "
if /i "!open_bot!"=="y" (
    start https://t.me/!bot_username!
)

pause