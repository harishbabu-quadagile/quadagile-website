# QuadAgile - One-Click Deployment Guide

Deploy your QuadAgile website to Hostinger with a single command!

---

## Quick Start (3 Methods)

### Method 1: Using the Deploy Script (Recommended)

```bash
# 1. Navigate to project directory
cd /mnt/okcomputer/output

# 2. Set your Hostinger FTP credentials
export HOSTINGER_FTP_SERVER="ftp.quadagile.in"
export HOSTINGER_FTP_USERNAME="your-ftp-username"
export HOSTINGER_FTP_PASSWORD="your-ftp-password"

# 3. Run the deploy script
./deploy.sh
```

### Method 2: Using Node.js Deploy Script

```bash
# 1. Navigate to project directory
cd /mnt/okcomputer/output

# 2. Set environment variables
export HOSTINGER_FTP_SERVER="ftp.quadagile.in"
export HOSTINGER_FTP_USERNAME="your-ftp-username"
export HOSTINGER_FTP_PASSWORD="your-ftp-password"

# 3. Run Node.js deploy script
node scripts/hostinger-deploy.js
```

### Method 3: GitHub Actions (Fully Automated)

1. **Push to GitHub:**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin https://github.com/yourusername/quadagile.git
   git push -u origin main
   ```

2. **Add GitHub Secrets:**
   Go to GitHub Repository → Settings → Secrets and variables → Actions
   
   Add these secrets:
   - `HOSTINGER_FTP_SERVER`: ftp.quadagile.in
   - `HOSTINGER_FTP_USERNAME`: your-ftp-username
   - `HOSTINGER_FTP_PASSWORD`: your-ftp-password
   - `VITE_API_URL`: https://api.quadagile.in
   - `VITE_RECAPTCHA_SITE_KEY`: your-recaptcha-site-key
   - `VITE_GA4_ID`: G-XXXXXXXXXX

3. **Deploy automatically:**
   - Push to `main` branch triggers automatic deployment
   - Or go to Actions tab → Deploy to Hostinger → Run workflow

---

## Prerequisites

### Local Deployment

1. **Node.js 18+** installed
2. **lftp** installed (script will auto-install if missing)
3. **Hostinger FTP credentials**

### GitHub Actions Deployment

1. **GitHub repository** with your code
2. **Hostinger FTP credentials**
3. **GitHub Secrets** configured

---

## Getting Hostinger Credentials

### FTP Credentials

1. Login to [Hostinger hPanel](https://hpanel.hostinger.com)
2. Go to **Files** → **FTP Accounts**
3. Create or note existing FTP account:
   - **Server/Host**: Usually `ftp.quadagile.in` or IP address
   - **Username**: Your FTP username
   - **Password**: Your FTP password
   - **Port**: 21 (default)

### SSH Credentials (Optional - for backend)

1. Go to **Advanced** → **SSH Access**
2. Enable SSH and note:
   - **Host**: Your server IP or hostname
   - **Username**: Your SSH username
   - **Password**: Your SSH password
   - **Port**: 22 (default)

---

## Environment Variables

### Required for Frontend

```bash
export VITE_API_URL="https://api.quadagile.in"
export VITE_RECAPTCHA_SITE_KEY="your-recaptcha-site-key"
export VITE_GA4_ID="G-XXXXXXXXXX"
```

### Required for Deployment

```bash
export HOSTINGER_FTP_SERVER="ftp.quadagile.in"
export HOSTINGER_FTP_USERNAME="your-username"
export HOSTINGER_FTP_PASSWORD="your-password"
```

### Optional for Backend

```bash
export HOSTINGER_SSH_HOST="your-server-ip"
export HOSTINGER_SSH_USERNAME="your-ssh-username"
export HOSTINGER_SSH_PASSWORD="your-ssh-password"
```

---

## Using .env File

Create a `.env` file in the project root:

```bash
# Deployment credentials
HOSTINGER_FTP_SERVER=ftp.quadagile.in
HOSTINGER_FTP_USERNAME=your-username
HOSTINGER_FTP_PASSWORD=your-password

# Frontend environment
VITE_API_URL=https://api.quadagile.in
VITE_RECAPTCHA_SITE_KEY=your-recaptcha-site-key
VITE_GA4_ID=G-XXXXXXXXXX
```

Then run:
```bash
source .env && ./deploy.sh
```

---

## What the Deploy Script Does

1. ✅ **Checks prerequisites** (Node.js, npm, lftp)
2. ✅ **Installs dependencies** if needed
3. ✅ **Builds the frontend** (npm run build)
4. ✅ **Connects to Hostinger** via FTP with SSL
5. ✅ **Cleans old files** from public_html
6. ✅ **Uploads new files** (dist/ folder)
7. ✅ **Verifies deployment** (optional curl check)

---

## Post-Deployment Checklist

After deployment, verify:

- [ ] **Website loads**: https://quadagile.in
- [ ] **SSL active**: Padlock icon in browser
- [ ] **All pages work**: /blogs, /case-studies
- [ ] **Admin login**: /admin
- [ ] **Contact form**: Submit test message
- [ ] **Mobile responsive**: Test on mobile device
- [ ] **SEO meta tags**: View page source

---

## Troubleshooting

### "lftp not found"
```bash
# macOS
brew install lftp

# Ubuntu/Debian
sudo apt-get update && sudo apt-get install lftp

# CentOS/RHEL
sudo yum install lftp
```

### "FTP connection failed"
- Verify FTP credentials in Hostinger hPanel
- Check if FTP access is enabled
- Try using IP address instead of domain
- Ensure firewall allows FTP (port 21)

### "Build failed"
```bash
# Clean and rebuild
cd app
rm -rf node_modules dist
npm install
npm run build
```

### "Permission denied"
- Check FTP user has write permissions to public_html
- Contact Hostinger support if needed

---

## Automated Deployment Options

### Option 1: Cron Job (Auto-deploy on schedule)

```bash
# Edit crontab
crontab -e

# Add line to deploy daily at 2 AM
0 2 * * * cd /path/to/quadagile && ./deploy.sh >> /var/log/quadagile-deploy.log 2>&1
```

### Option 2: Git Hook (Auto-deploy on push)

```bash
# In your git repository
cd .git/hooks

cat > post-push << 'EOF'
#!/bin/bash
./deploy.sh
EOF

chmod +x post-push
```

### Option 3: Watch Mode (Auto-deploy on file changes)

```bash
# Install nodemon globally
npm install -g nodemon

# Watch src folder and auto-deploy
nodemon --watch app/src --ext ts,tsx,css --exec "./deploy.sh"
```

---

## Backend Deployment

The frontend deploys automatically. For backend:

### Manual Backend Deploy

```bash
# SSH into Hostinger server
ssh username@your-server-ip

# Navigate to backend folder
cd ~/backend

# Pull latest code
git pull origin main

# Install dependencies
npm install --production

# Restart with PM2
pm2 restart quadagile-cms || pm2 start server.js --name quadagile-cms
pm2 save
```

### Automated Backend Deploy

Add to GitHub Actions workflow (already included in `.github/workflows/deploy.yml`):

```yaml
- name: Deploy backend via SSH
  uses: appleboy/ssh-action@v1.0.0
  with:
    host: ${{ secrets.HOSTINGER_SSH_HOST }}
    username: ${{ secrets.HOSTINGER_SSH_USERNAME }}
    password: ${{ secrets.HOSTINGER_SSH_PASSWORD }}
    script: |
      cd ~/backend
      git pull origin main
      npm install --production
      pm2 restart quadagile-cms
```

---

## Rollback Deployment

If something goes wrong:

```bash
# Via FTP - restore from backup
lftp -u username,password ftp.quadagile.in

cd /public_html
!mv backup_$(date +%Y%m%d) current
bye
```

Or use Hostinger's built-in backup restore in hPanel.

---

## Security Notes

⚠️ **Never commit credentials to Git!**

- Use `.env` file (already in `.gitignore`)
- Use GitHub Secrets for CI/CD
- Use environment variables for local deployment
- Rotate passwords regularly

---

## Support

Need help?
- 📧 Email: reach-us@quadagile.in
- 📞 Phone: +91 74061 09111
- 🌐 Website: https://quadagile.in

---

## License

© 2026 QuadAgile. All rights reserved.
