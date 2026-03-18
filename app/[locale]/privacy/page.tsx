import type { Metadata } from 'next';

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'Privacy Policy — Peptide Alliance',
    description: 'How Peptide Alliance collects, uses, and protects your personal information.',
    alternates: {
      canonical: 'https://peptidealliance.io/privacy',
    },
  };
}

export default function PrivacyPage() {
  return <PrivacyEn />;
}

function PrivacyEn() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-14">
      <p className="text-sm text-muted mb-2">Last updated: March 2026</p>
      <h1 className="font-heading text-4xl font-bold text-text mb-4">Privacy Policy</h1>
      <p className="text-muted leading-relaxed mb-10">
        Peptide Alliance (&ldquo;we&rdquo;, &ldquo;us&rdquo;, &ldquo;our&rdquo;) operates{' '}
        <strong>peptidealliance.io</strong> — an online directory, governing body, and standards
        organization for the peptide and regenerative health industry serving the United States and
        Canada. We are committed to protecting your privacy and handling your personal information
        responsibly.
      </p>

      <Section title="1. Who This Policy Applies To">
        <p>This Privacy Policy applies to:</p>
        <ul>
          <li><strong>Visitors</strong> who browse Peptide Alliance without an account.</li>
          <li><strong>Business owners</strong> who claim or list their business on our platform.</li>
          <li><strong>Users</strong> who create an account, subscribe to our newsletter, or submit a lead (inquiry) to a business.</li>
        </ul>
      </Section>

      <Section title="2. What Information We Collect">
        <h3>Information you provide directly</h3>
        <ul>
          <li><strong>Account registration:</strong> full name, email address.</li>
          <li><strong>Business listings:</strong> business name, address, city, state or province, country, phone number, website, social media links, category, service area, description, photos, products, certifications, and lab results.</li>
          <li><strong>Lead / contact forms:</strong> your name, email, phone number, and message when you contact a business through our platform.</li>
          <li><strong>Newsletter subscription:</strong> email address.</li>
          <li><strong>Suggest a business:</strong> any information you voluntarily submit about a business.</li>
        </ul>

        <h3>Information collected automatically</h3>
        <ul>
          <li><strong>Search events:</strong> search queries, geographic filters, category filters, and the number of results returned — used to improve the directory.</li>
          <li><strong>Listing views:</strong> which business profiles are viewed, collected in aggregate. Your actual IP address is one-way hashed before storage and is never recoverable.</li>
          <li><strong>Usage analytics:</strong> pages visited, session duration, and general device type, collected via Google Analytics 4 (anonymised).</li>
          <li><strong>Cookies:</strong> session cookies for authentication, and analytics cookies placed by Google Analytics.</li>
        </ul>

        <h3>Payment information</h3>
        <p>
          Subscription payments are processed by <strong>Stripe</strong>. We never see or store your
          full credit card number — Stripe handles all payment data under their own PCI-DSS compliant
          systems. We retain only a Stripe customer ID and subscription status.
        </p>
      </Section>

      <Section title="3. How We Use Your Information">
        <ul>
          <li>To operate and improve the Peptide Alliance directory and its search features.</li>
          <li>To display business listings publicly on the platform.</li>
          <li>To forward leads (inquiries) from users to the relevant business owner via email.</li>
          <li>To send transactional emails: email verification, claim confirmations, subscription receipts.</li>
          <li>To send subscribers our newsletter (with your explicit opt-in consent).</li>
          <li>To generate anonymised platform analytics and industry trends.</li>
          <li>To communicate important service updates, security notices, or policy changes.</li>
          <li>To prevent fraud and abuse of the platform.</li>
        </ul>
        <p>
          We do <strong>not</strong> sell, rent, or trade your personal information to third parties
          for marketing purposes.
        </p>
      </Section>

      <Section title="4. Legal Basis for Processing">
        <p>We process personal information under the following bases:</p>
        <ul>
          <li><strong>Consent:</strong> newsletter subscriptions, analytics cookies.</li>
          <li><strong>Contract:</strong> account registration, business listing management, payment processing.</li>
          <li><strong>Legitimate interests:</strong> fraud prevention, platform security, anonymised analytics to improve search results.</li>
          <li><strong>Legal obligation:</strong> retaining transaction records as required by applicable tax law.</li>
        </ul>
      </Section>

      <Section title="5. Sharing Your Information">
        <p>We share personal information only where necessary:</p>
        <ul>
          <li><strong>Supabase:</strong> our database and authentication provider.</li>
          <li><strong>Resend:</strong> our transactional email provider, used to deliver verification, claim confirmation, lead notification, and newsletter emails.</li>
          <li><strong>Stripe:</strong> our payment processor for subscription billing.</li>
          <li><strong>Google Analytics:</strong> anonymised usage statistics. IP addresses are anonymised before being sent to Google.</li>
          <li><strong>Anthropic (Claude AI):</strong> used to power the PeptideBot chatbot. No personal identifying information is included in AI prompts.</li>
          <li><strong>Law enforcement:</strong> where required by law or valid legal process.</li>
        </ul>
        <p>All third-party providers are bound by data processing agreements and are prohibited from using your data for their own purposes.</p>
      </Section>

      <Section title="6. Data Retention">
        <ul>
          <li><strong>Account data:</strong> retained while your account is active. Deleted within 30 days of a verified account deletion request.</li>
          <li><strong>Business listings:</strong> retained while active on the platform. Business owners may request removal at any time.</li>
          <li><strong>Leads / inquiries:</strong> retained for 2 years to support business owner records, then deleted.</li>
          <li><strong>Search event logs:</strong> retained for 13 months to support analytics, then deleted.</li>
          <li><strong>Newsletter subscriber records:</strong> retained until unsubscribe is requested.</li>
          <li><strong>Payment records:</strong> retained for 7 years as required by applicable tax regulations.</li>
        </ul>
      </Section>

      <Section title="7. Cookies">
        <p>We use the following cookies:</p>
        <ul>
          <li><strong>Strictly necessary:</strong> session cookies that keep you logged in. These cannot be disabled without breaking core functionality.</li>
          <li><strong>Analytics:</strong> Google Analytics cookies (GA4) that collect anonymised usage data. You may opt out via your browser settings.</li>
        </ul>
        <p>We do not use advertising or tracking cookies.</p>
      </Section>

      <Section title="8. Your Rights">
        <p>You have the right to:</p>
        <ul>
          <li><strong>Access</strong> the personal information we hold about you.</li>
          <li><strong>Correct</strong> inaccurate or incomplete information.</li>
          <li><strong>Request deletion</strong> of your personal information (subject to legal retention requirements).</li>
          <li><strong>Withdraw consent</strong> for newsletter communications at any time via the unsubscribe link in any email.</li>
          <li><strong>Request your business listing be updated or removed.</strong></li>
        </ul>
        <p>
          To exercise any of these rights, contact us at{' '}
          <a href="mailto:hello@peptidealliance.io" className="text-primary underline underline-offset-2">
            hello@peptidealliance.io
          </a>. We will respond within <strong>30 days</strong>.
        </p>
      </Section>

      <Section title="9. Business Listing Data">
        <div className="bg-primary/5 border border-primary/20 rounded-2xl p-5 mb-4">
          <h3 className="font-bold text-text mt-0">Claiming, updating, or removing your listing</h3>
          <ul>
            <li>
              <strong>Claim your listing:</strong> create a free account, find your business, and click &ldquo;Claim this listing&rdquo;. Your claim is reviewed by our team within 3 business days.
            </li>
            <li>
              <strong>Update your information:</strong> log in to your dashboard at any time and edit your listing details, photos, products, certifications, and lab results.
            </li>
            <li>
              <strong>Remove your listing:</strong> contact us at{' '}
              <a href="mailto:hello@peptidealliance.io" className="text-primary underline underline-offset-2">
                hello@peptidealliance.io
              </a>{' '}
              with your business name and we will remove your listing within 5 business days.
            </li>
          </ul>
          <p className="mb-0">
            Unclaimed listings may have been sourced from publicly available information. By claiming your listing, you take ownership of the data and agree to our Terms of Service.
          </p>
        </div>
      </Section>

      <Section title="10. Data Security">
        <ul>
          <li>All data is transmitted over <strong>HTTPS / TLS encryption</strong>.</li>
          <li>Passwords are hashed using industry-standard algorithms — we never store plaintext passwords.</li>
          <li>IP addresses are <strong>one-way hashed</strong> before storage — the original IP cannot be recovered.</li>
          <li>Database access is restricted via row-level security (RLS) policies — users can only access their own data.</li>
          <li>Administrative access requires multi-factor authentication.</li>
        </ul>
      </Section>

      <Section title="11. Children's Privacy">
        <p>
          Peptide Alliance is not directed at children under the age of 13. We do not knowingly collect
          personal information from children. If you believe a child has provided us with personal
          information, please contact us and we will delete it promptly.
        </p>
      </Section>

      <Section title="12. Changes to This Policy">
        <p>
          We may update this Privacy Policy from time to time. When we do, we will update the
          &ldquo;Last updated&rdquo; date at the top of this page. For material changes, we will
          notify registered users by email. Continued use of Peptide Alliance after the effective
          date constitutes acceptance of the updated policy.
        </p>
      </Section>

      <Section title="13. Contact Us">
        <p>For any privacy-related questions, requests, or concerns, please contact us:</p>
        <div className="bg-surface border border-border rounded-xl px-5 py-4 text-sm">
          <p className="mb-1"><strong>Peptide Alliance</strong></p>
          <p className="mb-0">
            Email:{' '}
            <a href="mailto:hello@peptidealliance.io" className="text-primary underline underline-offset-2">
              hello@peptidealliance.io
            </a>
          </p>
        </div>
      </Section>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mb-10">
      <h2 className="font-heading text-xl font-bold text-text mb-4 pb-2 border-b border-border">
        {title}
      </h2>
      <div className="text-muted leading-relaxed space-y-3 [&_h3]:font-semibold [&_h3]:text-text [&_h3]:mt-5 [&_h3]:mb-2 [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:space-y-2 [&_li]:leading-relaxed [&_strong]:text-text [&_a]:text-primary [&_a]:underline [&_a]:underline-offset-2 [&_p]:leading-relaxed">
        {children}
      </div>
    </section>
  );
}
