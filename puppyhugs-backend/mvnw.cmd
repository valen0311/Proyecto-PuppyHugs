@echo off
REM mvnw.cmd - launcher for mvnw.ps1
SET SCRIPT_DIR=%~dp0
Powershell -NoProfile -ExecutionPolicy Bypass -File "%SCRIPT_DIR%mvnw.ps1" %*
EXIT /b %ERRORLEVEL%
