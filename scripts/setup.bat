@echo off
mklink .git\hooks\pre-push scripts\pre-push
git config push.followTags true