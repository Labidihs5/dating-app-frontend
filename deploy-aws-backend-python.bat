@echo off
echo =========================================
echo Deploiement du Backend Python sur AWS
echo =========================================
echo.

cd backend-python

REM Verifier si EB CLI est installe
where eb >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo Installation d'EB CLI...
    pip install awsebcli
)

REM Creer .ebignore
echo __pycache__/> .ebignore
echo *.pyc>> .ebignore
echo .env>> .ebignore
echo .git/>> .ebignore
echo venv/>> .ebignore
echo *.log>> .ebignore

REM Creer Procfile
echo web: uvicorn app.main:app --host 0.0.0.0 --port 8080> Procfile

REM Initialiser EB
if not exist .elasticbeanstalk (
    echo Initialisation d'Elastic Beanstalk...
    eb init heartmatch-backend-python --platform python-3.9 --region eu-west-1
)

REM Demander les informations
set /p RDS_ENDPOINT="Entrez l'endpoint RDS: "
set /p RDS_PASSWORD="Entrez le mot de passe RDS: "
set /p SECRET_KEY="Entrez le SECRET_KEY: "
set /p BACKEND_NODE_URL="Entrez l'URL du backend Node.js: "

REM Creer l'environnement
eb create heartmatch-backend-python-env --instance-type t3.micro

REM Configurer les variables
eb setenv DATABASE_URL="postgresql://postgres:%RDS_PASSWORD%@%RDS_ENDPOINT%:5432/heartmatch" SECRET_KEY="%SECRET_KEY%" BACKEND_NODE_URL="%BACKEND_NODE_URL%" ALLOWED_ORIGINS="*"

REM Deployer
eb deploy

REM Afficher le statut
eb status

echo.
echo Deploiement termine !
echo Pour voir les logs: eb logs
echo Pour redéployer: eb deploy

cd ..
pause
