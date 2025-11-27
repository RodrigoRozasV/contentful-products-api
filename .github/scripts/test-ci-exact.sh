#!/bin/bash

echo "🧪 Replicando GitHub Actions Workflow CI"
echo "========================================="
echo "Workflow: .github/workflows/ci.yml"
echo "Job: test-and-lint"
echo "========================================="
echo ""

# Colores
GREEN='\033[0;32m'
RED='\033[0;31m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m'

# === CONFIGURACIÓN EXACTA DEL WORKFLOW ===
NODE_VERSION="20.x"
POSTGRES_IMAGE="postgres:15-alpine"
POSTGRES_USER="postgres"
POSTGRES_PASSWORD="postgres"
POSTGRES_DB="contentful_products"

# Environment Variables
export DB_HOST=localhost
export DB_PORT=5432
export DB_USERNAME=postgres
export DB_PASSWORD=postgres
export DB_DATABASE=contentful_products
export CONTENTFUL_SPACE_ID=bbd24zg4yngm
export CONTENTFUL_ACCESS_TOKEN=wXfbqDOLix1ksxVH8NcRX1oE4KYytPW-ULqpXCxx3RU
export CONTENTFUL_ENVIRONMENT=master
export CONTENTFUL_CONTENT_TYPE=product
export JWT_SECRET=e3bf76123ac0c41cf6b0e94bf932a6d747f6d27ee28f3df1f07f8a61cbb845ff5bd8c4f867ac234de808ed72f8a28f7cc61bb1c26a762a8fd5588c043bda41b2
export JWT_EXPIRATION=24h
export PORT=3000

# Función para manejar errores
handle_error() {
    echo -e "${RED}❌ Step Failed: $1${NC}"
    echo ""
    echo "Cleaning up..."
    docker stop postgres-ci-test 2>/dev/null
    docker rm postgres-ci-test 2>/dev/null
    exit 1
}

# Función para imprimir step header
print_step() {
    echo ""
    echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo -e "${BLUE}▶ $1${NC}"
    echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
}

# STEP: Checkout
print_step "actions/checkout@v3"
echo "✅ Using current directory: $(pwd)"

# STEP: Setup Node.js
print_step "Use Node.js $NODE_VERSION"
CURRENT_NODE=$(node --version)
echo "Current Node.js version: $CURRENT_NODE"
echo "NPM version: $(npm --version)"
if [[ ! "$CURRENT_NODE" =~ ^v20\. ]]; then
    echo -e "${YELLOW}⚠️  Warning: Expected Node.js 20.x, found $CURRENT_NODE${NC}"
fi

# STEP: Start PostgreSQL Service
print_step "Starting PostgreSQL Service (postgres:15-alpine)"

docker stop postgres-ci-test 2>/dev/null
docker rm postgres-ci-test 2>/dev/null

echo "Starting container with health checks..."
docker run -d \
  --name postgres-ci-test \
  -e POSTGRES_USER=$POSTGRES_USER \
  -e POSTGRES_PASSWORD=$POSTGRES_PASSWORD \
  -e POSTGRES_DB=$POSTGRES_DB \
  -p 5432:5432 \
  --health-cmd="pg_isready -U postgres" \
  --health-interval=10s \
  --health-timeout=5s \
  --health-retries=5 \
  $POSTGRES_IMAGE > /dev/null || handle_error "Starting PostgreSQL"

echo "⏳ Waiting for PostgreSQL to be healthy..."
for i in {1..30}; do
  HEALTH=$(docker inspect --format='{{.State.Health.Status}}' postgres-ci-test 2>/dev/null)
  if [ "$HEALTH" = "healthy" ]; then
    echo -e "${GREEN}✅ PostgreSQL is healthy and ready!${NC}"
    break
  fi
  echo -n "."
  sleep 2
  if [ $i -eq 30 ]; then
    echo ""
    docker logs postgres-ci-test
    handle_error "PostgreSQL health check timeout"
  fi
done

# STEP: Install dependencies
print_step "Install dependencies"
echo "Running: npm ci"
if npm ci; then
  echo -e "${GREEN}✅ Dependencies installed${NC}"
else
  handle_error "Install dependencies"
fi

# STEP: Run linter
print_step "Run linter"
echo "Running: npm run lint"
if npm run lint; then
  echo -e "${GREEN}✅ Linter passed${NC}"
else
  handle_error "Run linter"
fi

# STEP: Run tests with coverage
print_step "Run tests with coverage"
echo "Running: npm run test:cov"
echo "Environment: NODE_ENV=test"

export NODE_ENV=test

if npm run test:cov; then
  echo -e "${GREEN}✅ Tests passed with coverage${NC}"
else
  handle_error "Run tests with coverage"
fi

# STEP: Check test coverage
print_step "Check test coverage"
if [ ! -f "coverage/coverage-summary.json" ]; then
  handle_error "Coverage report not found"
fi

# Usar Node.js para parsear JSON (funciona en Windows sin jq)
COVERAGE=$(node -e "const fs=require('fs'); const data=JSON.parse(fs.readFileSync('coverage/coverage-summary.json')); console.log(data.total.statements.pct);")
echo "📊 Test coverage: $COVERAGE%"

# Comparación simple sin bc
COVERAGE_INT=$(echo $COVERAGE | cut -d'.' -f1)
if [ "$COVERAGE_INT" -lt 30 ]; then
  echo -e "${RED}❌ Test coverage is below 30%${NC}"
  handle_error "Check test coverage"
else
  echo -e "${GREEN}✅ Test coverage is sufficient (>= 30%)${NC}"
fi

# STEP: Build application
print_step "Build application"
echo "Running: npm run build"
echo "Environment: NODE_ENV=production"

export NODE_ENV=production

if npm run build; then
  echo -e "${GREEN}✅ Build successful${NC}"
  if [ -f "dist/main.js" ]; then
    echo "📦 Build output: dist/main.js exists"
  fi
else
  handle_error "Build application"
fi

# STEP: Upload coverage reports (simulated)
print_step "Upload coverage reports (codecov/codecov-action@v3)"
echo "ℹ️  Skipping upload in local simulation"
if [ -f "coverage/coverage-summary.json" ]; then
  echo "  ✓ coverage/coverage-summary.json exists"
fi

# CLEANUP
print_step "Cleanup"
echo "Stopping and removing PostgreSQL container..."
docker stop postgres-ci-test > /dev/null 2>&1
docker rm postgres-ci-test > /dev/null 2>&1
echo -e "${GREEN}✅ Cleanup complete${NC}"

# SUCCESS
echo ""
echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${GREEN}✅ ALL WORKFLOW STEPS PASSED! ✅${NC}"
echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""
echo "Summary of completed steps:"
echo "  ✅ actions/checkout@v3"
echo "  ✅ Use Node.js $NODE_VERSION"
echo "  ✅ PostgreSQL Service (healthy)"
echo "  ✅ Install dependencies"
echo "  ✅ Run linter"
echo "  ✅ Run tests with coverage"
echo "  ✅ Check test coverage ($COVERAGE%)"
echo "  ✅ Build application"
echo "  ℹ️  Upload coverage reports (skipped locally)"
echo ""
echo "🚀 Your code is ready to push to GitHub!"
echo ""