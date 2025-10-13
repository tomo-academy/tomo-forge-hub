# GitHub SSH Key Setup Guide

## Step 1: Generate SSH Key

Open PowerShell or Git Bash and run:

```bash
ssh-keygen -t ed25519 -C "your_email@example.com"
```

**Replace** `your_email@example.com` with your actual GitHub email.

When prompted:
- Press **Enter** to save to default location (`C:\Users\YourName\.ssh\id_ed25519`)
- Enter a passphrase (optional but recommended)
- Confirm the passphrase

## Step 2: Start SSH Agent

```bash
# Start the ssh-agent in the background
eval "$(ssh-agent -s)"

# Add your SSH private key to the ssh-agent
ssh-add ~/.ssh/id_ed25519
```

## Step 3: Copy Your Public Key

```bash
# Windows (PowerShell)
Get-Content ~/.ssh/id_ed25519.pub | clip

# Or manually open and copy
notepad ~/.ssh/id_ed25519.pub
```

Your public key will look like:
```
ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAIJl3dIeudNqd0DPMRD6OIh65A9gg2L/cR4H2JfFGKqPe your_email@example.com
```

## Step 4: Add SSH Key to GitHub

1. Go to **GitHub.com** → Click your profile picture → **Settings**
2. Click **SSH and GPG keys** in the left sidebar
3. Click **New SSH key** button
4. Give it a title (e.g., "TOMO Academy Laptop")
5. Paste your public key into the "Key" field
6. Click **Add SSH key**

## Step 5: Test Connection

```bash
ssh -T git@github.com
```

You should see:
```
Hi username! You've successfully authenticated, but GitHub does not provide shell access.
```

## Step 6: Update Git Remote to Use SSH

```bash
# Navigate to your project
cd E:\tomo-forge-hub

# Check current remote
git remote -v

# Change from HTTPS to SSH
git remote set-url origin git@github.com:tomo-academy/tomo-forge-hub.git

# Verify the change
git remote -v
```

## Step 7: Push to GitHub

```bash
# Add all changes
git add .

# Commit
git commit -m "🚀 Advanced Features: Analytics Dashboard, Notifications & Logo Updates"

# Push to GitHub
git push origin main
```

## Troubleshooting

### If repository doesn't exist:
1. Go to https://github.com/tomo-academy
2. Click **New repository**
3. Name it: `tomo-forge-hub`
4. **Do NOT** initialize with README
5. Click **Create repository**
6. Then push your code

### Permission Denied Error:
```bash
# Make sure SSH key is added to agent
ssh-add -l

# If empty, add it again
ssh-add ~/.ssh/id_ed25519
```

### Host Key Verification Failed:
```bash
# Add GitHub to known hosts
ssh-keyscan github.com >> ~/.ssh/known_hosts
```

## Alternative: Using GitHub CLI

If you prefer, you can use GitHub CLI:

```bash
# Install GitHub CLI
winget install --id GitHub.cli

# Authenticate
gh auth login

# Create repository and push
gh repo create tomo-academy/tomo-forge-hub --public --source=. --remote=origin --push
```

---

## Quick Commands Summary

```bash
# 1. Generate key
ssh-keygen -t ed25519 -C "your_email@example.com"

# 2. Start agent and add key
eval "$(ssh-agent -s)"
ssh-add ~/.ssh/id_ed25519

# 3. Copy public key
Get-Content ~/.ssh/id_ed25519.pub | clip

# 4. Add to GitHub (manual step on website)

# 5. Test connection
ssh -T git@github.com

# 6. Update remote
git remote set-url origin git@github.com:tomo-academy/tomo-forge-hub.git

# 7. Push
git push origin main
```

---

**Note**: Keep your private key (`id_ed25519`) secure and never share it!
