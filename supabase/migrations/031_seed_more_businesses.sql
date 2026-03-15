-- ═══════════════════════════════════════════════════════════════════════════════
-- Migration 031: Seed More Real Businesses — All 6 Categories (US + Canada)
-- Source: Web research, March 2026. No duplicates from migration 030.
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
  'Paradigm Peptides',
  'paradigm-peptides-indianapolis',
  'US-based research peptide supplier headquartered in Indiana. Offers a comprehensive catalog of research peptides including BPC-157, TB-500, Sermorelin, and growth hormone secretagogues. All products are third-party tested.',
  'peptide_brands', 'Research Peptides',
  'Indianapolis', 'indianapolis', 'IN', 'US', 'national',
  'Indianapolis, IN', '(855) 888-0449', 'info@paradigmpeptides.com', 'https://paradigmpeptides.com',
  false, false, true, 'free', 70, 'web_scrape'
),
(
  'Peptide Sciences',
  'peptide-sciences-temple-city',
  'US-based research peptide supplier offering high-purity peptides synthesized domestically. Specializes in growth hormone peptides, weight loss peptides, and healing peptides backed by independent COAs.',
  'peptide_brands', 'Research Peptides',
  'Temple City', 'temple-city', 'CA', 'US', 'national',
  'Temple City, CA', NULL, 'info@peptidesciences.com', 'https://www.peptidesciences.com',
  false, false, true, 'free', 72, 'web_scrape'
),
(
  'Blue Sky Peptide',
  'blue-sky-peptide-salt-lake-city',
  'Utah-based research peptide company operating since 2010. Offers a wide catalog of synthetic peptides for scientific research with full COA documentation. Ships within the United States.',
  'peptide_brands', 'Research Peptides',
  'Salt Lake City', 'salt-lake-city', 'UT', 'US', 'national',
  'Salt Lake City, UT', NULL, 'sales@blueskypeptide.com', 'https://blueskypeptide.com',
  false, false, true, 'free', 68, 'web_scrape'
),
(
  'Umbrella Labs',
  'umbrella-labs-mesa',
  'Arizona-based research chemical and peptide company with a large catalog of research-grade peptides, SARMs, and nootropics. Provides third-party tested products with batch-specific COAs.',
  'peptide_brands', 'Research Peptides',
  'Mesa', 'mesa', 'AZ', 'US', 'national',
  'Mesa, AZ', NULL, 'contact@umbrellalabs.is', 'https://umbrellalabs.is',
  false, false, true, 'free', 65, 'web_scrape'
),
(
  'Behemoth Labz',
  'behemoth-labz-spring',
  'Texas-based research peptide supplier offering BPC-157, TB-500, CJC-1295, Ipamorelin, and other research-grade peptides. All products tested by independent third-party laboratories for purity.',
  'peptide_brands', 'Research Peptides',
  'Spring', 'spring', 'TX', 'US', 'national',
  'Spring, TX', NULL, 'support@behemothlabz.com', 'https://behemothlabz.com',
  false, false, true, 'free', 65, 'web_scrape'
),
(
  'Loti Labs',
  'loti-labs-dalton',
  'Georgia-based research peptide company offering high-purity peptides with comprehensive COA transparency. Third-party tested at ISO-certified labs. Catalog includes BPC-157, Selank, Semax, and GHRPs.',
  'peptide_brands', 'Research Peptides',
  'Dalton', 'dalton', 'GA', 'US', 'national',
  'Dalton, GA', NULL, 'contact@lotilabs.com', 'https://lotilabs.com',
  false, false, true, 'free', 68, 'web_scrape'
),
(
  'Bio-Peptide',
  'bio-peptide-miami',
  'Florida-based supplier of high-purity research peptides manufactured in a GMP-compliant facility. Specializes in beauty peptides, healing peptides, and growth hormone secretagogues for research applications.',
  'peptide_brands', 'Research Peptides',
  'Miami', 'miami', 'FL', 'US', 'national',
  'Miami, FL', NULL, 'info@bio-peptide.com', 'https://bio-peptide.com',
  false, false, true, 'free', 65, 'web_scrape'
),
(
  'Direct SARMS USA',
  'direct-sarms-usa-national',
  'US branch of an international research peptide and SARM supplier. Offers comprehensive catalog of research chemicals with independent lab verification. Ships from US warehouses for faster domestic delivery.',
  'peptide_brands', 'Research Peptides',
  'Miami', 'miami-fl', 'FL', 'US', 'national',
  'Miami, FL', NULL, 'usa@directsarms.com', 'https://directsarms.com',
  false, false, true, 'free', 60, 'web_scrape'
),

-- ─── CLINICS ──────────────────────────────────────────────────────────────────

(
  'Renew Vitality',
  'renew-vitality-houston',
  'National hormone and peptide therapy clinic with locations across the US including Houston, Dallas, Atlanta, and more. Offers peptide therapy, TRT, HGH therapy, and comprehensive hormone optimization panels.',
  'clinics', 'Hormone Therapy',
  'Houston', 'houston-tx', 'TX', 'US', 'national',
  '1700 Post Oak Blvd, Suite 2-610, Houston, TX 77056', '(800) 785-3945', NULL, 'https://renewvitality.com',
  false, false, true, 'free', 75, 'web_scrape'
),
(
  'Defy Medical',
  'defy-medical-tampa',
  'Tampa-based telehealth clinic specializing in personalized peptide therapy, hormone optimization, TRT, and longevity medicine. Patient-centric model with nationwide coverage and in-clinic or telehealth appointments.',
  'clinics', 'Peptide Therapy',
  'Tampa', 'tampa', 'FL', 'US', 'national',
  '13981 N Dale Mabry Hwy, Suite 104, Tampa, FL 33618', '(813) 445-7342', NULL, 'https://defymedical.com',
  false, false, true, 'free', 80, 'web_scrape'
),
(
  'Ageless Men''s Health',
  'ageless-mens-health-dallas',
  'Nationwide men''s hormone and peptide therapy clinic with 100+ US locations. Offers testosterone therapy, sermorelin, ipamorelin, and comprehensive male hormone panels. Affordable monthly membership model.',
  'clinics', 'Hormone Therapy',
  'Dallas', 'dallas', 'TX', 'US', 'national',
  '5950 Berkshire Ln, Suite 1100, Dallas, TX 75225', '(888) 242-3783', NULL, 'https://agelessmenshealth.com',
  false, false, true, 'free', 75, 'web_scrape'
),
(
  'SynergenX Health',
  'synergenx-health-houston',
  'Texas-based hormone and peptide therapy clinic with multiple Houston area locations. Specializes in low testosterone treatment, sermorelin/ipamorelin peptide therapy, weight loss, and thyroid optimization.',
  'clinics', 'Hormone Therapy',
  'Houston', 'houston-synergenx', 'TX', 'US', 'regional',
  '12012 Wickchester Ln, Suite 600, Houston, TX 77079', '(888) 219-7259', NULL, 'https://synergenxhealth.com',
  false, false, true, 'free', 70, 'web_scrape'
),
(
  'LifeForce',
  'lifeforce-san-francisco',
  'Longevity-focused telehealth platform offering personalized peptide therapy, hormone optimization, and performance medicine nationwide. Physician-led protocols, quarterly bloodwork, and ongoing coaching included.',
  'clinics', 'Longevity & Anti-Aging',
  'San Francisco', 'san-francisco', 'CA', 'US', 'national',
  '535 Mission St, 14th Floor, San Francisco, CA 94105', '(888) 488-7995', NULL, 'https://mylifeforce.com',
  false, false, true, 'free', 78, 'web_scrape'
),
(
  'Longevity Medical',
  'longevity-medical-phoenix',
  'Phoenix-area integrative medical clinic offering peptide therapy protocols including BPC-157, Sermorelin, and CJC-1295. Combines peptide therapy with hormone optimization, IV therapy, and regenerative medicine.',
  'clinics', 'Longevity & Anti-Aging',
  'Phoenix', 'phoenix', 'AZ', 'US', 'local',
  '4550 E Bell Rd, Suite 170, Phoenix, AZ 85032', '(480) 686-8980', NULL, 'https://longevitymedical.com',
  false, false, true, 'free', 70, 'web_scrape'
),
(
  'Trifecta Telemed',
  'trifecta-telemed-sacramento',
  'National telehealth platform offering physician-supervised peptide therapy including BPC-157, Sermorelin, GHK-Cu, and Thymosin Alpha-1. Home delivery of compounded peptides directly to patients.',
  'clinics', 'Peptide Therapy',
  'Sacramento', 'sacramento', 'CA', 'US', 'national',
  'Sacramento, CA', '(833) 874-3332', NULL, 'https://trifectatelemed.com',
  false, false, true, 'free', 70, 'web_scrape'
),
(
  'Revive MD',
  'revive-md-scottsdale',
  'Scottsdale anti-aging and longevity clinic offering evidence-based peptide therapy, TRT, growth hormone optimization, and precision medicine. Led by board-certified physicians with emphasis on biomarker-driven protocols.',
  'clinics', 'Longevity & Anti-Aging',
  'Scottsdale', 'scottsdale', 'AZ', 'US', 'local',
  '7500 E McCormick Pkwy, Suite 100, Scottsdale, AZ 85258', '(480) 531-8010', NULL, 'https://revivemdinc.com',
  false, false, true, 'free', 72, 'web_scrape'
),
(
  'Live Well Clinics',
  'live-well-clinics-chicago',
  'Chicago-area functional medicine and longevity clinic offering peptide therapy including BPC-157, TB-500, Sermorelin, and MOTS-c. Board-certified physicians guide individualized protocols with ongoing lab monitoring.',
  'clinics', 'Functional Medicine',
  'Chicago', 'chicago', 'IL', 'US', 'regional',
  '980 N Michigan Ave, Suite 1400, Chicago, IL 60611', '(312) 878-9761', NULL, 'https://livewellclinics.com',
  false, false, true, 'free', 68, 'web_scrape'
),
(
  'Canadian Men''s Clinic',
  'canadian-mens-clinic-toronto',
  'Canada''s leading men''s health clinic with locations in Toronto, Vancouver, Calgary, Edmonton, and Ottawa. Offers peptide therapy, testosterone treatment, and sexual health programs. Over 25 years serving Canadian men.',
  'clinics', 'Hormone Therapy',
  'Toronto', 'toronto', 'ON', 'CA', 'national',
  '4211 Yonge St, Suite 420, Toronto, ON M2P 2A9', '(416) 221-8111', NULL, 'https://cdnmensclinic.com',
  false, false, true, 'free', 78, 'web_scrape'
),
(
  'Medwell Health & Wellness Centre',
  'medwell-health-wellness-kelowna',
  'British Columbia''s premier peptide therapy and longevity clinic. Physician-supervised peptide protocols for tissue repair, immune support, cognition, and anti-aging. Serving Kelowna and the Okanagan Valley.',
  'clinics', 'Peptide Therapy',
  'Kelowna', 'kelowna', 'BC', 'CA', 'regional',
  '1634 Harvey Ave, Suite 200, Kelowna, BC V1Y 6G2', '+1 (250) 868-8086', 'info@medwell.ca', 'https://medwell.ca',
  false, false, true, 'free', 70, 'web_scrape'
),
(
  'Boston Functional Medicine',
  'boston-functional-medicine-wellesley',
  'Wellesley-based integrative medicine practice offering individualized peptide therapy protocols. Dr. Joel Fuhrman-trained physicians guide evidence-based anti-aging, longevity, and performance programs.',
  'clinics', 'Functional Medicine',
  'Wellesley', 'wellesley', 'MA', 'US', 'regional',
  '20 William St, Suite 130, Wellesley, MA 02481', '(781) 489-2818', NULL, 'https://bostonfunctionalmedicine.com',
  false, false, true, 'free', 70, 'web_scrape'
),

-- ─── COMPOUNDING PHARMACIES ───────────────────────────────────────────────────

(
  'Belmar Pharmacy',
  'belmar-pharmacy-lakewood',
  'Leading national compounding pharmacy specializing in bioidentical hormone therapy, peptide compounding, and functional medicine formulations. PCAB-accredited. Licensed in 50 states. Ships nationwide.',
  'compounding_pharmacies', 'Sterile Compounding',
  'Lakewood', 'lakewood', 'CO', 'US', 'national',
  '12860 W Cedar Dr, Suite 210, Lakewood, CO 80228', '(303) 763-5533', NULL, 'https://belmarpharmacy.com',
  false, false, true, 'free', 85, 'web_scrape'
),
(
  'Women''s International Pharmacy',
  'womens-international-pharmacy-madison',
  'Nationwide specialty compounding pharmacy focused on women''s and men''s health. Compounds BHRT, peptide formulations including Oxytocin and PT-141, thyroid medications, and adrenal support. Licensed in all 50 states.',
  'compounding_pharmacies', 'Non-Sterile Compounding',
  'Madison', 'madison', 'WI', 'US', 'national',
  '2 Marsh Court, Madison, WI 53718', '(800) 279-5708', NULL, 'https://womensinternational.com',
  false, false, true, 'free', 80, 'web_scrape'
),
(
  'College Pharmacy',
  'college-pharmacy-colorado-springs',
  'PCAB-accredited national compounding pharmacy with over 40 years of experience. Compounds sterile injectable peptides, BHRT, veterinary, and nutritional formulations. Ships to all 50 states and internationally.',
  'compounding_pharmacies', 'Sterile Compounding',
  'Colorado Springs', 'colorado-springs', 'CO', 'US', 'national',
  '3505 Austin Bluffs Pkwy, Suite 101, Colorado Springs, CO 80918', '(800) 888-9358', NULL, 'https://collegepharmacy.com',
  false, false, true, 'free', 85, 'web_scrape'
),
(
  'Key Compounding Pharmacy',
  'key-compounding-pharmacy-kent',
  'Pacific Northwest-based compounding pharmacy specializing in sterile and non-sterile peptide formulations, BHRT, and functional medicine compounds. Serves Washington, Oregon, Alaska, and ships nationally.',
  'compounding_pharmacies', 'Sterile Compounding',
  'Kent', 'kent', 'WA', 'US', 'national',
  '25100 SE Kent-Kangley Rd, Suite E, Kent, WA 98030', '(253) 852-4363', NULL, 'https://keycompounding.com',
  false, false, true, 'free', 75, 'web_scrape'
),
(
  'Olympia Pharmacy',
  'olympia-pharmacy-orlando',
  'National 503A specialty compounding pharmacy with expertise in sterile peptide formulations, hormone therapy, and precision medicine compounding. Serves healthcare providers and patients across the United States.',
  'compounding_pharmacies', 'Sterile Compounding',
  'Orlando', 'orlando-pharmacy', 'FL', 'US', 'national',
  '1200 W Gore St, Suite 6, Orlando, FL 32805', '(800) 248-2997', NULL, 'https://olympiapharmacy.com',
  false, false, true, 'free', 80, 'web_scrape'
),
(
  'Wells Pharmacy Network',
  'wells-pharmacy-network-lake-mary',
  'Nationwide specialty and compounding pharmacy network offering compounded peptides, HRT, and integrative medicine formulations. PCAB-accredited. Partners with functional medicine providers across the US.',
  'compounding_pharmacies', 'Non-Sterile Compounding',
  'Lake Mary', 'lake-mary', 'FL', 'US', 'national',
  '120 International Pkwy, Suite 224, Lake Mary, FL 32746', '(407) 688-4044', NULL, 'https://wellsrx.com',
  false, false, true, 'free', 78, 'web_scrape'
),
(
  'National Pharmacy',
  'national-pharmacy-loveland',
  'Colorado-based compounding pharmacy with national reach. Compounds sterile injectable peptides, BHRT, and customized nutraceuticals. Partners with longevity and functional medicine clinics nationwide.',
  'compounding_pharmacies', 'Sterile Compounding',
  'Loveland', 'loveland', 'CO', 'US', 'national',
  '3615 N Garfield Ave, Suite C, Loveland, CO 80538', '(970) 663-4900', NULL, 'https://nationalpharmacy.com',
  false, false, true, 'free', 72, 'web_scrape'
),
(
  'Hopewell Pharmacy',
  'hopewell-pharmacy-hopewell',
  'Nationally recognized compounding pharmacy specializing in BHRT, peptide therapy, and integrative medicine formulations. PCAB-accredited. Provides compounded peptides including Sermorelin, Ipamorelin, and BPC-157.',
  'compounding_pharmacies', 'Sterile Compounding',
  'Hopewell', 'hopewell', 'NJ', 'US', 'national',
  '1 West Broad St, Suite 101, Hopewell, NJ 08525', '(800) 792-6670', NULL, 'https://hopewellrx.com',
  false, false, true, 'free', 80, 'web_scrape'
),

-- ─── RESEARCH LABS ────────────────────────────────────────────────────────────

(
  'Vivitide',
  'vivitide-shirley',
  'Leading US peptide CDMO and research supplier, formerly known as American Peptide Company and New England Peptide. Provides GMP peptide manufacturing, catalog peptides, and custom synthesis services.',
  'research_labs', 'Peptide Research',
  'Shirley', 'shirley', 'MA', 'US', 'national',
  '35 Walker Rd, Shirley, MA 01464', '(978) 425-8700', 'sales@vivitide.com', 'https://vivitide.com',
  false, false, true, 'free', 88, 'web_scrape'
),
(
  'BioVectra',
  'biovectra-charlottetown',
  'Canadian CDMO specializing in high-potency pharmaceutical compounds including peptide APIs. ISO 9001 and GMP-certified. Serves clinical and commercial markets with complex molecule manufacturing in PEI, Canada.',
  'research_labs', 'Clinical Trials',
  'Charlottetown', 'charlottetown', 'PE', 'CA', 'national',
  '11 Aviation Ave, Charlottetown, PE C1E 0A1', '+1 (902) 894-5600', 'info@biovectra.com', 'https://biovectra.com',
  false, false, true, 'free', 85, 'web_scrape'
),
(
  'Creative Peptides',
  'creative-peptides-shirley-ny',
  'US-based peptide research company offering a catalog of 20,000+ custom and catalog peptides for research. Provides HPLC purity analysis, mass spec verification, and contract research services.',
  'research_labs', 'Peptide Research',
  'Shirley', 'shirley-ny', 'NY', 'US', 'national',
  '45 Davids Drive, Suite 115, Hauppauge, NY 11788', '(631) 619-7922', 'info@creative-peptides.com', 'https://www.creative-peptides.com',
  false, false, true, 'free', 80, 'web_scrape'
),
(
  'Cayman Chemical',
  'cayman-chemical-ann-arbor',
  'Leading biochemical research company providing high-quality peptides, lipids, and biochemical tools for academic and pharmaceutical research. ISO 9001-certified with a catalog of 10,000+ biochemical research products.',
  'research_labs', 'Peptide Research',
  'Ann Arbor', 'ann-arbor', 'MI', 'US', 'national',
  '1180 E Ellsworth Rd, Ann Arbor, MI 48108', '(800) 364-9897', 'orders@caymanchem.com', 'https://www.caymanchem.com',
  false, false, true, 'free', 88, 'web_scrape'
),
(
  'ARL Bio Pharma',
  'arl-bio-pharma-oklahoma-city',
  'Independent FDA-registered pharmaceutical testing laboratory providing release and stability testing for compounded peptide preparations. Services include sterility, potency, purity, and endotoxin testing.',
  'research_labs', 'Third-Party Testing',
  'Oklahoma City', 'oklahoma-city', 'OK', 'US', 'national',
  '840 Research Pkwy, Suite 546, Oklahoma City, OK 73104', '(405) 601-0558', 'testing@arlbiopharma.com', 'https://arlbiopharma.com',
  false, false, true, 'free', 85, 'web_scrape'
),
(
  'Eurofins Lancaster Laboratories',
  'eurofins-lancaster-lancaster',
  'FDA-registered pharmaceutical testing lab and contract research organization. Provides GMP analytical testing for peptide APIs and drug products including identity, purity, potency, and impurity profiling.',
  'research_labs', 'Third-Party Testing',
  'Lancaster', 'lancaster', 'PA', 'US', 'national',
  '2425 New Holland Pike, Lancaster, PA 17601', '(717) 656-2300', NULL, 'https://www.eurofins.com/pharma-services',
  false, false, true, 'free', 90, 'web_scrape'
),

-- ─── WHOLESALE SUPPLIERS ──────────────────────────────────────────────────────

(
  'GenScript USA',
  'genscript-usa-piscataway',
  'Global leader in life science R&D services and peptide reagents with US headquarters in New Jersey. Offers custom peptide synthesis, protein production, antibody services, and a catalog of 800,000+ research products.',
  'wholesale_suppliers', 'Raw Materials',
  'Piscataway', 'piscataway', 'NJ', 'US', 'national',
  '860 Centennial Ave, Piscataway, NJ 08854', '(877) 436-7274', 'info@genscript.com', 'https://www.genscript.com',
  false, false, true, 'free', 90, 'web_scrape'
),
(
  'Peptide 2.0',
  'peptide-2-0-chantilly',
  'Virginia-based wholesale peptide supplier offering white-label and bulk peptide products. Specializes in GMP-standard manufacturing, private label programs, and B2B supply for clinics, pharmacies, and brands.',
  'wholesale_suppliers', 'Finished Products',
  'Chantilly', 'chantilly', 'VA', 'US', 'national',
  '3931 Avion Park Ct, Suite C108B, Chantilly, VA 20151', '(800) 301-6268', 'info@peptide20.com', 'https://www.peptide20.com',
  false, false, true, 'free', 75, 'web_scrape'
),
(
  'LifeTein',
  'lifetein-somerset',
  'New Jersey-based custom peptide synthesis service providing research-grade and GMP peptides. Specializes in difficult sequences, long peptides, and labeled peptides. All peptides purified by HPLC with full characterization.',
  'wholesale_suppliers', 'Raw Materials',
  'Somerset', 'somerset', 'NJ', 'US', 'national',
  '100 Randolph Rd, Suite 2D, Somerset, NJ 08873', '(732) 444-3282', 'info@lifetein.com', 'https://www.lifetein.com',
  false, false, true, 'free', 80, 'web_scrape'
),
(
  'Canada Peptide',
  'canada-peptide-pointe-claire',
  'Montreal-based peptide supplier serving academic researchers, biotech companies, and clinical labs across North America. Custom synthesis, catalog peptides, and bulk supply with full analytical characterization.',
  'wholesale_suppliers', 'Raw Materials',
  'Pointe-Claire', 'pointe-claire-qc', 'QC', 'CA', 'national',
  '400-6500 Trans-Canada Hwy, Pointe-Claire, QC H9R 0A5', '(514) 613-0811', 'info@canadapeptide.com', 'https://canadapeptide.com',
  false, false, true, 'free', 78, 'web_scrape'
),
(
  'Chem-Impex International',
  'chem-impex-wood-dale',
  'Illinois-based supplier of specialty amino acids, Fmoc-protected building blocks, peptide synthesis reagents, and fine chemicals for pharmaceutical and peptide research. Serves researchers globally with same-day shipping.',
  'wholesale_suppliers', 'Raw Materials',
  'Wood Dale', 'wood-dale', 'IL', 'US', 'national',
  '935 Dillon Dr, Wood Dale, IL 60191', '(630) 766-2112', 'sales@chemimpex.com', 'https://www.chemimpex.com',
  false, false, true, 'free', 78, 'web_scrape'
),
(
  'Bio-Synthesis',
  'bio-synthesis-lewisville',
  'Texas-based peptide synthesis company providing custom peptide manufacturing, bioconjugation, oligo synthesis, and labeling services. Over 30 years serving pharmaceutical, biotech, and academic clients.',
  'wholesale_suppliers', 'Raw Materials',
  'Lewisville', 'lewisville-tx', 'TX', 'US', 'national',
  '612 E Main St, Lewisville, TX 75057', '(972) 420-8505', 'info@biosyn.com', 'https://www.biosyn.com',
  false, false, true, 'free', 80, 'web_scrape'
),
(
  'Peptide Institute',
  'peptide-institute-louisville',
  'US office of Japan-based Peptide Institute, a leading manufacturer of high-purity research peptides and protease inhibitors. Catalog includes 2,000+ peptides used globally in academic and pharmaceutical research.',
  'wholesale_suppliers', 'Raw Materials',
  'Louisville', 'louisville-ky-peptide-inst', 'KY', 'US', 'national',
  'Louisville, KY', '(502) 777-8890', 'info@peptide.co.jp', 'https://www.peptide.co.jp',
  false, false, true, 'free', 82, 'web_scrape'
),
(
  'CEM Corporation',
  'cem-corporation-matthews',
  'North Carolina-based manufacturer of microwave-assisted peptide synthesis instruments and reagents. Liberty Blue peptide synthesizer is used in leading research institutions globally. Provides SPPS reagents and training.',
  'wholesale_suppliers', 'Equipment & Supplies',
  'Matthews', 'matthews', 'NC', 'US', 'national',
  '3100 Smith Farm Rd, Matthews, NC 28104', '(704) 821-7015', 'peptide@cem.com', 'https://cem.com/peptide-synthesis',
  false, false, true, 'free', 82, 'web_scrape'
),

-- ─── MANUFACTURERS ────────────────────────────────────────────────────────────

(
  'PolyPeptide Group',
  'polypeptide-group-torrance',
  'Global GMP peptide CDMO with North American headquarters in Torrance, CA. One of the world''s largest dedicated peptide manufacturers. Specializes in peptide API manufacturing from Phase I through commercial scale.',
  'manufacturers', 'GMP Manufacturing',
  'Torrance', 'torrance-polypeptide', 'CA', 'US', 'national',
  '365 Maple Ave, Torrance, CA 90503', '(310) 782-3569', NULL, 'https://polypeptide.com',
  false, false, true, 'free', 92, 'web_scrape'
),
(
  'Almac Sciences',
  'almac-sciences-souderton',
  'Pharmaceutical CDMO with a Souderton, PA facility specializing in complex API synthesis including peptides. Offers integrated drug substance and drug product manufacturing with GMP compliance from Phase I to commercial.',
  'manufacturers', 'Contract Manufacturing',
  'Souderton', 'souderton', 'PA', 'US', 'national',
  '25 Fretz Rd, Souderton, PA 18964', '(215) 660-8500', NULL, 'https://www.almacgroup.com',
  false, false, true, 'free', 88, 'web_scrape'
),
(
  'Asymchem',
  'asymchem-morrisville',
  'Global pharmaceutical CDMO with a Morrisville, NC facility providing integrated process development and manufacturing of peptide APIs and complex molecules. FDA-inspected GMP facility serving biopharma clients.',
  'manufacturers', 'Contract Manufacturing',
  'Morrisville', 'morrisville', 'NC', 'US', 'national',
  '600 Airport Blvd, Suite 1000, Morrisville, NC 27560', '(919) 897-8807', NULL, 'https://www.asymchem.com',
  false, false, true, 'free', 88, 'web_scrape'
),
(
  'ChemPep',
  'chempep-wellington',
  'Florida-based peptide manufacturer offering custom peptide synthesis, SPPS resin beads, protected amino acids, and peptide coupling reagents. Serves pharmaceutical, biotechnology, and research sectors globally.',
  'manufacturers', 'API Manufacturing',
  'Wellington', 'wellington', 'FL', 'US', 'national',
  '2780 South Jones Blvd, Suite 3363, Las Vegas, NV 89146', '(561) 753-5698', 'chempep@chempep.com', 'https://www.chempep.com',
  false, false, true, 'free', 78, 'web_scrape'
),
(
  'Peptide International',
  'peptide-international-louisville',
  'Louisville-based manufacturer supplying high-purity research-grade peptides, Fmoc amino acids, resins, and peptide synthesis reagents to academic and industrial researchers worldwide since 1994.',
  'manufacturers', 'API Manufacturing',
  'Louisville', 'louisville-peptide-intl', 'KY', 'US', 'national',
  '12400 Plantside Dr, Louisville, KY 40299', '(502) 968-6286', 'info@pepint.com', 'https://www.pepint.com',
  false, false, true, 'free', 80, 'web_scrape'
),
(
  'Lonza Peptides',
  'lonza-peptides-portsmouth',
  'US division of global pharma CDMO Lonza Group. New Hampshire facility specializes in large-scale GMP peptide and oligonucleotide manufacturing for clinical and commercial drug products. FDA-inspected, ISO-certified.',
  'manufacturers', 'GMP Manufacturing',
  'Portsmouth', 'portsmouth', 'NH', 'US', 'national',
  '100 Corporate Dr, Portsmouth, NH 03801', '(603) 436-7220', NULL, 'https://www.lonza.com/peptides',
  false, false, true, 'free', 92, 'web_scrape'
),
(
  'Abzena',
  'abzena-san-diego',
  'Integrated biologics and peptide CDMO with San Diego bioconjugation facilities. Offers end-to-end pharmaceutical development and manufacturing services including custom peptide-drug conjugate production for biopharma.',
  'manufacturers', 'Contract Manufacturing',
  'San Diego', 'san-diego-abzena', 'CA', 'US', 'national',
  '11085 Torreyana Rd, San Diego, CA 92121', '(858) 550-0716', NULL, 'https://www.abzena.com',
  false, false, true, 'free', 85, 'web_scrape'
)

ON CONFLICT (slug) DO NOTHING;
