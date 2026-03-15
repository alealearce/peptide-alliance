-- ═══════════════════════════════════════════════════════════════════════════════
-- Migration 033: Seed More Real Businesses — Verified from Research Agents
-- Source: Web research agents, March 2026. No duplicates from 030–032.
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
  'Belmar Pharma Solutions',
  'belmar-pharma-solutions-golden',
  '40-year-old compounding pharmacy with six 503A Centers of Excellence across the US. Specializes in hormones, peptides including sermorelin, and wellness compounds for patient-specific prescriptions. Headquartered in Golden, CO.',
  'compounding_pharmacies', 'Sterile Compounding',
  'Golden', 'golden', 'CO', 'US', 'national',
  '231 Violet St, Suite 140, Golden, CO 80401', '(800) 525-9473', NULL, 'https://belmarpharmasolutions.com',
  false, false, true, 'free', 85, 'web_scrape'
),
(
  'MediVera Compounding Pharmacy',
  'medivera-compounding-pharmacy-troy',
  'PCAB-accredited compounding pharmacy operating from a 56,000 sq ft facility in Troy, MI. Ships prescription compounds including sermorelin nasal spray and hormone peptide therapies to patients in 45 states.',
  'compounding_pharmacies', 'Sterile Compounding',
  'Troy', 'troy', 'MI', 'US', 'national',
  '5225 Crooks Rd, Troy, MI 48098', '(877) 531-1147', 'info@mediverarx.com', 'https://mediverarx.com',
  false, false, true, 'free', 82, 'web_scrape'
),
(
  'Formulation Compounding Center',
  'formulation-compounding-center-lewisville',
  'Full-service sterile compounding pharmacy in Lewisville, TX offering custom peptide formulations including sermorelin and hormone-based compounds tailored by physician prescription. Ships throughout the United States.',
  'compounding_pharmacies', 'Sterile Compounding',
  'Lewisville', 'lewisville-formulation', 'TX', 'US', 'national',
  '1511 Justin Rd, Suite 106A, Lewisville, TX 75077', '(469) 301-7621', NULL, 'https://formulationrx.com',
  false, false, true, 'free', 72, 'web_scrape'
),
(
  'HB Pharmacy',
  'hb-pharmacy-north-arlington',
  'Established North Arlington, NJ compounding pharmacy offering sermorelin therapy in sublingual, nasal spray, and injectable forms. Same-day shipping for prescriptions received before 1 PM. Serves patients nationally.',
  'compounding_pharmacies', 'Sterile Compounding',
  'North Arlington', 'north-arlington', 'NJ', 'US', 'national',
  '98 Ridge Rd, North Arlington, NJ 07031', '(201) 997-2010', NULL, 'https://hbpharmacy.com',
  false, false, true, 'free', 72, 'web_scrape'
),
(
  'Sarasota Compounding Pharmacy',
  'sarasota-compounding-pharmacy',
  'Florida-based compounding pharmacy preparing custom sermorelin and hormone peptide prescriptions per physician specifications. Serves both local and mail-order patients with personalized formulations.',
  'compounding_pharmacies', 'Sterile Compounding',
  'Sarasota', 'sarasota', 'FL', 'US', 'regional',
  '2075 Siesta Dr, Sarasota, FL 34239', '(941) 366-0880', NULL, 'https://sarasotarx.com',
  false, false, true, 'free', 70, 'web_scrape'
),
(
  'Southend Pharmacy',
  'southend-pharmacy-houston',
  'LegitScript-certified Houston compounding pharmacy that compounds sermorelin to USP 797 sterile standards with third-party testing through FDA/DEA-registered labs on every compounded lot.',
  'compounding_pharmacies', 'Sterile Compounding',
  'Houston', 'houston-southend', 'TX', 'US', 'regional',
  '415 Westheimer Rd, Suite 103, Houston, TX 77006', '(281) 498-1450', NULL, 'https://southendpharmacystore.com',
  false, false, true, 'free', 75, 'web_scrape'
),
(
  'Town & Country Compounding',
  'town-country-compounding-ramsey',
  'Licensed New Jersey compounding pharmacy offering sterile and non-sterile peptide and hormone formulations. Serves patients and prescribers in the tri-state area with custom peptide preparations.',
  'compounding_pharmacies', 'Sterile Compounding',
  'Ramsey', 'ramsey', 'NJ', 'US', 'regional',
  '535 E Crescent Ave, Ramsey, NJ 07446', '(201) 447-2020', NULL, 'https://townandcountrycompounding.com',
  false, false, true, 'free', 70, 'web_scrape'
),
(
  'Olympia Pharmaceuticals',
  'olympia-pharmaceuticals-503b-orlando',
  'FDA-registered 503B outsourcing facility and affiliated 503A pharmacy licensed to ship peptide medications nationwide. Compounds sermorelin acetate and peptide-based hormone therapies for clinical and patient use.',
  'compounding_pharmacies', '503B Outsourcing',
  'Orlando', 'orlando-503b', 'FL', 'US', 'national',
  '6700 Conroy Windermere Rd, Suite 155, Orlando, FL 32835', '(407) 673-2222', NULL, 'https://olympiapharmacy.com/503b',
  false, false, true, 'free', 82, 'web_scrape'
),

-- ─── RESEARCH LABS ────────────────────────────────────────────────────────────

(
  'ResolveMass Laboratories',
  'resolvemass-laboratories-laval',
  'Canadian analytical CRO specializing in peptide characterization including purity profiling, LC-MS/MS, amino acid analysis, and peptide mapping. Supports FDA and Health Canada regulatory submissions.',
  'research_labs', 'Third-Party Testing',
  'Laval', 'laval', 'QC', 'CA', 'national',
  '500 Bd Cartier O, Laval, QC H7V 5B7', '+1 (306) 705-7145', 'info@resolvemass.ca', 'https://resolvemass.ca',
  false, false, true, 'free', 80, 'web_scrape'
),
(
  'Alcami Corporation',
  'alcami-corporation-wilmington',
  'US-based CDMO and contract laboratory with 45+ years of experience providing analytical testing, stability studies, and impurity analysis for peptides, biologics, and oligonucleotides across all development stages.',
  'research_labs', 'Third-Party Testing',
  'Wilmington', 'wilmington', 'NC', 'US', 'national',
  '2320 Scientific Park Dr, Wilmington, NC 28405', '(910) 254-7000', 'info@alcaminow.com', 'https://alcami.com',
  false, false, true, 'free', 85, 'web_scrape'
),
(
  'WuXi AppTec Lab Testing',
  'wuxi-apptec-lab-testing-cranbury',
  'Global pharmaceutical testing CRO with US operations in Cranbury, NJ offering DMPK, bioanalysis, HPLC, and mass spectrometry peptide testing services supporting full drug development from characterization to commercial release.',
  'research_labs', 'Third-Party Testing',
  'Cranbury', 'cranbury', 'NJ', 'US', 'national',
  '6 Cedarbrook Dr, Cranbury, NJ 08512', '+1 (609) 606-6666', NULL, 'https://labtesting.wuxiapptec.com',
  false, false, true, 'free', 88, 'web_scrape'
),
(
  'University of Pittsburgh Peptide Core',
  'pitt-peptide-core-pittsburgh',
  'Academic core facility at the University of Pittsburgh providing GMP-compliant certified peptide synthesis with full analytical documentation including COAs. Serves pharmaceutical, biotech, and academic researchers across North America.',
  'research_labs', 'Peptide Research',
  'Pittsburgh', 'pittsburgh', 'PA', 'US', 'national',
  '200 Lothrop St, Biomedical Science Tower, Pittsburgh, PA 15261', '(412) 648-8780', NULL, 'https://peptide.pitt.edu',
  false, false, true, 'free', 80, 'web_scrape'
),
(
  'SGS Life Sciences',
  'sgs-life-sciences-wayne',
  'Global testing, inspection, and certification company with a Wayne, NJ pharmaceutical testing laboratory. Provides GMP analytical testing, method development, and stability studies for peptide APIs and drug products.',
  'research_labs', 'Third-Party Testing',
  'Wayne', 'wayne', 'NJ', 'US', 'national',
  '900 Ridgebury Rd, Wayne, NJ 07470', '(973) 790-3500', NULL, 'https://www.sgs.com/life-sciences',
  false, false, true, 'free', 85, 'web_scrape'
),
(
  'Pacific BioLabs',
  'pacific-biolabs-hercules',
  'FDA-registered contract testing laboratory in Hercules, CA offering biocompatibility, toxicology, microbiology, and chemistry testing for pharmaceuticals and medical devices including peptide-based products.',
  'research_labs', 'Third-Party Testing',
  'Hercules', 'hercules', 'CA', 'US', 'national',
  '551 Linus Pauling Dr, Hercules, CA 94547', '(510) 964-9000', NULL, 'https://pacificbiolabs.com',
  false, false, true, 'free', 82, 'web_scrape'
)

ON CONFLICT (slug) DO NOTHING;
