# Push this project to GitHub

## 1) Install Git (Windows)
Download and install Git:
https://git-scm.com/download/win

Then close and reopen PowerShell.

## 2) Create an empty GitHub repo
On GitHub, create a new repository (without README/license/gitignore).
Copy the repo URL, for example:
https://github.com/your-username/FLASHMASTER.git

## 3) Push everything from this folder
From this folder:
C:\Users\hp\OneDrive\Desktop\FLASHMASTER

Run:

```powershell
.\push-to-github.ps1 -RepoUrl "https://github.com/your-username/FLASHMASTER.git"
```

If you want a different branch name:

```powershell
.\push-to-github.ps1 -RepoUrl "https://github.com/your-username/FLASHMASTER.git" -Branch "main"
```

## Manual commands (if you prefer)

```powershell
git init
git checkout -B main
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/your-username/FLASHMASTER.git
git push -u origin main
```
