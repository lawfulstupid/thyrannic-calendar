@echo off
cd %~dp0\..
set cmd=
if not exist dist\interactive-thyrannic-calendar\index.html set "cmd=npm run build &&"
%cmd% npx --yes live-server dist\interactive-thyrannic-calendar --port=8247