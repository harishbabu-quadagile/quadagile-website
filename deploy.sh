#!/bin/bash

# QuadAgile - One-Click Deployment Script for Hostinger
# Usage: ./deploy.sh [environment]
# Environments: production (default), staging

set -e  # Exit on error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
ENVIRONMENT=${1:-production}
APP_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)/app"
BACKEND_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)/backend"
BUILD_DIR="$APP_DIR/dist"

# Hostinger Configuration (set these environment variables)
HOSTINGER_FTP_SERVER="${HOSTINGER_FTP_SERVER:-}"
HOSTINGER_FTP_USERNAME="${HOSTINGER_FTP_USERNAME:-}"
HOSTINGER_FTP_PASSWORD="${HOSTINGER_FTP_PASSWORD:-}"
HOSTINGER_SSH_HOST="${HOSTINGER_SSH_HOST:-}"
HOSTINGER_SSH_USERNAME="${HOSTINGER_SSH_USERNAME:-}"
HOSTINGER_SSH_PASSWORD="${HOSTINGER_SSH_PASSWORD:-}"

echo -e "${BLUE}╔════════════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║                                                        ║${NC}"
echo -e "${BLUE}║   QuadAgile - One-Click Deployment                    ║${NC}"
echo -e "${BLUE}║   Environment: $ENVIRONMENT                                    ║${NC}"
echo -e "${BLUE}║                                                        ║${NC}"
echo -e "${BLUE}╚════════════════════════════════════════════════════════╝${NC}"
echo ""

# Check prerequisites
check_prerequisites() {
    echo -e "${YELLOW}Checking prerequisites...${NC}"
    
    # Check Node.js
    if ! command -v node &> /dev/null; then
        echo -e "${RED}❌ Node.js is not installed${NC}"
        exit 1
    fi
    
    NODE_VERSION=$(node --version | cut -d'v' -f2 | cut -d'.' -f1)
    if [ "$NODE_VERSION" -lt 18 ]; then
        echo -e "${RED}❌ Node.js 18+ required (found $(node --version))${NC}"
        exit 1
    fi
    echo -e "${GREEN}✓ Node.js $(node --version)${NC}"
    
    # Check npm
    if ! command -v npm &> /dev/null; then
        echo -e "${RED}❌ npm is not installed${NC}"
        exit 1
    fi
    echo -e "${GREEN}✓ npm $(npm --version)${NC}"
    
    # Check if lftp is installed for FTP deployment
    if ! command -v lftp &> /dev/null; then
        echo -e "${YELLOW}⚠ lftp not found. Installing...${NC}"
        if command -v apt-get &> /dev/null; then
            sudo apt-get update && sudo apt-get install -y lftp
        elif command -v brew &> /dev/null; then
            brew install lftp
        else
            echo -e "${RED}❌ Please install lftp manually${NC}"
            exit 1
        fi
    fi
    echo -e "${GREEN}✓ lftp installed${NC}"
    
    echo ""
}

# Build frontend
build_frontend() {
    echo -e "${YELLOW}Building frontend...${NC}"
    
    cd "$APP_DIR"
    
    # Install dependencies if node_modules doesn't exist
    if [ ! -d "node_modules" ]; then
        echo -e "${BLUE}Installing dependencies...${NC}"
        npm ci
    fi
    
    # Build
    echo -e "${BLUE}Running build...${NC}"
    npm run build
    
    if [ ! -d "$BUILD_DIR" ]; then
        echo -e "${RED}❌ Build failed - dist folder not found${NC}"
        exit 1
    fi
    
    echo -e "${GREEN}✓ Frontend built successfully${NC}"
    echo ""
}

# Deploy via FTP
deploy_ftp() {
    echo -e "${YELLOW}Deploying to Hostinger via FTP...${NC}"
    
    if [ -z "$HOSTINGER_FTP_SERVER" ] || [ -z "$HOSTINGER_FTP_USERNAME" ] || [ -z "$HOSTINGER_FTP_PASSWORD" ]; then
        echo -e "${RED}❌ FTP credentials not set${NC}"
        echo -e "${YELLOW}Please set the following environment variables:${NC}"
        echo "  - HOSTINGER_FTP_SERVER"
        echo "  - HOSTINGER_FTP_USERNAME"
        echo "  - HOSTINGER_FTP_PASSWORD"
        exit 1
    fi
    
    # Create lftp script
    LFTP_SCRIPT=$(cat <<EOF
set ssl:verify-certificate no
set ftp:ssl-allow yes
set ftp:ssl-force true
set ftp:ssl-protect-data true
set net:max-retries 3
set net:timeout 30
open -u "$HOSTINGER_FTP_USERNAME","$HOSTINGER_FTP_PASSWORD" "$HOSTINGER_FTP_SERVER"
rm -rf /public_html/assets
rm -rf /public_html/images
rm /public_html/index.html
rm /public_html/robots.txt
rm /public_html/sitemap.xml
rm /public_html/.htaccess
lcd "$BUILD_DIR"
cd /public_html
mirror -R --parallel=10 --verbose .
bye
EOF
)
    
    echo "$LFTP_SCRIPT" | lftp
    
    echo -e "${GREEN}✓ Frontend deployed successfully${NC}"
    echo ""
}

# Deploy backend
deploy_backend() {
    echo -e "${YELLOW}Deploying backend...${NC}"
    
    if [ -z "$HOSTINGER_SSH_HOST" ] || [ -z "$HOSTINGER_SSH_USERNAME" ]; then
        echo -e "${YELLOW}⚠ SSH credentials not set, skipping backend deployment${NC}"
        return 0
    fi
    
    echo -e "${BLUE}Backend deployment requires manual setup.${NC}"
    echo -e "${YELLOW}Please follow the backend deployment instructions in DEPLOYMENT.md${NC}"
    echo ""
}

# Verify deployment
verify_deployment() {
    echo -e "${YELLOW}Verifying deployment...${NC}"
    
    # Wait a moment for deployment to propagate
    sleep 3
    
    # Check if website is accessible
    if command -v curl &> /dev/null; then
        HTTP_STATUS=$(curl -s -o /dev/null -w "%{http_code}" https://quadagile.in || echo "000")
        if [ "$HTTP_STATUS" = "200" ]; then
            echo -e "${GREEN}✓ Website is accessible (HTTP 200)${NC}"
        else
            echo -e "${YELLOW}⚠ Website returned HTTP $HTTP_STATUS${NC}"
        fi
    fi
    
    echo ""
}

# Print summary
print_summary() {
    echo -e "${GREEN}╔════════════════════════════════════════════════════════╗${NC}"
    echo -e "${GREEN}║                                                        ║${NC}"
    echo -e "${GREEN}║   🎉 Deployment Complete!                              ║${NC}"
    echo -e "${GREEN}║                                                        ║${NC}"
    echo -e "${GREEN}║   Website URL: https://quadagile.in                   ║${NC}"
    echo -e "${GREEN}║   Admin URL:   https://quadagile.in/admin             ║${NC}"
    echo -e "${GREEN}║                                                        ║${NC}"
    echo -e "${GREEN}╚════════════════════════════════════════════════════════╝${NC}"
    echo ""
    echo -e "${BLUE}Next steps:${NC}"
    echo "  1. Verify the website loads correctly"
    echo "  2. Check SSL certificate is active"
    echo "  3. Test contact form functionality"
    echo "  4. Review Google Analytics data"
    echo ""
}

# Main deployment flow
main() {
    echo -e "${BLUE}Starting deployment process...${NC}"
    echo ""
    
    check_prerequisites
    build_frontend
    deploy_ftp
    deploy_backend
    verify_deployment
    print_summary
}

# Run main function
main
