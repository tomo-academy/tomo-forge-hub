#!/bin/bash

# TOMO Academy - GitHub SSH Setup Script
# This script automates SSH key generation and setup for GitHub

echo "🚀 TOMO Academy - GitHub SSH Setup"
echo "=================================="
echo ""

# Check if Git is installed
if ! command -v git &> /dev/null; then
    echo "❌ Git is not installed. Please install Git first."
    exit 1
fi

# Get user email
echo "📧 Enter your GitHub email address:"
read -p "Email: " github_email

if [ -z "$github_email" ]; then
    echo "❌ Email cannot be empty!"
    exit 1
fi

# Set SSH key path
SSH_KEY_PATH="$HOME/.ssh/id_ed25519"

# Check if SSH key already exists
if [ -f "$SSH_KEY_PATH" ]; then
    echo ""
    echo "⚠️  SSH key already exists at $SSH_KEY_PATH"
    read -p "Do you want to overwrite it? (y/N): " overwrite
    if [[ ! $overwrite =~ ^[Yy]$ ]]; then
        echo "Using existing SSH key..."
    else
        echo "Generating new SSH key..."
        ssh-keygen -t ed25519 -C "$github_email" -f "$SSH_KEY_PATH" -N ""
    fi
else
    echo ""
    echo "🔑 Generating SSH key..."
    ssh-keygen -t ed25519 -C "$github_email" -f "$SSH_KEY_PATH" -N ""
fi

echo ""
echo "✅ SSH key generated successfully!"
echo ""

# Start SSH agent
echo "🔧 Starting SSH agent..."
eval "$(ssh-agent -s)"

# Add SSH key to agent
echo "🔐 Adding SSH key to agent..."
ssh-add "$SSH_KEY_PATH"

echo ""
echo "✅ SSH key added to agent!"
echo ""

# Display the public key
echo "📋 Your SSH Public Key:"
echo "=================================="
cat "${SSH_KEY_PATH}.pub"
echo "=================================="
echo ""

# Copy to clipboard (if available)
if command -v clip.exe &> /dev/null; then
    # Windows (WSL)
    cat "${SSH_KEY_PATH}.pub" | clip.exe
    echo "✅ Public key copied to clipboard!"
elif command -v pbcopy &> /dev/null; then
    # macOS
    cat "${SSH_KEY_PATH}.pub" | pbcopy
    echo "✅ Public key copied to clipboard!"
elif command -v xclip &> /dev/null; then
    # Linux
    cat "${SSH_KEY_PATH}.pub" | xclip -selection clipboard
    echo "✅ Public key copied to clipboard!"
else
    echo "ℹ️  Copy the key above manually"
fi

echo ""
echo "📝 Next Steps:"
echo "1. Go to: https://github.com/settings/ssh/new"
echo "2. Title: TOMO Academy Laptop"
echo "3. Paste the key above"
echo "4. Click 'Add SSH key'"
echo ""

# Wait for user to add key to GitHub
read -p "Press Enter after you've added the key to GitHub..."

echo ""
echo "🧪 Testing GitHub connection..."
ssh -T git@github.com 2>&1 | grep -q "successfully authenticated" && echo "✅ GitHub connection successful!" || echo "⚠️  Connection test - you may see a warning, that's normal if this is first time"

echo ""
echo "🔄 Updating Git remote to use SSH..."
cd "$(dirname "$0")"

# Check if we're in a git repository
if [ -d .git ]; then
    # Get current remote URL
    current_url=$(git remote get-url origin 2>/dev/null)
    
    if [[ $current_url == https://github.com/* ]]; then
        # Extract repo path from HTTPS URL
        repo_path=$(echo $current_url | sed 's|https://github.com/||' | sed 's|.git||')
        new_url="git@github.com:${repo_path}.git"
        
        echo "Changing remote from:"
        echo "  $current_url"
        echo "to:"
        echo "  $new_url"
        
        git remote set-url origin "$new_url"
        echo "✅ Remote updated to SSH!"
    else
        echo "ℹ️  Remote is already using SSH or custom URL"
    fi
else
    echo "⚠️  Not in a git repository"
fi

echo ""
echo "🎉 Setup Complete!"
echo ""
echo "📤 Ready to push to GitHub:"
echo "   git push origin main"
echo ""
echo "🔑 Your SSH public key (save this):"
cat "${SSH_KEY_PATH}.pub"
echo ""
