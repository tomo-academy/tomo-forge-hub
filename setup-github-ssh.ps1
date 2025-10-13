# TOMO Academy - GitHub SSH Setup Script (PowerShell)
# This script automates SSH key generation and setup for GitHub

Write-Host "🚀 TOMO Academy - GitHub SSH Setup" -ForegroundColor Cyan
Write-Host "==================================" -ForegroundColor Cyan
Write-Host ""

# Get user email
$githubEmail = Read-Host "📧 Enter your GitHub email address"

if ([string]::IsNullOrWhiteSpace($githubEmail)) {
    Write-Host "❌ Email cannot be empty!" -ForegroundColor Red
    exit 1
}

# Set SSH key path
$sshPath = "$env:USERPROFILE\.ssh"
$keyPath = "$sshPath\id_ed25519"

# Create .ssh directory if it doesn't exist
if (!(Test-Path $sshPath)) {
    New-Item -ItemType Directory -Path $sshPath | Out-Null
}

# Check if SSH key already exists
if (Test-Path $keyPath) {
    Write-Host ""
    Write-Host "⚠️  SSH key already exists at $keyPath" -ForegroundColor Yellow
    $overwrite = Read-Host "Do you want to overwrite it? (y/N)"
    if ($overwrite -ne "y" -and $overwrite -ne "Y") {
        Write-Host "Using existing SSH key..." -ForegroundColor Green
    } else {
        Write-Host "Generating new SSH key..." -ForegroundColor Cyan
        ssh-keygen -t ed25519 -C $githubEmail -f $keyPath -N '""'
    }
} else {
    Write-Host ""
    Write-Host "🔑 Generating SSH key..." -ForegroundColor Cyan
    ssh-keygen -t ed25519 -C $githubEmail -f $keyPath -N '""'
}

Write-Host ""
Write-Host "✅ SSH key generated successfully!" -ForegroundColor Green
Write-Host ""

# Start SSH agent
Write-Host "🔧 Starting SSH agent..." -ForegroundColor Cyan
Start-Service ssh-agent -ErrorAction SilentlyContinue
Set-Service ssh-agent -StartupType Automatic -ErrorAction SilentlyContinue

# Add SSH key to agent
Write-Host "🔐 Adding SSH key to agent..." -ForegroundColor Cyan
ssh-add $keyPath

Write-Host ""
Write-Host "✅ SSH key added to agent!" -ForegroundColor Green
Write-Host ""

# Display and copy the public key
$publicKey = Get-Content "$keyPath.pub"
Write-Host "📋 Your SSH Public Key:" -ForegroundColor Cyan
Write-Host "==================================" -ForegroundColor Cyan
Write-Host $publicKey -ForegroundColor Yellow
Write-Host "==================================" -ForegroundColor Cyan
Write-Host ""

# Copy to clipboard
$publicKey | Set-Clipboard
Write-Host "✅ Public key copied to clipboard!" -ForegroundColor Green
Write-Host ""

Write-Host "📝 Next Steps:" -ForegroundColor Cyan
Write-Host "1. Go to: https://github.com/settings/ssh/new" -ForegroundColor White
Write-Host "2. Title: TOMO Academy Laptop" -ForegroundColor White
Write-Host "3. Paste the key (already in clipboard)" -ForegroundColor White
Write-Host "4. Click 'Add SSH key'" -ForegroundColor White
Write-Host ""

# Open GitHub SSH settings in browser
$openBrowser = Read-Host "Open GitHub SSH settings in browser? (Y/n)"
if ($openBrowser -ne "n" -and $openBrowser -ne "N") {
    Start-Process "https://github.com/settings/ssh/new"
}

# Wait for user to add key to GitHub
Write-Host ""
Read-Host "Press Enter after you've added the key to GitHub"

Write-Host ""
Write-Host "🧪 Testing GitHub connection..." -ForegroundColor Cyan
$testResult = ssh -T git@github.com 2>&1
if ($testResult -match "successfully authenticated") {
    Write-Host "✅ GitHub connection successful!" -ForegroundColor Green
} else {
    Write-Host "⚠️  Connection test completed (warnings are normal for first time)" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "🔄 Updating Git remote to use SSH..." -ForegroundColor Cyan

# Check if we're in a git repository
if (Test-Path ".git") {
    try {
        $currentUrl = git remote get-url origin 2>$null
        
        if ($currentUrl -match "https://github.com/(.+)") {
            $repoPath = $matches[1] -replace "\.git$", ""
            $newUrl = "git@github.com:$repoPath.git"
            
            Write-Host "Changing remote from:" -ForegroundColor Yellow
            Write-Host "  $currentUrl" -ForegroundColor White
            Write-Host "to:" -ForegroundColor Yellow
            Write-Host "  $newUrl" -ForegroundColor White
            
            git remote set-url origin $newUrl
            Write-Host "✅ Remote updated to SSH!" -ForegroundColor Green
        } else {
            Write-Host "ℹ️  Remote is already using SSH or custom URL" -ForegroundColor Cyan
        }
    } catch {
        Write-Host "⚠️  Could not update remote URL" -ForegroundColor Yellow
    }
} else {
    Write-Host "⚠️  Not in a git repository" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "🎉 Setup Complete!" -ForegroundColor Green
Write-Host ""
Write-Host "📤 Ready to push to GitHub:" -ForegroundColor Cyan
Write-Host "   git push origin main" -ForegroundColor Yellow
Write-Host ""
Write-Host "🔑 Your SSH public key (save this):" -ForegroundColor Cyan
Write-Host $publicKey -ForegroundColor Yellow
Write-Host ""

# Save key to file for reference
$keyFile = "SSH_PUBLIC_KEY.txt"
$publicKey | Out-File $keyFile -Encoding UTF8
Write-Host "💾 Public key also saved to: $keyFile" -ForegroundColor Green
Write-Host ""
