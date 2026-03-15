-- ═══════════════════════════════════════════════════════════════════════════════
-- Migration 034: Seed More Real Businesses — Verified from Research Agents
-- Source: Web research agents, March 2026. No duplicates from 030–033.
-- ═══════════════════════════════════════════════════════════════════════════════

INSERT INTO businesses (
  name, slug, description_en, category, subcategory,
  city, city_slug, province, country, service_area,
  address, phone, email, website,
  is_verified, is_premium, is_active,
  subscription_tier, trust_score, source
) VALUES

-- ─── COMPOUNDING PHARMACIES ───────────────────────────────────────────────────

(
  'Carie Boyd Pharmaceuticals',
  'carie-boyd-pharmaceuticals-irving',
  'FDA-registered 503B outsourcing facility and 503A specialty compounding pharmacy in Texas. Known for hormone pellets, sterile injectables, and a broad range of patient-specific and office-use compounded medications.',
  'compounding_pharmacies', '503B Outsourcing',
  'Irving', 'irving', 'TX', 'US', 'national',
  '8400 Esters Blvd, Suite 190, Irving, TX 75063', '(817) 282-9376', NULL, 'https://carieboyd.com',
  false, false, true, 'free', 80, 'web_scrape'
),
(
  'Hallandale Pharmacy',
  'hallandale-pharmacy-fort-lauderdale',
  'South Florida 503A compounding pharmacy providing high-quality bulk compounds and custom formulations including sterile peptide injectables, hormone preparations, and specialty medications for healthcare providers nationwide.',
  'compounding_pharmacies', 'Sterile Compounding',
  'Fort Lauderdale', 'fort-lauderdale-hallandale', 'FL', 'US', 'national',
  '2666 SW 36th St, Fort Lauderdale, FL 33312', '(866) 537-4557', 'orders@hallandalerx.com', 'https://hallandalerx.com',
  false, false, true, 'free', 78, 'web_scrape'
),
(
  'PCCA',
  'pcca-houston',
  'The leading supplier of pharmaceutical-grade chemicals, equipment, and compounding education for independent compounding pharmacies across North America. Supports pharmacies that compound customized peptide medications.',
  'compounding_pharmacies', 'Non-Sterile Compounding',
  'Houston', 'houston-pcca', 'TX', 'US', 'national',
  '9901 S Wilcrest Dr, Houston, TX 77099', '(800) 331-2498', NULL, 'https://pccarx.com',
  false, false, true, 'free', 82, 'web_scrape'
),
(
  'Woodland Hills Pharmacy',
  'woodland-hills-pharmacy',
  'California-based compounding pharmacy serving the Woodland Hills area with personalized compounded medications including hormone therapy, peptide formulations, and custom wellness compounds by physician prescription.',
  'compounding_pharmacies', 'Non-Sterile Compounding',
  'Woodland Hills', 'woodland-hills', 'CA', 'US', 'regional',
  '20011 Ventura Blvd, Suite 1006, Woodland Hills, CA 91364', NULL, NULL, 'https://woodlandhillsrx.com',
  false, false, true, 'free', 65, 'web_scrape'
),

-- ─── RESEARCH LABS ────────────────────────────────────────────────────────────

(
  'Colmaric Analyticals',
  'colmaric-analyticals-st-petersburg',
  'Rapidly growing ISO/IEC-accredited CRO in Florida providing peptide purity testing, dietary supplement batch testing, pharmaceutical analytics, and food safety testing to nutraceutical, pharmaceutical, and cosmetic industries.',
  'research_labs', 'Third-Party Testing',
  'St. Petersburg', 'st-petersburg', 'FL', 'US', 'national',
  '3235 Fairfield Ave S, Suite A, St. Petersburg, FL 33712', '(727) 289-4877', 'contactus@colmaricanalyticals.com', 'https://colmaricanalyticals.com',
  false, false, true, 'free', 82, 'web_scrape'
),
(
  'Analytical Resource Laboratories',
  'analytical-resource-labs-lehi',
  'Independent consumer products quality testing laboratory in Utah providing microbiological and analytical chemistry services including peptide and compound identity and purity testing for the dietary supplement and pharmaceutical industries.',
  'research_labs', 'Third-Party Testing',
  'Lehi', 'lehi', 'UT', 'US', 'national',
  '520 S 850 E, Suite B3, Lehi, UT 84043', '(801) 847-7722', 'info@yourqualitylab.com', 'https://analyticalresource.com',
  false, false, true, 'free', 78, 'web_scrape'
),
(
  'Labdoor',
  'labdoor-san-francisco',
  'Consumer-focused supplement testing and rating company that independently tests and grades nutritional supplements including peptide-based products for label accuracy, purity, and safety. Publishes all results publicly.',
  'research_labs', 'Third-Party Testing',
  'San Francisco', 'san-francisco-labdoor', 'CA', 'US', 'national',
  '301 Howard St, Suite 950, San Francisco, CA 94105', '(415) 549-7339', NULL, 'https://labdoor.com',
  false, false, true, 'free', 80, 'web_scrape'
),
(
  'Sports Medicine Research and Testing Laboratory',
  'smrtl-south-jordan',
  'WADA-accredited anti-doping laboratory in South Jordan, UT providing comprehensive testing for performance-enhancing substances including peptide hormones. Serves Olympic, collegiate, professional sports, and federal anti-doping programs.',
  'research_labs', 'Third-Party Testing',
  'South Jordan', 'south-jordan', 'UT', 'US', 'national',
  '10644 S Jordan Gateway, South Jordan, UT 84095', '(801) 994-9454', 'info@smrtl.org', 'https://smrtl.org',
  false, false, true, 'free', 88, 'web_scrape'
),
(
  'JPT Peptide Technologies',
  'jpt-peptide-technologies-acton',
  'Peptide technology specialist with a US office near Boston providing custom peptide libraries, PepMix peptide pools for T-cell immunology, MHC ligandome services, and high-throughput synthesis for diagnostics and vaccine development.',
  'research_labs', 'Peptide Research',
  'Acton', 'acton', 'MA', 'US', 'national',
  '10 Thoreau Rd, Acton, MA 01720', '(888) 578-2660', 'us-bd@jpt.com', 'https://jpt.com',
  false, false, true, 'free', 80, 'web_scrape'
),
(
  'ProImmune',
  'proimmune-sarasota',
  'World leader in MHC-peptide binding assays and MHC multimer technologies. Provides custom peptide synthesis, T cell epitope discovery, HLA tissue typing, and immune response assays to pharmaceutical and academic researchers.',
  'research_labs', 'Peptide Research',
  'Sarasota', 'sarasota-proimmune', 'FL', 'US', 'national',
  '4281 Express Lane, Suite L2378, Sarasota, FL 34249', NULL, 'enquiries@proimmune.com', 'https://proimmune.com',
  false, false, true, 'free', 80, 'web_scrape'
)

ON CONFLICT (slug) DO NOTHING;
