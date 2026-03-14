import { NextRequest, NextResponse } from 'next/server';
import { chatWithSylvita } from '@/lib/ai/claude';
import type { ChatMessage } from '@/lib/ai/claude';
import { createAdminClient } from '@/lib/supabase/server';
import { sendEscalationEmail } from '@/lib/email/resend';
import { rateLimit } from '@/lib/rateLimit';

export const runtime = 'nodejs';

const ESCALATION_MARKER = 'support@peptidealliance.io';

const MAX_MSG_LENGTH = 2000;
const VALID_ROLES = new Set(['user', 'assistant']);

export async function POST(req: NextRequest) {
  // Rate limit: 20 messages per minute per IP
  const rl = rateLimit(req, { limit: 20, windowMs: 60_000, prefix: 'chat' });
  if (!rl.success) {
    return NextResponse.json(
      { error: 'Too many requests. Please wait before sending more messages.' },
      { status: 429, headers: { 'Retry-After': String(rl.retryAfter) } }
    );
  }

  try {
    const body = await req.json() as { messages: ChatMessage[]; sessionId?: string };
    const { messages, sessionId } = body;

    // Validate messages array structure and content length
    if (
      !messages ||
      !Array.isArray(messages) ||
      messages.length === 0 ||
      messages.length > 40 ||
      messages.some(
        (m) =>
          typeof m?.content !== 'string' ||
          !VALID_ROLES.has(m?.role) ||
          m.content.length > MAX_MSG_LENGTH,
      )
    ) {
      return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
    }

    // Limit conversation history to last 10 messages
    const recent = messages.slice(-10);
    const reply = await chatWithSylvita(recent);

    // ── Persist session and detect escalation ─────────────────────────────
    if (sessionId) {
      const saveSession = async () => {
        try {
          const supabase = createAdminClient();
          const allMessages = [...recent, { role: 'assistant' as const, content: reply }];
          const isEscalatedNow = reply.includes(ESCALATION_MARKER);

          // Check if this session was already escalated (avoid duplicate emails)
          const { data: existing } = await supabase
            .from('chat_sessions')
            .select('escalated')
            .eq('session_id', sessionId)
            .maybeSingle();

          const wasEscalated = existing?.escalated ?? false;

          await supabase.from('chat_sessions').upsert(
            {
              session_id: sessionId,
              messages: allMessages,
              escalated: isEscalatedNow || wasEscalated,
              updated_at: new Date().toISOString(),
            },
            { onConflict: 'session_id' }
          );

          // Send email only on the first escalation in this session
          if (isEscalatedNow && !wasEscalated) {
            sendEscalationEmail({ sessionId, messages: allMessages }).catch((err) =>
              console.error('[chat] escalation email error:', err)
            );
          }
        } catch (dbErr) {
          console.error('[chat] session save error:', dbErr);
        }
      };

      // Fire-and-forget — don't block the response
      saveSession();
    }

    return NextResponse.json({ reply });
  } catch (err) {
    console.error('Chat API error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
