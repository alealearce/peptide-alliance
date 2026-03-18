#!/usr/bin/env node
// ─── Peptide Alliance — Bulk Business Outreach ───────────────────────────────
// Sends the "Your business has been added" invite email to every business
// in the directory that has a website. Uses info@ on their domain as contact.
//
// Run: node scripts/send-outreach-bulk.mjs

import { createClient } from '@supabase/supabase-js';
import { Resend } from 'resend';

const SUPABASE_URL    = 'https://jxyaubxjamlojccmneni.supabase.co';
const SERVICE_ROLE    = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp4eWF1YnhqYW1sb2pjY21uZW5pIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MzUwMzI4MCwiZXhwIjoyMDg5MDc5MjgwfQ.1Ix7scPOR9EoSwMQplr2J2DutSFKdGdxy1EUiXtpm84';
const RESEND_API_KEY  = 're_iKueVP5e_C6FnvCz9jc35eSWHHVmdWdsS';

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE, {
  auth: { autoRefreshToken: false, persistSession: false },
});
const resend = new Resend(RESEND_API_KEY);

const PRIMARY = '#0A1F44';
const GOLD    = '#C9A05D';
const BG      = '#F8FAFB';

// ── Extract domain from URL and build info@ email ─────────────────────────────
function getDomainEmail(website) {
  try {
    const url = new URL(website.startsWith('http') ? website : `https://${website}`);
    const domain = url.hostname.replace(/^www\./, '');
    return `info@${domain}`;
  } catch {
    return null;
  }
}

// ── Build the HTML email for a specific business ──────────────────────────────
function buildEmail(businessName) {
  return `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f0f4f8;font-family:Inter,Arial,sans-serif">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f0f4f8;padding:32px 16px">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:20px;overflow:hidden;border:1px solid #e2e8f0">

        <!-- Header -->
        <tr><td style="background:${PRIMARY};padding:36px 40px;text-align:center">
          <div style="color:#ffffff;font-size:26px;font-weight:800;letter-spacing:0.3px">The Peptide Alliance</div>
          <div style="color:rgba(255,255,255,0.65);font-size:12px;margin-top:6px;letter-spacing:1.5px;text-transform:uppercase">The Standard in Regenerative Health</div>
        </td></tr>

        <!-- Intro -->
        <tr><td style="padding:40px 40px 24px">
          <p style="margin:0 0 16px;font-size:15px;color:#4a5568;line-height:1.7">Hi,</p>
          <p style="margin:0 0 16px;font-size:15px;color:#4a5568;line-height:1.7">
            We wanted to reach out to let you know that <strong style="color:#1a202c">${businessName}</strong> has been added to
            <a href="https://peptidealliance.io" style="color:${PRIMARY};font-weight:600;text-decoration:none">The Peptide Alliance</a> —
            a new industry resource built specifically for peptide solutions and regenerative health providers across North America.
          </p>
          <p style="margin:0;font-size:15px;color:#4a5568;line-height:1.7">
            <strong style="color:#1a202c">Claiming your profile is completely free</strong> and takes under 2 minutes.
            Once claimed, you control your listing — your products, your description, your links.
          </p>
        </td></tr>

        <!-- CTA -->
        <tr><td style="padding:0 40px 32px;text-align:center">
          <a href="https://peptidealliance.io/claim" style="display:inline-block;background:${PRIMARY};color:#ffffff;font-size:16px;font-weight:700;padding:16px 40px;border-radius:12px;text-decoration:none;letter-spacing:0.3px">
            Claim Your Free Profile &#8594;
          </a>
        </td></tr>

        <!-- Divider -->
        <tr><td style="padding:0 40px"><hr style="border:none;border-top:1px solid #e2e8f0;margin:0"></td></tr>

        <!-- Why it matters heading -->
        <tr><td style="padding:32px 40px 16px">
          <h2 style="margin:0 0 6px;font-size:20px;font-weight:800;color:#1a202c">Why this matters for your business</h2>
          <p style="margin:0;font-size:14px;color:#718096">The way buyers find peptide suppliers is changing fast. Here is what that means for you.</p>
        </td></tr>

        <!-- Reason 1 — Industry Credibility -->
        <tr><td style="padding:8px 40px">
          <table width="100%" cellpadding="0" cellspacing="0" style="background:#fef9ec;border-radius:14px;padding:20px;border-left:4px solid ${GOLD}">
            <tr>
              <td width="44" valign="top" style="padding:0 14px 0 0;font-size:28px">&#9989;</td>
              <td>
                <p style="margin:0 0 4px;font-size:15px;font-weight:700;color:#1a202c">Industry credibility in a niche that demands trust</p>
                <p style="margin:0;font-size:14px;color:#4a5568;line-height:1.6">
                  Buyers, practitioners, and researchers are increasingly looking for sources through
                  <strong>industry-specific, vetted directories</strong> rather than random Google searches.
                  A presence on The Peptide Alliance signals that your business is legitimate, established, and
                  part of the professional supply chain.
                </p>
              </td>
            </tr>
          </table>
        </td></tr>

        <!-- Reason 2 — Showcase Products -->
        <tr><td style="padding:8px 40px">
          <table width="100%" cellpadding="0" cellspacing="0" style="background:#eff6ff;border-radius:14px;padding:20px;border-left:4px solid #3b82f6">
            <tr>
              <td width="44" valign="top" style="padding:0 14px 0 0;font-size:28px">&#128717;</td>
              <td>
                <p style="margin:0 0 4px;font-size:15px;font-weight:700;color:#1a202c">Showcase your products and drive traffic directly to your site</p>
                <p style="margin:0;font-size:14px;color:#4a5568;line-height:1.6">
                  The Peptide Alliance is a <strong>traffic generation platform, not a marketplace</strong> — we do not take a cut
                  of your sales or process any transactions. You list your products and services, and interested buyers click
                  directly through to your website. Pure qualified traffic with zero middleman fees.
                </p>
              </td>
            </tr>
          </table>
        </td></tr>

        <!-- Reason 3 — Google + ChatGPT -->
        <tr><td style="padding:8px 40px">
          <table width="100%" cellpadding="0" cellspacing="0" style="background:${BG};border-radius:14px;padding:20px;border-left:4px solid ${PRIMARY}">
            <tr>
              <td width="44" valign="top" style="padding:0 14px 0 0;font-size:28px">&#128269;</td>
              <td>
                <p style="margin:0 0 4px;font-size:15px;font-weight:700;color:#1a202c">Rank higher on Google and get found by ChatGPT</p>
                <p style="margin:0;font-size:14px;color:#4a5568;line-height:1.6">
                  Businesses listed across multiple trusted industry sources rank significantly higher in search results.
                  More importantly, AI tools like <strong>ChatGPT, Perplexity, and Google AI Overviews</strong> now recommend
                  businesses from vetted directories when people search for things like "best peptide supplier in the US"
                  or "TRT clinic near me." Your listing here is direct exposure to those answers.
                </p>
              </td>
            </tr>
          </table>
        </td></tr>

        <!-- What you get free -->
        <tr><td style="padding:28px 40px 12px">
          <h2 style="margin:0 0 16px;font-size:18px;font-weight:800;color:#1a202c">What you get with a free claimed profile</h2>
          <table width="100%" cellpadding="0" cellspacing="0">
            <tr><td style="padding:6px 0;font-size:14px;color:#4a5568">&#10003; &nbsp; Full control of your business description, photos, and keywords</td></tr>
            <tr><td style="padding:6px 0;font-size:14px;color:#4a5568">&#10003; &nbsp; Product catalog — list your peptides, services, or treatments</td></tr>
            <tr><td style="padding:6px 0;font-size:14px;color:#4a5568">&#10003; &nbsp; Direct links to your website and social media</td></tr>
            <tr><td style="padding:6px 0;font-size:14px;color:#4a5568">&#10003; &nbsp; Upload certifications and lab results (CoAs) to build buyer trust</td></tr>
            <tr><td style="padding:6px 0;font-size:14px;color:#4a5568">&#10003; &nbsp; Receive and manage customer reviews</td></tr>
            <tr><td style="padding:6px 0;font-size:14px;color:#4a5568">&#10003; &nbsp; Inbound leads delivered directly to your inbox</td></tr>
          </table>
        </td></tr>

        <!-- Final CTA -->
        <tr><td style="padding:28px 40px 36px;text-align:center">
          <p style="margin:0 0 20px;font-size:15px;color:#4a5568">Takes under 2 minutes. No credit card required.</p>
          <a href="https://peptidealliance.io/claim" style="display:inline-block;background:${PRIMARY};color:#ffffff;font-size:16px;font-weight:700;padding:16px 40px;border-radius:12px;text-decoration:none">
            Claim Your Free Profile &#8594;
          </a>
          <p style="margin:20px 0 0;font-size:13px;color:#a0aec0">Questions? Reply to this email — we are happy to help.</p>
        </td></tr>

        <!-- Footer -->
        <tr><td style="background:#f8fafc;padding:24px 40px;border-top:1px solid #e2e8f0;text-align:center">
          <p style="margin:0 0 4px;font-size:13px;color:#718096">
            <strong>The Peptide Alliance</strong> &nbsp;·&nbsp;
            <a href="https://peptidealliance.io" style="color:${PRIMARY};text-decoration:none">peptidealliance.io</a> &nbsp;·&nbsp;
            <a href="mailto:hello@peptidealliance.io" style="color:${PRIMARY};text-decoration:none">hello@peptidealliance.io</a>
          </p>
          <p style="margin:8px 0 0;font-size:11px;color:#a0aec0">
            You are receiving this because your business was added to our directory. To remove your listing, simply reply to this email.
          </p>
        </td></tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

// ── Sleep helper ──────────────────────────────────────────────────────────────
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// ── Main ──────────────────────────────────────────────────────────────────────
async function main() {
  // Pull all unclaimed businesses with a website
  const { data: businesses, error } = await supabase
    .from('businesses')
    .select('id, name, website')
    .is('claimed_by', null)
    .not('website', 'is', null)
    .order('name');

  if (error) {
    console.error('Failed to fetch businesses:', error.message);
    process.exit(1);
  }

  console.log(`\n📬  Sending outreach to ${businesses.length} businesses…\n`);

  let sent     = 0;
  let skipped  = 0;
  let failed   = 0;

  for (const biz of businesses) {
    const toEmail = getDomainEmail(biz.website);

    if (!toEmail) {
      console.log(`  ⏭  Skipped (no domain): ${biz.name}`);
      skipped++;
      continue;
    }

    try {
      const { error: emailError } = await resend.emails.send({
        from: 'The Peptide Alliance <team@peptidealliance.io>',
        to: toEmail,
        replyTo: 'hello@peptidealliance.io',
        subject: `${biz.name} has been added to The Peptide Alliance`,
        html: buildEmail(biz.name),
      });

      if (emailError) {
        console.error(`  ✗  ${biz.name} → ${toEmail} — ${emailError.message}`);
        failed++;
      } else {
        console.log(`  ✓  ${biz.name} → ${toEmail}`);
        sent++;
      }
    } catch (err) {
      console.error(`  ✗  ${biz.name} → ${toEmail} — ${err.message}`);
      failed++;
    }

    // 500ms delay between sends to respect Resend rate limits
    await sleep(500);
  }

  console.log(`\n─────────────────────────────────────────`);
  console.log(`  Sent    : ${sent}`);
  console.log(`  Skipped : ${skipped}`);
  console.log(`  Failed  : ${failed}`);
  console.log(`─────────────────────────────────────────\n`);
}

main().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
