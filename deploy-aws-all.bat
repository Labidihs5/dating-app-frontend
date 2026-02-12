@echo off
echo ============================================
echo Deploiement Complet de HeartMatch sur AWS
echo ============================================
echo.

REM Verifier les prerequis
where aws >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo AWS CLI n'est pas installe
    echo Installez-le depuis: https://aws.amazon.com/cli/
    pause
    exit /b 1
)

where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo Node.js n'est pas installe
    pause
    exit /b 1
)

where python >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo Python n'est pas installe
    pause
    exit /b 1
)

echo Tous les prerequis sont installes
echo.

REM Collecter les informations
echo [ETAPE 1] Collecte des informations
echo.

set /p AWS_REGION="Region AWS (ex: eu-west-1): "
set /p RDS_ENDPOINT="Endpoint RDS PostgreSQL: "
set /p RDS_PASSWORD="Mot de passe RDS: "
set /p JWT_SECRET="JWT Secret: "
set /p SECRET_KEY="Secret Key (Python): "

echo.
echo Recapitulatif:
echo   - Region: %AWS_REGION%
echo   - RDS Endpoint: %RDS_ENDPOINT%
echo   - JWT Secret: [MASQUE]
echo   - Secret Key: [MASQUE]
echo.

set /p CONFIRM="Continuer avec ces parametres ? (y/n): "
if /i not "%CONFIRM%"=="y" (
    echo Deploiement annule
    pause
    exit /b 0
)

REM Installer EB CLI
where eb >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo [ETAPE 2] Installation d'Elastic Beanstalk CLI...
    pip install awsebcli
)

REM Deployer Backend Node.js
echo.
echo [ETAPE 3] Deploiement du Backend Node.js...
echo.

cd backend

echo node_modules/> .ebignore
echo .env>> .ebignore
echo .git/>> .ebignore
echo uploads/>> .ebignore
echo *.log>> .ebignore

if not exist .elasticbeanstalk (
    eb init heartmatch-backend-node --platform node.js --region %AWS_REGION%
)

eb create heartmatch-backend-node-env --instance-type t3.micro

eb setenv DATABASE_URL="postgresql://postgres:%RDS_PASSWORD%@%RDS_ENDPOINT%:5432/heartmatch" NODE_ENV=production PORT=8080 JWT_SECRET="%JWT_SECRET%" UPLOAD_PATH="/tmp/uploads" MAX_FILE_SIZE=5242880

eb deploy

REM Recuperer l'URL
for /f "tokens=2" %%i in ('eb status ^| findstr "CNAME"') do set BACKEND_NODE_URL=http://%%i

echo Backend Node.js deploye: %BACKEND_NODE_URL%

cd ..

REM Deployer Backend Python
echo.
echo [ETAPE 4] Deploiement du Backend Python...
echo.

cd backend-python

echo __pycache__/> .ebignore
echo *.pyc>> .ebignore
echo .env>> .ebignore
echo .git/>> .ebignore
echo venv/>> .ebignore

echo web: uvicorn app.main:app --host 0.0.0.0 --port 8080> Procfile

if not exist .elasticbeanstalk (
    eb init heartmatch-backend-python --platform python-3.9 --region %AWS_REGION%
)

eb create heartmatch-backend-python-env --instance-type t3.micro

eb setenv DATABASE_URL="postgresql://postgres:%RDS_PASSWORD%@%RDS_ENDPOINT%:5432/heartmatch" SECRET_KEY="%SECRET_KEY%" BACKEND_NODE_URL="%BACKEND_NODE_URL%" ALLOWED_ORIGINS="*"

eb deploy

REM Recuperer l'URL
for /f "tokens=2" %%i in ('eb status ^| findstr "CNAME"') do set BACKEND_PYTHON_URL=http://%%i

echo Backend Python deploye: %BACKEND_PYTHON_URL%

cd ..

REM Preparer le Frontend
echo.
echo [ETAPE 5] Preparation du Frontend...
echo.

echo NEXT_PUBLIC_API_URL=%BACKEND_NODE_URL%/api> .env.production
echo NEXT_PUBLIC_PYTHON_API_URL=%BACKEND_PYTHON_URL%>> .env.production

call npm install
call npm run build

echo Frontend builde avec succes

REM Executer les migrations
echo.
echo [ETAPE 6] Execution des migrations Prisma...
echo.

cd backend
eb ssh --command "cd /var/app/current && npx prisma migrate deploy && npx prisma generate"
cd ..

echo.
echo ============================================
echo DEPLOIEMENT TERMINE !
echo ============================================
echo.
echo URLs de vos services:
echo   Backend Node.js: %BACKEND_NODE_URL%
echo   Backend Python:  %BACKEND_PYTHON_URL%
echo.
echo Prochaines etapes pour le Frontend:
echo   1. Allez sur https://console.aws.amazon.com/amplify
echo   2. Creez une nouvelle app
echo   3. Uploadez le dossier .next/ ou connectez votre repo Git
echo   4. Configurez les variables d'environnement:
echo      NEXT_PUBLIC_API_URL=%BACKEND_NODE_URL%/api
echo      NEXT_PUBLIC_PYTHON_API_URL=%BACKEND_PYTHON_URL%
echo.
echo Commandes utiles:
echo   Backend Node.js: cd backend ^&^& eb status
echo   Backend Python: cd backend-python ^&^& eb status
echo.

pause
