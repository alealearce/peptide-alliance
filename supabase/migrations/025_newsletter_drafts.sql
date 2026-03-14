-- ── Migration 025: Newsletter approval flow ───────────────────────────────────
-- Creates newsletter_drafts table so the admin can review and approve the
-- newsletter before it goes out to subscribers.
-- Also moves the cron trigger from the 15th (direct send) to the 12th (draft
-- generation + admin preview), giving 3 days for review.

-- ── Table ──────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS newsletter_drafts (
  id               uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  subject_en       text        NOT NULL,
  body_en          text        NOT NULL,
  subject_es       text        NOT NULL,
  body_es          text        NOT NULL,
  approval_token   text        UNIQUE NOT NULL
                               DEFAULT encode(extensions.gen_random_bytes(32), 'hex'),
  status           text        NOT NULL DEFAULT 'pending'
                               CHECK (status IN ('pending', 'sent', 'cancelled')),
  subscriber_count integer     DEFAULT 0,
  sent_at          timestamptz,
  created_at       timestamptz DEFAULT now()
);

-- Only admins can read/write drafts through the client
ALTER TABLE newsletter_drafts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can manage newsletter drafts"
  ON newsletter_drafts FOR ALL
  USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- Service role (used by edge functions and approve API) bypasses RLS automatically
GRANT ALL ON newsletter_drafts TO service_role;


-- ── pg_cron: move newsletter trigger from 15th → 12th ─────────────────────────
-- 15th was "send immediately"; 12th is now "generate draft + email admin preview"
SELECT cron.unschedule('send-newsletter');

SELECT cron.schedule(
  'send-newsletter',
  '0 10 12 * *',
  $$
  SELECT extensions.http_post(
    url     := 'https://jypneygzfjwknimanvxm.supabase.co/functions/v1/send-newsletter',
    headers := jsonb_build_object(
      'Content-Type', 'application/json',
      'Authorization', 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp5cG5leWd6Zmp3a25pbWFudnhtIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MjE2Mjg0OCwiZXhwIjoyMDg3NzM4ODQ4fQ.e49Kz9ZEOkdIUG7E5NYCpZRY46AIlUkQsjGYTHFH41E'
    ),
    body    := '{}'::jsonb
  ) AS request_id;
  $$
);
