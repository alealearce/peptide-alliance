import type { Metadata } from 'next';

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'Terms of Service — Peptide Alliance',
    description: 'The terms and conditions governing use of Peptide Alliance for visitors and business owners.',
    alternates: {
      canonical: 'https://peptidealliance.io/terms',
    },
  };
}

export default function TermsPage() {
  return <TermsEn />;
}

function TermsEn() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-14">
      <p className="text-sm text-muted mb-2">Last updated: March 2026</p>
      <h1 className="font-heading text-4xl font-bold text-text mb-4">Terms of Service</h1>
      <p className="text-muted leading-relaxed mb-10">
        These Terms of Service (&ldquo;Terms&rdquo;) constitute a legally binding agreement between you
        (&ldquo;User&rdquo;, &ldquo;you&rdquo;, &ldquo;your&rdquo;) and Peptide Alliance
        (&ldquo;the Platform&rdquo;, &ldquo;we&rdquo;, &ldquo;us&rdquo;, &ldquo;our&rdquo;) at{' '}
        <strong>peptidealliance.io</strong>. By accessing the platform, creating an account, claiming
        a business listing, submitting a new business, or subscribing to any of our services, you
        acknowledge that you have read, understood, and agree to be bound by these Terms in their
        entirety. <strong>If you do not agree to all of these Terms, you may not use this platform.</strong>
      </p>

      <Section title="1. About Peptide Alliance">
        <p>
          Peptide Alliance is an online directory, industry standards resource, and informational
          platform for the peptide and regenerative health industry. We connect peptide brands, clinics,
          compounding pharmacies, research laboratories, wholesale suppliers, and manufacturers with
          buyers, practitioners, and researchers across the United States and Canada.
        </p>
        <p>
          Peptide Alliance provides free and paid listing tiers, business owner management tools, a
          Trust Score informational system, lead management, a peptide educational database, and
          editorial content for the peptide industry. We are an <strong>information and directory service
          only</strong> — we do not manufacture, sell, distribute, test, inspect, prescribe, or recommend
          any product or service listed on this platform.
        </p>
        <p>
          Peptide Alliance is not a medical provider, pharmacy, regulatory body, licensing authority,
          or law enforcement agency. Nothing on this platform constitutes medical advice, legal advice,
          financial advice, or a recommendation to purchase any product or engage any service.
        </p>
      </Section>

      <Section title="2. What &ldquo;Verified&rdquo; Means — Important Disclaimer">
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5 mb-4">
          <h3 className="font-bold text-text mt-0">Please read this section carefully</h3>
          <p>
            The &ldquo;<strong>Verified</strong>&rdquo; designation on Peptide Alliance refers
            exclusively to a <strong>listing verification status</strong> — it means that the business
            owner has claimed their listing, provided basic identity and business information, and our
            team has confirmed the business appears to exist and the claimant appears to represent it.
          </p>
          <p>
            <strong>Verified does NOT mean any of the following:</strong>
          </p>
          <ul>
            <li>That Peptide Alliance has tested, inspected, audited, or approved any product sold by the business.</li>
            <li>That any product listed or described meets any particular quality, purity, potency, sterility, or safety standard.</li>
            <li>That the business is licensed, regulated, accredited, or operating lawfully in any jurisdiction.</li>
            <li>That the business holds any required federal, state, or provincial permits, DEA registrations, pharmacy licenses, or manufacturing licenses.</li>
            <li>That any claims made by the business about their products are accurate, lawful, or scientifically substantiated.</li>
            <li>That certifications or lab results uploaded by the business have been independently validated, authenticated, or reviewed by Peptide Alliance.</li>
            <li>That the business&rsquo;s products are safe, effective, or appropriate for any particular use.</li>
            <li>That Peptide Alliance endorses or recommends the business or any of its products or services.</li>
          </ul>
          <p className="mb-0">
            Verification is a <strong>directory listing status only</strong>. It is not an endorsement,
            certification, quality guarantee, or safety certification of any kind. Users must conduct
            independent due diligence before purchasing any product or engaging any service.
          </p>
        </div>
      </Section>

      <Section title="3. No Product Endorsement or Liability">
        <div className="bg-primary/5 border border-primary/20 rounded-2xl p-5 mb-4">
          <p>
            <strong>Peptide Alliance is an information directory only.</strong> We do not manufacture,
            sell, distribute, test, inspect, or endorse any products. We are not a regulatory body and
            we do not enforce compliance with any law, regulation, or industry standard.
          </p>
          <ul>
            <li>
              <strong>We are not responsible for products you purchase</strong> from any business listed
              on this platform. Any transaction you enter into with a listed business is solely between
              you and that business.
            </li>
            <li>
              <strong>We do not verify the accuracy of product descriptions,</strong> pricing,
              certifications, lab results, or any other information uploaded by business owners.
              Businesses are solely responsible for the truthfulness and legality of their listings.
            </li>
            <li>
              <strong>The Trust Score is an informational tool only.</strong> It is calculated
              algorithmically based on profile completeness and uploaded documents — it is not a
              guarantee of quality, safety, regulatory compliance, or business legitimacy.
            </li>
            <li>
              <strong>Lab results and certifications displayed on listings</strong> are uploaded
              directly by business owners. Peptide Alliance does not independently verify these
              documents unless explicitly stated with an admin-verified badge. The presence of a
              document on a listing does not confirm its authenticity, accuracy, or current validity.
            </li>
            <li>
              <strong>You are solely responsible</strong> for conducting your own due diligence,
              including verifying regulatory compliance, licenses, and product safety, before purchasing
              any product or engaging any service from a listed business.
            </li>
            <li>
              <strong>Peptide Alliance is not liable for any adverse health outcomes,</strong> injuries,
              allergic reactions, overdoses, contamination events, or other harm resulting from the
              purchase or use of any product found through this platform.
            </li>
          </ul>
          <p className="mb-0 font-semibold text-text">
            By using this platform to find businesses or products, you acknowledge and accept that
            Peptide Alliance has no liability for any harm, loss, injury, or legal consequence
            arising from products purchased or services engaged through listings found on this platform.
          </p>
        </div>
      </Section>

      <Section title="4. Medical and Health Disclaimer">
        <div className="bg-red-50 border border-red-200 rounded-2xl p-5 mb-4">
          <p>
            <strong>IMPORTANT: Nothing on this platform constitutes medical advice.</strong>
          </p>
          <p>
            The information provided on Peptide Alliance — including peptide descriptions, research
            summaries, dosage information, administration routes, and any user-generated content — is
            for <strong>informational and educational purposes only</strong>. It is not intended to
            diagnose, treat, cure, prevent, or mitigate any disease or health condition.
          </p>
          <ul>
            <li>
              <strong>Always consult a licensed, qualified healthcare professional</strong> before using
              any peptide, supplement, hormone, or other compound. This is particularly important for
              individuals who are pregnant, nursing, have pre-existing medical conditions, or are taking
              prescription medications.
            </li>
            <li>
              Many peptides listed on this platform are <strong>classified as research chemicals</strong>{' '}
              and are not approved by the U.S. Food and Drug Administration (FDA) or Health Canada for
              human use. Their safety and efficacy in humans have not been established through FDA-reviewed
              clinical trials.
            </li>
            <li>
              <strong>Peptide Alliance does not endorse, recommend, or facilitate</strong> the self-administration
              of any prescription-only compound, controlled substance, or unapproved drug.
            </li>
            <li>
              The legal status of peptides varies significantly by jurisdiction. It is your sole
              responsibility to determine the legality of any compound in your location before purchase
              or use.
            </li>
            <li>
              References to &ldquo;research use only&rdquo; products indicate that such compounds are
              not approved for human use. Purchasing such compounds for human use may violate federal,
              state, or local law.
            </li>
          </ul>
          <p className="mb-0 font-semibold text-text">
            Peptide Alliance expressly disclaims all liability for any health outcome, adverse event,
            injury, or legal consequence resulting from any individual&rsquo;s decision to use, purchase,
            or administer any compound based on information found on this platform.
          </p>
        </div>
      </Section>

      <Section title="5. Eligibility">
        <p>You must be at least 18 years old to create an account, claim a business listing, or submit a new business. By using Peptide Alliance you represent and warrant that:</p>
        <ul>
          <li>You are at least 18 years of age.</li>
          <li>You have the full legal capacity and authority to agree to these Terms on behalf of yourself or the business you represent.</li>
          <li>If you are acting on behalf of a business entity, you have authority to bind that entity to these Terms.</li>
          <li>All information you provide is accurate, current, and complete.</li>
          <li>Your use of the platform does not violate any applicable law, regulation, or third-party agreement.</li>
          <li>You are not located in, or operating on behalf of any person or entity in, any jurisdiction where access to this platform or the types of products or services described herein is prohibited by law.</li>
        </ul>
      </Section>

      <Section title="6. Business Owner Eligibility and Representations">
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5 mb-4">
          <h3 className="font-bold text-text mt-0">Business owners must read and comply with this section</h3>
          <p>
            By claiming a business listing or submitting a new business on Peptide Alliance, you make
            the following representations and warranties, which you confirm each time you submit a claim
            or listing:
          </p>
          <ol className="list-decimal pl-6 space-y-3">
            <li>
              <strong>You represent a real, legally operating business.</strong> The business you are
              listing or claiming is a genuine, lawfully organized business entity (corporation, LLC,
              sole proprietorship, partnership, or equivalent) that is registered and operating in
              compliance with the laws of the jurisdiction in which it operates. You are not submitting
              a fictitious, fraudulent, or non-existent business.
            </li>
            <li>
              <strong>You are an authorized representative.</strong> You are the owner, operator, or
              an authorized agent or employee of the business, and you have the authority to manage the
              business&rsquo;s online presence, enter into binding agreements on its behalf, and agree
              to these Terms on its behalf.
            </li>
            <li>
              <strong>Your business complies with all applicable laws.</strong> Your business holds all
              required federal, state, provincial, and local licenses, permits, registrations, and
              authorizations necessary for it to legally operate and sell the products or services it
              offers. This includes, without limitation: state pharmacy licenses (where applicable),
              DEA registrations (where required), FDA registrations (where applicable), Health Canada
              approvals, and any applicable state or provincial business licenses.
            </li>
            <li>
              <strong>Your products comply with applicable law.</strong> Any products you list, describe,
              or promote on the platform are lawfully manufactured, lawfully sold in the jurisdictions
              where you offer them, and accurately described. You do not sell or promote any controlled
              substance in an unlawful manner, any counterfeit product, any mislabeled product, or any
              product that violates FDA, FTC, Health Canada, or DEA regulations.
            </li>
            <li>
              <strong>Your marketing claims are truthful and substantiated.</strong> Any claims you make
              about your products — including health claims, efficacy claims, quality claims, or
              certification claims — are truthful, not misleading, and substantiated by competent and
              reliable scientific evidence as required by applicable law, including FTC guidelines.
            </li>
            <li>
              <strong>You will keep your listing current and accurate.</strong> You will update your
              listing promptly if any information becomes inaccurate, including changes to your
              business status, licensure, product offerings, or regulatory standing.
            </li>
            <li>
              <strong>You are not engaged in prohibited activities.</strong> You are not using this
              platform to facilitate the sale of counterfeit goods, unapproved drugs represented as
              safe for human use, controlled substances without proper authorization, or any product or
              service that is otherwise illegal in the jurisdictions where you operate or where your
              customers are located.
            </li>
          </ol>
        </div>
        <p>
          <strong>Violation of any of these representations</strong> may result in immediate removal
          of your listing, termination of your account, forfeiture of any paid subscription fees,
          referral to appropriate regulatory authorities, and civil legal action. Peptide Alliance
          reserves the right to report suspected illegal activity to the FDA, FTC, DEA, Health Canada,
          or any other applicable regulatory or law enforcement agency.
        </p>
      </Section>

      <Section title="7. Account Registration">
        <ul>
          <li>You are responsible for maintaining the confidentiality of your login credentials and for all activity that occurs under your account.</li>
          <li>You must provide accurate, current, and complete information when creating your account and must keep this information up to date.</li>
          <li>You may not share your account credentials with any third party or allow any third party to access your account.</li>
          <li>You must notify us immediately at{' '}
            <a href="mailto:hello@peptidealliance.io">hello@peptidealliance.io</a> if you suspect unauthorized access to your account.
          </li>
          <li>We reserve the right to suspend or terminate accounts that violate these Terms, provide false information, engage in fraudulent activity, or are inactive for an extended period.</li>
          <li>Each business may only have one active listing claim per unique business entity. Creating duplicate or overlapping claims is prohibited.</li>
        </ul>
      </Section>

      <Section title="8. Claiming a Business Listing">
        <div className="bg-primary/5 border border-primary/20 rounded-2xl p-5 mb-4">
          <h3 className="font-bold text-text mt-0">How the claim process works</h3>
          <ol className="list-decimal pl-6 space-y-2">
            <li>
              <strong>Find or add your business:</strong> search for your business on Peptide Alliance. If it already appears, click &ldquo;Claim this listing&rdquo;. If it does not, use the &ldquo;Get Listed&rdquo; flow to submit it.
            </li>
            <li>
              <strong>Create or log in to your account:</strong> registration is free.
            </li>
            <li>
              <strong>Agree to these Terms and submit your claim:</strong> provide your full name and role at the business. By checking the agreement box and submitting, you certify under penalty of perjury that the information you provide is truthful, that you have authority to manage this business&rsquo;s online presence, and that the business is a real, legally operating entity.
            </li>
            <li>
              <strong>Review period:</strong> our team reviews all claims within 3 business days. You will receive an email confirmation once your claim is approved.
            </li>
            <li>
              <strong>Manage your listing:</strong> once approved, you can edit all listing details, upload products, certifications, and lab results from your dashboard.
            </li>
          </ol>

          <div className="mt-4 bg-white rounded-xl border border-primary/10 p-4 text-sm">
            <p className="font-semibold text-text mb-1">
              By submitting a claim, you agree to these Terms of Service in full, including all
              business owner obligations, regulatory compliance requirements, and liability disclaimers.
            </p>
            <p className="text-muted mb-0">
              Claiming a listing confirms that you are an authorized representative of a real, legally
              operating business. Fraudulent claims may result in permanent account termination,
              forfeiture of all paid fees, and legal action including referral to regulatory authorities.
            </p>
          </div>
        </div>

        <h3>Business listing content standards</h3>
        <p>Once you have claimed your listing, you are solely responsible for the accuracy, completeness, and legality of all content you publish, including product descriptions, certifications, and lab results. You agree not to post:</p>
        <ul>
          <li>False, misleading, or deceptive information about your business, products, services, or qualifications.</li>
          <li>Fabricated, altered, expired, or inapplicable lab results, certifications, or compliance documents.</li>
          <li>Health or efficacy claims that are not substantiated by competent scientific evidence.</li>
          <li>Content that violates any applicable law or regulation, including FDA regulations, FTC guidelines, DEA regulations, Health Canada requirements, or controlled substance laws.</li>
          <li>Content that infringes any copyright, trademark, patent, trade secret, or other intellectual property rights.</li>
          <li>Discriminatory, defamatory, threatening, harassing, or offensive material.</li>
          <li>Spam, phishing content, or links to malicious or fraudulent sites.</li>
          <li>Personal information of third parties without their consent.</li>
          <li>Any content that violates the privacy rights of any individual.</li>
        </ul>
        <p>We reserve the right to edit, suppress, or permanently remove any listing content that violates these standards, at our sole discretion and without prior notice or compensation.</p>
      </Section>

      <Section title="9. Prohibited Products and Activities">
        <p>Business owners may not use Peptide Alliance to list, promote, advertise, or facilitate the sale of:</p>
        <ul>
          <li>Any controlled substance (Schedule I–V under the Controlled Substances Act) without all required DEA and state licenses and approvals.</li>
          <li>Any prescription drug or prescription-only compound promoted for direct sale to consumers without a valid prescription and licensed pharmacy involvement.</li>
          <li>Any product containing ingredients banned by the FDA, Health Canada, or other applicable regulatory authority in the jurisdiction where it is sold.</li>
          <li>Any product represented as a drug or medical treatment that has not been approved by the applicable regulatory authority for that use.</li>
          <li>Counterfeit, adulterated, or misbranded products of any kind.</li>
          <li>Any product that makes unauthorized drug claims (i.e., disease claims on a supplement that would require FDA drug approval).</li>
          <li>Human growth hormone (HGH) for anti-aging, bodybuilding, or athletic enhancement outside of a valid physician-patient relationship and in compliance with applicable law.</li>
          <li>Any anabolic steroid outside of a valid physician-patient relationship and in compliance with applicable law.</li>
          <li>Products marketed with illegal per se claims (e.g., claiming a product cures, treats, or prevents any disease without FDA approval).</li>
        </ul>
        <p>
          Peptide Alliance reserves the right to determine, in its sole discretion, whether a listing
          violates this section. Violating listings will be removed without refund, and repeat violators
          will be permanently banned. Nothing in these Terms prevents Peptide Alliance from reporting
          suspected violations to the FDA, DEA, FTC, Health Canada, or any other regulatory or law
          enforcement agency.
        </p>
      </Section>

      <Section title="10. Subscription Plans & Billing">
        <h3>Standard (Free) tier</h3>
        <p>
          All business owners can claim and manage a basic listing for free. Standard listings include
          your business name, address, category, description, and basic contact information.
        </p>

        <h3>Paid tiers — Verified, Featured, Industry Leader</h3>
        <p>Paid plans unlock additional features. See our{' '}
          <a href="/upgrade">pricing page</a> for full details. Features include:
        </p>
        <ul>
          <li><strong>Verified ($49/month USD):</strong> clickable links, lead inbox, review management, search boost.</li>
          <li><strong>Featured ($99/month USD):</strong> everything in Verified plus priority placement and featured position in category pages.</li>
          <li><strong>Industry Leader ($499/month USD):</strong> everything in Featured plus homepage spotlight, phone number displayed, and maximum search boost.</li>
        </ul>

        <h3>Billing</h3>
        <ul>
          <li>Subscriptions are billed monthly in <strong>United States Dollars (USD)</strong> via <strong>Stripe</strong>.</li>
          <li>By subscribing, you authorize Peptide Alliance to charge your payment method on a recurring monthly basis until you cancel.</li>
          <li>Subscriptions renew automatically on the same date each month unless cancelled before the renewal date.</li>
          <li>You are responsible for keeping your payment information current. Failed payments may result in immediate downgrade to the free tier.</li>
          <li>To cancel, manage your subscription from your dashboard or contact us at{' '}
            <a href="mailto:hello@peptidealliance.io">hello@peptidealliance.io</a> at least 48 hours before your renewal date.
          </li>
          <li>Peptide Alliance reserves the right to modify pricing with at least 30 days&rsquo; written notice to active subscribers.</li>
        </ul>

        <h3>Refunds</h3>
        <p>
          We offer a <strong>7-day refund</strong> for new subscriptions if you are not satisfied with
          the service. To request a refund within 7 days of your initial charge, contact us at{' '}
          <a href="mailto:hello@peptidealliance.io">hello@peptidealliance.io</a>. After 7 days,
          subscription fees are <strong>non-refundable</strong>. If you cancel mid-cycle, your paid
          features remain active until the end of the billing period. No partial refunds are issued for
          unused days in a billing cycle. Refunds will not be issued for accounts terminated due to
          violations of these Terms.
        </p>

        <h3>Chargebacks</h3>
        <p>
          If you initiate a chargeback or payment dispute with your bank or card issuer for any charge
          that was legitimately billed under these Terms, we reserve the right to immediately suspend
          your account, permanently ban you from the platform, and pursue recovery of the disputed
          amount plus any applicable fees through all available legal means.
        </p>
      </Section>

      <Section title="11. Products, Certifications & Lab Results">
        <p>Business owners on paid tiers may upload products, certifications, and lab result documents to their listing. By uploading this content, you represent and warrant that:</p>
        <ul>
          <li>All information is accurate, current, not misleading, and not deceptive.</li>
          <li>All documents (certifications, Certificates of Analysis, lab reports, regulatory approvals, etc.) are genuine, unaltered, unexpired, and applicable to the specific products being promoted.</li>
          <li>You have the right to publish this information publicly and doing so does not violate any third-party rights or confidentiality obligations.</li>
          <li>The products and services described comply with all applicable laws in the jurisdictions where you operate and where your customers are located.</li>
          <li>You will promptly update or remove any document that becomes outdated, revoked, or inapplicable.</li>
        </ul>
        <p>
          <strong>Peptide Alliance does not independently verify uploaded documents</strong> unless our
          team has reviewed them and applied a specific admin-verified badge. The presence of a
          certification or lab result on a listing does not constitute verification, authentication, or
          endorsement by Peptide Alliance. Users must independently verify the authenticity and
          applicability of any documents before relying on them.
        </p>
        <p>
          We reserve the right to remove any uploaded content that we believe, in our sole discretion,
          to be false, fraudulent, misleading, outdated, harmful, or in violation of applicable law,
          without prior notice or liability.
        </p>
        <p>
          <strong>Uploading fraudulent documents</strong> — including falsified Certificates of Analysis,
          fabricated lab results, altered certifications, or counterfeit regulatory approvals — is a
          serious violation of these Terms and may constitute a federal crime under 18 U.S.C. § 1001
          (false statements), FTC Act § 5, or other applicable law. Peptide Alliance will report
          suspected document fraud to appropriate regulatory and law enforcement authorities.
        </p>
      </Section>

      <Section title="12. User Conduct">
        <p>When using Peptide Alliance, you agree not to:</p>
        <ul>
          <li>Violate any applicable federal, state, provincial, local, or international laws or regulations.</li>
          <li>Scrape, harvest, crawl, or systematically extract data from the platform without our express written consent.</li>
          <li>Attempt to gain unauthorized access to any part of the platform, its infrastructure, databases, or user accounts.</li>
          <li>Submit false, misleading, or fraudulent information of any kind.</li>
          <li>Impersonate any person, business, regulatory body, or other entity.</li>
          <li>Claim a business that you do not own or have authority to represent.</li>
          <li>Interfere with the proper working of the platform, its servers, or its infrastructure.</li>
          <li>Use the platform to send spam, unsolicited commercial messages, or phishing content.</li>
          <li>Reverse-engineer, decompile, disassemble, or attempt to derive the source code of any part of the platform.</li>
          <li>Use automated tools, bots, or scripts to interact with the platform in a way that creates a disproportionate load on our infrastructure.</li>
          <li>Attempt to circumvent any security, access control, or anti-fraud measure on the platform.</li>
          <li>Use the platform in any way that could bring Peptide Alliance into disrepute or create liability for us.</li>
          <li>Engage in any activity that is harmful, threatening, harassing, abusive, or invasive of another person&rsquo;s privacy.</li>
        </ul>
      </Section>

      <Section title="13. Leads & Customer Inquiries">
        <ul>
          <li>When a user submits a lead (inquiry) through a business listing, their contact information is forwarded to the business owner by email.</li>
          <li>Business owners agree to use lead information only to respond to the specific inquiry and not to add users to mailing lists, automated marketing sequences, or third-party databases without the user&rsquo;s explicit prior consent.</li>
          <li>Business owners agree to comply with all applicable anti-spam laws including the CAN-SPAM Act and Canada&rsquo;s Anti-Spam Legislation (CASL) when communicating with leads.</li>
          <li>Peptide Alliance is not responsible for the quality, accuracy, safety, or outcome of any interaction, transaction, or ongoing relationship between a user and a business owner facilitated through the platform.</li>
          <li>Peptide Alliance does not guarantee the quality, exclusivity, or conversion rate of any leads delivered to business owners and makes no representations regarding the commercial value of leads.</li>
        </ul>
      </Section>

      <Section title="14. Reviews and User-Generated Content">
        <p>
          Peptide Alliance may enable users to submit reviews of listed businesses. By submitting a
          review, you represent that:
        </p>
        <ul>
          <li>The review reflects your honest, genuine experience with the business.</li>
          <li>You have actually interacted with or purchased from the business you are reviewing.</li>
          <li>The review does not contain false statements of fact, defamatory content, or content that violates applicable law.</li>
          <li>You are not a competitor of the business, a current or former employee with a conflict of interest, or a person paid to submit the review.</li>
          <li>You grant Peptide Alliance a non-exclusive, royalty-free, perpetual licence to display your review on the platform.</li>
        </ul>
        <p>
          Peptide Alliance reserves the right to remove reviews that violate these standards or that
          we determine, in our sole discretion, to be fraudulent, defamatory, or otherwise harmful.
          We are not liable for the content of user-submitted reviews.
        </p>
      </Section>

      <Section title="15. Regulatory Compliance">
        <p>
          The peptide and regenerative health industry is subject to extensive and evolving regulatory
          oversight. By using this platform as a business owner, you acknowledge that:
        </p>
        <ul>
          <li>
            <strong>FDA jurisdiction:</strong> The U.S. Food and Drug Administration regulates drugs,
            biologics, and medical devices. Many peptides may be regulated as drugs or drug ingredients
            depending on how they are marketed and sold. It is your sole responsibility to determine the
            regulatory status of your products and to comply with all applicable FDA requirements,
            including those related to labeling, good manufacturing practices (GMP), drug approval,
            and marketing restrictions.
          </li>
          <li>
            <strong>FTC requirements:</strong> The Federal Trade Commission requires that advertising
            claims be truthful, not misleading, and substantiated. Health and performance claims must
            meet the applicable FTC standard of &ldquo;competent and reliable scientific evidence.&rdquo;
            You agree that all marketing content you publish on this platform complies with FTC
            guidelines, including the FTC&rsquo;s Endorsement Guides.
          </li>
          <li>
            <strong>DEA requirements:</strong> Certain peptides and compounds may be subject to DEA
            scheduling or analogues provisions. You represent that you comply with all applicable DEA
            regulations for any compound you sell or promote.
          </li>
          <li>
            <strong>State and provincial law:</strong> Pharmacy laws, professional licensing requirements,
            and consumer protection laws vary significantly by state and province. You are responsible
            for compliance with all applicable state and provincial laws in every jurisdiction where
            you operate or where your customers are located.
          </li>
          <li>
            <strong>Health Canada:</strong> If you operate in or ship to Canada, you are subject to
            Health Canada&rsquo;s Food and Drugs Act, the Natural Health Products Regulations, and
            other applicable Canadian federal and provincial law.
          </li>
        </ul>
        <p>
          Peptide Alliance does not provide legal, regulatory, or compliance advice. We strongly
          recommend that all business owners consult with qualified legal counsel regarding the
          regulatory status of their products and operations before listing on our platform.
        </p>
      </Section>

      <Section title="16. Intellectual Property">
        <h3>Our content</h3>
        <p>
          The Peptide Alliance name, logo, platform design, original editorial content, peptide database
          content, AI-generated content, and all other original content are the intellectual property
          of Peptide Alliance. You may not copy, reproduce, republish, upload, post, transmit, or
          distribute any part of our content without our prior written permission.
        </p>

        <h3>Your content</h3>
        <p>
          You retain ownership of the original content you submit to Peptide Alliance (excluding any
          AI-generated content). By submitting content, you grant us a non-exclusive, royalty-free,
          worldwide, sublicensable licence to display, reproduce, modify, and distribute that content
          on our platform and in associated marketing materials for the purpose of promoting your
          business listing and operating the platform.
        </p>
        <p>
          You represent that you have all rights necessary to grant this licence, that your content
          does not infringe any third-party rights, and that your content complies with all applicable
          laws.
        </p>

        <h3>Trademark</h3>
        <p>
          &ldquo;Peptide Alliance&rdquo; and associated logos are trademarks of Peptide Alliance. You
          may not use our trademarks, trade names, or branding in any way that could cause confusion,
          imply endorsement, or otherwise infringe our rights without our prior written consent.
        </p>
      </Section>

      <Section title="17. Privacy and Data">
        <p>
          Your use of Peptide Alliance is also governed by our{' '}
          <a href="/privacy">Privacy Policy</a>, which is incorporated into these Terms by reference.
          By using the platform, you consent to the data practices described in our Privacy Policy.
        </p>
        <ul>
          <li>We collect and process personal information as described in our Privacy Policy.</li>
          <li>We do not sell your personal data to third parties for advertising purposes.</li>
          <li>We use payment processing services (Stripe) and may share limited data with Stripe as necessary to process payments. Stripe&rsquo;s use of your data is governed by Stripe&rsquo;s Privacy Policy.</li>
          <li>By claiming a business listing, you consent to display of your business name, contact information, and other listing details publicly on the platform.</li>
          <li>We may use aggregated, anonymized data for analytics and platform improvement without restriction.</li>
        </ul>
      </Section>

      <Section title="18. Disclaimers">
        <ul>
          <li>Peptide Alliance provides the directory <strong>&ldquo;as is&rdquo;</strong> and <strong>&ldquo;as available&rdquo;</strong> without any warranties, express or implied, including without limitation warranties of merchantability, fitness for a particular purpose, or non-infringement.</li>
          <li>We do not warrant that the platform will be uninterrupted, error-free, secure, or free of viruses or other harmful components.</li>
          <li>We do not verify the accuracy of all business information, particularly for unclaimed listings.</li>
          <li>We do not endorse, recommend, or guarantee the quality, safety, legality, or suitability of any product, service, or business listed on the platform.</li>
          <li>We are not responsible for any loss, harm, injury, legal consequence, or damage of any kind arising from your reliance on information found in a listing, your purchase of any product, or your engagement with any business found through the platform.</li>
          <li>The &ldquo;Verified&rdquo; badge is a listing designation only. See Section 2 for the full definition.</li>
          <li>Trust Scores are informational and algorithmic only — they do not constitute a safety rating, quality certification, or regulatory compliance assessment.</li>
          <li>The educational content in our Peptide Database is for informational purposes only and does not constitute medical advice or a recommendation to use any compound.</li>
          <li>We make no representations about the completeness, accuracy, or currency of the peptide information in our educational database.</li>
        </ul>
      </Section>

      <Section title="19. Limitation of Liability">
        <p>
          To the fullest extent permitted by applicable law, Peptide Alliance and its operators,
          owners, officers, directors, employees, agents, successors, and assigns shall not be liable
          for any direct, indirect, incidental, consequential, special, exemplary, or punitive damages
          arising from or related to your use of (or inability to use) the platform, including but
          not limited to:
        </p>
        <ul>
          <li>Loss of revenue, profits, data, business opportunities, goodwill, or anticipated savings.</li>
          <li>Any harm, illness, injury, adverse health outcome, or death resulting from products purchased through or found on the platform.</li>
          <li>Any legal, regulatory, administrative, or financial consequence arising from your engagement with a listed business or purchase of any product.</li>
          <li>Any inaccuracy in business information, certifications, lab results, or regulatory status published on the platform.</li>
          <li>Any unauthorized access to or alteration of your data or transmissions.</li>
          <li>Any conduct or content of any third party on the platform.</li>
          <li>Any interruption, suspension, or termination of the platform or any part thereof.</li>
          <li>Any viruses, malware, or other technologically harmful material that may infect your systems.</li>
        </ul>
        <p>
          Our total aggregate liability for any claim arising from these Terms or your use of the
          platform shall not exceed the total amount you paid to Peptide Alliance in the 12 months
          immediately preceding the event giving rise to the claim. For free-tier users, our total
          aggregate liability is limited to USD $100.00. This limitation applies regardless of the
          legal theory under which the claim is brought (contract, tort, strict liability, or otherwise).
        </p>
        <p>
          Some jurisdictions do not allow the exclusion of certain warranties or the limitation of
          liability for certain damages. In such jurisdictions, our liability will be limited to the
          maximum extent permitted by law.
        </p>
      </Section>

      <Section title="20. Indemnification">
        <p>
          You agree to indemnify, defend, and hold harmless Peptide Alliance and its operators, owners,
          officers, directors, employees, contractors, agents, successors, and assigns from any claims,
          losses, damages, liabilities, penalties, fines, settlements, judgments, or expenses
          (including reasonable attorneys&rsquo; fees and court costs) arising from or related to:
        </p>
        <ul>
          <li>(a) your use of the platform in violation of these Terms;</li>
          <li>(b) content you submit to the platform, including business information, product descriptions, certifications, or lab results;</li>
          <li>(c) any transaction, interaction, or dispute between you and another user or business;</li>
          <li>(d) your violation of any third-party rights, including intellectual property rights;</li>
          <li>(e) your violation of any applicable law, regulation, or regulatory requirement;</li>
          <li>(f) any false or misleading representation you made in connection with claiming or listing a business;</li>
          <li>(g) any products or services you sell or promote through your listing, including any harm, injury, or adverse event caused by such products;</li>
          <li>(h) any regulatory action, investigation, or enforcement proceeding initiated against Peptide Alliance as a result of your listing or conduct.</li>
        </ul>
        <p>
          We reserve the right, at our own expense, to assume the exclusive defense and control of any
          matter otherwise subject to indemnification by you. You agree to cooperate fully in such defense.
        </p>
      </Section>

      <Section title="21. Dispute Resolution and Arbitration">
        <p>
          <strong>Informal Resolution:</strong> Before initiating any formal dispute proceedings, you
          agree to first contact us at{' '}
          <a href="mailto:hello@peptidealliance.io">hello@peptidealliance.io</a> and attempt to
          resolve the dispute informally. We will attempt to resolve any dispute within 30 days.
        </p>
        <p>
          <strong>Binding Arbitration:</strong> If a dispute cannot be resolved informally, you agree
          that any claim arising from or relating to these Terms or your use of the platform will be
          resolved through final and binding arbitration, rather than in court, except as set forth
          below. The arbitration will be conducted by a mutually agreed arbitration service under its
          consumer or commercial arbitration rules as applicable.
        </p>
        <p>
          <strong>Class Action Waiver:</strong> You agree that any dispute will be resolved on an
          individual basis and not as a class action, collective action, or representative proceeding.
          You expressly waive any right to participate in a class action lawsuit or class-wide
          arbitration against Peptide Alliance.
        </p>
        <p>
          <strong>Exceptions:</strong> Either party may seek emergency injunctive or other equitable
          relief in a court of competent jurisdiction to prevent irreparable harm while arbitration
          is pending. Claims that are within the jurisdiction of small claims court may be brought
          in that court.
        </p>
      </Section>

      <Section title="22. Governing Law">
        <p>
          These Terms are governed by the laws of the United States, without regard to its conflict
          of law principles. To the extent that any dispute is not subject to arbitration, you consent
          to exclusive jurisdiction and venue in the federal or state courts located in the United States.
        </p>
        <p>
          If you are accessing this platform from Canada, you acknowledge that these Terms are governed
          by U.S. law and that you are voluntarily agreeing to this choice of law.
        </p>
      </Section>

      <Section title="23. Termination">
        <ul>
          <li>You may close your account at any time by contacting us at <a href="mailto:hello@peptidealliance.io">hello@peptidealliance.io</a>. Closure does not entitle you to any refund of subscription fees.</li>
          <li>We may suspend or terminate your account immediately and without prior notice if you breach these Terms, upload fraudulent documents, make false representations, engage in deceptive practices, violate any applicable law, or pose a risk to other users, the public, or the platform.</li>
          <li>We may also terminate or suspend accounts at our sole discretion for any reason with reasonable notice for non-breach-related terminations.</li>
          <li>Upon termination, your right to use the platform ceases immediately. We may retain your data as required by applicable law or our legitimate business interests.</li>
          <li>The following sections survive termination: 3, 4, 6, 9, 11, 16, 18, 19, 20, 21, and 22.</li>
        </ul>
      </Section>

      <Section title="24. Force Majeure">
        <p>
          Peptide Alliance shall not be liable for any failure or delay in performance resulting from
          causes beyond our reasonable control, including without limitation: acts of God, natural
          disasters, pandemics, war, terrorism, government actions, internet or telecommunications
          outages, cyberattacks, strikes, or any other cause beyond our reasonable control.
        </p>
      </Section>

      <Section title="25. Severability and Entire Agreement">
        <p>
          If any provision of these Terms is found to be unenforceable or invalid under applicable law,
          such provision shall be modified to the minimum extent necessary to make it enforceable, and
          the remaining provisions shall continue in full force and effect.
        </p>
        <p>
          These Terms, together with our Privacy Policy and any other policies or agreements incorporated
          by reference, constitute the entire agreement between you and Peptide Alliance with respect to
          your use of the platform and supersede all prior agreements, understandings, and representations.
        </p>
        <p>
          Our failure to enforce any right or provision of these Terms shall not constitute a waiver
          of that right or provision.
        </p>
      </Section>

      <Section title="26. Changes to These Terms">
        <p>
          We may update these Terms from time to time to reflect changes in our services, applicable
          law, or industry practices. We will notify registered users of material changes by email at
          least 14 days before the changes take effect. The updated Terms will be posted on this page
          with a revised &ldquo;Last updated&rdquo; date. Continued use of the platform after the
          effective date of any changes constitutes your acceptance of the updated Terms.
        </p>
        <p>
          If you do not agree to the updated Terms, you must stop using the platform and may close
          your account by contacting us at{' '}
          <a href="mailto:hello@peptidealliance.io">hello@peptidealliance.io</a>.
        </p>
      </Section>

      <Section title="27. Contact Us">
        <p>Questions about these Terms? We&rsquo;re happy to help.</p>
        <div className="bg-surface border border-border rounded-xl px-5 py-4 text-sm">
          <p className="mb-1"><strong>Peptide Alliance</strong></p>
          <p className="mb-1">
            Email:{' '}
            <a href="mailto:hello@peptidealliance.io" className="text-primary underline underline-offset-2">
              hello@peptidealliance.io
            </a>
          </p>
          <p className="mb-0 text-muted text-xs">
            For legal notices and formal correspondence, please use the email address above and mark
            your subject line with &ldquo;Legal Notice — Peptide Alliance.&rdquo;
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
      <div className="text-muted leading-relaxed space-y-3 [&_h3]:font-semibold [&_h3]:text-text [&_h3]:mt-5 [&_h3]:mb-2 [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:space-y-2 [&_ol]:pl-6 [&_ol]:space-y-2 [&_li]:leading-relaxed [&_strong]:text-text [&_a]:text-primary [&_a]:underline [&_a]:underline-offset-2 [&_p]:leading-relaxed">
        {children}
      </div>
    </section>
  );
}
