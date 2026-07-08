#!/bin/bash

# Optimus Monorepo - Complete Build Script
# Builds Optimus IDE binaries for multiple platforms
# Output: optimus, optimus.exe, optimus-linux, optimus-darwin, etc.

set -e

echo "🚧 Optimus IDE Build System"
echo "======================================"
echo ""

# Configuration
BUILD_DIR="${1:-./dist}"
VERSION="${2:-1.0.0}"
GIT_COMMIT=$(git rev-parse --short HEAD 2>/dev/null || echo "unknown")
BUILD_TIME=$(date -u +'%Y-%m-%dT%H:%M:%SZ')

echo "📋 Configuration:"
echo "  Output Directory: $BUILD_DIR"
echo "  Version: $VERSION"
echo "  Git Commit: $GIT_COMMIT"
echo "  Build Time: $BUILD_TIME"
echo ""

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

# Check prerequisites
echo "🔍 Checking prerequisites..."
echo ""

if ! command -v go &> /dev/null; then
  echo -e "${RED}❌ Go not found${NC}"
  echo "Please install Go 1.21+: https://golang.org/dl/"
  exit 1
fi

if ! command -v pnpm &> /dev/null; then
  echo -e "${RED}❌ pnpm not found${NC}"
  echo "Please install pnpm: npm install -g pnpm"
  exit 1
fi

echo -e "${GREEN}✓${NC} Go $(go version | awk '{print $3}')"
echo -e "${GREEN}✓${NC} pnpm $(pnpm --version)"
echo -e "${GREEN}✓${NC} Node $(node --version)"
echo ""

# Step 1: Build React Frontend
echo "🎨 Step 1: Building React Frontend"
echo "---"

if [ ! -d "apps/optimus-ide/site" ]; then
  echo -e "${RED}❌ apps/optimus-ide/site not found${NC}"
  exit 1
fi

cd apps/optimus-ide/site
echo "Installing frontend dependencies..."
pnpm install --frozen-lockfile || pnpm install

echo "Building frontend..."
pnpm run build

if [ ! -d "dist" ]; then
  echo -e "${RED}❌ Frontend build failed${NC}"
  exit 1
fi

echo -e "${GREEN}✓${NC} Frontend built successfully"
cd ../../..
echo ""

# Step 2: Build Go Backend
echo "🐹 Step 2: Building Go Backend"
echo "---"

cd apps/optimus-ide

# Verify Go modules
if [ ! -f "go.mod" ]; then
  echo -e "${RED}❌ go.mod not found${NC}"
  exit 1
fi

echo "Downloading Go dependencies..."
go mod download
go mod verify

echo "Building for multiple platforms..."
echo ""

mkdir -p "../../$BUILD_DIR"

# Define build targets
declare -a TARGETS=(
  "linux:amd64:optimus-linux-amd64"
  "linux:arm64:optimus-linux-arm64"
  "darwin:amd64:optimus-darwin-amd64"
  "darwin:arm64:optimus-darwin-arm64"
  "windows:amd64:optimus-windows-amd64.exe"
)

for target in "${TARGETS[@]}"; do
  IFS=':' read -r GOOS GOARCH BINARY <<< "$target"
  
  echo -e "${YELLOW}↳${NC} Building for $GOOS/$GOARCH -> $BINARY"
  
  CGO_ENABLED=0 GOOS=$GOOS GOARCH=$GOARCH go build \
    -ldflags "-X 'github.com/coder/coder/v2/buildinfo.Version=$VERSION' \
              -X 'github.com/coder/coder/v2/buildinfo.ExternalURL=' \
              -X 'main.BuildTime=$BUILD_TIME' \
              -X 'main.GitCommit=$GIT_COMMIT' \
              -s -w" \
    -o "../../$BUILD_DIR/$BINARY" \
    ./cmd/coder 2>&1 | grep -v "^#"
  
  if [ $? -eq 0 ]; then
    SIZE=$(du -h "../../$BUILD_DIR/$BINARY" | cut -f1)
    echo -e "${GREEN}✓${NC} $BINARY ($SIZE)"
  else
    echo -e "${RED}❌ Failed to build $BINARY${NC}"
    exit 1
  fi
done

cd ../..
echo ""

# Step 3: Create checksums
echo "📝 Step 3: Creating Checksums"
echo "---"

cd $BUILD_DIR

if command -v sha256sum &> /dev/null; then
  for binary in optimus-*; do
    if [ -f "$binary" ]; then
      sha256sum "$binary" > "$binary.sha256"
      echo -e "${GREEN}✓${NC} $binary.sha256"
    fi
  done
elif command -v shasum &> /dev/null; then
  for binary in optimus-*; do
    if [ -f "$binary" ]; then
      shasum -a 256 "$binary" > "$binary.sha256"
      echo -e "${GREEN}✓${NC} $binary.sha256"
    fi
  done
else
  echo -e "${YELLOW}⚠${NC}  sha256sum/shasum not available"
fi

cd ../..
echo ""

# Step 4: Create metadata
echo "📊 Step 4: Creating Metadata"
echo "---"

cat > "$BUILD_DIR/VERSION.txt" << EOF
Optimus IDE Binary Distribution
Version: $VERSION
Built: $BUILD_TIME
Git Commit: $GIT_COMMIT
Go Version: $(go version)
Node Version: $(node --version)
EOF

echo -e "${GREEN}✓${NC} VERSION.txt"

cat > "$BUILD_DIR/README.md" << 'EOF'
# Optimus IDE Binaries

These are the compiled Optimus IDE binaries.

## Available Builds

- `optimus-linux-amd64` - Linux x86_64 (Intel/AMD)
- `optimus-linux-arm64` - Linux ARM64 (Raspberry Pi 4+)
- `optimus-darwin-amd64` - macOS Intel
- `optimus-darwin-arm64` - macOS Apple Silicon (M1/M2/M3)
- `optimus-windows-amd64.exe` - Windows 10/11 x86_64

## Usage

### Linux/macOS

```bash
# Make executable
chmod +x optimus-linux-amd64

# Run
./optimus-linux-amd64 server --listen=0.0.0.0:3000
```

### Windows

```powershell
# Run
.\optimus-windows-amd64.exe server --listen=0.0.0.0:3000
```

## Environment Configuration

```bash
export OPTIMUS_IDE_PORT=3000
export OPTIMUS_IDE_HOST=0.0.0.0
export OPTIMUS_IDE_WORKSPACE_DOMAIN=optimus.dev
export OPTIMUS_IDE_PG_CONNECTION_URL=postgres://user:pass@localhost:5432/optimus

./optimus-linux-amd64 server
```

## Verification

Verify binary integrity using the `.sha256` files:

```bash
sha256sum -c optimus-linux-amd64.sha256
```

## Support

For issues and documentation, visit: https://github.com/coumbassaabdoulaye01-del/optimus-the-ai-platform-to-bu
EOF

echo -e "${GREEN}✓${NC} README.md"
echo ""

# Summary
echo "======================================"
echo -e "${GREEN}✅ Build Complete!${NC}"
echo "======================================"
echo ""
echo "📄 Output Directory: $BUILD_DIR"
echo ""
echo "Binaries created:"
ls -lh "$BUILD_DIR"/optimus-* 2>/dev/null | awk '{print "  " $9 " (" $5 ")"}'
echo ""
echo "🚀 Next steps:"
echo "  1. Test a binary: ./$BUILD_DIR/optimus-linux-amd64 --version"
echo "  2. Verify checksums: sha256sum -c $BUILD_DIR/*.sha256"
echo "  3. Deploy to infrastructure"
echo "  4. Configure with environment variables (see README.md)"
echo ""
