# QuadAgile - Quick Start Guide

## 🚀 Deploy in 3 Simple Steps

### Step 1: Get Hostinger Credentials

1. Login to [Hostinger hPanel](https://hpanel.hostinger.com)
2. Go to **Files** → **FTP Accounts**
3. Note down:
   - FTP Server (e.g., `ftp.quadagile.in`)
   - FTP Username
   - FTP Password

### Step 2: Run Setup Script

```bash
cd /mnt/okcomputer/output
./setup.sh
```

This will:
- ✅ Check prerequisites
- ✅ Install dependencies
- ✅ Build the website
- ✅ Configure environment
- ✅ Deploy to Hostinger

### Step 3: Verify Deployment

Visit: **https://quadagile.in**

---

## 📋 Alternative Methods

### Method A: Quick Deploy (Pre-configured)

If you already have `.env` file:

```bash
./deploy.sh
```

### Method B: Manual Steps

```bash
# 1. Install dependencies
cd app && npm install

# 2. Build
cd app && npm run build

# 3. Deploy (using lftp)
lftp -u username,password ftp.quadagile.in
mirror -R app/dist /public_html
bye
```

### Method C: GitHub Actions

1. Push code to GitHub
2. Add secrets in GitHub Settings
3. Auto-deploy on every push!

See [ONE_CLICK_DEPLOY.md](ONE_CLICK_DEPLOY.md)

---

## 🔧 Environment Setup

### Create .env file:

```bash
cp .env.example .env
nano .env  # Edit with your credentials
```

### Required variables:

```env
HOSTINGER_FTP_SERVER=ftp.quadagile.in
HOSTINGER_FTP_USERNAME=your-username
HOSTINGER_FTP_PASSWORD=your-password
```

---

## 🎯 What's Included

| Feature | Status |
|---------|--------|
| Modern React Frontend | ✅ |
| Node.js CMS Backend | ✅ |
| Blog & Case Studies | ✅ |
| Admin Dashboard | ✅ |
| SEO Optimization | ✅ |
| Security Headers | ✅ |
| reCAPTCHA v3 | ✅ |
| GA4 Analytics | ✅ |

---

## 📁 Key Files

| File | Purpose |
|------|---------|
| `setup.sh` | Complete setup & deploy |
| `deploy.sh` | Deploy only |
| `.env.example` | Environment template |
| `Makefile` | Common commands |
| `app/dist/` | Build output (upload this) |

---

## 🆘 Need Help?

- 📖 [ONE_CLICK_DEPLOY.md](ONE_CLICK_DEPLOY.md) - Detailed guide
- 📖 [DEPLOYMENT.md](DEPLOYMENT.md) - Full documentation
- 📧 reach-us@quadagile.in

---

**Ready to deploy? Run: `./setup.sh`**
