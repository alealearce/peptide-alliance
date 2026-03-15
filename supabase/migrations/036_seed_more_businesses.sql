-- ═══════════════════════════════════════════════════════════════════════════════
-- Migration 036: Seed More Real Businesses — Verified from Research Agents
-- Source: Web research agents, March 2026. No duplicates from 030–035.
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
  'Fagron Sterile Services US',
  'fagron-sterile-services-wichita',
  'FDA-registered and DEA-licensed 503B outsourcing facility in Wichita, KS providing a broad portfolio of sterile medications including peptide-containing formulations for clinical use. Part of the global Fagron group.',
  'compounding_pharmacies', '503B Outsourcing',
  'Wichita', 'wichita', 'KS', 'US', 'national',
  '8710 E 34th St N, Wichita, KS 67226', '(877) 405-8066', NULL, 'https://fagronsterile.com',
  false, false, true, 'free', 82, 'web_scrape'
),
(
  'WP Pharma Labs',
  'wp-pharma-labs-dallas',
  'Dallas-based 503A compounding pharmacy specializing in anti-aging, functional medicine, peptides, weight management, and sexual wellness compounded formulations for healthcare providers.',
  'compounding_pharmacies', 'Sterile Compounding',
  'Dallas', 'dallas-wp-pharma', 'TX', 'US', 'national',
  '4001 McEwen Rd, Suite 110, Dallas, TX 75244', '(469) 722-4500', NULL, 'https://wppharmalabs.com',
  false, false, true, 'free', 72, 'web_scrape'
),
(
  'Texas Star Pharmacy',
  'texas-star-pharmacy-plano',
  'Licensed 503A compounding pharmacy shipping to 40+ states under the Texas Star and Thesis Pharmacy brands. Offers peptide therapy, hormone therapy, and custom pharmaceutical formulations for providers and patients.',
  'compounding_pharmacies', 'Sterile Compounding',
  'Plano', 'plano', 'TX', 'US', 'national',
  '3033 W Parker Rd, Suite 100, Plano, TX 75023', '(972) 519-8475', 'providersupport@texasstarpharmacy.com', 'https://texasstarpharmacy.com',
  false, false, true, 'free', 75, 'web_scrape'
),
(
  'Lone Star Compounding Pharmacy',
  'lone-star-compounding-fort-worth',
  'Fort Worth-based compounding pharmacy offering personalized sterile and non-sterile compounded medications including peptides for men, women, and pediatric patients. Serves the greater Dallas-Fort Worth metroplex.',
  'compounding_pharmacies', 'Sterile Compounding',
  'Fort Worth', 'fort-worth', 'TX', 'US', 'regional',
  '8752 Medical City Way, Suite 120, Fort Worth, TX 76132', '(682) 710-7777', 'info@lscpharmacy.com', 'https://lscpharmacy.com',
  false, false, true, 'free', 70, 'web_scrape'
),
(
  'ReviveRX Pharmacy',
  'reviverx-houston',
  'Licensed mail-order compounding pharmacy in Houston with USP-certified clean rooms. Specializes in compounded peptides, HRT, and wellness medications including BPC-157 and Sermorelin. Ships nationwide.',
  'compounding_pharmacies', 'Sterile Compounding',
  'Houston', 'houston-reviverx', 'TX', 'US', 'national',
  '3831 Golf Dr, Suite A, Houston, TX 77018', '(888) 689-2271', 'info@reviverxpharmacy.com', 'https://reviverx.com',
  false, false, true, 'free', 75, 'web_scrape'
),
(
  'Preston''s Pharmacy',
  'prestons-pharmacy-arlington',
  'Northern Virginia compounding pharmacy serving patients since 1934. Offers peptide compounding, hormone replacement therapy, weight loss medications, and next-day courier or mail delivery.',
  'compounding_pharmacies', 'Sterile Compounding',
  'Arlington', 'arlington-va', 'VA', 'US', 'regional',
  '5101 Langston Blvd, Arlington, VA 22207', '(571) 341-8787', NULL, 'https://prestonspharmacy.com',
  false, false, true, 'free', 72, 'web_scrape'
),
(
  'New Drug Loft',
  'new-drug-loft-new-york',
  'Upper East Side NYC retail and sterile compounding pharmacy specializing in peptide, dermatology, wellness, and pain management compounded formulations. Serves Manhattan patients and prescribers.',
  'compounding_pharmacies', 'Sterile Compounding',
  'New York', 'new-york-ndl', 'NY', 'US', 'regional',
  '1410 2nd Ave, New York, NY 10021', '(212) 879-0910', NULL, 'https://newdrugloft.com',
  false, false, true, 'free', 72, 'web_scrape'
),
(
  'The Compounding Pharmacy of America',
  'compounding-pharmacy-of-america-knoxville',
  'PCAB-accredited and LegitScript-certified compounding pharmacy in Knoxville serving 48 states with peptide and wellness compounded medications for providers and patients.',
  'compounding_pharmacies', 'Sterile Compounding',
  'Knoxville', 'knoxville', 'TN', 'US', 'national',
  '7240 Kingston Pike, Suite 136, Knoxville, TN 37919', '(865) 243-2488', NULL, 'https://compoundingrxusa.com',
  false, false, true, 'free', 78, 'web_scrape'
),
(
  'Sincerus Pharmaceuticals',
  'sincerus-pharmaceuticals-pompano-beach',
  'Florida-based sterile and non-sterile compounding pharmacy providing customized pharmaceutical preparations including dermatologic and peptide formulations to physician practices and surgery centers.',
  'compounding_pharmacies', 'Sterile Compounding',
  'Pompano Beach', 'pompano-beach', 'FL', 'US', 'national',
  '3265 W McNab Rd, Pompano Beach, FL 33069', '(800) 604-5032', 'info@sincerususa.com', 'https://sincerususa.com',
  false, false, true, 'free', 72, 'web_scrape'
),
(
  'Letco Medical',
  'letco-medical-decatur',
  'Pharmaceutical ingredient supplier (part of the Fagron group) providing bulk APIs, peptide-related compounding chemicals, and specialty pharma ingredients to US compounding pharmacies. PCAB-qualified supplier.',
  'compounding_pharmacies', 'Non-Sterile Compounding',
  'Decatur', 'decatur', 'AL', 'US', 'national',
  '1316 Commerce Dr NW, Decatur, AL 35601', '(800) 239-5288', NULL, 'https://letcomedical.com',
  false, false, true, 'free', 75, 'web_scrape'
),

-- ─── RESEARCH LABS ────────────────────────────────────────────────────────────

(
  'QPS LLC',
  'qps-llc-newark',
  'GLP/GCP-compliant CRO established in 1995 offering discovery, preclinical, and clinical research services including LC-MS/MS and LC-HRMS peptide and protein bioanalysis for drug development clients.',
  'research_labs', 'Clinical Trials',
  'Newark', 'newark-de', 'DE', 'US', 'national',
  '3 Innovation Way, Newark, DE 19711', '(302) 369-5601', 'info@qps.com', 'https://qps.com',
  false, false, true, 'free', 82, 'web_scrape'
),
(
  'ICON Central Laboratories',
  'icon-laboratories-farmingdale',
  'Global central laboratory in Farmingdale, NY offering comprehensive clinical trial services including biorepository, peptide bioanalysis, and sample management for pharmaceutical drug development programs.',
  'research_labs', 'Clinical Trials',
  'Farmingdale', 'farmingdale', 'NY', 'US', 'national',
  '123 Smith St, Farmingdale, NY 11735', '(631) 306-5355', NULL, 'https://iconplc.com',
  false, false, true, 'free', 85, 'web_scrape'
),
(
  'Nexomics Biosciences',
  'nexomics-biosciences-rocky-hill',
  'New Jersey-based research services company providing gene-to-structure services including recombinant protein and peptide expression, bioinformatics, crystallography, and NMR structural studies for biopharma clients.',
  'research_labs', 'Peptide Research',
  'Rocky Hill', 'rocky-hill', 'NJ', 'US', 'national',
  '5 Crescent Ave, G1 Princeton Business Park, Rocky Hill, NJ 08553', NULL, 'info@nexomics.com', 'https://nexomics.com',
  false, false, true, 'free', 78, 'web_scrape'
),
(
  'Krause Analytical',
  'krause-analytical-austin',
  'Austin, TX contract analytical laboratory specializing in third-party peptide purity, potency, and identity testing via LC-MS. Covers Semaglutide, Tirzepatide, BPC-157, CJC-1295, and many other research peptides.',
  'research_labs', 'Third-Party Testing',
  'Austin', 'austin-krause', 'TX', 'US', 'national',
  '6902 Winterberry Dr, Austin, TX 78750', '(512) 343-7529', 'info@krauseanalytical.com', 'https://krauselabs.com',
  false, false, true, 'free', 82, 'web_scrape'
),
(
  'Freedom Diagnostics Testing',
  'freedom-diagnostics-testing-franklin',
  'Tennessee-based laboratory providing high-precision purity and identity testing for research-use-only peptides with rapid turnaround and Certificate of Analysis reporting.',
  'research_labs', 'Third-Party Testing',
  'Franklin', 'franklin-tn', 'TN', 'US', 'national',
  '133 Holiday Ct, Suite 106, Franklin, TN 37067', NULL, NULL, 'https://freedomdiagnosticstesting.com',
  false, false, true, 'free', 75, 'web_scrape'
),
(
  'Vici Health Sciences',
  'vici-health-sciences-elkridge',
  'Maryland-based pharmaceutical R&D CRO offering formulation development, analytical method validation, peptide characterization, cGMP clinical manufacturing, and FDA regulatory consulting services.',
  'research_labs', 'Peptide Research',
  'Elkridge', 'elkridge', 'MD', 'US', 'national',
  '6655 Amberton Dr, Unit O, Elkridge, MD 21075', '(410) 379-1500', 'info@vicihealthsciences.com', 'https://vicihealthsciences.com',
  false, false, true, 'free', 78, 'web_scrape'
),
(
  'Resolian',
  'resolian-malvern',
  'Global GxP bioanalysis and DMPK CRO (formerly Alliance Pharma) with a major US hub in Malvern, PA. Provides peptide bioanalysis, immunoassay, and drug metabolism services for pharmaceutical drug development.',
  'research_labs', 'Clinical Trials',
  'Malvern', 'malvern', 'PA', 'US', 'national',
  '17 Lee Blvd, Malvern, PA 19355', '(610) 296-3152', 'BD@resolian.com', 'https://resolian.com',
  false, false, true, 'free', 80, 'web_scrape'
),
(
  'NOVA Biologics',
  'nova-biologics-oceanside',
  'FDA-registered biologic raw material supplier in Oceanside, CA providing serums, plasma, cell culture materials, and biological intermediates to research organizations and peptide and biopharma manufacturers.',
  'research_labs', 'Peptide Research',
  'Oceanside', 'oceanside', 'CA', 'US', 'national',
  '4120 Avenida de la Plata, Oceanside, CA 92056', '(760) 630-5700', 'info@NOVABiologics.com', 'https://novabiologics.com',
  false, false, true, 'free', 78, 'web_scrape'
)

ON CONFLICT (slug) DO NOTHING;
