#!/usr/bin/env bash
# ============================================================
# InfoSylvita — Full Backup Script
# ============================================================
# Backs up:
#   1. Database schema (DDL)     → schema.sql
#   2. Database data             → data.sql
#   3. Auth users list           → auth_users.json
#   4. Git snapshot              → git log summary
#
# Backups are saved to: ~/infosylvita-backups/YYYY-MM-DD_HH-MM/
# Keeps the last 30 days of backups automatically.
#
# Usage:
#   ./scripts/backup.sh            — run a full backup
#   ./scripts/backup.sh --dry-run  — preview without writing files
# ============================================================

set -euo pipefail

# ── Config ──────────────────────────────────────────────────
PROJECT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
BACKUP_ROOT="$HOME/infosylvita-backups"
TIMESTAMP=$(date +"%Y-%m-%d_%H-%M")
BACKUP_DIR="$BACKUP_ROOT/$TIMESTAMP"
KEEP_DAYS=30
DRY_RUN=false
LOG_FILE="$BACKUP_ROOT/backup.log"

# Load env for API keys
ENV_FILE="$PROJECT_DIR/.env.local"
if [[ -f "$ENV_FILE" ]]; then
  export $(grep -v '^#' "$ENV_FILE" | grep -E "SUPABASE_URL|SUPABASE_SERVICE_ROLE|NEXT_PUBLIC_SUPABASE" | xargs)
fi

SUPABASE_URL="${NEXT_PUBLIC_SUPABASE_URL:-}"
SERVICE_KEY="${SUPABASE_SERVICE_ROLE_KEY:-}"
ANON_KEY="${NEXT_PUBLIC_SUPABASE_ANON_KEY:-}"

# ── Parse args ───────────────────────────────────────────────
for arg in "$@"; do
  case $arg in
    --dry-run) DRY_RUN=true ;;
  esac
done

# ── Helpers ─────────────────────────────────────────────────
log() {
  local msg="[$(date '+%Y-%m-%d %H:%M:%S')] $*"
  echo "$msg"
  if [[ "$DRY_RUN" == false ]]; then
    echo "$msg" >> "$LOG_FILE"
  fi
}

die() { log "ERROR: $*"; exit 1; }

check_deps() {
  command -v supabase >/dev/null 2>&1 || die "supabase CLI not found"
  command -v curl     >/dev/null 2>&1 || die "curl not found"
  command -v gzip     >/dev/null 2>&1 || die "gzip not found"
  [[ -n "$SERVICE_KEY" ]] || die ".env.local missing SUPABASE_SERVICE_ROLE_KEY"
  [[ -n "$SUPABASE_URL" ]] || die ".env.local missing NEXT_PUBLIC_SUPABASE_URL"
}

# ── Main ────────────────────────────────────────────────────
main() {
  log "=========================================="
  log "InfoSylvita Backup - $TIMESTAMP"
  if [[ "$DRY_RUN" == true ]]; then log "DRY RUN - no files will be written"; fi
  log "=========================================="

  check_deps

  if [[ "$DRY_RUN" == false ]]; then
    mkdir -p "$BACKUP_DIR"
    log "Backup directory: $BACKUP_DIR"
  fi

  # ── 1. Schema (DDL) ───────────────────────────────────────
  # supabase db dump requires Docker to run pg_dump in a container.
  # Workaround: use --dry-run to get fresh CLI credentials + the exact
  # pg_dump command, then run it directly via the local pg_dump binary.
  log "Step 1/4: Dumping database schema..."
  if [[ "$DRY_RUN" == false ]]; then
    cd "$PROJECT_DIR"
    schema_script=$(supabase db dump --dry-run 2>&1 | sed -n '/^#!\/usr\/bin\/env bash/,$ p')
    if [[ -n "$schema_script" ]]; then
      echo "$schema_script" | bash > "$BACKUP_DIR/schema.sql" 2>>"$LOG_FILE" \
        && log "  [OK] schema.sql saved ($(wc -l < "$BACKUP_DIR/schema.sql") lines)" \
        || log "  [WARN] Schema dump failed (check log)"
    else
      log "  [WARN] Could not extract schema script from CLI"
    fi
  else
    log "  [DRY RUN] Would dump schema to $BACKUP_DIR/schema.sql"
  fi

  # ── 2. Data only ─────────────────────────────────────────
  log "Step 2/4: Dumping database data..."
  if [[ "$DRY_RUN" == false ]]; then
    cd "$PROJECT_DIR"
    data_script=$(supabase db dump --dry-run --data-only 2>&1 | sed -n '/^#!\/usr\/bin\/env bash/,$ p')
    if [[ -n "$data_script" ]]; then
      echo "$data_script" | bash > "$BACKUP_DIR/data.sql" 2>>"$LOG_FILE" \
        && log "  [OK] data.sql saved ($(wc -l < "$BACKUP_DIR/data.sql") lines)" \
        || log "  [WARN] Data dump failed (check log)"
    else
      log "  [WARN] Could not extract data script from CLI"
    fi
  else
    log "  [DRY RUN] Would dump data to $BACKUP_DIR/data.sql"
  fi

  # ── 3. Auth users (via Admin API) ─────────────────────────
  log "Step 3/4: Exporting auth users list..."
  if [[ "$DRY_RUN" == false ]]; then
    curl -s \
      "${SUPABASE_URL}/auth/v1/admin/users?page=1&per_page=1000" \
      -H "apikey: $SERVICE_KEY" \
      -H "Authorization: Bearer $SERVICE_KEY" \
      -o "$BACKUP_DIR/auth_users.json"
    USER_COUNT=$(grep -o '"email"' "$BACKUP_DIR/auth_users.json" | wc -l | tr -d ' ')
    log "  ✅ auth_users.json saved ($USER_COUNT users)"
  else
    log "  [DRY RUN] Would export auth users → $BACKUP_DIR/auth_users.json"
  fi

  # ── 4. Git snapshot ───────────────────────────────────────
  log "Step 4/4: Saving git snapshot..."
  if [[ "$DRY_RUN" == false ]]; then
    cd "$PROJECT_DIR"
    {
      echo "=== Git Status ==="
      git status --short 2>&1 || true
      echo ""
      echo "=== Git Log (last 20 commits) ==="
      git log --oneline -20 2>&1 || true
      echo ""
      echo "=== Remote ==="
      git remote -v 2>&1 || echo "No remote configured"
    } > "$BACKUP_DIR/git_snapshot.txt"
    log "  ✅ git_snapshot.txt saved"

    # If remote is configured, push
    if git remote 2>/dev/null | grep -q origin; then
      log "  Pushing to GitHub..."
      if git push origin main >>"$LOG_FILE" 2>&1; then
        log "  [OK] GitHub push successful"
      else
        log "  [WARN] GitHub push failed (check log)"
      fi
    else
      log "  [INFO] No GitHub remote configured - skipping push"
    fi
  else
    log "  [DRY RUN] Would save git snapshot and push to GitHub"
  fi

  # ── 5. Compress ───────────────────────────────────────────
  if [[ "$DRY_RUN" == false ]]; then
    log "Compressing backup..."
    gzip -f "$BACKUP_DIR/schema.sql"   2>/dev/null || true
    gzip -f "$BACKUP_DIR/data.sql"     2>/dev/null || true
    gzip -f "$BACKUP_DIR/auth_users.json" 2>/dev/null || true

    # Calculate size
    BACKUP_SIZE=$(du -sh "$BACKUP_DIR" | cut -f1)
    log "  ✅ Compressed — total size: $BACKUP_SIZE"
  fi

  # ── 6. Clean old backups (keep last 30 days) ──────────────
  if [[ "$DRY_RUN" == false ]]; then
    log "Cleaning backups older than ${KEEP_DAYS} days..."
    find "$BACKUP_ROOT" -maxdepth 1 -type d -mtime +${KEEP_DAYS} | while read -r old_dir; do
      [[ "$old_dir" == "$BACKUP_ROOT" ]] && continue
      log "  Removing old backup: $(basename "$old_dir")"
      rm -rf "$old_dir"
    done
    log "  ✅ Cleanup done"
  fi

  # ── Summary ───────────────────────────────────────────────
  log "=========================================="
  if [[ "$DRY_RUN" == false ]]; then
    log "✅ Backup complete: $BACKUP_DIR"
    log "   Files:"
    ls -lh "$BACKUP_DIR" | tail -n +2 | awk '{print "   " $5 "  " $9}'
  else
    log "✅ Dry run complete — no files written"
  fi
  log "=========================================="
}

main "$@"
