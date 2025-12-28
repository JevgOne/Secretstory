#!/bin/bash

# 🚀 Automatický migrační skript
# Tento skript ti pomůže migrovat projekt na nový GitHub/Vercel/Turso setup

set -e  # Exit on error

echo "🎯 Lovelygirls Migration Script"
echo "================================"
echo ""

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Functions
print_step() {
    echo -e "${BLUE}📍 $1${NC}"
}

print_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

# Check prerequisites
print_step "Checking prerequisites..."

if ! command -v git &> /dev/null; then
    print_error "Git is not installed"
    exit 1
fi
print_success "Git installed"

if ! command -v node &> /dev/null; then
    print_error "Node.js is not installed"
    exit 1
fi
print_success "Node.js installed"

if ! command -v turso &> /dev/null; then
    print_warning "Turso CLI not found. Install it with:"
    echo "curl -sSfL https://get.tur.so/install.sh | bash"
    exit 1
fi
print_success "Turso CLI installed"

echo ""
print_step "Starting migration process..."
echo ""

# Ask for new project name
read -p "Enter new project name (default: lovelygirls-prod): " PROJECT_NAME
PROJECT_NAME=${PROJECT_NAME:-lovelygirls-prod}

read -p "Enter new Turso database name (default: ${PROJECT_NAME}): " DB_NAME
DB_NAME=${DB_NAME:-$PROJECT_NAME}

echo ""
print_step "Configuration:"
echo "  Project name: $PROJECT_NAME"
echo "  Database name: $DB_NAME"
echo ""

read -p "Continue? (y/N): " CONFIRM
if [[ ! $CONFIRM =~ ^[Yy]$ ]]; then
    echo "Aborted."
    exit 0
fi

# Step 1: Export Turso data
echo ""
print_step "Step 1/7: Exporting Turso database..."
echo "Please run this command manually to export your data:"
echo ""
echo "  turso db shell lg --location aws-ap-south-1 \".dump\" > turso-backup-$(date +%Y%m%d).sql"
echo ""
read -p "Press Enter when done..."

if [ ! -f "turso-backup-"*".sql" ]; then
    print_warning "No backup file found. Make sure you exported the database."
fi

# Step 2: Create new Turso database
echo ""
print_step "Step 2/7: Creating new Turso database..."
echo "Run these commands:"
echo ""
echo "  turso db create $DB_NAME --location aws-ap-south-1"
echo "  turso db show $DB_NAME"
echo "  turso db tokens create $DB_NAME"
echo ""
print_warning "Save the DATABASE_URL and AUTH_TOKEN!"
echo ""
read -p "Press Enter when done..."

# Step 3: Import data
echo ""
print_step "Step 3/7: Import data to new database"
echo "Run this command with your backup file:"
echo ""
echo "  turso db shell $DB_NAME < turso-backup-YYYYMMDD.sql"
echo ""
read -p "Press Enter when done..."

# Step 4: Create GitHub repo
echo ""
print_step "Step 4/7: Creating GitHub repository..."
echo ""
echo "Option A: Using GitHub CLI (gh):"
echo "  gh repo create $PROJECT_NAME --private --source=. --remote=new-origin"
echo "  git push new-origin main"
echo ""
echo "Option B: Manual via web:"
echo "  1. Go to https://github.com/new"
echo "  2. Create repo: $PROJECT_NAME (Private)"
echo "  3. Run:"
echo "     git remote add new-origin https://github.com/YOUR-USERNAME/$PROJECT_NAME.git"
echo "     git push new-origin main"
echo ""
read -p "Press Enter when done..."

# Step 5: Update .env.local
echo ""
print_step "Step 5/7: Updating .env.local..."
echo ""

# Backup old env
if [ -f ".env.local" ]; then
    cp .env.local .env.local.backup-$(date +%Y%m%d)
    print_success "Backed up .env.local"
fi

read -p "Enter new TURSO_DATABASE_URL: " TURSO_URL
read -p "Enter new TURSO_AUTH_TOKEN: " TURSO_TOKEN

# Get existing values
BLOB_TOKEN=$(grep "BLOB_READ_WRITE_TOKEN" .env.local 2>/dev/null | cut -d '=' -f2 || echo "")
RESEND_KEY=$(grep "RESEND_API_KEY" .env.local 2>/dev/null | cut -d '=' -f2 || echo "")

# Create new .env.local
cat > .env.local << EOF
# Created by migration script on $(date)
TURSO_DATABASE_URL=$TURSO_URL
TURSO_AUTH_TOKEN=$TURSO_TOKEN
BLOB_READ_WRITE_TOKEN=$BLOB_TOKEN
RESEND_API_KEY=$RESEND_KEY
NEXT_PUBLIC_APP_URL=https://${PROJECT_NAME}.vercel.app
EOF

print_success "Created new .env.local"

# Step 6: Deploy to Vercel
echo ""
print_step "Step 6/7: Deploying to Vercel..."
echo ""
echo "Go to: https://vercel.com/new"
echo ""
echo "1. Import your new GitHub repo: $PROJECT_NAME"
echo "2. Add these Environment Variables:"
echo ""
echo "   TURSO_DATABASE_URL=$TURSO_URL"
echo "   TURSO_AUTH_TOKEN=$TURSO_TOKEN"
echo "   BLOB_READ_WRITE_TOKEN=$BLOB_TOKEN"
echo "   RESEND_API_KEY=$RESEND_KEY"
echo "   NEXT_PUBLIC_APP_URL=https://${PROJECT_NAME}.vercel.app"
echo ""
echo "3. Click Deploy"
echo ""
read -p "Press Enter when deployed..."

# Step 7: Verify
echo ""
print_step "Step 7/7: Verification..."
echo ""
echo "Test your new deployment:"
echo "  https://${PROJECT_NAME}.vercel.app"
echo ""
read -p "Does the site work correctly? (y/N): " VERIFY

if [[ $VERIFY =~ ^[Yy]$ ]]; then
    print_success "Migration completed successfully! 🎉"
    echo ""
    echo "Next steps:"
    echo "  • Test all pages on your new site"
    echo "  • Set up custom domain in Vercel (optional)"
    echo "  • Archive old project when ready"
else
    print_warning "Please check the Vercel deployment logs for errors"
fi

echo ""
print_success "Migration script finished!"
