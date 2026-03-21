// Supabase Edge Function: send-lead-notification
// Called after a lead is inserted (can be triggered via DB webhook or manually)

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!;
const SUPABASE_SERVICE_ROLE = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY')!;
const FROM_EMAIL = Deno.env.get('RESEND_FROM_EMAIL') ?? 'hi@peptidealliance.io';

Deno.serve(async (req) => {
  if (req.method !== 'POST') {
    return new Response('Method not allowed', { status: 405 });
  }

  const payload = await req.json();

  // Support both direct call and Supabase DB webhook payload
  const leadId: string = payload.leadId ?? payload.record?.id;
  if (!leadId) {
    return new Response(JSON.stringify({ error: 'leadId required' }), { status: 400 });
  }

  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE);

  const { data: lead } = await supabase
    .from('leads')
    .select('*, businesses(name, claimed_by)')
    .eq('id', leadId)
    .single();

  if (!lead) {
    return new Response(JSON.stringify({ error: 'Lead not found' }), { status: 404 });
  }

  const biz = lead.businesses as any;
  if (!biz?.claimed_by) {
    return new Response(JSON.stringify({ skipped: 'Business not claimed' }));
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('email')
    .eq('id', biz.claimed_by)
    .single();

  if (!profile?.email) {
    return new Response(JSON.stringify({ skipped: 'No owner email' }));
  }

  const emailRes = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${RESEND_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: FROM_EMAIL,
      to: profile.email,
      reply_to: lead.email,
      subject: `New message for ${biz.name} — Peptide Alliance`,
      html: `
        <div style="font-family: Inter, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px;">
          <h2 style="color: #2B5EBE;">New message for ${biz.name}</h2>
          <p>Someone found your listing on Peptide Alliance and wants to connect!</p>
          <div style="background: #EAF4E8; border-radius: 12px; padding: 20px; margin: 20px 0;">
            <p><strong>From:</strong> ${lead.name}</p>
            <p><strong>Email:</strong> <a href="mailto:${lead.email}">${lead.email}</a></p>
            ${lead.phone ? `<p><strong>Phone:</strong> ${lead.phone}</p>` : ''}
            <p><strong>Message:</strong></p>
            <p>${lead.message}</p>
          </div>
          <p style="color: #6B7280; font-size: 14px;">Reply to this email to respond to ${lead.name}.</p>
        </div>
      `,
    }),
  });

  if (!emailRes.ok) {
    const errText = await emailRes.text();
    return new Response(JSON.stringify({ error: 'Email failed', detail: errText }), { status: 500 });
  }

  return new Response(JSON.stringify({ success: true, to: profile.email }), {
    headers: { 'Content-Type': 'application/json' },
  });
});
