@ECHO OFF
echo Press any key to run the server
pause
echo running the server
cd %~dp0
START cmd.exe /k node server.js
