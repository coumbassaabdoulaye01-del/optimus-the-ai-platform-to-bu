#!/bin/bash

# Optimus IDE Rebranding Script
# This script performs a comprehensive search-and-replace to rebrand from Coder to Optimus IDE

set -e

echo "🎨 Starting Optimus IDE Rebranding Process..."
echo "================================================"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

IDE_PATH="${1:-.}"

if [ ! -d "$IDE_PATH" ]; then
  echo -e "${RED}Error: Path $IDE_PATH does not exist${NC}"
  exit 1
fi

echo -e "${YELLOW}Target directory: $IDE_PATH${NC}"

# List of search-and-replace patterns
declare -A PATTERNS=(
  # Brand names
  ["Coder IDE"]=\"Optimus IDE\"
  ["coder-ide"]=\"optimus-ide\"
  ["CoderIDE"]=\"OptimusIDE\"
  ["CODER_IDE"]=\"OPTIMUS_IDE\"
  
  # Product names
  ["Coder"]=\"Optimus\"
  ["coder"]=\"optimus\"
  ["CODER"]=\"OPTIMUS\"
  
  # Environment variables
  ["CODER_PORT"]=\"OPTIMUS_IDE_PORT\"
  ["CODER_HOST"]=\"OPTIMUS_IDE_HOST\"
  ["CODER_URL"]=\"OPTIMUS_IDE_URL\"
  ["CODER_TOKEN"]=\"OPTIMUS_IDE_TOKEN\"
  ["CODER_API"]=\"OPTIMUS_IDE_API\"
  
  # URLs and endpoints
  ["api/v2/coder"]=\"api/v2/optimus\"
  ["coder.com"]=\"optimus.ai\"
  
  # CSS classes
  [".coder-"]=\".optimus-\"
  ["coder_"]=\"optimus_\"
)

# File types to search
FILE_PATTERNS=(
  "*.ts"
  "*.tsx"
  "*.js"
  "*.jsx"
  "*.json"
  "*.css"
  "*.scss"
  "*.html"
  "*.md"
  "*.env*"
  "*.yml"
  "*.yaml"
)

echo -e "${YELLOW}Patterns to replace: ${#PATTERNS[@]}${NC}"

# Perform replacements
for pattern in "${!PATTERNS[@]}"; do
  replacement="${PATTERNS[$pattern]}"
  
  echo -e "${YELLOW}Replacing: $pattern -> $replacement${NC}"
  
  # Find and replace in all relevant files
  for file_pattern in "${FILE_PATTERNS[@]}"; do
    find "$IDE_PATH" -type f -name "$file_pattern" ! -path "*/node_modules/*" ! -path "*/.next/*" ! -path "*/dist/*" -print0 | \
    xargs -0 sed -i "s/$pattern/$replacement/g" 2>/dev/null || true
  done
  
  echo -e "${GREEN}✓ Done${NC}"
done

# Special handling for filenames
echo -e "${YELLOW}Renaming files and directories...${NC}"

# Rename directories
find "$IDE_PATH" -type d ! -path "*/node_modules/*" ! -path "*/.next/*" ! -path "*/dist/*" | while read dir; do
  newdir="${dir//coder/optimus}"
  if [ "$dir" != "$newdir" ]; then
    mv "$dir" "$newdir" 2>/dev/null || true
    echo -e "${GREEN}✓ Renamed: $dir -> $newdir${NC}"
  fi
done

# Rename files
find "$IDE_PATH" -type f ! -path "*/node_modules/*" ! -path "*/.next/*" ! -path "*/dist/*" -name "*coder*" | while read file; do
  newfile="${file//coder/optimus}"
  if [ "$file" != "$newfile" ]; then
    mv "$file" "$newfile" 2>/dev/null || true
    echo -e "${GREEN}✓ Renamed: $file -> $newfile${NC}"
  fi
done

echo ""
echo -e "${GREEN}================================================${NC}"
echo -e "${GREEN}✓ Rebranding Complete!${NC}"
echo -e "${GREEN}================================================${NC}"
echo ""
echo "Next steps:"
echo "  1. Review changes with: git diff"
echo "  2. Test the application: pnpm dev:ide"
echo "  3. Update any hardcoded URLs or API endpoints if needed"
echo "  4. Review and update .env files"
echo "  5. Commit changes: git commit -am 'chore: rebrand to Optimus IDE'"
echo ""
