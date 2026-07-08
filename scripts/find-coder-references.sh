#!/bin/bash

# Identify remaining Coder references
# Helps find any missed rebranding opportunities

echo "🔍 Scanning for remaining Coder references..."
echo "================================================"

IDE_PATH="${1:-.}"
COUNT=0

# Search for Coder references (case-sensitive)
echo ""
echo "📋 Files containing 'Coder':"
echo "---"
grep -r "Coder" "$IDE_PATH" \
  --include="*.ts" \
  --include="*.tsx" \
  --include="*.js" \
  --include="*.jsx" \
  --include="*.json" \
  --include="*.md" \
  --include="*.env*" \
  --exclude-dir=node_modules \
  --exclude-dir=.next \
  --exclude-dir=dist \
  --exclude-dir=.git \
  2>/dev/null || echo "No matches found"

echo ""
echo "📋 Files containing 'coder' (lowercase):"
echo "---"
grep -r "coder" "$IDE_PATH" \
  --include="*.ts" \
  --include="*.tsx" \
  --include="*.js" \
  --include="*.jsx" \
  --include="*.json" \
  --include="*.md" \
  --include="*.env*" \
  --exclude-dir=node_modules \
  --exclude-dir=.next \
  --exclude-dir=dist \
  --exclude-dir=.git \
  2>/dev/null || echo "No matches found"

echo ""
echo "📋 Files containing 'CODER' (uppercase):"
echo "---"
grep -r "CODER" "$IDE_PATH" \
  --include="*.ts" \
  --include="*.tsx" \
  --include="*.js" \
  --include="*.jsx" \
  --include="*.json" \
  --include="*.md" \
  --include="*.env*" \
  --exclude-dir=node_modules \
  --exclude-dir=.next \
  --exclude-dir=dist \
  --exclude-dir=.git \
  2>/dev/null || echo "No matches found"

echo ""
echo "================================================"
echo "Scan complete. Review results above."
echo ""
