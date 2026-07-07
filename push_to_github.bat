@echo off
echo Starting GitHub Repository clean setup for ArenaIQ...
cd /d "F:\aa"

:: Delete existing git folder to wipe secret history
if exist .git (
    echo Wiping local git history to clear cached secrets...
    rmdir /s /q .git
)

:: Initialize Git
git init

:: Add files
git add .

:: Commit
git commit -m "Initial commit: ArenaIQ FIFA World Cup 2026 Dashboard"

:: Set branch name
git branch -M main

:: Add remote origin explicitly
git remote add origin https://github.com/abhishekmsm51w-star/ArenaIQ.git

:: Force push to overwrite remote history with clean commits
echo Force-pushing clean commit to GitHub...
git push -u -f origin main

echo.
echo Process completed! Clean code pushed to ArenaIQ repo.
pause
