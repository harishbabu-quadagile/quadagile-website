#!/usr/bin/env node

/**
 * QuadAgile - Hostinger One-Click Deployment Script
 * This script automates the deployment process to Hostinger hosting
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[0;31m',
  green: '\x1b[0;32m',
  yellow: '\x1b[1;33m',
  blue: '\x1b[0;34m',
  cyan: '\x1b[0;36m'
};

const log = {
  info: (msg) => console.log(`${colors.blue}ℹ ${msg}${colors.reset}`),
  success: (msg) => console.log(`${colors.green}✓ ${msg}${colors.reset}`),
  warning: (msg) => console.log(`${colors.yellow}⚠ ${msg}${colors.reset}`),
  error: (msg) => console.log(`${colors.red}✗ ${msg}${colors.reset}`),
  step: (msg) => console.log(`${colors.cyan}→ ${msg}${colors.reset}`)
};

// Configuration
const CONFIG = {
  appDir: path.join(__dirname, '..', 'app'),
  backendDir: path.join(__dirname, '..', 'backend'),
  buildDir: path.join(__dirname, '..', 'app', 'dist'),
  requiredEnvVars: [
    'HOSTINGER_FTP_SERVER',
    'HOSTINGER_FTP_USERNAME',
    'HOSTINGER_FTP_PASSWORD'
  ]
};

// Check if environment variables are set
function checkEnvironment() {
  log.step('Checking environment variables...');
  
  const missing = CONFIG.requiredEnvVars.filter(varName => !process.env[varName]);
  
  if (missing.length > 0) {
    log.error('Missing required environment variables:');
    missing.forEach(varName => console.log(`  - ${varName}`));
    console.log('');
    log.info('Please set these variables and try again.');
    log.info('You can create a .env file or export them in your shell.');
    process.exit(1);
  }
  
  log.success('All environment variables are set');
}

// Check prerequisites
function checkPrerequisites() {
  log.step('Checking prerequisites...');
  
  try {
    // Check Node.js version
    const nodeVersion = execSync('node --version', { encoding: 'utf8' }).trim();
    const majorVersion = parseInt(nodeVersion.slice(1).split('.')[0]);
    
    if (majorVersion < 18) {
      log.error(`Node.js 18+ required (found ${nodeVersion})`);
      process.exit(1);
    }
    log.success(`Node.js ${nodeVersion}`);
    
    // Check npm
    const npmVersion = execSync('npm --version', { encoding: 'utf8' }).trim();
    log.success(`npm ${npmVersion}`);
    
    // Check if lftp is available
    try {
      execSync('which lftp', { stdio: 'ignore' });
      log.success('lftp is installed');
    } catch {
      log.warning('lftp not found. Attempting to install...');
      try {
        if (process.platform === 'darwin') {
          execSync('brew install lftp', { stdio: 'inherit' });
        } else if (process.platform === 'linux') {
          execSync('sudo apt-get update && sudo apt-get install -y lftp', { stdio: 'inherit' });
        }
        log.success('lftp installed successfully');
      } catch (error) {
        log.error('Failed to install lftp. Please install it manually.');
        process.exit(1);
      }
    }
  } catch (error) {
    log.error('Failed to check prerequisites');
    console.error(error);
    process.exit(1);
  }
}

// Build the frontend
function buildFrontend() {
  log.step('Building frontend...');
  
  try {
    process.chdir(CONFIG.appDir);
    
    // Install dependencies if needed
    if (!fs.existsSync(path.join(CONFIG.appDir, 'node_modules'))) {
      log.info('Installing dependencies...');
      execSync('npm ci', { stdio: 'inherit' });
    }
    
    // Build
    log.info('Running production build...');
    execSync('npm run build', { stdio: 'inherit' });
    
    // Verify build output
    if (!fs.existsSync(CONFIG.buildDir)) {
      log.error('Build failed - dist folder not found');
      process.exit(1);
    }
    
    log.success('Frontend built successfully');
  } catch (error) {
    log.error('Build failed');
    console.error(error);
    process.exit(1);
  }
}

// Deploy via FTP
function deployFTP() {
  log.step('Deploying to Hostinger via FTP...');
  
  const { HOSTINGER_FTP_SERVER, HOSTINGER_FTP_USERNAME, HOSTINGER_FTP_PASSWORD } = process.env;
  
  // Create lftp script
  const lftpScript = `
set ssl:verify-certificate no
set ftp:ssl-allow yes
set ftp:ssl-force true
set ftp:ssl-protect-data true
set net:max-retries 3
set net:timeout 30
open -u "${HOSTINGER_FTP_USERNAME}","${HOSTINGER_FTP_PASSWORD}" "${HOSTINGER_FTP_SERVER}"
rm -rf /public_html/assets
rm -rf /public_html/images
rm /public_html/index.html
rm /public_html/robots.txt
rm /public_html/sitemap.xml
rm /public_html/.htaccess
lcd "${CONFIG.buildDir}"
cd /public_html
mirror -R --parallel=10 --verbose .
bye
`;

  try {
    execSync(`echo '${lftpScript}' | lftp`, { stdio: 'inherit' });
    log.success('Files uploaded successfully');
  } catch (error) {
    log.error('FTP deployment failed');
    console.error(error);
    process.exit(1);
  }
}

// Verify deployment
function verifyDeployment() {
  log.step('Verifying deployment...');
  
  // Wait a moment for deployment to propagate
  log.info('Waiting for deployment to propagate...');
  
  setTimeout(() => {
    try {
      const response = execSync('curl -s -o /dev/null -w "%{http_code}" https://quadagile.in', {
        encoding: 'utf8',
        timeout: 10000
      }).trim();
      
      if (response === '200') {
        log.success('Website is accessible (HTTP 200)');
      } else {
        log.warning(`Website returned HTTP ${response}`);
      }
    } catch {
      log.warning('Could not verify deployment. Please check manually.');
    }
  }, 5000);
}

// Print summary
function printSummary() {
  console.log('');
  console.log(`${colors.green}╔════════════════════════════════════════════════════════╗${colors.reset}`);
  console.log(`${colors.green}║                                                        ║${colors.reset}`);
  console.log(`${colors.green}║   🎉 Deployment Complete!                              ║${colors.reset}`);
  console.log(`${colors.green}║                                                        ║${colors.reset}`);
  console.log(`${colors.green}║   Website URL: https://quadagile.in                   ║${colors.reset}`);
  console.log(`${colors.green}║   Admin URL:   https://quadagile.in/admin             ║${colors.reset}`);
  console.log(`${colors.green}║                                                        ║${colors.reset}`);
  console.log(`${colors.green}╚════════════════════════════════════════════════════════╝${colors.reset}`);
  console.log('');
  log.info('Next steps:');
  console.log('  1. Visit https://quadagile.in to verify');
  console.log('  2. Check SSL certificate is active');
  console.log('  3. Test contact form functionality');
  console.log('  4. Login to admin at /admin');
  console.log('');
}

// Main function
async function main() {
  console.log(`${colors.cyan}`);
  console.log('╔════════════════════════════════════════════════════════╗');
  console.log('║                                                        ║');
  console.log('║   QuadAgile - One-Click Deployment to Hostinger       ║');
  console.log('║                                                        ║');
  console.log('╚════════════════════════════════════════════════════════╝');
  console.log(`${colors.reset}`);
  console.log('');
  
  try {
    checkEnvironment();
    checkPrerequisites();
    buildFrontend();
    deployFTP();
    verifyDeployment();
    printSummary();
  } catch (error) {
    log.error('Deployment failed');
    console.error(error);
    process.exit(1);
  }
}

// Run main
main();
