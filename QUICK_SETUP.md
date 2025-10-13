# 🚀 Quick GitHub SSH Setup

## For Windows Users (Recommended)

### Option 1: PowerShell Script (Easiest)

1. **Open PowerShell as Administrator**
   - Right-click PowerShell → "Run as Administrator"

2. **Navigate to project folder**
   ```powershell
   cd E:\tomo-forge-hub
   ```

3. **Run the setup script**
   ```powershell
   .\setup-github-ssh.ps1
   ```

4. **Follow the prompts:**
   - Enter your GitHub email
   - Script will automatically:
     - Generate SSH key
     - Copy it to clipboard
     - Open GitHub in browser
   - Paste the key on GitHub
   - Press Enter to continue

5. **Done!** Push your code:
   ```powershell
   git push origin main
   ```

---

### Option 2: Git Bash Script

1. **Open Git Bash**

2. **Navigate to project**
   ```bash
   cd /e/tomo-forge-hub
   ```

3. **Make script executable**
   ```bash
   chmod +x setup-github-ssh.sh
   ```

4. **Run the script**
   ```bash
   ./setup-github-ssh.sh
   ```

5. **Follow the prompts and you're done!**

---

## Manual Steps (If Scripts Don't Work)

### Step 1: Generate Key
```bash
ssh-keygen -t ed25519 -C "your_email@example.com"
```
Press Enter 3 times (default location, no passphrase)

### Step 2: Copy Key
```powershell
Get-Content ~/.ssh/id_ed25519.pub | clip
```

### Step 3: Add to GitHub
1. Go to: https://github.com/settings/ssh/new
2. Title: **TOMO Academy Laptop**
3. Paste the key
4. Click **Add SSH key**

### Step 4: Update Remote
```bash
git remote set-url origin git@github.com:tomo-academy/tomo-forge-hub.git
```

### Step 5: Push
```bash
git push origin main
```

---

## 🔑 Your SSH Key Will Look Like This:

```
ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAIJl3dIeudNqd0DPMRD6OIh65A9gg2L/cR4H2JfFGKqPe your_email@example.com
```

**Copy the ENTIRE line** (starting with `ssh-ed25519` and ending with your email)

---

## ✅ After Adding Key to GitHub

The script will automatically:
- ✅ Test the connection
- ✅ Update your git remote to SSH
- ✅ Save your public key to `SSH_PUBLIC_KEY.txt`

Then just run:
```bash
git push origin main
```

---

## 🐛 Troubleshooting

### "Permission Denied"
```powershell
# Run PowerShell as Administrator
# Or allow script execution:
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

### "ssh-agent not found"
```powershell
# Start SSH agent service
Start-Service ssh-agent
Set-Service ssh-agent -StartupType Automatic
```

### "Repository not found"
Make sure the repository exists on GitHub first:
1. Go to https://github.com/tomo-academy
2. Click "New repository"
3. Name: `tomo-forge-hub`
4. Click "Create repository"
5. Then run the script again

---

## 📞 Need Help?

If the automated scripts don't work, use the manual steps above or check `GITHUB_SSH_SETUP.md` for detailed instructions.

---

**That's it! Your SSH key will be ready and you can push to GitHub!** 🎉
