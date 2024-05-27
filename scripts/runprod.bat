@echo off
cd %~dp0\..
set cmd=
if not exist dist\uesrpg-combat-helper\index.html set "cmd=npm run build &&"
%cmd% npx --yes live-server dist\uesrpg-combat-helper --port=8247