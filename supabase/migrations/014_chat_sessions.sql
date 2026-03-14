-- Chat sessions — stores all Sylvita conversations for admin review
CREATE TABLE IF NOT EXISTS chat_sessions (
  id         uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id text        NOT NULL UNIQUE,
  messages   jsonb       NOT NULL DEFAULT '[]',
  escalated  boolean     NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE chat_sessions ENABLE ROW LEVEL SECURITY;

-- Service role (admin API) has full access; no public access
CREATE POLICY "Service role full access on chat_sessions"
  ON chat_sessions
  USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');
