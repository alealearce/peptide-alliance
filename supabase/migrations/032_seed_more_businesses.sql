-- ═══════════════════════════════════════════════════════════════════════════════
-- Migration 032: Seed More Real Businesses — Verified from Research Agents
-- Source: Web research agents, March 2026. No duplicates from 030 or 031.
-- ═══════════════════════════════════════════════════════════════════════════════

INSERT INTO businesses (
  name, slug, description_en, category, subcategory,
  city, city_slug, province, country, service_area,
  address, phone, email, website,
  is_verified, is_premium, is_active,
  subscription_tier, trust_score, source
) VALUES

-- ─── PEPTIDE BRANDS ───────────────────────────────────────────────────────────

(
  'Peptide Systems',
  'peptide-systems-folsom',
  'US-based supplier offering HPLC/LC-MS verified peptides at 99%+ purity, including BPC-157, TB-500, and Sermorelin. All products come with certified Certificates of Analysis from independent third-party labs.',
  'peptide_brands', 'Research Peptides',
  'Folsom', 'folsom', 'CA', 'US', 'national',
  '50 Iron Point Cir, Suite 140, Folsom, CA 95630', '(833) 484-9696', 'support@peptidesystems.com', 'https://peptidesystems.com',
  false, false, true, 'free', 72, 'web_scrape'
),
(
  'Pure Health Peptides',
  'pure-health-peptides-fallbrook',
  'California-based LLC offering US-made, third-party tested research peptides including BPC-157 and TB-500 blends. Every batch is verified with COAs published on their site for full transparency.',
  'peptide_brands', 'Research Peptides',
  'Fallbrook', 'fallbrook', 'CA', 'US', 'national',
  '376 Charles Swisher Ct, Fallbrook, CA 92028', NULL, 'info@purehealthpeptides.com', 'https://purehealthpeptides.com',
  false, false, true, 'free', 68, 'web_scrape'
),
(
  'Peptide Warehouse Canada',
  'peptide-warehouse-canada-mississauga',
  'Mississauga-based Canadian peptide supplier offering research-grade peptides with fast domestic shipping across all Canadian provinces. Provides 24/7 customer support and COA documentation for every product.',
  'peptide_brands', 'Research Peptides',
  'Mississauga', 'mississauga', 'ON', 'CA', 'national',
  '1089 Britannia Rd E, Unit 110, Mississauga, ON L4W 3X1', '(416) 254-9562', 'info@peptidewarehouse.ca', 'https://peptidewarehouse.ca',
  false, false, true, 'free', 68, 'web_scrape'
),
(
  'Polar Peptides',
  'polar-peptides-canada',
  'Canadian research peptide supplier shipping directly from their Canadian fulfillment center within 24 hours. Typical delivery in 2–5 business days. Accepts Interac e-Transfer and provides COAs on request.',
  'peptide_brands', 'Research Peptides',
  'Vancouver', 'vancouver', 'BC', 'CA', 'national',
  'Vancouver, BC', NULL, 'info@polarpeptides.ca', 'https://polarpeptides.ca',
  false, false, true, 'free', 62, 'web_scrape'
),
(
  'Maxim Peptide',
  'maxim-peptide-kansas-city',
  'Missouri-based research peptide supplier with a large catalog of high-purity peptides. All products are rigorously tested with independently published COAs. Ships across the United States.',
  'peptide_brands', 'Research Peptides',
  'Kansas City', 'kansas-city', 'MO', 'US', 'national',
  'Kansas City, MO', NULL, 'support@maximpeptide.com', 'https://maximpeptide.com',
  false, false, true, 'free', 65, 'web_scrape'
),
(
  'Peptide Pros',
  'peptide-pros-scottsdale',
  'Arizona-based research peptide supplier known for competitively priced, high-purity peptides. Offers same-day shipping on in-stock items with COA documentation. Catalog includes over 200 research peptides.',
  'peptide_brands', 'Research Peptides',
  'Scottsdale', 'scottsdale-peptide-pros', 'AZ', 'US', 'national',
  'Scottsdale, AZ', NULL, 'info@peptidepros.com', 'https://peptidepros.com',
  false, false, true, 'free', 65, 'web_scrape'
),

-- ─── CLINICS ──────────────────────────────────────────────────────────────────

(
  'Genesis Health Institute',
  'genesis-health-institute-fort-lauderdale',
  'Fort Lauderdale functional medicine clinic offering physician-supervised peptide therapy including Sermorelin and PT-141, alongside bioidentical hormone replacement and medical aesthetics. Emphasis on longevity and optimization.',
  'clinics', 'Functional Medicine',
  'Fort Lauderdale', 'fort-lauderdale', 'FL', 'US', 'local',
  '1001 NE 26th St, Fort Lauderdale, FL 33305', '(954) 561-3175', NULL, 'https://ghinstitute.com',
  false, false, true, 'free', 72, 'web_scrape'
),
(
  'Executive Medicine of Texas',
  'executive-medicine-of-texas-southlake',
  'Southlake executive health clinic providing CJC-1295 and Ipamorelin peptide therapy as part of a comprehensive age management program. Includes bioidentical hormone therapy, executive physicals, and an autoimmune protocol.',
  'clinics', 'Longevity & Anti-Aging',
  'Southlake', 'southlake', 'TX', 'US', 'regional',
  '2106 E State Hwy 114, Suite 300, Southlake, TX 76092', '(817) 552-4300', NULL, 'https://emtexas.com',
  false, false, true, 'free', 75, 'web_scrape'
),
(
  'Revive Health and Beauty',
  'revive-health-and-beauty-frisco',
  'Frisco, Texas med spa and wellness clinic offering physician-prescribed peptide therapy alongside testosterone replacement and hormone optimization. Personalized treatment plans with Monday through Saturday availability.',
  'clinics', 'Hormone Therapy',
  'Frisco', 'frisco', 'TX', 'US', 'local',
  '11500 State Hwy 121, Suite 320, Frisco, TX 75035', '(214) 618-0048', NULL, 'https://revivehealthandbeauty.com',
  false, false, true, 'free', 68, 'web_scrape'
),
(
  'Naples Longevity Clinic',
  'naples-longevity-clinic-bonita-springs',
  'Board-certified internal medicine practice led by Dr. Tareq Khader offering peptide therapy, bioidentical hormone replacement, metabolic profiling, and nutrition services in Southwest Florida.',
  'clinics', 'Longevity & Anti-Aging',
  'Bonita Springs', 'bonita-springs', 'FL', 'US', 'local',
  '10971 Bonita Beach Rd SE, Suite 1, Bonita Springs, FL 34135', '(239) 659-3266', NULL, 'https://napleslongevity.com',
  false, false, true, 'free', 72, 'web_scrape'
),
(
  'Performance Rejuvenation Center',
  'performance-rejuvenation-center-washington-dc',
  'Washington DC anti-aging and hormone specialist clinic providing TRT, peptide therapy, and HGH replacement therapy. A dedicated longevity-focused practice serving the greater DC metro area.',
  'clinics', 'Longevity & Anti-Aging',
  'Washington', 'washington-dc-prc', 'DC', 'US', 'regional',
  '6856 Eastern Ave NW, Suite 205, Washington, DC 20012', '(202) 251-4472', NULL, 'https://prcindc.com',
  false, false, true, 'free', 70, 'web_scrape'
),
(
  'Vitalogy Health and Integrative Medicine',
  'vitalogy-health-denver',
  'Cherry Creek North Denver clinic offering personalized peptide therapy, hormone replacement, and integrative wellness services. Combines functional medicine diagnostics with individualized treatment plans for optimization.',
  'clinics', 'Functional Medicine',
  'Denver', 'denver', 'CO', 'US', 'local',
  '90 Madison St, Suite 101, Denver, CO 80206', '(720) 805-1989', NULL, 'https://vitalogydenver.com',
  false, false, true, 'free', 70, 'web_scrape'
),
(
  'Fulcrum Aesthetics and Surgery',
  'fulcrum-aesthetics-chicago',
  'Chicago plastic surgery and med spa offering peptide therapy as part of a comprehensive wellness and aesthetics platform. Positioned as one of the most advanced approaches for enhancing health, performance, and recovery.',
  'clinics', 'Sports Medicine',
  'Chicago', 'chicago-fulcrum', 'IL', 'US', 'local',
  '1457 W Belmont Ave, Chicago, IL 60657', '(773) 598-7003', NULL, 'https://fulcrumaesthetics.com',
  false, false, true, 'free', 68, 'web_scrape'
),
(
  'Coastal Integrative Healthcare',
  'coastal-integrative-healthcare-edgewater',
  'Multi-location Florida integrative health center offering peptide therapy combined with chiropractic, physical therapy, and functional medicine. Serves communities across Edgewater, Palm Coast, and New Smyrna Beach.',
  'clinics', 'Functional Medicine',
  'Edgewater', 'edgewater', 'FL', 'US', 'regional',
  '315 N Ridgewood Ave, Edgewater, FL 32132', '(386) 427-8403', NULL, 'https://coastalintegrativehealthcare.com',
  false, false, true, 'free', 65, 'web_scrape'
),
(
  'Pinnacle Integrative Health',
  'pinnacle-integrative-health-seattle',
  'Seattle functional medicine clinic founded in 2010 blending Eastern medicine, clinical nutrition, and advanced diagnostics. Offers peptide injections to support energy, joint health, and recovery. Nationally recognized practice.',
  'clinics', 'Functional Medicine',
  'Seattle', 'seattle', 'WA', 'US', 'regional',
  '509 Olive Way, Suite 803, Seattle, WA 98101', '(206) 624-0397', NULL, 'https://pinnacleintegrative.com',
  false, false, true, 'free', 72, 'web_scrape'
),
(
  'Beverly Hills Concierge Doctor',
  'beverly-hills-concierge-doctor',
  'Beverly Hills concierge physician offering physician-grade peptide therapy including BPC-157, Sermorelin, Ipamorelin, and Tesamorelin through in-office and house-call formats. Available seven days a week.',
  'clinics', 'Longevity & Anti-Aging',
  'Beverly Hills', 'beverly-hills', 'CA', 'US', 'local',
  '9400 Brighton Way, Suite 303, Beverly Hills, CA 90210', '(310) 683-0180', 'info@beverlyhillsconciergedoctor.com', 'https://beverlyhillsconciergedoctor.com',
  false, false, true, 'free', 75, 'web_scrape'
),
(
  'Daniel Benhuri MD',
  'daniel-benhuri-md-beverly-hills',
  'Board-certified Beverly Hills internist specializing in concierge peptide therapy including Semaglutide, BPC-157, and growth hormone secretagogues. Same-day availability with personalized injectable protocols.',
  'clinics', 'Longevity & Anti-Aging',
  'Beverly Hills', 'beverly-hills-benhuri', 'CA', 'US', 'local',
  '9400 Brighton Way, Suite 210, Beverly Hills, CA 90210', '(310) 362-1255', NULL, 'https://danielbenhurimd.com',
  false, false, true, 'free', 72, 'web_scrape'
),
(
  'Cenegenics',
  'cenegenics-las-vegas',
  'National age management medical practice with the world''s largest age management physician training program. Offers personalized peptide therapy, hormone optimization, and longevity medicine with locations in 10+ US cities.',
  'clinics', 'Longevity & Anti-Aging',
  'Las Vegas', 'las-vegas-cenegenics', 'NV', 'US', 'national',
  '851 S Rampart Blvd, Suite 110, Las Vegas, NV 89145', '(866) 953-1510', NULL, 'https://cenegenics.com',
  false, false, true, 'free', 80, 'web_scrape'
),
(
  'Optimale Health',
  'optimale-health-toronto',
  'Toronto-based men''s health clinic offering evidence-based peptide therapy, testosterone replacement, and hormone optimization. Fully licensed Canadian medical practice with telehealth options across Ontario.',
  'clinics', 'Hormone Therapy',
  'Toronto', 'toronto-optimale', 'ON', 'CA', 'regional',
  '120 Eglinton Ave E, Suite 800, Toronto, ON M4P 1E2', '(416) 994-8440', NULL, 'https://optimalehealth.ca',
  false, false, true, 'free', 70, 'web_scrape'
),
(
  'Ottawa Valley Health Centre',
  'ottawa-valley-health-centre-ottawa',
  'Ottawa integrative medicine clinic offering peptide therapy, bioidentical hormone replacement, and functional medicine diagnostics. Canadian Medical Association certified physicians guide individualized longevity protocols.',
  'clinics', 'Functional Medicine',
  'Ottawa', 'ottawa', 'ON', 'CA', 'regional',
  '1390 Prince of Wales Dr, Suite 302, Ottawa, ON K2C 3N6', '(613) 567-1900', NULL, 'https://ottawahealthcentre.com',
  false, false, true, 'free', 68, 'web_scrape'
),

-- ─── WHOLESALE SUPPLIERS ──────────────────────────────────────────────────────

(
  'AnaSpec Peptide Supply',
  'anaspec-peptide-supply-fremont',
  'Fremont, CA-based peptide supplier offering a catalog of 20,000+ pre-made and custom peptides for academic and pharmaceutical research. Provides fluorescent dye conjugates, peptide libraries, and HPLC-purified research peptides.',
  'wholesale_suppliers', 'Raw Materials',
  'Fremont', 'fremont-anaspec', 'CA', 'US', 'national',
  '34801 Campus Dr, Fremont, CA 94555', '(510) 791-9560', 'service@anaspec.com', 'https://www.anaspec.com/products/peptides',
  false, false, true, 'free', 82, 'web_scrape'
),
(
  'Sigma-Aldrich Peptides',
  'sigma-aldrich-peptides-st-louis',
  'Division of MilliporeSigma (Merck KGaA) providing over 35,000 catalog peptides and custom synthesis services for pharmaceutical and research applications. Global standard for biochemical reagents and peptide building blocks.',
  'wholesale_suppliers', 'Raw Materials',
  'St. Louis', 'st-louis', 'MO', 'US', 'national',
  '3050 Spruce St, St. Louis, MO 63103', '(800) 325-3010', NULL, 'https://www.sigmaaldrich.com/peptides',
  false, false, true, 'free', 90, 'web_scrape'
),
(
  'American Peptide Company',
  'american-peptide-company-sunnyvale',
  'California-based custom peptide synthesis service providing academic and pharmaceutical researchers with high-purity catalog and custom peptides. Specializes in difficult sequences, cyclic peptides, and stapled peptides.',
  'wholesale_suppliers', 'Custom Synthesis',
  'Sunnyvale', 'sunnyvale', 'CA', 'US', 'national',
  '777 E Evelyn Ave, Suite 212, Sunnyvale, CA 94086', '(408) 733-4300', 'info@americanpeptide.com', 'https://www.americanpeptide.com',
  false, false, true, 'free', 82, 'web_scrape'
),

-- ─── MANUFACTURERS ────────────────────────────────────────────────────────────

(
  'ImprimisRx',
  'imprimisrx-san-diego',
  'San Diego-based 503B outsourcing facility offering compounded ophthalmology, urology, and specialty medications including peptide-based preparations. FDA-registered, PCAB-accredited, and ships nationally to healthcare providers.',
  'manufacturers', 'API Manufacturing',
  'San Diego', 'san-diego-imprimis', 'CA', 'US', 'national',
  '12264 El Camino Real, Suite 350, San Diego, CA 92130', '(844) 446-7746', NULL, 'https://imprimisrx.com',
  false, false, true, 'free', 80, 'web_scrape'
),
(
  'Enovachem Pharmaceuticals',
  'enovachem-pharmaceuticals-torrance',
  'Torrance-based 503B pharmaceutical outsourcing facility manufacturing sterile injectable peptide preparations including sermorelin, ipamorelin, and CJC-1295. FDA-registered and ships to licensed practitioners nationally.',
  'manufacturers', 'GMP Manufacturing',
  'Torrance', 'torrance-enovachem', 'CA', 'US', 'national',
  '2400 Crenshaw Blvd, Suite 181, Torrance, CA 90501', '(800) 616-0400', NULL, 'https://enovachem.com',
  false, false, true, 'free', 78, 'web_scrape'
),
(
  'Harrow Health',
  'harrow-health-nashville',
  'Nashville-based specialty pharmaceutical company with FDA-registered 503B outsourcing facilities. Manufactures compounded ophthalmic, injectable, and peptide drug products for licensed practitioners and institutions.',
  'manufacturers', 'GMP Manufacturing',
  'Nashville', 'nashville', 'TN', 'US', 'national',
  '102 Woodmont Blvd, Suite 610, Nashville, TN 37205', '(615) 733-4730', NULL, 'https://harrowinc.com',
  false, false, true, 'free', 80, 'web_scrape'
)

ON CONFLICT (slug) DO NOTHING;
