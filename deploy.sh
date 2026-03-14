#!/bin/bash
# ─────────────────────────────────────────────────────────────
# Directory Framework — one-command deploy
# Usage:  ./deploy.sh "your commit message"
# ─────────────────────────────────────────────────────────────

set -e  # exit immediately on any error

MSG="${1:-chore: update}"

echo ""
echo "🚀  Deploy"
echo "────────────────────────────────────"

# ── 1. Stage all changes ───────────────────────────────────────
echo "📦  Staging changes..."
git add -A

# Check if there's anything to commit
if git diff --cached --quiet; then
  echo "✅  Nothing to commit — working tree clean"
else
  echo "💬  Committing: \"$MSG\""
  git commit -m "$MSG

Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>"

  # ── 2. Push to GitHub ──────────────────────────────────────────
  echo "⬆️   Pushing to GitHub..."
  git push origin main
  echo "✅  GitHub updated"
fi

# ── 3. Deploy to Vercel ────────────────────────────────────────
echo "▲   Deploying to Vercel (production)..."
vercel deploy --prod

echo ""
echo "✅  All done! Live at https://infosylvita.com"
echo "────────────────────────────────────"
