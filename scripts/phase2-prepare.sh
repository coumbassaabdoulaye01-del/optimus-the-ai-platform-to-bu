#!/bin/bash

# Optimus Monorepo - Prepare for Phase 2
# Ensures all prerequisites are met before importing Coder and moving Optimus

set -e

echo "📋 Phase 2 Preparation Checklist"
echo "======================================="
echo ""

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m'

ERRORS=0

echo "Checking prerequisites..."
echo ""

# 1. Check git is clean
echo "1. Git Status"
if [ -z "$(git status --porcelain)" ]; then
  echo -e "${GREEN}✓${NC} Working directory clean"
else
  echo -e "${YELLOW}⚠${NC}  Working directory has uncommitted changes"
  echo "   This is OK for Phase 2 merge"
fi
echo ""

# 2. Verify monorepo structure
echo "2. Monorepo Structure"
if [ -f pnpm-workspace.yaml ] && [ -f turbo.json ] && [ -f package.json ]; then
  echo -e "${GREEN}✓${NC} Monorepo configuration files present"
else
  echo -e "${RED}✗${NC} Missing monorepo configuration"
  ((ERRORS++))
fi

if [ -d apps/optimus ]; then
  echo -e "${GREEN}✓${NC} apps/optimus exists"
else
  echo -e "${RED}✗${NC} apps/optimus missing (will be created in Phase 2)"
fi

if [ -d apps/optimus-ide ]; then
  if [ -f apps/optimus-ide/package.json ] && [ ! -f apps/optimus-ide/go.mod ]; then
    echo -e "${YELLOW}⚠${NC}  apps/optimus-ide exists but is incomplete (no Go code yet)"
    echo "   This will be populated in Phase 2"
  elif [ -f apps/optimus-ide/go.mod ]; then
    echo -e "${GREEN}✓${NC} apps/optimus-ide has Go module (Coder imported)"
  fi
else
  echo -e "${RED}✗${NC} apps/optimus-ide missing (will be created in Phase 2)"
fi
echo ""

# 3. Check scripts
echo "3. Utility Scripts"
if [ -f scripts/doctor.sh ]; then
  echo -e "${GREEN}✓${NC} scripts/doctor.sh present"
else
  echo -e "${YELLOW}⚠${NC}  scripts/doctor.sh missing"
fi

if [ -f scripts/rebrand-ui.sh ]; then
  echo -e "${GREEN}✓${NC} scripts/rebrand-ui.sh present (safe rebranding)"
else
  echo -e "${YELLOW}⚠${NC}  scripts/rebrand-ui.sh missing"
fi
echo ""

# 4. Check Makefile
echo "4. Build Configuration"
if [ -f Makefile ]; then
  echo -e "${GREEN}✓${NC} Root Makefile present"
else
  echo -e "${YELLOW}⚠${NC}  Makefile missing"
fi

if [ -f scripts/build-optimus.sh ]; then
  echo -e "${GREEN}✓${NC} scripts/build-optimus.sh present"
else
  echo -e "${YELLOW}⚠${NC}  Binary build script missing"
fi
echo ""

# 5. Check documentation
echo "5. Documentation"
if [ -f ARCHITECTURE.md ]; then
  echo -e "${GREEN}✓${NC} ARCHITECTURE.md present"
fi

if [ -f PLAN_MIGRATION_REVISITE.md ]; then
  echo -e "${GREEN}✓${NC} PLAN_MIGRATION_REVISITE.md present"
fi

if [ -f BUILD_DEPLOYMENT.md ]; then
  echo -e "${GREEN}✓${NC} BUILD_DEPLOYMENT.md present"
fi
echo ""

# 6. Node.js ecosystem
echo "6. Dependencies"
if command -v node &> /dev/null; then
  echo -e "${GREEN}✓${NC} Node.js $(node --version)"
else
  echo -e "${RED}✗${NC} Node.js not found"
  ((ERRORS++))
fi

if command -v pnpm &> /dev/null; then
  echo -e "${GREEN}✓${NC} pnpm $(pnpm --version)"
else
  echo -e "${YELLOW}⚠${NC}  pnpm not installed (install: npm i -g pnpm)"
fi
echo ""

echo "======================================="
if [ $ERRORS -eq 0 ]; then
  echo -e "${GREEN}✓ Phase 2 Ready!${NC}"
  echo ""
  echo "Next: Import Coder into apps/optimus-ide/"
  echo "  git remote add coder <coder-repo-url>"
  echo "  git fetch coder main"
  echo "  git read-tree --prefix=apps/optimus-ide coder/main"
  echo ""
else
  echo -e "${RED}✗ Prerequisites not met${NC}"
  exit 1
fi
