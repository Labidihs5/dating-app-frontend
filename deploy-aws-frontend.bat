@echo off
echo =====================================
echo Deploiement du Frontend sur AWS
echo =====================================
echo.

REM Demander les URLs des backends
set /p BACKEND_NODE_URL="Entrez l'URL du backend Node.js: "
set /p BACKEND_PYTHON_URL="Entrez l'URL du backend Python: "

REM Creer .env.production
echo NEXT_PUBLIC_API_URL=%BACKEND_NODE_URL%/api> .env.production
echo NEXT_PUBLIC_PYTHON_API_URL=%BACKEND_PYTHON_URL%>> .env.production

echo Fichier .env.production cree
echo.

REM Build l'application
echo Build de l'application Next.js...
call npm install
call npm run build

if %ERRORLEVEL% NEQ 0 (
    echo Erreur lors du build
    pause
    exit /b 1
)

echo.
echo Build reussi !
echo.
echo ========================================
echo Prochaines etapes pour deployer sur Amplify:
echo ========================================
echo.
echo Option 1 - Via AWS Console (Recommande):
echo   1. Allez sur https://console.aws.amazon.com/amplify
echo   2. Cliquez 'New app' -^> 'Host web app'
echo   3. Choisissez 'Deploy without Git' ou connectez votre repo GitHub
echo   4. Configurez les variables d'environnement:
echo      NEXT_PUBLIC_API_URL=%BACKEND_NODE_URL%/api
echo      NEXT_PUBLIC_PYTHON_API_URL=%BACKEND_PYTHON_URL%
echo   5. Deployez !
echo.
echo Option 2 - Via Git (si vous avez un repo):
echo   1. Poussez votre code sur GitHub
echo   2. Connectez le repo dans Amplify Console
echo   3. Amplify detectera automatiquement Next.js
echo.
echo Votre build est pret dans le dossier .next/
echo.

pause
