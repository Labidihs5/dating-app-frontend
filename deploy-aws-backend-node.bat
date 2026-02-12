@echo off
echo ========================================
echo Deploiement du Backend Node.js sur AWS
echo ========================================
echo.

cd backend

REM Verifier si EB CLI est installe
where eb >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo Installation d'EB CLI...
    pip install awsebcli
)

REM Creer .ebignore
echo node_modules/> .ebignore
echo .env>> .ebignore
echo .git/>> .ebignore
echo uploads/>> .ebignore
echo *.log>> .ebignore

REM Initialiser EB
if not exist .elasticbeanstalk (
    echo Initialisation d'Elastic Beanstalk...
    eb init heartmatch-backend-node --platform node.js --region eu-west-1
)

REM Demander les informations
set /p RDS_ENDPOINT="Entrez l'endpoint RDS: "
set /p RDS_PASSWORD="Entrez le mot de passe RDS: "
set /p JWT_SECRET="Entrez le JWT_SECRET: "

REM Creer l'environnement
eb create heartmatch-backend-node-env --instance-type t3.micro

REM Configurer les variables
eb setenv DATABASE_URL="postgresql://postgres:%RDS_PASSWORD%@%RDS_ENDPOINT%:5432/heartmatch" NODE_ENV=production PORT=8080 JWT_SECRET="%JWT_SECRET%" UPLOAD_PATH="/tmp/uploads" MAX_FILE_SIZE=5242880

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
