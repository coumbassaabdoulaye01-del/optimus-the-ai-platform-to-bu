# Root Makefile for Optimus Monorepo
# Orchestrates builds across all workspace packages

.PHONY: help install dev build lint type-check test clean format setup doctor validate-monorepo

# Default target
.DEFAULT_GOAL := help

help:
	@echo "Optimus Monorepo - Build Commands"
	@echo ""
	@echo "Setup & Installation:"
	@echo "  make install          Install all dependencies (pnpm)"
	@echo "  make setup            Full setup (install + validate)"
	@echo ""
	@echo "Development:"
	@echo "  make dev              Start all apps in dev mode"
	@echo "  make dev-optimus      Start only Optimus Platform"
	@echo "  make dev-ide          Start only Optimus IDE"
	@echo ""
	@echo "Building:"
	@echo "  make build            Build all packages"
	@echo "  make build-optimus    Build Optimus Platform only"
	@echo "  make build-ide        Build Optimus IDE only"
	@echo "  make build-binaries   Build Optimus IDE binaries (all platforms)"
	@echo ""
	@echo "Code Quality:"
	@echo "  make lint             Run linters on all packages"
	@echo "  make type-check       Run TypeScript type checking"
	@echo "  make test             Run tests in all packages"
	@echo "  make format           Format code in all packages"
	@echo "  make format-check     Check code formatting"
	@echo ""
	@echo "Maintenance:"
	@echo "  make clean            Clean all build artifacts"
	@echo "  make doctor           Validate monorepo health"
	@echo "  make rebrand-ui       Rebrand Optimus IDE UI only (SAFE)"
	@echo "  make find-refs        Find Coder references in code"
	@echo ""

# Installation
install:
	@echo "📦 Installing dependencies..."
	@pnpm install
	@echo "✓ Installation complete"

setup: install doctor
	@echo "✓ Setup complete"

# Development
dev:
	@echo "🚀 Starting development servers..."
	@pnpm dev

dev-optimus:
	@echo "🚀 Starting Optimus Platform..."
	@pnpm dev --filter=apps/optimus

dev-ide:
	@echo "🚀 Starting Optimus IDE..."
	@pnpm dev --filter=apps/optimus-ide

# Building
build:
	@echo "🔨 Building all packages..."
	@pnpm build
	@echo "✓ Build complete"

build-optimus:
	@echo "🔨 Building Optimus Platform..."
	@pnpm build --filter=apps/optimus

build-ide:
	@echo "🔨 Building Optimus IDE (Go + Node)..."
	@cd apps/optimus-ide && make build

build-binaries:
	@echo "🔨 Building Optimus IDE binaries (all platforms)..."
	@bash scripts/build-optimus.sh dist 1.0.0

# Code Quality
lint:
	@echo "✓ Running linters..."
	@pnpm lint

type-check:
	@echo "✓ Running type checks..."
	@pnpm type-check

test:
	@echo "✓ Running tests..."
	@pnpm test

format:
	@echo "✓ Formatting code..."
	@pnpm format

format-check:
	@echo "✓ Checking code format..."
	@pnpm format:check

# Maintenance
clean:
	@echo "🧹 Cleaning artifacts..."
	@pnpm clean
	@rm -rf dist/ .turbo/
	@cd apps/optimus-ide && make clean || true
	@echo "✓ Clean complete"

doctor:
	@echo "🏥 Running health check..."
	@bash scripts/doctor.sh

rebrand-ui:
	@echo "🎨 Rebranding Optimus IDE UI (UI-only)..."
	@bash scripts/rebrand-ui.sh

find-refs:
	@echo "🔍 Finding Coder references..."
	@bash scripts/find-coder-refs.sh

# Validation
validate-monorepo: doctor type-check lint
	@echo "✓ Monorepo validation passed"

# CI/CD targets
ci-build: install build lint type-check test
	@echo "✓ CI build passed"

ci-release: ci-build build-binaries
	@echo "✓ Release ready"
