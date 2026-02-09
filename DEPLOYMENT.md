# QuadAgile Deployment Guide

## Overview

This guide covers the deployment of the QuadAgile website to Hostinger hosting with full security, SEO, and performance optimization.

## Project Structure

```
/mnt/okcomputer/output/
├── app/                    # React Frontend (Vite + TypeScript + Tailwind)
│   ├── src/               # Source code
│   ├── public/            # Static assets (images, robots.txt, sitemap.xml, .htaccess)
│   ├── dist/              # Build output (generated)
│   └── package.json
├── backend/               # Node.js CMS Backend
│   ├── server.js          # Main server file
│   ├── routes/            # API routes
│   ├── middleware/        # Auth & validation middleware
│   ├── database/          # SQLite database module
│   ├── package.json
│   └── .env.example       # Environment variables template
└── DEPLOYMENT.md          # This file
```

---

## Frontend Deployment (Hostinger)

### Step 1: Build the Frontend

```bash
cd /mnt/okcomputer/output/app
npm install
npm run build
```

This creates a `dist/` folder with optimized production files.

### Step 2: Upload to Hostinger

1. **Login to Hostinger Control Panel**
   - Go to https://hpanel.hostinger.com
   - Navigate to your domain (quadagile.in)

2. **Upload Files**
   - Go to **Files** → **File Manager**
   - Navigate to `public_html/`
   - Delete existing files (backup first if needed)
   - Upload all files from `dist/` folder
   - Ensure `index.html` is at the root of `public_html/`

3. **Upload Configuration Files**
   - Upload `.htaccess` from `public/` to `public_html/`
   - Upload `robots.txt` from `public/` to `public_html/`
   - Upload `sitemap.xml` from `public/` to `public_html/`

### Step 3: Configure SSL (HTTPS)

1. In Hostinger hPanel, go to **Advanced** → **SSL**
2. Enable **Let's Encrypt SSL** for quadagile.in
3. Enable **Force HTTPS** redirect
4. Wait for SSL certificate to be issued (usually instant)

### Step 4: Verify Deployment

- Visit https://quadagile.in
- Check all pages load correctly
- Verify HTTPS is working (padlock icon)
- Test navigation and forms

---

## Backend Deployment (Node.js CMS)

### Option A: Deploy on Same Hostinger Account (Recommended for small sites)

1. **Enable Node.js on Hostinger**
   - Go to **Advanced** → **Node.js**
   - Enable Node.js for your domain
   - Set Node.js version to 18.x or higher

2. **Upload Backend Files**
   - Create a folder outside `public_html/` (e.g., `~/backend/`)
   - Upload all backend files

3. **Install Dependencies**
   ```bash
   cd ~/backend
   npm install --production
   ```

4. **Configure Environment Variables**
   ```bash
   cp .env.example .env
   nano .env  # Edit with your values
   ```

5. **Initialize Database**
   ```bash
   npm run init-db
   ```

6. **Start with PM2**
   ```bash
   npm install -g pm2
   pm2 start server.js --name quadagile-cms
   pm2 save
   pm2 startup
   ```

### Option B: Deploy on Separate VPS (Recommended for production)

Use a VPS provider (DigitalOcean, AWS EC2, etc.) for better performance and isolation.

---

## Environment Variables

### Frontend (.env.production)

Create `app/.env.production`:

```env
VITE_API_URL=https://api.quadagile.in
VITE_RECAPTCHA_SITE_KEY=your-recaptcha-site-key
VITE_GA4_ID=G-XXXXXXXXXX
```

### Backend (.env)

```env
PORT=3000
NODE_ENV=production
JWT_SECRET=your-super-secret-jwt-key-min-32-chars
JWT_EXPIRES_IN=24h
RECAPTCHA_SECRET_KEY=your-recaptcha-secret-key
DB_PATH=./data/quadagile.db
CORS_ORIGINS=https://quadagile.in,https://www.quadagile.in
ADMIN_EMAIL=admin@quadagile.in
ADMIN_PASSWORD=your-secure-password
CONTACT_EMAIL=reach-us@quadagile.in
GA4_MEASUREMENT_ID=G-XXXXXXXXXX
GA4_API_SECRET=your-ga4-api-secret
```

---

## Security Checklist

### SSL/TLS
- [x] Let's Encrypt SSL enabled
- [x] HTTPS redirect enforced
- [x] HSTS header configured in .htaccess

### Headers (configured in .htaccess)
- [x] X-Frame-Options: SAMEORIGIN
- [x] X-Content-Type-Options: nosniff
- [x] X-XSS-Protection: 1; mode=block
- [x] Content-Security-Policy configured
- [x] Referrer-Policy: strict-origin-when-cross-origin

### Application Security
- [x] Input sanitization (XSS protection)
- [x] Rate limiting on API endpoints
- [x] CORS restricted to quadagile.in
- [x] JWT authentication for admin
- [x] Secure password hashing (bcrypt)
- [x] SQL injection protection (parameterized queries)

### reCAPTCHA
- [x] reCAPTCHA v3 integrated on contact form
- [x] Server-side token verification
- [x] Score threshold set to 0.5

---

## SEO Checklist

### Meta Tags
- [x] Title and description per route
- [x] Canonical tags
- [x] Open Graph tags
- [x] Twitter Card tags
- [x] Article tags for blog posts

### Structured Data
- [x] Organization schema
- [x] WebSite schema
- [x] BlogPosting schema for blogs
- [x] Article schema for case studies
- [x] BreadcrumbList schema

### Technical SEO
- [x] robots.txt configured
- [x] sitemap.xml generated
- [x] Proper H1-H6 hierarchy
- [x] Image alt tags
- [x] Semantic HTML
- [x] Mobile-first responsive design
- [x] Fast loading (optimized images, code splitting)

### Performance
- [x] Lazy loading for images
- [x] Code splitting
- [x] GZIP compression enabled
- [x] Browser caching configured
- [x] Minified assets

---

## Analytics Setup

### Google Analytics 4

1. Create GA4 property at https://analytics.google.com
2. Add tracking ID to environment variables
3. Verify events are firing:
   - Page views (SPA route changes)
   - CTA clicks
   - Form submissions
   - Content engagement

### Event Tracking

The following events are tracked:
- `page_view` - SPA route changes
- `cta_click` - Button clicks
- `contact_form_submit` - Form submissions
- `blog_read` - Blog article views
- `case_study_view` - Case study views

---

## Maintenance

### Updating Content

**Via Admin Panel:**
1. Visit https://quadagile.in/admin
2. Login with admin credentials
3. Add/Edit/Delete blogs and case studies

**Via Database:**
```bash
sqlite3 data/quadagile.db
```

### Backups

**Database Backup:**
```bash
cp data/quadagile.db backups/quadagile-$(date +%Y%m%d).db
```

**File Backup:**
- Use Hostinger's backup feature
- Or download via FTP regularly

### Updates

**Frontend:**
```bash
cd app
npm run build
# Upload new dist/ files
```

**Backend:**
```bash
cd backend
pm2 stop quadagile-cms
git pull  # or upload new files
npm install
pm2 start quadagile-cms
```

---

## Troubleshooting

### 404 Errors on Routes
- Ensure `.htaccess` is uploaded to `public_html/`
- Check Apache mod_rewrite is enabled

### API Not Responding
- Check backend is running: `pm2 status`
- Verify CORS origins in backend .env
- Check firewall settings

### SSL Issues
- Verify certificate is installed
- Check HTTPS redirect in .htaccess
- Clear browser cache

### Contact Form Not Working
- Verify reCAPTCHA keys
- Check backend logs
- Ensure CONTACT_EMAIL is set

---

## Support

For technical support:
- Email: reach-us@quadagile.in
- Phone: +91 74061 09111

---

## Post-Deployment Verification

After deployment, verify:

1. **Functionality**
   - [ ] All pages load correctly
   - [ ] Navigation works
   - [ ] Contact form submits
   - [ ] Admin login works

2. **Security**
   - [ ] HTTPS enforced
   - [ ] Security headers present (check at securityheaders.com)
   - [ ] No console errors

3. **SEO**
   - [ ] Meta tags present (view page source)
   - [ ] Structured data valid (test at search.google.com/test/rich-results)
   - [ ] Sitemap accessible
   - [ ] Robots.txt correct

4. **Performance**
   - [ ] Lighthouse score 90+
   - [ ] Images optimized
   - [ ] No render-blocking resources

5. **Analytics**
   - [ ] GA4 receiving data
   - [ ] Events tracking correctly
