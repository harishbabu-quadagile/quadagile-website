#!/bin/bash

# QuadAgile - Complete Setup & Deployment Script
# This script sets up the entire project and deploys to Hostinger

set -e  # Exit on any error

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Banner
echo -e "${CYAN}"
echo "╔═══════════════════════════════════════════════════════════════╗"
echo "║                                                               ║"
echo "║   🚀 QuadAgile - Complete Setup & One-Click Deployment       ║"
echo "║                                                               ║"
echo "╚═══════════════════════════════════════════════════════════════╝"
echo -e "${NC}"
echo ""

# Get script directory
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

# Function to print sections
print_section() {
    echo ""
    echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo -e "${BLUE}  $1${NC}"
    echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo ""
}

# Function to ask for input
ask_input() {
    local prompt="$1"
    local var_name="$2"
    local is_password="${3:-false}"
    
    if [ "$is_password" = true ]; then
        read -rsp "$prompt: " value
        echo ""
    else
        read -rp "$prompt: " value
    fi
    
    eval "$var_name='$value'"
}

# Check if running in interactive mode
if [ -t 0 ]; then
    INTERACTIVE=true
else
    INTERACTIVE=false
fi

print_section "Step 1: Environment Setup"

# Check if .env exists
if [ -f ".env" ]; then
    echo -e "${YELLOW}⚠ .env file already exists${NC}"
    read -rp "Do you want to reconfigure? (y/N): " reconfigure
    if [[ ! $reconfigure =~ ^[Yy]$ ]]; then
        echo -e "${GREEN}✓ Using existing .env file${NC}"
        source .env
    else
        rm .env
    fi
fi

# Create .env if it doesn't exist
if [ ! -f ".env" ]; then
    echo -e "${YELLOW}Creating .env configuration file...${NC}"
    echo ""
    
    if [ "$INTERACTIVE" = true ]; then
        echo -e "${CYAN}Hostinger FTP Credentials (Required for deployment):${NC}"
        ask_input "FTP Server (e.g., ftp.quadagile.in)" HOSTINGER_FTP_SERVER
        ask_input "FTP Username" HOSTINGER_FTP_USERNAME
        ask_input "FTP Password" HOSTINGER_FTP_PASSWORD true
        echo ""
        
        echo -e "${CYAN}Frontend Configuration:${NC}"
        ask_input "API URL (default: https://api.quadagile.in)" VITE_API_URL
        VITE_API_URL=${VITE_API_URL:-https://api.quadagile.in}
        
        ask_input "Google reCAPTCHA Site Key (optional)" VITE_RECAPTCHA_SITE_KEY
        ask_input "Google Analytics 4 ID (optional, e.g., G-XXXXXXXXXX)" VITE_GA4_ID
        echo ""
        
        echo -e "${CYAN}Backend Configuration (optional):${NC}"
        ask_input "SSH Host (optional)" HOSTINGER_SSH_HOST
        if [ -n "$HOSTINGER_SSH_HOST" ]; then
            ask_input "SSH Username" HOSTINGER_SSH_USERNAME
            ask_input "SSH Password" HOSTINGER_SSH_PASSWORD true
        fi
        echo ""
    else
        # Non-interactive mode - copy example
        echo -e "${YELLOW}Running in non-interactive mode${NC}"
        echo -e "${YELLOW}Please edit .env file manually after setup${NC}"
    fi
    
    # Create .env file
    cat > .env <<EOF
# Hostinger Deployment Credentials
HOSTINGER_FTP_SERVER=${HOSTINGER_FTP_SERVER:-ftp.quadagile.in}
HOSTINGER_FTP_USERNAME=${HOSTINGER_FTP_USERNAME:-}
HOSTINGER_FTP_PASSWORD=${HOSTINGER_FTP_PASSWORD:-}

# SSH Credentials (optional)
HOSTINGER_SSH_HOST=${HOSTINGER_SSH_HOST:-}
HOSTINGER_SSH_USERNAME=${HOSTINGER_SSH_USERNAME:-}
HOSTINGER_SSH_PASSWORD=${HOSTINGER_SSH_PASSWORD:-}

# Frontend Environment
VITE_API_URL=${VITE_API_URL:-https://api.quadagile.in}
VITE_RECAPTCHA_SITE_KEY=${VITE_RECAPTCHA_SITE_KEY:-}
VITE_GA4_ID=${VITE_GA4_ID:-}
EOF
    
    echo -e "${GREEN}✓ .env file created${NC}"
    echo ""
fi

# Source the .env file
set -a
source .env
set +a

print_section "Step 2: Installing Dependencies"

# Check Node.js
if ! command -v node &> /dev/null; then
    echo -e "${RED}❌ Node.js is not installed${NC}"
    echo "Please install Node.js 18+ from https://nodejs.org"
    exit 1
fi

NODE_VERSION=$(node --version | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo -e "${RED}❌ Node.js 18+ required (found $(node --version))${NC}"
    exit 1
fi

echo -e "${GREEN}✓ Node.js $(node --version)${NC}"

# Install frontend dependencies
echo ""
echo -e "${YELLOW}Installing frontend dependencies...${NC}"
cd app
if [ ! -d "node_modules" ]; then
    npm ci
else
    echo -e "${GREEN}✓ Frontend dependencies already installed${NC}"
fi
cd ..

# Install backend dependencies
echo ""
echo -e "${YELLOW}Installing backend dependencies...${NC}"
cd backend
if [ ! -d "node_modules" ]; then
    npm install
else
    echo -e "${GREEN}✓ Backend dependencies already installed${NC}"
fi
cd ..

print_section "Step 3: Building Frontend"

cd app
npm run build
cd ..

if [ ! -d "app/dist" ]; then
    echo -e "${RED}❌ Build failed - dist folder not found${NC}"
    exit 1
fi

echo -e "${GREEN}✓ Frontend built successfully${NC}"

print_section "Step 4: Deployment Options"

echo "Choose deployment method:"
echo ""
echo "  1) Deploy to Hostinger NOW (requires FTP credentials)"
echo "  2) Setup GitHub Actions for auto-deployment"
echo "  3) Skip deployment (manual deploy later)"
echo ""

if [ "$INTERACTIVE" = true ]; then
    read -rp "Select option (1-3): " deploy_option
else
    deploy_option="3"
fi

case $deploy_option in
    1)
        echo ""
        echo -e "${YELLOW}Deploying to Hostinger...${NC}"
        
        # Check if credentials are set
        if [ -z "$HOSTINGER_FTP_SERVER" ] || [ -z "$HOSTINGER_FTP_USERNAME" ] || [ -z "$HOSTINGER_FTP_PASSWORD" ]; then
            echo -e "${RED}❌ FTP credentials not configured${NC}"
            echo "Please edit .env file and add your credentials:"
            echo "  HOSTINGER_FTP_SERVER"
            echo "  HOSTINGER_FTP_USERNAME"
            echo "  HOSTINGER_FTP_PASSWORD"
            exit 1
        fi
        
        # Run deployment
        ./deploy.sh
        ;;
    
    2)
        echo ""
        echo -e "${CYAN}GitHub Actions Setup Instructions:${NC}"
        echo ""
        echo "1. Push this repository to GitHub:"
        echo "   git init"
        echo "   git add ."
        echo "   git commit -m 'Initial commit'"
        echo "   git remote add origin https://github.com/YOUR_USERNAME/quadagile.git"
        echo "   git push -u origin main"
        echo ""
        echo "2. Add GitHub Secrets:"
        echo "   Go to: GitHub Repo → Settings → Secrets → Actions"
        echo "   Add these secrets:"
        echo "   - HOSTINGER_FTP_SERVER"
        echo "   - HOSTINGER_FTP_USERNAME"
        echo "   - HOSTINGER_FTP_PASSWORD"
        echo "   - VITE_API_URL"
        echo "   - VITE_RECAPTCHA_SITE_KEY"
        echo "   - VITE_GA4_ID"
        echo ""
        echo "3. Deployment will happen automatically on push to main!"
        echo ""
        ;;
    
    3|*)
        echo ""
        echo -e "${YELLOW}Skipping deployment${NC}"
        echo "To deploy later, run: ./deploy.sh"
        echo ""
        ;;
esac

print_section "Setup Complete!"

echo -e "${GREEN}╔════════════════════════════════════════════════════════════╗${NC}"
echo -e "${GREEN}║                                                            ║${NC}"
echo -e "${GREEN}║   ✅ QuadAgile Setup Complete!                             ║${NC}"
echo -e "${GREEN}║                                                            ║${NC}"
echo -e "${GREEN}╚════════════════════════════════════════════════════════════╝${NC}"
echo ""
echo -e "${CYAN}Project Structure:${NC}"
echo "  📁 app/           - Frontend React application"
echo "  📁 backend/       - Node.js CMS backend"
echo "  📁 scripts/       - Deployment scripts"
echo "  📄 .env           - Environment configuration"
echo ""
echo -e "${CYAN}Useful Commands:${NC}"
echo "  ./deploy.sh       - Deploy to Hostinger"
echo "  make build        - Build frontend"
echo "  make dev          - Start dev server"
echo "  make clean        - Clean build files"
echo ""
echo -e "${CYAN}Documentation:${NC}"
echo "  ONE_CLICK_DEPLOY.md  - Deployment guide"
echo "  DEPLOYMENT.md        - Detailed deployment docs"
echo "  PROJECT_SUMMARY.md   - Project overview"
echo ""
echo -e "${GREEN}🌐 Your website will be live at: https://quadagile.in${NC}"
echo ""

# Make scripts executable
chmod +x deploy.sh scripts/*.js 2>/dev/null || true

exit 0
