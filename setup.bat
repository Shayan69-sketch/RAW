@echo off
echo.
echo ============================================
echo    RAWTHREAD - Full Stack Setup Script
echo ============================================
echo.

REM Check if Node.js is installed
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Node.js is not installed!
    echo Please download and install Node.js from: https://nodejs.org/
    echo Get the LTS version (v20+)
    pause
    exit /b 1
)
echo [OK] Node.js found: 
node --version

REM Check if npm is available
where npm >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] npm is not found. Please reinstall Node.js.
    pause
    exit /b 1
)
echo [OK] npm found:
npm --version

echo.
echo ============================================
echo  Step 1: Installing Server Dependencies
echo ============================================
echo.
cd /d "%~dp0server"
call npm install
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Server npm install failed!
    pause
    exit /b 1
)
echo [OK] Server dependencies installed

echo.
echo ============================================
echo  Step 2: Installing Client Dependencies
echo ============================================
echo.
cd /d "%~dp0client"
call npm install
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Client npm install failed!
    pause
    exit /b 1
)
echo [OK] Client dependencies installed

echo.
echo ============================================
echo  SETUP COMPLETE!
echo ============================================
echo.
echo  IMPORTANT: You need MongoDB running before starting the server.
echo.
echo  Option A: Use MongoDB Atlas (FREE cloud database)
echo    1. Go to: https://www.mongodb.com/atlas
echo    2. Create a free account and cluster
echo    3. Get your connection string
echo    4. Update server\.env: MONGO_URI=mongodb+srv://user:pass@cluster.mongodb.net/rawthread
echo.
echo  Option B: Install MongoDB locally
echo    1. Download from: https://www.mongodb.com/try/download/community
echo    2. Install with default settings
echo    3. It runs automatically on mongodb://localhost:27017
echo.
echo  THEN RUN:
echo    Terminal 1:  cd server ^&^& npm run dev
echo    Terminal 2:  cd client ^&^& npm run dev
echo    Terminal 3:  cd server ^&^& npm run seed   (to populate test data)
echo.
echo  Demo Logins (after seeding):
echo    Admin: admin@rawthread.com / admin123456
echo    User:  john@example.com / password123
echo.
echo  Frontend: http://localhost:5173
echo  Backend:  http://localhost:5000
echo.
pause
