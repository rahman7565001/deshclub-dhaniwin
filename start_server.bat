@echo off
title Dhani Local Server
echo ===================================================
echo           Dhani.win Local Server Running
echo ===================================================
echo App URL:    http://localhost:8000
echo Admin URL:  http://localhost:8000/admin
echo Admin Login: admin / admin123
echo ===================================================
echo Press Ctrl+C to stop the server.
echo.
"C:\Users\MD RAHMAN\Downloads\php82\php.exe" -S localhost:8000 router.php
pause
