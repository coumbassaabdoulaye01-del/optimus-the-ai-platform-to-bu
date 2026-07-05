#!/usr/bin/env bash
set -euo pipefail

if command -v coder >/dev/null 2>&1; then
  echo "Coder is already installed: $(command -v coder)"
  coder version || true
  exit 0
fi

if [[ -n "${CODER_REPO_PATH:-}" && -x "${CODER_REPO_PATH}/coder" ]]; then
  mkdir -p "$HOME/.local/bin"
  cp "${CODER_REPO_PATH}/coder" "$HOME/.local/bin/coder"
  chmod +x "$HOME/.local/bin/coder"
  echo "Installed coder from CODER_REPO_PATH into $HOME/.local/bin/coder"
  exit 0
fi

if [[ -x "../coder/coder" ]]; then
  mkdir -p "$HOME/.local/bin"
  cp "../coder/coder" "$HOME/.local/bin/coder"
  chmod +x "$HOME/.local/bin/coder"
  echo "Installed coder from ../coder into $HOME/.local/bin/coder"
  exit 0
fi

curl -fsSL https://coder.com/install.sh | sh
