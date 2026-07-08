{
  "name": "optimus-monorepo",
  "version": "1.0.0",
  "description": "Optimus - Unified Monorepo Migration Plan",
  "scripts": {
    "setup:monorepo": "pnpm install && pnpm run build",
    "rebrand:ide": "bash ./scripts/rebrand-to-optimus.sh ./apps/optimus-ide",
    "find:coder-refs": "bash ./scripts/find-coder-references.sh ./apps/optimus-ide"
  }
}
