@echo off
cd /d "d:\MLVS"
python -m uvicorn backend.main:app --host 0.0.0.0 --port 8000
