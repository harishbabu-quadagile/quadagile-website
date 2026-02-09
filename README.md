# QuadAgile Website - One-Click Deployment

[![Deploy to Hostinger](https://img.shields.io/badge/Deploy%20to-Hostinger-FF6B6B?style=for-the-badge&logo=cloudflare)](ONE_CLICK_DEPLOY.md)

A modern, corporate React website with secure CMS, blogs, case studies, and full SEO optimization.

---

## 🚀 One-Click Deployment

### Option 1: Quick Setup Script (Recommended)

```bash
# Clone or navigate to the project
cd /mnt/okcomputer/output

# Run the setup script
./setup.sh
```

This interactive script will:
1. ✅ Check prerequisites
2. ✅ Install dependencies
3. ✅ Build the frontend
4. ✅ Configure environment
5. ✅ Deploy to Hostinger

### Option 2: Direct Deploy (if already configured)

```bash
# Set your credentials
export HOSTINGER_FTP_SERVER="ftp.quadagile.in"
export HOSTINGER_FTP_USERNAME="your-username"
export HOSTINGER_FTP_PASSWORD="your-password"

# Deploy
./deploy.sh
```

### Option 3: GitHub Actions (Fully Automated)

1. Push to GitHub
2. Add secrets in GitHub Settings
3. Automatic deployment on every push!

See [ONE_CLICK_DEPLOY.md](ONE_CLICK_DEPLOY.md) for details.

---

## 📁 Project Structure

```
quadagile/
├── app/                    # React Frontend
│   ├── src/               # Source code
│   ├── dist/              # Build output (deploy this)
│   └── public/            # Static assets
├── backend/               # Node.js CMS
│   ├── server.js          # Main server
│   ├── routes/            # API routes
│   └── database/          # SQLite database
├── scripts/               # Deployment scripts
├── .github/workflows/     # GitHub Actions
├── deploy.sh              # One-click deploy script
├── setup.sh               # Complete setup script
├── Makefile               # Common commands
└── .env.example           # Environment template
```

---

## 🛠️ Prerequisites

- **Node.js 18+**
- **npm** or **yarn**
- **Hostinger account** with FTP access
- **lftp** (auto-installed by scripts)

---

## 📖 Documentation

| Document | Description |
|----------|-------------|
| [ONE_CLICK_DEPLOY.md](ONE_CLICK_DEPLOY.md) | Quick deployment guide |
| [DEPLOYMENT.md](DEPLOYMENT.md) | Detailed deployment instructions |
| [PROJECT_SUMMARY.md](PROJECT_SUMMARY.md) | Project overview & features |
| [Design.md](Design.md) | Design specifications |

---

## 🎯 Features

### Frontend
- ⚡ React + Vite + TypeScript
- 🎨 Tailwind CSS + shadcn/ui
- 🎬 GSAP ScrollTrigger animations
- 📱 Fully responsive
- 🔍 SEO optimized

### Backend
- 🔐 JWT authentication
- 📝 CRUD for blogs & case studies
- 🛡️ Rate limiting & CORS
- 🧹 Input sanitization
- 🤖 reCAPTCHA v3

### Security
- 🔒 SSL/HTTPS enforced
- 🛡️ Security headers
- 🚫 XSS/SQL injection protection
- 🔑 Secure password hashing

---

## 📝 Common Commands

```bash
# Setup everything
./setup.sh

# Deploy to Hostinger
./deploy.sh

# Build only
make build

# Development server
make dev

# Clean build files
make clean

# Full pipeline
make all
```

---

## 🔐 Environment Variables

Create `.env` file from template:

```bash
cp .env.example .env
# Edit with your credentials
```

Required variables:
- `HOSTINGER_FTP_SERVER`
- `HOSTINGER_FTP_USERNAME`
- `HOSTINGER_FTP_PASSWORD`

Optional:
- `VITE_RECAPTCHA_SITE_KEY`
- `VITE_GA4_ID`

---

## 🌐 Live Website

After deployment:
- **Website**: https://quadagile.in
- **Admin**: https://quadagile.in/admin
- **Blogs**: https://quadagile.in/blogs
- **Case Studies**: https://quadagile.in/case-studies

---

## 🆘 Troubleshooting

| Issue | Solution |
|-------|----------|
| lftp not found | `brew install lftp` (mac) or `apt-get install lftp` (linux) |
| FTP connection failed | Verify credentials in Hostinger hPanel |
| Build failed | `make clean && make build` |
| Permission denied | Check FTP user has write access |

---

## 📞 Support

- 📧 Email: reach-us@quadagile.in
- 📞 Phone: +91 74061 09111
- 🌐 Website: https://quadagile.in

---

## 📄 License

© 2026 QuadAgile. All rights reserved.
