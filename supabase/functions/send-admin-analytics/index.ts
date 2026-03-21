// Supabase Edge Function: send-admin-analytics
// Scheduled: 2nd of every month at 09:00 UTC via pg_cron
// Sends a monthly search & platform analytics digest to the admin.

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { Resend } from 'https://esm.sh/resend@3';

const SUPABASE_URL       = Deno.env.get('SUPABASE_URL')!;
const SUPABASE_SERVICE_ROLE = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const RESEND_API_KEY     = Deno.env.get('RESEND_API_KEY')!;
const FROM               = Deno.env.get('RESEND_FROM_EMAIL') ?? 'hi@peptidealliance.io';
const ADMIN_EMAIL        = 'hi@arce.ca';

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE);
const resend   = new Resend(RESEND_API_KEY);

const MONTHS = [
  'January','February','March','April','May','June',
  'July','August','September','October','November','December',
];

interface SearchStats {
  total_searches:       number;
  top_queries:          Array<{ query: string; count: number; zero_result_count: number }>;
  zero_result_queries:  Array<{ query: string; count: number }>;
  top_categories:       Array<{ category: string; count: number }>;
  top_cities:           Array<{ city: string; count: number }>;
  new_businesses:       number;
  total_businesses:     number;
  premium_count:        number;
  new_leads:            number;
  new_premium_upgrades: number;
}

Deno.serve(async (req) => {
  if (req.method !== 'POST') {
    return new Response('Method not allowed', { status: 405 });
  }

  const now = new Date();

  // Report covers the previous calendar month
  const reportMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  const periodStart  = reportMonth.toISOString();
  const monthName    = MONTHS[reportMonth.getMonth()];
  const year         = reportMonth.getFullYear();

  // Get all aggregated stats via a single RPC call
  const { data, error } = await supabase.rpc('get_admin_monthly_report', {
    since: periodStart,
  });

  if (error) {
    console.error('RPC error:', error);
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }

  const stats = data as SearchStats;

  const html = buildEmail(stats, monthName, year);

  await resend.emails.send({
    from:    FROM,
    to:      ADMIN_EMAIL,
    subject: `📊 Peptide Alliance Analytics — ${monthName} ${year}`,
    html,
  });

  console.log(`Admin analytics email sent for ${monthName} ${year}`);

  return new Response(JSON.stringify({ success: true, month: `${monthName} ${year}` }), {
    headers: { 'Content-Type': 'application/json' },
  });
});

// ── Email builder ─────────────────────────────────────────────────────────────

function row(label: string, value: string | number, highlight = false): string {
  return `
    <tr>
      <td style="padding:8px 12px;border-bottom:1px solid #f0f0f0;${highlight ? 'font-weight:600;color:#c53030;' : ''}">${label}</td>
      <td style="padding:8px 12px;border-bottom:1px solid #f0f0f0;text-align:center;font-weight:600;">${value}</td>
    </tr>`;
}

function section(title: string, rows: string, extra = ''): string {
  if (!rows) return '';
  return `
    <h2 style="font-size:16px;font-weight:700;color:#1a202c;margin:28px 0 8px;">${title}</h2>
    ${extra}
    <table style="width:100%;border-collapse:collapse;margin-bottom:8px;font-size:14px;">
      <tbody>${rows}</tbody>
    </table>`;
}

function buildEmail(stats: SearchStats, month: string, year: number): string {
  // ── Zero-result searches ─────────────────────────────────────────────────
  const zeroRows = (stats.zero_result_queries ?? [])
    .map(r => row(r.query, r.count, true))
    .join('');

  // ── Top queries ──────────────────────────────────────────────────────────
  const queryRows = (stats.top_queries ?? [])
    .map(r => {
      const badge = r.zero_result_count > 0
        ? `<span style="color:#c53030;font-size:12px;">⚠ ${r.zero_result_count}× no results</span>`
        : `<span style="color:#38a169;font-size:12px;">✓</span>`;
      return `
        <tr>
          <td style="padding:8px 12px;border-bottom:1px solid #f0f0f0;">${r.query}</td>
          <td style="padding:8px 12px;border-bottom:1px solid #f0f0f0;text-align:center;font-weight:600;">${r.count}</td>
          <td style="padding:8px 12px;border-bottom:1px solid #f0f0f0;text-align:center;">${badge}</td>
        </tr>`;
    })
    .join('');

  // ── Top categories ───────────────────────────────────────────────────────
  const catRows = (stats.top_categories ?? [])
    .map(r => row(r.category, r.count))
    .join('');

  // ── Top cities ───────────────────────────────────────────────────────────
  const cityRows = (stats.top_cities ?? [])
    .map(r => row(r.city, r.count))
    .join('');

  return `<!DOCTYPE html>
<html lang="en">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="font-family:system-ui,-apple-system,sans-serif;background:#f3f4f6;margin:0;padding:24px;">
<div style="max-width:620px;margin:0 auto;background:#fff;border-radius:12px;overflow:hidden;box-shadow:0 2px 12px rgba(0,0,0,0.08);">

  <!-- Header -->
  <div style="background:linear-gradient(135deg,#1b4332,#40916c);padding:32px 28px;color:#fff;">
    <div style="font-size:13px;opacity:0.7;margin-bottom:6px;text-transform:uppercase;letter-spacing:0.08em;">Peptide Alliance Admin</div>
    <h1 style="margin:0;font-size:26px;font-weight:800;">📊 Monthly Analytics</h1>
    <p style="margin:8px 0 0;opacity:0.85;font-size:15px;">${month} ${year}</p>
  </div>

  <!-- Summary bar -->
  <table style="width:100%;border-collapse:collapse;background:#f0fdf4;border-bottom:2px solid #d1fae5;">
    <tr>
      <td style="padding:20px 16px;text-align:center;border-right:1px solid #d1fae5;">
        <div style="font-size:30px;font-weight:800;color:#1b4332;">${stats.total_searches ?? 0}</div>
        <div style="font-size:12px;color:#6b7280;margin-top:4px;">Searches</div>
      </td>
      <td style="padding:20px 16px;text-align:center;border-right:1px solid #d1fae5;">
        <div style="font-size:30px;font-weight:800;color:#1b4332;">${stats.new_leads ?? 0}</div>
        <div style="font-size:12px;color:#6b7280;margin-top:4px;">New Leads</div>
      </td>
      <td style="padding:20px 16px;text-align:center;border-right:1px solid #d1fae5;">
        <div style="font-size:30px;font-weight:800;color:#1b4332;">${stats.new_businesses ?? 0}</div>
        <div style="font-size:12px;color:#6b7280;margin-top:4px;">New Listings</div>
      </td>
      <td style="padding:20px 16px;text-align:center;">
        <div style="font-size:30px;font-weight:800;color:#1b4332;">${stats.new_premium_upgrades ?? 0}</div>
        <div style="font-size:12px;color:#6b7280;margin-top:4px;">Upgrades</div>
      </td>
    </tr>
  </table>

  <div style="padding:24px 28px;">

    <!-- Platform snapshot -->
    <p style="margin:0 0 24px;font-size:14px;color:#4b5563;background:#f9fafb;padding:12px 16px;border-radius:8px;border:1px solid #e5e7eb;">
      Platform: <strong>${stats.total_businesses ?? 0}</strong> active listings &nbsp;·&nbsp;
      <strong>${stats.premium_count ?? 0}</strong> Premium / Featured
    </p>

    <!-- Zero-result searches — most actionable section -->
    ${zeroRows ? `
    <h2 style="font-size:16px;font-weight:700;color:#c53030;margin:0 0 6px;">⚠️ Searches With Zero Results</h2>
    <p style="font-size:13px;color:#6b7280;margin:0 0 12px;">
      These are people looking for businesses you don't have yet — your best recruitment targets.
    </p>
    <table style="width:100%;border-collapse:collapse;margin-bottom:28px;font-size:14px;">
      <thead>
        <tr style="background:#fff5f5;">
          <th style="padding:8px 12px;text-align:left;color:#9b2c2c;font-weight:600;border-bottom:2px solid #fed7d7;">Search Query</th>
          <th style="padding:8px 12px;text-align:center;color:#9b2c2c;font-weight:600;border-bottom:2px solid #fed7d7;">Times Searched</th>
        </tr>
      </thead>
      <tbody>${zeroRows}</tbody>
    </table>
    ` : `<p style="color:#38a169;font-weight:600;margin-bottom:24px;">✅ Every search returned results this month!</p>`}

    <!-- Top queries with 3 columns -->
    ${queryRows ? `
    <h2 style="font-size:16px;font-weight:700;color:#1a202c;margin:0 0 12px;">🔍 Top Search Queries</h2>
    <table style="width:100%;border-collapse:collapse;margin-bottom:28px;font-size:14px;">
      <thead>
        <tr style="background:#f9fafb;">
          <th style="padding:8px 12px;text-align:left;color:#6b7280;font-weight:600;border-bottom:2px solid #e5e7eb;">Query</th>
          <th style="padding:8px 12px;text-align:center;color:#6b7280;font-weight:600;border-bottom:2px solid #e5e7eb;">Count</th>
          <th style="padding:8px 12px;text-align:center;color:#6b7280;font-weight:600;border-bottom:2px solid #e5e7eb;">Results?</th>
        </tr>
      </thead>
      <tbody>${queryRows}</tbody>
    </table>
    ` : ''}

    <!-- Categories & Cities side by side via table -->
    <table style="width:100%;border-collapse:collapse;margin-bottom:8px;">
      <tr>
        <td style="vertical-align:top;padding-right:12px;width:50%;">
          ${catRows ? `
          <h2 style="font-size:15px;font-weight:700;color:#1a202c;margin:0 0 10px;">📂 Top Categories</h2>
          <table style="width:100%;border-collapse:collapse;font-size:14px;">
            <tbody>${catRows}</tbody>
          </table>
          ` : ''}
        </td>
        <td style="vertical-align:top;padding-left:12px;width:50%;">
          ${cityRows ? `
          <h2 style="font-size:15px;font-weight:700;color:#1a202c;margin:0 0 10px;">📍 Top Cities</h2>
          <table style="width:100%;border-collapse:collapse;font-size:14px;">
            <tbody>${cityRows}</tbody>
          </table>
          ` : ''}
        </td>
      </tr>
    </table>

  </div>

  <!-- Footer -->
  <div style="padding:18px 28px;background:#f9fafb;border-top:1px solid #e5e7eb;text-align:center;">
    <p style="margin:0;font-size:12px;color:#9ca3af;">
      Peptide Alliance · Automated admin report · ${month} ${year}
    </p>
  </div>

</div>
</body>
</html>`;
}
