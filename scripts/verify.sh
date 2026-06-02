#!/usr/bin/env bash
# verify.sh — Three-layer verification harness for RentBasket Website
#
# Lecture 09: agents are systematically overconfident; completion judgement
# must be externalised. This script IS that externalisation.
# Lecture 10: only end-to-end testing is true verification — Layer 3 is the
# only path to `passing` in docs/features.md.
#
# Usage:
#   bash scripts/verify.sh                     # all layers
#   bash scripts/verify.sh --layer 1           # lint + typecheck + arch rules
#   bash scripts/verify.sh --layer 2           # layer 1 + vitest
#   bash scripts/verify.sh --layer 3           # all layers including Playwright
#   bash scripts/verify.sh --layer 3 --scope design  # design specs only
#   bash scripts/verify.sh --feature D01       # scoped to one feature
#
# Exit codes: 0 = pass, 1 = failure, 2 = invalid args

set -uo pipefail
cd "$(dirname "$0")/.."

LAYER="all"
FEATURE=""
SCOPE=""

while [[ $# -gt 0 ]]; do
  case "$1" in
    --layer)   LAYER="$2"; shift 2 ;;
    --feature) FEATURE="$2"; shift 2 ;;
    --scope)   SCOPE="$2"; shift 2 ;;
    *) echo "Unknown arg: $1" >&2; exit 2 ;;
  esac
done

# ──────────────────────────────────────────────
# Agent-oriented error helper (Lecture 10)
# ──────────────────────────────────────────────
fail() {
  local what="$1"; local why="$2"; local fix="$3"
  echo "" >&2
  echo "============================================================" >&2
  echo "ERROR: $what" >&2
  echo "WHY:   $why" >&2
  echo "FIX:   $fix" >&2
  echo "============================================================" >&2
  exit 1
}
ok()   { echo "  ✅ $1"; }
warn() { echo "  ⚠️  $1"; }
info() { echo "→ $1"; }

# ──────────────────────────────────────────────
# Layer 1 — Lint + typecheck + architectural rules
# Fast, cheap, blocks everything else on failure.
# ──────────────────────────────────────────────
layer1() {
  info "Layer 1: lint + typecheck + architectural rules"

  # ESLint
  if grep -q '"lint"' package.json 2>/dev/null; then
    npm run lint --silent 2>&1 || fail \
      "ESLint found violations" \
      "Style or correctness rules are broken" \
      "Run 'npm run lint' for details. Most are auto-fixable with 'npm run lint -- --fix'."
    ok "ESLint"
  fi

  # TypeScript
  if [[ -f tsconfig.json ]]; then
    npx tsc --noEmit 2>&1 || fail \
      "TypeScript type errors" \
      "Code refers to symbols or shapes that don't match type declarations" \
      "Read the tsc output. Each error gives file:line + expected vs actual type. Fix the code, or add/update a type declaration."
    ok "TypeScript"
  fi

  # ── Architectural rules (Lecture 10: make rules executable) ──────

  # Rule: no raw hex colours in JSX or CSS (AGENTS.md Hard Constraint #1)
  if grep -rE '#[0-9a-fA-F]{6}|#[0-9a-fA-F]{3}' \
       --include="*.jsx" --include="*.tsx" --include="*.css" \
       src/ 2>/dev/null \
     | grep -v "// ignore-harness" \
     | grep -v "node_modules" \
     | grep -q .; then
    fail \
      "Raw hex colour found in source" \
      "AGENTS.md Hard Constraint #1: all colours must use HSL CSS tokens from src/index.css" \
      "Replace the hex value with a semantic token class (e.g. bg-primary, text-muted-foreground).
       If the colour doesn't exist as a token, add it to src/index.css :root first.
       See docs/design-system.md § Colour Tokens."
  fi
  ok "No raw hex in source"

  # Rule: no console.log left in src/
  if grep -rn 'console\.log(' \
       --include="*.jsx" --include="*.tsx" --include="*.js" --include="*.ts" \
       src/ 2>/dev/null \
     | grep -v "// ignore-harness" \
     | grep -q .; then
    warn "console.log found in src/ — remove before deploy (or add '// ignore-harness' comment to suppress)"
    grep -rn 'console\.log(' --include="*.jsx" --include="*.tsx" src/ 2>/dev/null | grep -v "// ignore-harness" || true
  fi

  # Rule: whileInView animations must have once:true (re-animation on scroll-up feels broken)
  if grep -rn 'whileInView' --include="*.jsx" --include="*.tsx" src/ 2>/dev/null | grep -q .; then
    if ! grep -rn 'whileInView' --include="*.jsx" --include="*.tsx" src/ 2>/dev/null \
         | xargs grep -l 'once.*true\|once: true' 2>/dev/null | grep -q .; then
      warn "whileInView used without 'once: true' — check src/ components re-animate on scroll-up"
    fi
  fi

  # Rule: products in products.js must match copy-spa-404.js static routes (rough check)
  if [[ -f scripts/copy-spa-404.js && -f src/data/products.js ]]; then
    PRODUCT_COUNT=$(grep -c '^\s*id:' src/data/products.js 2>/dev/null || echo 0)
    SPA_COUNT=$(grep -c 'writeRouteIndex.*"product"' scripts/copy-spa-404.js 2>/dev/null || echo -1)
    # SPA uses a loop so count won't match; just verify the loop exists
    if ! grep -q 'writeRouteIndex.*"product"' scripts/copy-spa-404.js 2>/dev/null; then
      fail \
        "copy-spa-404.js does not generate /product/* routes" \
        "All product pages would 404 on GitHub Pages after deploy" \
        "Ensure scripts/copy-spa-404.js has the productIds loop that calls writeRouteIndex('product', id)."
    fi
  fi
  ok "Architectural rules"

  echo ""
}

# ──────────────────────────────────────────────
# Layer 2 — Unit tests (Vitest)
# ──────────────────────────────────────────────
layer2() {
  info "Layer 2: unit tests (vitest)"

  if grep -q '"test"' package.json 2>/dev/null; then
    npm test -- --reporter=verbose --passWithNoTests 2>&1 || fail \
      "Vitest unit tests failed" \
      "One or more unit tests produced an actual value that differs from expected" \
      "Read the failing test names and diffs above. Fix the source code to match the test expectation.
       Re-run a single file with: npx vitest run src/path/to/file.test.jsx"
    ok "Vitest unit tests"
  else
    warn "No 'test' script in package.json — skipping unit tests"
  fi

  echo ""
}

# ──────────────────────────────────────────────
# Layer 3 — End-to-end (Playwright)
# The ONLY layer that moves a feature to `passing` in docs/features.md.
# ──────────────────────────────────────────────
layer3() {
  info "Layer 3: end-to-end (Playwright)"

  if ! command -v npx >/dev/null 2>&1; then
    fail "npx not found" "Node.js not installed or not on PATH" "Install Node.js 20+ and retry."
  fi

  if [[ ! -d e2e ]]; then
    fail \
      "No e2e/ directory" \
      "Layer 3 requires Playwright specs in e2e/" \
      "Run: npm install -D @playwright/test && npx playwright install chromium
       Then create e2e/landing.spec.ts as your first spec (see docs/design-evolution.md § Sprint Framework)."
  fi

  SPECS=$(find e2e -name "*.spec.ts" -o -name "*.spec.js" 2>/dev/null | wc -l | tr -d ' ')
  if [[ "$SPECS" -eq 0 ]]; then
    warn "e2e/ directory exists but contains no spec files — Layer 3 skipped"
    warn "Create e2e/landing.spec.ts to start Playwright verification (feature E01)"
    echo ""
    return 0
  fi

  # Build the site first (Playwright needs a running server or built output)
  if [[ ! -d dist ]]; then
    info "Building site for e2e..."
    npm run build --silent 2>&1 || fail \
      "Vite build failed before e2e" \
      "The site cannot be built — fix build errors in Layer 1/2 first" \
      "Run 'npm run build' and fix the errors reported."
  fi

  if [[ -n "$FEATURE" ]]; then
    info "Scoped to feature: $FEATURE"
    npx playwright test e2e/ --grep "$FEATURE" 2>&1 || fail \
      "Playwright e2e failed for $FEATURE" \
      "The end-to-end journey for $FEATURE did not produce the expected outcome" \
      "Open the failing spec file in e2e/, read the assertion that failed, trace the component
       that renders the element. Common causes: component not rendering, selector changed, missing data.
       See docs/design-evolution.md § Sprint Framework for the e2e pattern."
  elif [[ "$SCOPE" == "design" ]]; then
    info "Design specs only (e2e/design.spec.ts)"
    if [[ -f e2e/design.spec.ts ]]; then
      npx playwright test e2e/design.spec.ts 2>&1 || fail \
        "Design spec failed" \
        "A design-quality assertion did not pass — visual or behavioural regression detected" \
        "Check the Playwright report (npx playwright show-report). Compare before/after screenshots.
         See docs/design-evolution.md § Evaluator Rubric."
    else
      warn "e2e/design.spec.ts not yet created — skipping design e2e"
    fi
  else
    npx playwright test e2e/ 2>&1 || fail \
      "Playwright e2e suite failed" \
      "One or more end-to-end journeys did not complete successfully" \
      "Run 'npx playwright show-report' for the interactive report with screenshots.
       See docs/design-evolution.md and docs/features.md for the feature specification."
    ok "Playwright e2e"
  fi

  # Pass-state gating (Lecture 08): update docs/features.md if a specific feature passed
  update_feature_state

  echo ""
}

# ──────────────────────────────────────────────
# Pass-state gating (Lecture 08)
# Only e2e success can move active → passing.
# ──────────────────────────────────────────────
update_feature_state() {
  if [[ -n "$FEATURE" && -f docs/features.md ]]; then
    info "Promoting $FEATURE to passing in docs/features.md"
    TIMESTAMP=$(date -u +"%Y-%m-%d")
    # Update state from active/not_started to passing
    sed -i.bak \
      -e "s/\"state\": \"active\"\(.*\)\"id\": \"$FEATURE\"/\"state\": \"passing\"\1\"id\": \"$FEATURE\"/" \
      -e "/\"id\": \"$FEATURE\"/,/}/ s/\"state\": \"active\"/\"state\": \"passing\"/" \
      -e "/\"id\": \"$FEATURE\"/,/}/ s/\"evidence\": null/\"evidence\": \"e2e run $TIMESTAMP\"/" \
      docs/features.md 2>/dev/null && rm -f docs/features.md.bak
    ok "$FEATURE promoted to passing in docs/features.md"
  fi
}

# ──────────────────────────────────────────────
# Main
# ──────────────────────────────────────────────
case "$LAYER" in
  1)   layer1 ;;
  2)   layer1; layer2 ;;
  3)   layer1; layer2; layer3 ;;
  all) layer1; layer2; layer3 ;;
  *)   echo "Invalid --layer: $LAYER (must be 1, 2, 3, or all)" >&2; exit 2 ;;
esac

echo ""
echo "============================================================"
echo "✅ verify.sh passed (layer=${LAYER}, feature=${FEATURE:-all}, scope=${SCOPE:-all})"
echo "============================================================"
