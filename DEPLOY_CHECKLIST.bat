@echo off
REM Quick Production Deployment Checklist for Windows
REM ===================================================

echo.
echo ==================================================
echo Buddy Script - Production Deployment Checklist
echo ==================================================
echo.

echo Step 1: Initialize Git Repository
echo  [ ] Open Git Bash or terminal in project folder
echo  [ ] Run: git init
echo  [ ] Run: git add .
echo  [ ] Run: git commit -m "Production ready setup"
echo  [ ] Create new repo on GitHub.com
echo  [ ] Run: git remote add origin https://github.com/YOUR_USERNAME/Appifylab.git
echo  [ ] Run: git branch -M main
echo  [ ] Run: git push -u origin main
echo.

echo Step 2: Deploy Backend on Render
echo  [ ] Go to https://render.com
echo  [ ] Sign in (create account if needed)
echo  [ ] Click "New +" button
echo  [ ] Select "Web Service"
echo  [ ] Connect GitHub repo "Appifylab"
echo  [ ] Settings:
echo       - Name: buddy-script-api
echo       - Environment: Python
echo       - Plan: Free
echo  [ ] Click "Create Web Service"
echo  [ ] Wait 5-10 minutes for deployment
echo  [ ] Copy your Render URL (save it!)
echo       Example: https://buddy-script-api-xxxxx.onrender.com
echo.

echo Step 3: Deploy Frontend on Vercel
echo  [ ] Go to https://vercel.com
echo  [ ] Sign in (create account if needed)
echo  [ ] Click "Add New" button
echo  [ ] Select "Project"
echo  [ ] Import GitHub repo "Appifylab"
echo  [ ] Settings:
echo       - Framework: React
echo       - Root Directory: buddy-frontend
echo       - Build: npm run build
echo       - Output: build
echo  [ ] Environment Variable:
echo       - Key: REACT_APP_API_URL
echo       - Value: paste your Render URL + /api
echo       Example: https://buddy-script-api-xxxxx.onrender.com/api
echo  [ ] Click "Deploy"
echo  [ ] Wait for deployment
echo  [ ] Copy your Vercel URL (save it!)
echo       Example: https://buddy-script-xxxxx.vercel.app
echo.

echo Step 4: Connect Frontend to Backend
echo  [ ] Go back to Render dashboard
echo  [ ] Select "buddy-script-api"
echo  [ ] Click "Settings"
echo  [ ] Find "Environment Variables"
echo  [ ] Edit "CORS_ORIGINS":
echo       - Set to your Vercel URL
echo       Example: https://buddy-script-xxxxx.vercel.app
echo  [ ] Click "Save"
echo  [ ] Service will redeploy automatically
echo.

echo Step 5: Test Everything
echo  [ ] Open your Vercel URL in browser
echo  [ ] Create a new account
echo  [ ] Create a post
echo  [ ] Refresh the page
echo  [ ] Data should still be there
echo  [ ] Share the link with friends!
echo.

echo ==================================================
echo Success! Your app is now live 24/7
echo ==================================================
echo.
echo Your Production URLs:
echo   Frontend: https://buddy-script-xxxxx.vercel.app
echo   Backend:  https://buddy-script-api-xxxxx.onrender.com
echo.
echo Costs: FREE ($0/month)
echo Uptime: 24/7
echo Works when your PC is OFF: YES
echo.
pause
