# Optimus IDE

## Overview
Optimus IDE is a secure, embeddable development environment powered by AI. It provides a complete workspace for developers with terminal, editor, and collaborative features.

**Note**: This is a rebrand of the Coder engine with Optimus branding and customizations.

## Quick Start

```bash
# From monorepo root
pnpm install
pnpm dev:ide
```

## Tech Stack
- **Frontend**: React 19 + TypeScript
- **Build**: Vite
- **Editor**: Monaco Editor
- **Terminal**: Xterm.js
- **UI**: Material-UI + Tailwind CSS
- **State**: TanStack Query
- **Code Quality**: Biome

## Project Structure
```
src/
  components/    - React components
  pages/         - Page components
  hooks/         - Custom React hooks
  services/      - API services
  types/         - TypeScript type definitions
  utils/         - Utility functions
  styles/        - Global styles
  App.tsx        - Main application component
  main.tsx       - Application entry point
```

## Rebranding Guide

This application has been rebranded from Coder to Optimus IDE. Key areas requiring attention:

### 1. Environment Variables
- Replace all `CODER_*` variables with `OPTIMUS_IDE_*`
- Update `.env` files accordingly

### 2. Text & Labels
- Search for remaining "Coder" references in:
  - Component labels and titles
  - Error messages
  - Documentation
  - Help text

### 3. Configuration Files
- Review and update config files in `src/config/`
- Update API endpoints if necessary

### 4. Assets & Branding
- Update logos in `public/images/`
- Update favicon in `public/`
- Update theme colors if needed

## Available Scripts

- `pnpm dev` - Start development server (port 5173)
- `pnpm build` - Build for production
- `pnpm preview` - Preview production build
- `pnpm type-check` - Run TypeScript type checker
- `pnpm lint` - Run Biome linter
- `pnpm lint:fix` - Fix linting issues
- `pnpm format` - Format code with Biome
- `pnpm test` - Run tests
- `pnpm test:watch` - Run tests in watch mode

## Embedding Optimus IDE

Optimus IDE can be embedded as an iframe in other applications:

```html
<iframe
  src="https://your-optimus-ide-domain"
  style="width: 100%; height: 100vh; border: none;"
/>
```

## Configuration

Create a `.env.local` file in the `apps/optimus-ide` directory:

```env
VITE_API_URL=http://localhost:3000
VITE_WS_URL=ws://localhost:3000
```
