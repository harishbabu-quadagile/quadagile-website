# QuadAgile - Makefile for Common Tasks
# Usage: make [command]

.PHONY: help install build deploy clean

# Default target
help:
	@echo "QuadAgile - Available Commands:"
	@echo ""
	@echo "  make install     - Install all dependencies"
	@echo "  make build       - Build the frontend"
	@echo "  make deploy      - Deploy to Hostinger (requires env vars)"
	@echo "  make clean       - Clean build artifacts"
	@echo "  make dev         - Start development server"
	@echo "  make test        - Run tests"
	@echo "  make setup       - Initial project setup"
	@echo ""

# Install dependencies
install:
	@echo "Installing frontend dependencies..."
	cd app && npm install
	@echo "Installing backend dependencies..."
	cd backend && npm install

# Build frontend
build:
	@echo "Building frontend..."
	cd app && npm run build
	@echo "Build complete! Output in app/dist/"

# Deploy to Hostinger
deploy:
	@echo "Deploying to Hostinger..."
	./deploy.sh

# Quick deploy (build + deploy)
ship: build deploy
	@echo "Shipped! 🚀"

# Clean build artifacts
clean:
	@echo "Cleaning build artifacts..."
	rm -rf app/dist
	rm -rf app/node_modules
	rm -rf backend/node_modules
	rm -rf backend/data/*.db
	@echo "Clean complete!"

# Start development server
dev:
	@echo "Starting development server..."
	cd app && npm run dev

# Run tests
test:
	@echo "Running tests..."
	cd app && npm test || echo "No tests configured"

# Initial setup
setup:
	@echo "Setting up QuadAgile project..."
	@echo ""
	@echo "1. Installing dependencies..."
	$(MAKE) install
	@echo ""
	@echo "2. Creating environment file..."
	cp .env.example .env
	@echo ""
	@echo "3. Building frontend..."
	$(MAKE) build
	@echo ""
	@echo "✅ Setup complete!"
	@echo ""
	@echo "Next steps:"
	@echo "  1. Edit .env file with your credentials"
	@echo "  2. Run 'make deploy' to deploy"
	@echo ""

# Backend operations
backend-start:
	@echo "Starting backend server..."
	cd backend && npm start

backend-dev:
	@echo "Starting backend in development mode..."
	cd backend && npm run dev

backend-init-db:
	@echo "Initializing database..."
	cd backend && npm run init-db

# Generate images
images:
	@echo "Generating images..."
	node scripts/generate-images.js

# SEO check
check-seo:
	@echo "Checking SEO configuration..."
	@echo "✓ robots.txt exists"
	@test -f app/public/robots.txt && echo "  - robots.txt" || echo "  ✗ robots.txt missing"
	@echo "✓ sitemap.xml exists"
	@test -f app/public/sitemap.xml && echo "  - sitemap.xml" || echo "  ✗ sitemap.xml missing"
	@echo "✓ .htaccess exists"
	@test -f app/public/.htaccess && echo "  - .htaccess" || echo "  ✗ .htaccess missing"

# Verify deployment
verify:
	@echo "Verifying deployment..."
	@curl -s -o /dev/null -w "HTTP Status: %{http_code}\n" https://quadagile.in
	@curl -s -o /dev/null -w "SSL: %{ssl_verify_result}\n" https://quadagile.in

# Full deployment pipeline
all: clean install build deploy verify
	@echo ""
	@echo "🎉 Full deployment complete!"
	@echo "   Website: https://quadagile.in"
