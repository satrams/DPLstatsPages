@ECHO OFF
echo Press any key to run bot
pause
echo running the bot...
cd %~dp0
set /p input=input the table you want to see: 
START cmd.exe /k node ./Database/dbViewTables.js %input%
