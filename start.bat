@echo off
title PRP Music Platform
color 0A

echo.
echo ========================================
echo    PRP MUSIC PLATFORM - DEMARRAGE
echo ========================================
echo.

echo [1/3] Demarrage du Backend...
start "PRP Backend" cmd /k "cd /d %~dp0backend && echo Backend PRP Music Platform && echo. && npm run dev"

echo [2/3] Attente de 5 secondes...
timeout /t 5 /nobreak > nul

echo [3/3] Demarrage du Frontend...
start "PRP Frontend" cmd /k "cd /d %~dp0 && echo Frontend PRP Music Platform && echo. && npm run dev"

echo.
echo ========================================
echo    PLATEFORME DEMARREE !
echo ========================================
echo.
echo Frontend: http://localhost:3000
echo Backend:  http://localhost:3001
echo.
echo Compte de test:
echo Email: test@example.com
echo Mot de passe: password123
echo.
echo Appuyez sur une touche pour fermer cette fenetre...
pause > nul