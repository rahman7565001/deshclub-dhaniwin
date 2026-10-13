@echo off
title Deshclub Local Server
echo ===================================================
echo           Deshclub Local Server Running
echo ===================================================
echo App URL:        http://localhost:8000
echo Cashier URL:    http://localhost:8000/pay/
echo Admin URL:      http://localhost:8000/admin
echo Admin Login:    admin / admin123
echo ===================================================
echo Starting PHP 8.2 backend on port 8080...
start /B "" "C:\Users\MD RAHMAN\Downloads\php82\php.exe" -S 127.0.0.1:8080 router.php > nul 2>&1
timeout /t 1 > nul
echo Starting Node.js server on port 8000...
node server.js
