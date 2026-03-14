-- ═══════════════════════════════════════════════════════════════════════════════
-- Migration 030: Seed Real Businesses — All 6 Categories (US + Canada)
-- Source: Web research, March 2026
-- Run on a fresh DB or where these slugs don't exist yet.
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
  'Biotech Peptides',
  'biotech-peptides-las-vegas',
  'US-based supplier synthesizing and lyophilizing research-grade peptides domestically. Catalog includes BPC-157, TB-500, and growth hormone secretagogues. Ships within the US.',
  'peptide_brands', 'Research Peptides',
  'Las Vegas', 'las-vegas', 'NV', 'US', 'national',
  '8275 S Eastern Ave, Suite 200, Las Vegas, NV 89123', NULL, NULL, 'https://biotechpeptides.com',
  false, false, true, 'free', 65, 'web_scrape'
),
(
  'Core Peptides',
  'core-peptides-orlando',
  'US-manufactured research peptides and combination blends sold for scientific research purposes. Known for competitive pricing and domestic fulfillment.',
  'peptide_brands', 'Research Peptides',
  'Orlando', 'orlando', 'FL', 'US', 'national',
  '5401 S Kirkman Rd, Suite 310, Orlando, FL 32819', '+1 (805) 429-8132', 'support@corepeptides.com', 'https://www.corepeptides.com',
  false, false, true, 'free', 65, 'web_scrape'
),
(
  'Limitless Life Nootropics',
  'limitless-life-nootropics-gulf-breeze',
  'GMP-manufactured, USA-made research peptides using advanced solid-phase synthesis and purification. Also operates as Limitless Biotech. Named Best Peptides Company of 2024.',
  'peptide_brands', 'Research Peptides',
  'Gulf Breeze', 'gulf-breeze', 'FL', 'US', 'national',
  '913 Gulf Breeze Pkwy, Suite 4, Gulf Breeze, FL 32561', '(800) 782-1905', NULL, 'https://limitlesslifenootropics.com',
  false, false, true, 'free', 70, 'web_scrape'
),
(
  'Swiss Chems',
  'swiss-chems-new-york',
  'Founded 2018. One of the largest selections of research peptides available online. Catalog includes BPC-157, Sermorelin, Ipamorelin, TB-500, and many others for research use only.',
  'peptide_brands', 'Research Peptides',
  'New York', 'new-york', 'NY', 'US', 'national',
  '42 Broadway, FL 12th, New York, NY 10004', '+1 (870) 533-5581', 'support@swisschems.is', 'https://swisschems.is',
  false, false, true, 'free', 65, 'web_scrape'
),
(
  'Amino Asylum',
  'amino-asylum-cypress',
  'US-based supplier offering research peptides with multiple domestic warehouse locations in TX and DE. Known for competitive pricing and product variety.',
  'peptide_brands', 'Research Peptides',
  'Cypress', 'cypress', 'CA', 'US', 'national',
  'Cypress, CA', NULL, 'sales@aminoasylumllc.com', 'https://aminoasylumllc.com',
  false, false, true, 'free', 60, 'web_scrape'
),
(
  'AminoVault',
  'aminovault-los-angeles',
  'US-based research peptide and reagent supplier focused on COA transparency. All sourcing, testing, and fulfillment handled within the United States. Wholesale and bulk options available.',
  'peptide_brands', 'Research Peptides',
  'Los Angeles', 'los-angeles', 'CA', 'US', 'national',
  'Los Angeles, CA', NULL, 'info@aminovault.com', 'https://aminovault.com',
  false, false, true, 'free', 60, 'web_scrape'
),
(
  'Sports Technology Labs',
  'sports-technology-labs-shelton',
  'US-based research peptide supplier publishing full third-party COAs for every batch. Tests every batch for minimum 95-98% purity. All COAs issued by independent external laboratories.',
  'peptide_brands', 'Research Peptides',
  'Shelton', 'shelton', 'CT', 'US', 'national',
  '494 Bridgeport Ave, Suite 101-222, Shelton, CT 06484', '(844) 950-1999', NULL, 'https://sportstechnologylabs.com',
  false, false, true, 'free', 75, 'web_scrape'
),
(
  'Phoenix Pharmaceuticals',
  'phoenix-pharmaceuticals-burlingame',
  'B2B peptide supplier based in Silicon Valley serving academic labs, biotech, and pharma companies since 1993. Manufactures research peptides, antibodies, and assay kits for preclinical research.',
  'peptide_brands', 'Research Peptides',
  'Burlingame', 'burlingame', 'CA', 'US', 'national',
  '330 Beach Road, Burlingame, CA 94010', '+1 (650) 558-8898', 'info@phoenixpeptide.com', 'https://phoenixpeptide.com',
  false, false, true, 'free', 80, 'web_scrape'
),

-- ─── CLINICS ──────────────────────────────────────────────────────────────────

(
  'Novus Anti-Aging Center',
  'novus-anti-aging-center-studio-city',
  'Los Angeles-area longevity clinic offering customized peptide therapy including BPC-157 with acoustic soundwave therapy. Focuses on hormone balance, libido, stamina, and overall vitality.',
  'clinics', 'Longevity & Anti-Aging',
  'Studio City', 'studio-city', 'CA', 'US', 'local',
  '11650 Riverside Dr, Suite 11, Studio City, CA 91602', '(310) 954-1450', NULL, 'https://thenovuscenter.com',
  false, false, true, 'free', 65, 'web_scrape'
),
(
  'Relive Health Houston',
  'relive-health-houston',
  'Full-service wellness and anti-aging clinic offering BPC-157, CJC-1295/Ipamorelin, Sermorelin, Tesamorelin, and GHK-Cu peptide therapies. Also provides hormone therapy, medical weight loss, and IV therapy.',
  'clinics', 'Peptide Therapy',
  'Houston', 'houston', 'TX', 'US', 'local',
  '9311 Katy Fwy, Suite E, Houston, TX 77024', '(346) 644-6366', NULL, 'https://relivehealth.com',
  false, false, true, 'free', 70, 'web_scrape'
),
(
  'Michael Aziz MD',
  'michael-aziz-md-new-york',
  'Board-certified Internal Medicine physician and attending at Lenox Hill Hospital. NYC peptide therapy specialist offering Sermorelin, Ipamorelin, and Tesamorelin protocols. Telehealth available.',
  'clinics', 'Peptide Therapy',
  'New York', 'new-york', 'NY', 'US', 'local',
  '515 Madison Avenue, Suite 602, New York, NY 10022', '(212) 906-9111', NULL, 'https://www.michaelazizmd.com',
  false, false, true, 'free', 75, 'web_scrape'
),
(
  'AyaFusion Wellness Clinic',
  'ayafusion-wellness-downers-grove',
  'DuPage County wellness clinic offering BPC-157, Sermorelin, TB-500, PT-141, and GHK-Cu peptide therapies. Serves Downers Grove, Naperville, Oak Brook, Hinsdale, and surrounding Chicagoland communities.',
  'clinics', 'Peptide Therapy',
  'Downers Grove', 'downers-grove', 'IL', 'US', 'local',
  '3050 Finley Road, Suite 300B, Downers Grove, IL 60515', '(773) 598-7200', 'Info@ayafusion.com', 'https://www.ayafusion.com',
  false, false, true, 'free', 65, 'web_scrape'
),
(
  'Alpine Health & Wellness',
  'alpine-health-wellness-kalispell',
  'Montana wellness clinic offering peptide therapy for weight loss, accelerated healing, and anti-aging alongside IV therapy, ketamine, NAD+, and functional wellness labs.',
  'clinics', 'Peptide Therapy',
  'Kalispell', 'kalispell', 'MT', 'US', 'local',
  '1825 US Highway 93 S, Suite A, Kalispell, MT 59901', '(406) 361-7421', 'myalpinehealth@gmail.com', 'https://www.myalpinehealth.com',
  false, false, true, 'free', 60, 'web_scrape'
),
(
  'Health Express Clinics',
  'health-express-clinics-lewisville',
  'Primary care practice offering CJC-1295/Ipamorelin, Sermorelin, and BPC-157 peptide therapy. Also serves Carrollton, Plano, and The Colony, TX.',
  'clinics', 'Peptide Therapy',
  'Lewisville', 'lewisville', 'TX', 'US', 'local',
  '860 Hebron Pkwy, Suite 501, Lewisville, TX 75057', '(469) 444-0955', NULL, 'https://healthexpressclinics.com',
  false, false, true, 'free', 65, 'web_scrape'
),
(
  'El Paso Men''s & Women''s Clinic',
  'el-paso-mens-womens-clinic',
  'Led by family medicine physician Dr. Leo Altenberg. Offers peptide therapy alongside hormone optimization and men''s and women''s health services.',
  'clinics', 'Hormone Therapy',
  'El Paso', 'el-paso', 'TX', 'US', 'local',
  '125 W Hague Rd, Suite 110, El Paso, TX 79902', '(915) 271-8400', NULL, 'https://www.elpasomensandwomensclinic.com',
  false, false, true, 'free', 70, 'web_scrape'
),
(
  'Dr. Toni Varela NMD',
  'dr-toni-varela-nmd-danville',
  'Naturopathic medical doctor in the San Francisco East Bay Area. Specializes in peptide therapy to restore biological resilience, using weekly injection protocols with monthly blood monitoring.',
  'clinics', 'Functional Medicine',
  'Danville', 'danville', 'CA', 'US', 'local',
  '939 Hartz Way, Suite 100, Danville, CA 94526', '(925) 786-0375', NULL, 'https://www.drtonivarela.com',
  false, false, true, 'free', 65, 'web_scrape'
),
(
  'Javan Anti-Aging and Wellness Institute',
  'javan-anti-aging-washington-dc',
  'Multi-location anti-aging institute in the DC metro area with locations at Dupont, U Street, and Arlington, VA. Medically supervised, lab-guided peptide therapy tailored to individual physiology.',
  'clinics', 'Longevity & Anti-Aging',
  'Washington', 'washington', 'DC', 'US', 'regional',
  '1626 U St NW, Washington, DC 20009', '(202) 868-5993', NULL, 'https://javanwellness.com',
  false, false, true, 'free', 70, 'web_scrape'
),
(
  'Richmond Anti-Aging Clinic',
  'richmond-anti-aging-clinic-richmond-bc',
  'Premier medical aesthetics and anti-aging clinic serving Greater Vancouver. Offers BPC-157 for muscle, tendon, and gut healing. Led by Dr. Charles Jiang. Also provides BHRT and NAD+ therapy.',
  'clinics', 'Longevity & Anti-Aging',
  'Richmond', 'richmond', 'BC', 'CA', 'local',
  'Unit 110, 5580 No. 3 Road, Richmond, BC V6X 0R8', '+1 (604) 277-9006', 'inquiry.raac@gmail.com', 'https://richmondantiaging.ca',
  false, false, true, 'free', 70, 'web_scrape'
),
(
  'MMC Wellness Center',
  'mmc-wellness-center-richmond-bc',
  'Canadian physician-supervised wellness clinic specializing in targeted peptide therapies for health and longevity. Initial consultation $200 CAD. Serves the Metro Vancouver area.',
  'clinics', 'Peptide Therapy',
  'Richmond', 'richmond', 'BC', 'CA', 'local',
  '130-8780 Blundell Rd, Richmond, BC V6Y 3Y8', '+1 (604) 277-9006', 'info@mmcwellness.ca', 'https://mmcwellness.ca',
  false, false, true, 'free', 65, 'web_scrape'
),

-- ─── COMPOUNDING PHARMACIES ───────────────────────────────────────────────────

(
  'Empower Pharmacy',
  'empower-pharmacy-houston',
  'The largest 503A compounding pharmacy and FDA-registered 503B outsourcing facility in the nation, serving functional medicine markets. Compounds sermorelin, NAD+, and a wide range of injectable peptides. PCAB-accredited.',
  'compounding_pharmacies', 'Sterile Compounding',
  'Houston', 'houston', 'TX', 'US', 'national',
  '7601 N Sam Houston Pkwy W, Suite 100, Houston, TX 77064', '(877) 562-8577', NULL, 'https://empowerpharmacy.com',
  false, false, true, 'free', 90, 'web_scrape'
),
(
  'Tailor Made Compounding',
  'tailor-made-compounding-nicholasville',
  '503A compounding pharmacy licensed in 46 states for sterile and non-sterile compounding. Equipped with a negative-pressure hazardous cleanroom per USP 800 guidelines. Conducts USP 71 sterility and USP 85 endotoxin testing.',
  'compounding_pharmacies', 'Sterile Compounding',
  'Nicholasville', 'nicholasville', 'KY', 'US', 'national',
  '200 Moore Dr, Nicholasville, KY 40356', '(859) 887-0013', NULL, 'https://tailormadecompounding.com',
  false, false, true, 'free', 85, 'web_scrape'
),
(
  'Strive Compounding Pharmacy',
  'strive-compounding-pharmacy-gilbert',
  'Multi-location national compounding pharmacy with locations in AZ, CA, TX, UT, VA, MO, and FL. Offers compounded sermorelin, NAD+, hormone replacement, and peptide therapies.',
  'compounding_pharmacies', 'Sterile Compounding',
  'Gilbert', 'gilbert', 'AZ', 'US', 'national',
  '1275 E Baseline Rd, Suite 104, Gilbert, AZ 85233', '(480) 626-4366', NULL, 'https://strivepharmacy.com',
  false, false, true, 'free', 80, 'web_scrape'
),
(
  'CRE8 Compounding Pharmacy',
  'cre8-compounding-pharmacy-coral-springs',
  'Specializes in compounding GHRPs, BHRT, sexual health, weight loss, hair regeneration, wound care, and aesthetics. Doctor-focused, prescription-based pharmacy serving patients and providers nationally.',
  'compounding_pharmacies', 'Sterile Compounding',
  'Coral Springs', 'coral-springs', 'FL', 'US', 'national',
  '3700 NW 126th Ave, Coral Springs, FL 33065', '(754) 529-8353', NULL, 'https://cre8pharmacy.com',
  false, false, true, 'free', 75, 'web_scrape'
),
(
  'CareFirst Specialty Pharmacy',
  'carefirst-specialty-pharmacy-mount-laurel',
  'PCAB and ACHC-accredited national compounding pharmacy. Compounds sermorelin in injectable and troche formulations. Partners with ARL Labs for independent testing. FDA-inspected.',
  'compounding_pharmacies', 'Sterile Compounding',
  'Mount Laurel', 'mount-laurel', 'NJ', 'US', 'national',
  '400 Fellowship Rd, Suite 100, Mount Laurel, NJ 08054', '(844) 822-7379', NULL, 'https://cfspharmacy.pharmacy',
  false, false, true, 'free', 80, 'web_scrape'
),
(
  'South Lake Pharmacy',
  'south-lake-pharmacy-zephyrhills',
  'Florida-based compounding pharmacy specializing in sterile and non-sterile peptide formulations. Ships nationally with a valid prescription. Custom formulations delivered across the United States.',
  'compounding_pharmacies', 'Sterile Compounding',
  'Zephyrhills', 'zephyrhills', 'FL', 'US', 'national',
  '38101 5th Ave, Zephyrhills, FL 33542', '(813) 395-5667', NULL, 'https://slcompounding.com',
  false, false, true, 'free', 70, 'web_scrape'
),
(
  'Illinois Compounding Pharmacy',
  'illinois-compounding-pharmacy-libertyville',
  'Full-service 503A and 503B compounding pharmacy offering peptide therapy, testosterone injections, weight loss medications, and pharmaceutical compounding. Ships nationally.',
  'compounding_pharmacies', '503B Outsourcing',
  'Libertyville', 'libertyville', 'IL', 'US', 'national',
  '1117 S Milwaukee Ave, Suite A2, Libertyville, IL 60048', '(847) 603-1034', NULL, 'https://illinoiscompoundingpharmacy.com',
  false, false, true, 'free', 70, 'web_scrape'
),
(
  'Carolina Compounding & Nutritional Pharmacy',
  'carolina-compounding-charlotte',
  'Founded in 2008. Custom-only compounding pharmacy with an on-site laboratory. Offers sterile and non-sterile compounding for pain management, hormone replacement therapy, peptide formulations, and veterinary.',
  'compounding_pharmacies', 'Non-Sterile Compounding',
  'Charlotte', 'charlotte', 'NC', 'US', 'regional',
  '7825 Ballantyne Commons Pkwy, Suite 230, Charlotte, NC 28277', '(704) 540-4330', NULL, 'https://ccnprx.com',
  false, false, true, 'free', 70, 'web_scrape'
),
(
  'Restorative Compounding Pharmacy',
  'restorative-compounding-pharmacy-waterford',
  'Michigan-based compounding pharmacy shipping nationally. Specializes in HRT, TRT, peptide therapy, dermatology, veterinary, and weight loss compounded medications.',
  'compounding_pharmacies', 'Sterile Compounding',
  'Waterford', 'waterford', 'MI', 'US', 'national',
  '4450 Dixie Hwy, Suite A, Waterford, MI 48329', '(248) 266-5276', NULL, 'https://restorativecompounding.com',
  false, false, true, 'free', 70, 'web_scrape'
),
(
  'Peptides Compounding Pharmacy',
  'peptides-compounding-pharmacy-charlotte',
  'Specialty pharmacy focused exclusively on prescription-based peptide compounding. Prepares sterile formulations meeting USP 797 standards. All formulations require a valid prescription from a licensed provider.',
  'compounding_pharmacies', 'Sterile Compounding',
  'Charlotte', 'charlotte', 'NC', 'US', 'national',
  '900 Pressley Rd, Charlotte, NC 28217', '(980) 448-7559', NULL, 'https://peptidescompoundingpharmacy.com',
  false, false, true, 'free', 70, 'web_scrape'
),

-- ─── RESEARCH LABS ────────────────────────────────────────────────────────────

(
  'MZ Biolabs',
  'mz-biolabs-tucson',
  'DEA Schedule III licensed analytical testing facility. Specializes in COA testing for peptides, SARMs, nootropics, vitamins, and research compounds using HPLC and mass spectrometry.',
  'research_labs', 'Third-Party Testing',
  'Tucson', 'tucson', 'AZ', 'US', 'national',
  '2102 N Country Club Rd, Suite C, Tucson, AZ 85716', '(520) 553-5489', NULL, 'https://mzbiolabs.com',
  false, false, true, 'free', 85, 'web_scrape'
),
(
  'Ethos Analytics',
  'ethos-analytics-phoenix',
  'ISO/IEC 17025 Accredited laboratory specializing in peptide purity and quantitation testing for research, pharmaceutical, and nutraceutical applications. Also tests supplements, food, and cosmetics.',
  'research_labs', 'Third-Party Testing',
  'Phoenix', 'phoenix', 'AZ', 'US', 'national',
  '3020 E Camelback Rd, Suite 397, Phoenix, AZ 85016', '(602) 203-4645', NULL, 'https://ethosanalytics.io',
  false, false, true, 'free', 80, 'web_scrape'
),
(
  'ACS Peptide Testing Labs',
  'acs-peptide-testing-labs-sun-city-center',
  'Professional third-party peptide analysis and verification lab. Provides ISO-certified COA testing, purity verification, and molecular identity confirmation for research peptides.',
  'research_labs', 'Third-Party Testing',
  'Sun City Center', 'sun-city-center', 'FL', 'US', 'national',
  '721 Cortaro Dr, Sun City Center, FL 33573', '(813) 616-5981', NULL, 'https://acslabtest.com',
  false, false, true, 'free', 75, 'web_scrape'
),
(
  'Finnrick Analytics',
  'finnrick-analytics-austin',
  'Independent testing and supply chain transparency organization for peptides and supplements. Has tested over 5,600 samples from 179+ vendors across 15 popular peptides. Publishes public test results and vendor ratings.',
  'research_labs', 'Third-Party Testing',
  'Austin', 'austin', 'TX', 'US', 'national',
  'Austin, TX', NULL, NULL, 'https://finnrick.com',
  false, false, true, 'free', 80, 'web_scrape'
),
(
  'PolyPeptide Laboratories San Diego',
  'polypeptide-laboratories-san-diego',
  'Global GMP peptide CDMO with a 45,000 sq ft San Diego facility supporting mid- to large-scale solid-phase peptide manufacturing. Maintains a GMP NeoAntigen Lab for immunotherapy. Multiple FDA inspections passed.',
  'research_labs', 'Peptide Research',
  'San Diego', 'san-diego', 'CA', 'US', 'national',
  '9395 Cabot Drive, San Diego, CA 92126', '+1 (858) 408-0808', NULL, 'https://polypeptide.com',
  false, false, true, 'free', 90, 'web_scrape'
),
(
  'AmbioPharm',
  'ambiopharm-north-augusta',
  'One of the world''s largest peptide CDMOs. FDA-inspected cGMP facility with 500+ chemists supporting pharmaceutical and biotech companies from development through commercial production. Five FDA inspections passed.',
  'research_labs', 'Clinical Trials',
  'North Augusta', 'north-augusta', 'SC', 'US', 'national',
  '1024 Dittman Court, North Augusta, SC 29842', '+1 (803) 442-7590', NULL, 'https://ambiopharm.com',
  false, false, true, 'free', 90, 'web_scrape'
),

-- ─── WHOLESALE SUPPLIERS ──────────────────────────────────────────────────────

(
  'rPeptide',
  'rpeptide-watkinsville',
  'US-based supplier of recombinant and synthetic peptides, proteins, and biochemicals for research. Offers bulk production on request, same-day shipping on in-stock items, and COA documentation.',
  'wholesale_suppliers', 'Raw Materials',
  'Watkinsville', 'watkinsville', 'GA', 'US', 'national',
  '1050 Barber Creek Blvd., Building 300, Suite 103, Watkinsville, GA 30677', '(678) 753-0747', 'sales@rpeptide.com', 'https://www.rpeptide.com',
  false, false, true, 'free', 75, 'web_scrape'
),
(
  'Evolve Peptides',
  'evolve-peptides-casper',
  'US-based wholesale and white-label peptide supplier with flexible, scalable supply solutions. Every batch is third-party tested with Certificates of Analysis. Offers private labeling and custom synthesis.',
  'wholesale_suppliers', 'Finished Products',
  'Casper', 'casper', 'WY', 'US', 'national',
  '5830 E 2nd St, Casper, WY 82609', NULL, 'wholesale@evolvepeptides.com', 'https://www.evolvepeptides.com',
  false, false, true, 'free', 65, 'web_scrape'
),
(
  'AAPPTec',
  'aapptec-louisville',
  'American peptide company manufacturing and supplying automated peptide synthesizers, laboratory equipment, Fmoc/Boc amino acids, coupling reagents, SPPS resins, and custom peptides from mg to kg scale.',
  'wholesale_suppliers', 'Equipment & Supplies',
  'Louisville', 'louisville', 'KY', 'US', 'national',
  '6309 Shepherdsville Road, Louisville, KY 40228', '+1 (502) 968-2223', 'info@aapptec.com', 'https://www.peptide.com',
  false, false, true, 'free', 80, 'web_scrape'
),
(
  'Bio Basic',
  'bio-basic-markham',
  'Canadian life science research supplier offering custom peptide synthesis, pharmaceutical peptides, cosmetic peptides, and raw biochemicals. Ships to the US and globally. Over 10 years in peptide services.',
  'wholesale_suppliers', 'Raw Materials',
  'Markham', 'markham', 'ON', 'CA', 'national',
  '20 Konrad Crescent, Markham, ON L3R 8T4', '+1 (905) 474-4493', NULL, 'https://www.biobasic.com',
  false, false, true, 'free', 75, 'web_scrape'
),
(
  'CanPeptide',
  'canpeptide-montreal',
  'Canadian specialist in custom synthetic peptide synthesis and analytical chemistry, serving academic and biopharmaceutical clients. Competitively priced peptides with quality assurance across North America.',
  'wholesale_suppliers', 'Raw Materials',
  'Pointe-Claire', 'pointe-claire', 'QC', 'CA', 'national',
  '265 Boul. Hymus, Suite 1500, Pointe-Claire, QC H9R 1G6', '(514) 697-2168', NULL, 'https://www.canpeptide.com',
  false, false, true, 'free', 75, 'web_scrape'
),
(
  'Biosynth',
  'biosynth-gardner',
  'Global life science company providing end-to-end peptide services from R&D to commercial supply, including custom synthesis, bulk raw materials, and catalog peptides. Serves diagnostic, pharma, and biotech sectors.',
  'wholesale_suppliers', 'Raw Materials',
  'Gardner', 'gardner', 'MA', 'US', 'national',
  '65 Zub Lane, Gardner, MA 01440', '+1 (978) 630-0020', NULL, 'https://www.biosynth.com',
  false, false, true, 'free', 80, 'web_scrape'
),

-- ─── MANUFACTURERS ────────────────────────────────────────────────────────────

(
  'Bachem Americas',
  'bachem-americas-torrance',
  'US subsidiary of Swiss-based Bachem Holding, a global leader in peptide chemistry. FDA-registered and GMP-compliant. Provides full-service CDMO capabilities from process development to large-scale commercial API production.',
  'manufacturers', 'GMP Manufacturing',
  'Torrance', 'torrance', 'CA', 'US', 'national',
  '3132 Kashiwa Street, Torrance, CA 90505', '+1 (888) 422-2436', NULL, 'https://www.bachem.com',
  false, false, true, 'free', 95, 'web_scrape'
),
(
  'AnaSpec',
  'anaspec-fremont',
  'Leading biotech CMO with 30+ years of peptide manufacturing experience. 44,000 sq ft facility in California''s Silicon Valley. Manufactures custom GMP peptides and dyes for diagnostics, biopharmaceuticals, and cosmetics.',
  'manufacturers', 'Contract Manufacturing',
  'Fremont', 'fremont', 'CA', 'US', 'national',
  '34801 Campus Drive, Fremont, CA 94555', '+1 (510) 791-9560', 'service@anaspec.com', 'https://www.anaspec.com',
  false, false, true, 'free', 85, 'web_scrape'
),
(
  'CPC Scientific',
  'cpc-scientific-rocklin',
  'CDMO specializing in large-scale, late-phase, and commercial GMP peptide and oligonucleotide manufacturing. Annual peptide API production capacity exceeds 1,000 kg. Serves clinical and commercial pharmaceutical clients.',
  'manufacturers', 'GMP Manufacturing',
  'Rocklin', 'rocklin', 'CA', 'US', 'national',
  '3880 Atherton Road, Rocklin, CA 95765', NULL, NULL, 'https://cpcscientific.com',
  false, false, true, 'free', 85, 'web_scrape'
),
(
  'CreoSalus',
  'creosalus-louisville',
  'Multi-division life sciences company offering full-service cGMP contract manufacturing of peptide drug substances (API) and sterile injectable drug products. Produces hundreds of API peptides monthly.',
  'manufacturers', 'GMP Manufacturing',
  'Louisville', 'louisville', 'KY', 'US', 'national',
  '1044 East Chestnut Street, Louisville, KY 40204', '(502) 515-1100', NULL, 'https://creosalus.com',
  false, false, true, 'free', 80, 'web_scrape'
)

ON CONFLICT (slug) DO NOTHING;
