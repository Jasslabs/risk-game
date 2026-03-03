@echo off
REM Risk Game Setup Script
REM This script helps set up and test the Risk Game

echo.
echo ====================================
echo   RISK GAME - Setup Wizard
echo ====================================
echo.

REM Check if XAMPP is running
echo Checking XAMPP status...
netstat -an | find "3306" >nul
if %errorlevel%==0 (
    echo [✓] MySQL is running
) else (
    echo [!] MySQL may not be running. Please start XAMPP MySQL.
)

netstat -an | find "80" >nul
if %errorlevel%==0 (
    echo [✓] Apache appears to be running
) else (
    echo [!] Apache may not be running. Please start XAMPP Apache.
)

echo.
echo ====================================
echo   Game Files Status
echo ====================================
echo.

if exist "%cd%\index.html" (
    echo [✓] index.html found
) else (
    echo [✗] index.html missing
)

if exist "%cd%\css\styles.css" (
    echo [✓] css/styles.css found
) else (
    echo [✗] css/styles.css missing
)

if exist "%cd%\js\game.js" (
    echo [✓] js/game.js found
) else (
    echo [✗] js/game.js missing
)

if exist "%cd%\js\graphics.js" (
    echo [✓] js/graphics.js found
) else (
    echo [✗] js/graphics.js missing
)

if exist "%cd%\js\animations.js" (
    echo [✓] js/animations.js found
) else (
    echo [✗] js/animations.js missing
)

if exist "%cd%\js\ai.js" (
    echo [✓] js/ai.js found
) else (
    echo [✗] js/ai.js missing
)

if exist "%cd%\php\api.php" (
    echo [✓] php/api.php found
) else (
    echo [✗] php/api.php missing
)

if exist "%cd%\php\db.php" (
    echo [✓] php/db.php found
) else (
    echo [✗] php/db.php missing
)

echo.
echo ====================================
echo   Setup Complete!
echo ====================================
echo.
echo Next steps:
echo 1. Open your browser and go to: http://localhost/aiprojectcopilot/
echo 2. Click "Start New Game" to begin playing
echo 3. Select number of players and enter names
echo 4. Click on territories to attack adjacent enemies
echo.
echo For online hosting:
echo - Upload all files to your web server
echo - Create MySQL database named 'risk_game'
echo - Update database credentials in php/db.php
echo.
pause
