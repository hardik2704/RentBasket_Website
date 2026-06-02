#!/usr/bin/env bash
# session_clockin.sh — Clock-in ritual for a new agent session (Lecture 05, 06)
# Run this at the START of every session before touching any feature code.

set -uo pipefail
cd "$(dirname "$0")/.."

echo ""
echo "╔══════════════════════════════════════════════════╗"
echo "║  🪴 RentBasket — Session Clock-In               ║"
echo "╚══════════════════════════════════════════════════╝"
echo ""

# 1. Git status
BRANCH=$(git rev-parse --abbrev-ref HEAD 2>/dev/null || echo "?")
COMMIT=$(git rev-parse --short HEAD 2>/dev/null || echo "?")
echo "Git branch: $BRANCH  |  HEAD: $COMMIT"
DIRTY=$(git status --porcelain 2>/dev/null | wc -l | tr -d ' ')
if [[ "$DIRTY" -gt 0 ]]; then
  echo "⚠️  $DIRTY uncommitted changes"
else
  echo "✅ Working tree clean"
fi
echo ""

# 2. Read PROGRESS.md current state
if [[ -f PROGRESS.md ]]; then
  echo "─── PROGRESS.md: Current State ───────────────────"
  sed -n '/^## Current State/,/^## /p' PROGRESS.md | head -20
  echo ""
  echo "─── PROGRESS.md: Next Steps ───────────────────────"
  sed -n '/^## Next Steps/,/^## /p' PROGRESS.md | head -10
  echo ""
else
  echo "⚠️  PROGRESS.md not found — create it (see templates/PROGRESS.md.template)"
fi

# 3. Next feature from docs/features.md
if [[ -f docs/features.md ]]; then
  echo "─── docs/features.md: Active & Not-Started ────────"
  python3 -c "
import json, re, sys
with open('docs/features.md') as f:
    content = f.read()
match = re.search(r'\`\`\`json\s*(.*?)\`\`\`', content, re.DOTALL)
if not match:
    print('Could not parse features JSON block')
    sys.exit(0)
features = json.loads(match.group(1))
for f in features:
    if f['state'] in ('active', 'not_started'):
        print(f'  [{f[\"state\"]:12s}] {f[\"id\"]}: {f[\"behavior\"][:80]}')
" 2>/dev/null || grep -A2 '"state": "active"\|"state": "not_started"' docs/features.md | head -20
  echo ""
fi

# 4. Bootstrap contract check
echo "─── Bootstrap Contract ─────────────────────────────"
echo "  Before starting feature work, confirm:"
echo "  [ ] PROGRESS.md read ✓ (just done)"
echo "  [ ] Exactly one feature picked from above"
echo "  [ ] make check passes (run it now: make check)"
echo ""
echo "═══════════════════════════════════════════════════"
echo "  Clock-in complete. Run 'make check', then start."
echo "═══════════════════════════════════════════════════"
echo ""
