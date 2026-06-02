#!/usr/bin/env bash
# session_clockout.sh — Clock-out ritual for end of agent session (Lecture 05, 07)
# Run this at the END of every session before committing.

set -uo pipefail
cd "$(dirname "$0")/.."

echo ""
echo "╔══════════════════════════════════════════════════╗"
echo "║  🪴 RentBasket — Session Clock-Out              ║"
echo "╚══════════════════════════════════════════════════╝"
echo ""

# 1. What was touched?
echo "─── Files changed this session ─────────────────────"
git diff --name-only HEAD 2>/dev/null | head -30
git status --short 2>/dev/null | head -20
echo ""

# 2. Run Layer 1 verify before committing
echo "─── Running Layer 1 verify (lint + typecheck + arch rules) ─"
bash scripts/verify.sh --layer 1 && echo "✅ Layer 1 passed" || {
  echo ""
  echo "ERROR: Layer 1 failed. Fix issues before committing."
  echo "This is not a suggestion — committing broken code locks in the regression."
  exit 1
}
echo ""

# 3. Prompt for PROGRESS.md update
echo "─── Checklist before commit ────────────────────────"
echo ""
echo "  Have you:"
echo "  [ ] Updated PROGRESS.md (Completed / In Progress / Known Issues / Handoff Note)?"
echo "  [ ] Updated docs/features.md state for the feature you worked on?"
echo "  [ ] Added a line to docs/harness-changelog.md if you changed the harness?"
echo "  [ ] Added a promotion to docs/review-promotions.md if review caught something verify.sh missed?"
echo ""
echo "  If any 'Design' features were changed:"
echo "  [ ] Added a Sprint Log entry to docs/design-evolution.md?"
echo "  [ ] Scored the design rubric (before vs after)?"
echo ""

# 4. Git summary
DIRTY=$(git status --porcelain 2>/dev/null | wc -l | tr -d ' ')
echo "─── Git status ─────────────────────────────────────"
echo "  Files to commit: $DIRTY"
git status --short 2>/dev/null
echo ""
echo "  Suggested commit command:"
echo "  git add <files> && git commit -m 'V x.x — <summary of what you did>'"
echo ""
echo "  After commit: run 'make check' before 'make deploy'."
echo ""
echo "═══════════════════════════════════════════════════"
echo "  Clock-out complete. Update PROGRESS.md, then commit."
echo "═══════════════════════════════════════════════════"
echo ""
