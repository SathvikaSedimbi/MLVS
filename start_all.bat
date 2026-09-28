@echo off
cd /d "d:\MLVS"
echo Starting NMDC MLVS Backend...
start "MLVS-Backend" cmd /c "d:\MLVS\start_backend.bat"
timeout /t 3 /nobreak >nul
echo Starting NMDC MLVS Frontend...
start "MLVS-Frontend" cmd /c "d:\MLVS\start_frontend.bat"
echo Both servers launched in background windows.
