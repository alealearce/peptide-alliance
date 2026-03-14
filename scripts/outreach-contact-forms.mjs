#!/usr/bin/env node
// ─── InfoSylvita — Two-Phase Business Outreach ──────────────────────────────
// Phase 1: Extract email from website → send branded HTML email via Resend
// Phase 2: For Phase 1 failures (no email found) → find contact form → submit
//
// Usage:
//   node scripts/outreach-contact-forms.mjs [--city Toronto] [--limit 20] [--dry-run]
//   node scripts/outreach-contact-forms.mjs --phase 1 --city Toronto --limit 20
//   node scripts/outreach-contact-forms.mjs --phase 2 --city Toronto --limit 20
//
// Tracks results in scripts/outreach-log.json (never contacts same business twice)

import { chromium } from 'playwright';
import { createClient } from '@supabase/supabase-js';
import { readFileSync, writeFileSync, existsSync } from 'fs';
import { resolve } from 'path';

// ── Load .env.local ──────────────────────────────────────────────────────────
const envContent = readFileSync(resolve('.env.local'), 'utf8');
for (const line of envContent.split('\n')) {
  const trimmed = line.trim();
  if (!trimmed || trimmed.startsWith('#')) continue;
  const eq = trimmed.indexOf('=');
  if (eq === -1) continue;
  process.env[trimmed.slice(0, eq)] = trimmed.slice(eq + 1);
}

const sb = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  { auth: { autoRefreshToken: false, persistSession: false } }
);

// ── CLI args ─────────────────────────────────────────────────────────────────
const args = process.argv.slice(2);
const hasFlag = (name) => args.includes(`--${name}`);
const getArg = (name) => {
  const idx = args.indexOf(`--${name}`);
  return idx !== -1 && args[idx + 1] ? args[idx + 1] : null;
};
const DRY_RUN     = hasFlag('dry-run');
const LIMIT       = getArg('limit') ? parseInt(getArg('limit'), 10) : Infinity;
const CITY_FILTER = getArg('city');
const PHASE       = getArg('phase') ? parseInt(getArg('phase'), 10) : 0; // 0 = both

// ── Log ───────────────────────────────────────────────────────────────────────
const LOG_FILE = resolve('scripts/outreach-log.json');
function loadLog() {
  if (!existsSync(LOG_FILE)) return {};
  try { return JSON.parse(readFileSync(LOG_FILE, 'utf8')); }
  catch { return {}; }
}
function saveLog(log) { writeFileSync(LOG_FILE, JSON.stringify(log, null, 2)); }

// ── Message content ───────────────────────────────────────────────────────────
const BASE_URL = 'https://infosylvita.com';

function claimUrl(bizId) { return `${BASE_URL}/en/claim?biz=${bizId}`; }

function plainTextMessage(bizName, bizId) {
  return `Hi! I'm Sylvita from InfoSylvita (infosylvita.com), a free directory for Latin-owned businesses across Canada.

We've added your business "${bizName}" to our directory and wanted to let you know. It's completely free — no catch.

If you'd like to claim your listing, you can update your information, add photos, and connect with thousands of people in the Latin community across Canada:
${claimUrl(bizId)}

If you'd prefer not to be listed, simply reply to this message and we'll remove you right away.

Warm regards,
Sylvita
InfoSylvita — The Latin Business Directory in Canada
hola@infosylvita.com`;
}

function htmlEmail(bizName, bizId) {
  const url = claimUrl(bizId);
  return `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f9f5f0;font-family:Georgia,serif">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f9f5f0;padding:32px 16px">
    <tr><td align="center">
      <table width="560" cellpadding="0" cellspacing="0" style="background:#fff;border-radius:16px;overflow:hidden;border:1px solid #e8ddd0">
        <!-- Header -->
        <tr><td style="background:#2d5a3d;padding:28px 32px;text-align:center">
          <div style="color:#f9f5f0;font-size:22px;font-weight:bold;letter-spacing:0.5px">🌿 InfoSylvita</div>
          <div style="color:#a8c5a0;font-size:13px;margin-top:4px">The Latin Business Directory in Canada</div>
        </td></tr>
        <!-- Body -->
        <tr><td style="padding:32px">
          <p style="margin:0 0 16px;font-size:16px;color:#2c2c2c;line-height:1.6">Hi! I'm <strong>Sylvita</strong> from <a href="https://infosylvita.com" style="color:#2d5a3d">InfoSylvita</a>, a free directory for Latin-owned businesses across Canada.</p>
          <p style="margin:0 0 16px;font-size:16px;color:#2c2c2c;line-height:1.6">We've added <strong>${bizName}</strong> to our directory and wanted to let you know. It's completely free — no catch.</p>
          <p style="margin:0 0 24px;font-size:16px;color:#2c2c2c;line-height:1.6">If you'd like to claim your listing, you can update your information, add photos, and connect with thousands of people in the Latin community across Canada:</p>
          <!-- CTA Button -->
          <table cellpadding="0" cellspacing="0" style="margin:0 auto 28px">
            <tr><td style="background:#2d5a3d;border-radius:10px;padding:14px 28px;text-align:center">
              <a href="${url}" style="color:#fff;font-size:16px;font-weight:bold;text-decoration:none;letter-spacing:0.3px">🏷️ Claim Your Free Listing</a>
            </td></tr>
          </table>
          <p style="margin:0;font-size:14px;color:#888;line-height:1.6">If you'd prefer not to be listed, simply reply to this email and we'll remove you right away.</p>
        </td></tr>
        <!-- Footer -->
        <tr><td style="background:#f9f5f0;padding:20px 32px;border-top:1px solid #e8ddd0;text-align:center">
          <p style="margin:0;font-size:13px;color:#888">Sylvita · InfoSylvita · <a href="mailto:hola@infosylvita.com" style="color:#2d5a3d">hola@infosylvita.com</a></p>
          <p style="margin:6px 0 0;font-size:11px;color:#aaa">You received this because your business serves the Latin community. Reply to remove your listing.</p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

// ── Helpers ──────────────────────────────────────────────────────────────────
async function safeGoto(page, url) {
  try {
    await page.goto(url, { waitUntil: 'networkidle', timeout: 15000 });
    return true;
  } catch {
    try {
      await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 8000 });
      return true;
    } catch { return false; }
  }
}

async function hasCaptcha(page) {
  return page.evaluate(() => !!(
    document.querySelector('.g-recaptcha,.h-captcha,[data-sitekey]') ||
    document.querySelector('iframe[src*="recaptcha"],iframe[src*="hcaptcha"],iframe[src*="turnstile"]') ||
    typeof window.grecaptcha !== 'undefined' || typeof window.hcaptcha !== 'undefined'
  )).catch(() => false);
}

async function findContactUrl(page) {
  return page.evaluate(() => {
    const RE = /contact|contacto|contact-us|reach|get-in-touch|mensaje|escribenos|consulta|inquiry/i;
    const link = [...document.querySelectorAll('a[href]')].find(a => {
      if (RE.test((a.textContent || '').trim())) return true;
      try { return RE.test(new URL(a.href).pathname); } catch { return false; }
    });
    return link ? link.href : null;
  }).catch(() => null);
}

// ── Phase 1: Contact form ─────────────────────────────────────────────────────
async function tryFormOnPage(page, message) {
  await page.waitForTimeout(1500);
  if (await hasCaptcha(page)) return 'captcha';

  const messageField = await page.$(
    'textarea[name*="message" i],textarea[name*="mensaje" i],textarea[name*="comment" i],textarea[name*="body" i],textarea[name*="note" i],textarea[id*="message" i],textarea[placeholder*="message" i],textarea[placeholder*="how can" i],textarea[placeholder*="tell us" i],textarea'
  ).catch(() => null);
  if (!messageField) return 'no-form';

  const emailField = await page.$(
    'input[type="email"],input[name*="email" i],input[id*="email" i],input[placeholder*="email" i],input[placeholder*="correo" i],input[autocomplete*="email" i]'
  ).catch(() => null);
  if (!emailField) return 'no-email-field';

  const nameField = await page.$(
    'input[name="name"],input[name="full_name"],input[id="name"],input[placeholder*="your name" i],input[placeholder*="nombre" i],input[autocomplete="name"]'
  ).catch(() => null);
  const subjectField = await page.$(
    'input[name*="subject" i],input[id*="subject" i],input[placeholder*="subject" i]'
  ).catch(() => null);
  const submitBtn = await page.$(
    'button[type="submit"],input[type="submit"],button:has-text("Send"),button:has-text("Submit"),button:has-text("Enviar")'
  ).catch(() => null);
  if (!submitBtn) return 'no-submit';

  if (await hasCaptcha(page)) return 'captcha';
  if (DRY_RUN) return 'dry-run';

  try {
    if (nameField) await nameField.fill('Sylvita from InfoSylvita', { timeout: 3000 });
    if (subjectField) await subjectField.fill('Your business is listed on InfoSylvita', { timeout: 3000 });
    await emailField.fill('hola@infosylvita.com', { timeout: 3000 });
    await messageField.fill(message, { timeout: 3000 });
    await submitBtn.click({ timeout: 5000 });
    await page.waitForTimeout(3000);
    return 'sent';
  } catch (e) {
    return `fill-error: ${e.message.substring(0, 60)}`;
  }
}

async function phase1(browser, biz) {
  const url = biz.website.startsWith('http') ? biz.website : `https://${biz.website}`;
  const message = plainTextMessage(biz.name, biz.id);
  let page;
  try {
    page = await browser.newPage();
    page.setDefaultTimeout(10000);

    if (!await safeGoto(page, url)) return 'site-unreachable';

    let result = await tryFormOnPage(page, message).catch(e => `error: ${e.message.substring(0, 60)}`);
    if (['sent', 'dry-run', 'captcha'].includes(result)) return result;

    const contactUrl = await findContactUrl(page).catch(() => null);
    if (!contactUrl || contactUrl === page.url()) return result;

    if (!await safeGoto(page, contactUrl)) return result;
    return await tryFormOnPage(page, message).catch(e => `error: ${e.message.substring(0, 60)}`);
  } catch (e) {
    return `error: ${e.message.substring(0, 80)}`;
  } finally {
    if (page && !page.isClosed()) await page.close().catch(() => {});
  }
}

// ── Phase 2: Email extraction + direct email ──────────────────────────────────
const EMAIL_RE = /[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}/g;
const SKIP_PREFIXES = ['noreply', 'no-reply', 'donotreply', 'bounce', 'mailer', 'postmaster', 'webmaster', 'admin', 'notifications', 'support@google', 'sentry'];
const SKIP_DOMAINS = ['sentry.io', 'google.com', 'facebook.com', 'w3.org', 'schema.org', 'example.com', 'infosylvita.com'];

function isValidOutreachEmail(email) {
  const lower = email.toLowerCase();
  if (lower.startsWith('%')) return false; // URL-encoded artifact
  if (!/^[a-z0-9._%+\-]+@[a-z0-9.\-]+\.[a-z]{2,}$/.test(lower)) return false;
  if (SKIP_PREFIXES.some(p => lower.startsWith(p))) return false;
  if (SKIP_DOMAINS.some(d => lower.endsWith(`@${d}`) || lower.includes(`@${d}/`))) return false;
  return true;
}

async function extractEmailsFromPage(page) {
  return page.evaluate((skipDomains) => {
    const emails = new Set();
    // 1. mailto: links (most reliable)
    document.querySelectorAll('a[href^="mailto:"]').forEach(a => {
      const email = a.href.replace('mailto:', '').split('?')[0].trim().toLowerCase();
      if (email) emails.add(email);
    });
    // 2. Page text
    const text = document.body?.innerText || '';
    const matches = text.match(/[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}/g) || [];
    matches.forEach(m => emails.add(m.toLowerCase()));
    return [...emails];
  }, SKIP_DOMAINS).catch(() => []);
}

async function extractEmail(browser, biz) {
  const url = biz.website.startsWith('http') ? biz.website : `https://${biz.website}`;
  let page;
  try {
    page = await browser.newPage();
    page.setDefaultTimeout(10000);

    if (!await safeGoto(page, url)) return null;

    let emails = (await extractEmailsFromPage(page)).filter(isValidOutreachEmail);

    if (emails.length === 0) {
      // Try contact page
      const contactUrl = await findContactUrl(page).catch(() => null);
      if (contactUrl && contactUrl !== page.url()) {
        if (await safeGoto(page, contactUrl)) {
          emails = (await extractEmailsFromPage(page)).filter(isValidOutreachEmail);
        }
      }
    }

    // Prefer emails that contain the business domain
    let domain = '';
    try { domain = new URL(url).hostname.replace(/^www\./, ''); } catch {}
    const domainEmails = emails.filter(e => domain && e.endsWith(`@${domain}`));
    return domainEmails[0] ?? emails[0] ?? null;
  } catch {
    return null;
  } finally {
    if (page && !page.isClosed()) await page.close().catch(() => {});
  }
}

async function sendEmail(to, bizName, bizId) {
  if (DRY_RUN) return 'dry-run';
  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
    },
    body: JSON.stringify({
      from: `Sylvita from InfoSylvita <${process.env.RESEND_FROM_EMAIL}>`,
      to: [to],
      subject: `Your business is listed on InfoSylvita 🌿`,
      html: htmlEmail(bizName, bizId),
      text: plainTextMessage(bizName, bizId),
    }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    return `send-error: ${err.message ?? res.status}`;
  }
  return 'sent';
}

async function phase2(browser, biz) {
  const email = await extractEmail(browser, biz);
  if (!email) return { result: 'no-email-found', email: null };
  const result = await sendEmail(email, biz.name, biz.id);
  return { result, email };
}

// ── Main ──────────────────────────────────────────────────────────────────────
async function main() {
  const log = loadLog();

  // Paginate through all businesses (Supabase default limit is 1000)
  const businesses = [];
  const PAGE_SIZE = 1000;
  let from = 0;
  while (true) {
    let query = sb
      .from('businesses')
      .select('id, name, website, city, province')
      .not('website', 'is', null)
      .eq('source', 'google_places')
      .range(from, from + PAGE_SIZE - 1);
    if (CITY_FILTER) query = query.ilike('city', CITY_FILTER);
    const { data, error } = await query;
    if (error) { console.error(error); process.exit(1); }
    if (!data || data.length === 0) break;
    businesses.push(...data);
    if (data.length < PAGE_SIZE) break;
    from += PAGE_SIZE;
  }

  // Determine which businesses need Phase 1 and/or Phase 2
  // Phase 1 = email outreach, Phase 2 = contact form fallback
  const needsP1 = (PHASE === 0 || PHASE === 1)
    ? businesses.filter(b => !log[b.id]?.p1_result)
    : [];
  const needsP2 = (PHASE === 0 || PHASE === 2)
    ? businesses.filter(b => {
        const entry = log[b.id];
        if (!entry) return PHASE === 2; // Phase 2 only: try all
        const p1Failed = entry.p1_result && entry.p1_result !== 'sent';
        return p1Failed && !entry.p2_result;
      })
    : [];

  const p1List = LIMIT < Infinity ? needsP1.slice(0, LIMIT) : needsP1;
  const p2List = LIMIT < Infinity ? needsP2.slice(0, LIMIT) : needsP2;

  const alreadyDone = businesses.filter(b => {
    const e = log[b.id];
    return e?.p1_result === 'sent' || e?.p2_result === 'sent';
  }).length;

  console.log(`\n📬 InfoSylvita Outreach (${PHASE === 1 ? 'Phase 1 only' : PHASE === 2 ? 'Phase 2 only' : 'Both Phases'})`);
  console.log('─'.repeat(52));
  console.log(`  Total with websites: ${businesses.length}`);
  console.log(`  Already reached:     ${alreadyDone}`);
  if (PHASE !== 2) console.log(`  Phase 1 (email):     ${p1List.length}`);
  if (PHASE !== 1) console.log(`  Phase 2 (forms):     ${p2List.length}`);
  console.log(`  City filter:         ${CITY_FILTER ?? 'all'}`);
  console.log(`  Dry run:             ${DRY_RUN ? 'YES' : 'no'}`);
  console.log('─'.repeat(52) + '\n');

  const browser = await chromium.launch({ headless: true });
  const stats = { p1: {}, p2: {} };

  // ── Phase 1: Email extraction + branded email ───────────────────────────────
  if (p1List.length > 0) {
    console.log('📧 Phase 1: Email Extraction + Branded Email\n');
    for (let i = 0; i < p1List.length; i++) {
      const biz = p1List[i];
      process.stdout.write(`  [${i + 1}/${p1List.length}] ${biz.name.substring(0, 42).padEnd(42)} → `);

      const { result, email } = await phase2(browser, biz);
      console.log(email ? `${result} (${email})` : result);

      if (!log[biz.id]) log[biz.id] = { name: biz.name, website: biz.website };
      log[biz.id].p1_result = result;
      if (email) log[biz.id].p1_email = email;
      log[biz.id].p1_at = new Date().toISOString();
      saveLog(log);

      stats.p1[result] = (stats.p1[result] ?? 0) + 1;
      await new Promise(r => setTimeout(r, 1500));
    }
  }

  // ── Phase 2: Contact form fallback ─────────────────────────────────────────
  // For "both phases" run, include businesses that just failed Phase 1 (no email found)
  const p2Full = (PHASE === 0)
    ? [...p2List, ...p1List.filter(b => log[b.id]?.p1_result && log[b.id].p1_result !== 'sent' && !log[b.id]?.p2_result)]
    : p2List;

  const p2Unique = [...new Map(p2Full.map(b => [b.id, b])).values()];

  if (p2Unique.length > 0) {
    console.log(`\n📋 Phase 2: Contact Form Fallback\n`);
    for (let i = 0; i < p2Unique.length; i++) {
      const biz = p2Unique[i];
      process.stdout.write(`  [${i + 1}/${p2Unique.length}] ${biz.name.substring(0, 42).padEnd(42)} → `);

      const result = await phase1(browser, biz);
      console.log(result);

      if (!log[biz.id]) log[biz.id] = { name: biz.name, website: biz.website };
      log[biz.id].p2_result = result;
      log[biz.id].p2_at = new Date().toISOString();
      saveLog(log);

      stats.p2[result] = (stats.p2[result] ?? 0) + 1;
      await new Promise(r => setTimeout(r, 2500));
    }
  }

  await browser.close();

  // ── Summary ────────────────────────────────────────────────────────────────
  console.log('\n' + '═'.repeat(52));
  console.log('✅  OUTREACH COMPLETE');
  console.log('═'.repeat(52));

  if (p1List.length > 0) {
    const p1Sent = (stats.p1['sent'] ?? 0) + (stats.p1['dry-run'] ?? 0);
    console.log(`  Phase 1 — sent/would-send: ${p1Sent}/${p1List.length}`);
    console.log(`            no email found:  ${stats.p1['no-email-found'] ?? 0}`);
  }
  if (p2Unique.length > 0) {
    const p2Sent = (stats.p2['sent'] ?? 0) + (stats.p2['dry-run'] ?? 0);
    console.log(`  Phase 2 — sent/would-send: ${p2Sent}/${p2Unique.length}`);
    console.log(`            captcha skipped: ${stats.p2['captcha'] ?? 0}`);
    console.log(`            no form found:   ${Object.entries(stats.p2).filter(([k]) => k.startsWith('no-')).reduce((s,[,v])=>s+v,0)}`);
  }
  console.log(`\n  Full log: scripts/outreach-log.json`);
  console.log();
}

main().catch(console.error);
