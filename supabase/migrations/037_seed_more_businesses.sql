-- ═══════════════════════════════════════════════════════════════════════════════
-- Migration 037: Seed Clinics & Peptide Brands — Verified from Research Agents
-- Source: Web research agents, March 2026. No duplicates from 030–036.
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
  false, false, true, 'free', 78, 'web_scrape'
),
(
  'Pure Health Peptides',
  'pure-health-peptides-fallbrook',
  'California-based LLC selling US-made, third-party tested research peptides including BPC-157/TB-500 blends. Every batch is verified with Certificates of Analysis readily available on their site.',
  'peptide_brands', 'Research Peptides',
  'Fallbrook', 'fallbrook', 'CA', 'US', 'national',
  '376 Charles Swisher Court, Fallbrook, CA 92028', NULL, 'info@purehealthpeptides.com', 'https://purehealthpeptides.com',
  false, false, true, 'free', 72, 'web_scrape'
),
(
  'Peptide Warehouse Canada',
  'peptide-warehouse-canada-mississauga',
  'Mississauga-based Canadian peptide supplier offering research-grade peptides with fast domestic shipping across all provinces. Provides 24/7 customer support and ships to the US as well.',
  'peptide_brands', 'Research Peptides',
  'Mississauga', 'mississauga', 'ON', 'CA', 'national',
  '1089 Britannia Rd E, Unit 110, Mississauga, ON L4W 3X1', '416-254-9562', 'info@peptidewarehouse.ca', 'https://peptidewarehouse.ca',
  false, false, true, 'free', 75, 'web_scrape'
),
(
  'Umbrella Labs',
  'umbrella-labs-tucson',
  'Research-focused supplier of SARMs, nootropics, peptides, and research chemicals based in Tucson, AZ. Strong commitment to third-party testing and purity verification with full COA documentation.',
  'peptide_brands', 'Research Peptides',
  'Tucson', 'tucson', 'AZ', 'US', 'national',
  '3280 E Hemisphere Loop, Suite 190, Tucson, AZ 85706', '(866) 289-7276', 'support@umbrella-labs.us', 'https://umbrellalabs.is',
  false, false, true, 'free', 78, 'web_scrape'
),
(
  'Blue Sky Peptide',
  'blue-sky-peptide-lake-park',
  'Catalog research peptide supplier in Palm Beach, FL offering a wide range of research peptides for scientific applications. Known for competitive pricing and reliable quality control.',
  'peptide_brands', 'Research Peptides',
  'Lake Park', 'lake-park', 'FL', 'US', 'national',
  '1250 Old Dixie Hwy, Unit 6, Lake Park, FL 33403', '(561) 318-5010', 'sales@blueskypeptide.com', 'https://www.blueskypeptide.com',
  false, false, true, 'free', 75, 'web_scrape'
),
(
  'Regen Peptide Solutions',
  'regen-peptide-solutions-colorado-springs',
  'Colorado Springs-based supplier providing high-purity research peptides including GHK-Cu, BPC-157, and TB-500 with minimum 99% purity standards and third-party verified COAs.',
  'peptide_brands', 'Research Peptides',
  'Colorado Springs', 'colorado-springs', 'CO', 'US', 'national',
  '3609 Austin Bluffs Pkwy, Suite 31-1289, Colorado Springs, CO 80918', NULL, NULL, 'https://www.regenpeptidesolutions.com',
  false, false, true, 'free', 70, 'web_scrape'
),
(
  'Amino Asylum',
  'amino-asylum-usa',
  'US-based research compound supplier offering peptides, SARMs, and pro-hormones with a focus on high purity. Ships from multiple warehouse locations in TX and DE.',
  'peptide_brands', 'Research Peptides',
  'Online', 'amino-asylum-online', 'TX', 'US', 'national',
  NULL, NULL, 'sales@aminoasylumllc.com', 'https://aminoasylumllc.com',
  false, false, true, 'free', 68, 'web_scrape'
),
(
  'Swiss Chems',
  'swiss-chems-new-york',
  'Peptide and SARMs research chemical supplier offering 24/7 customer support and a wide catalog of research compounds. Headquartered in New York with international availability.',
  'peptide_brands', 'Research Peptides',
  'New York', 'new-york-swiss-chems', 'NY', 'US', 'national',
  '42 Broadway, FL 12th, New York, NY 10004', '+1 (870) 533-5581', 'support@swisschems.is', 'https://swisschems.is',
  false, false, true, 'free', 70, 'web_scrape'
),
(
  'Peptide Pros',
  'peptide-pros-miami-beach',
  'USA peptide supplier operating since 2013, offering high-quality peptides and research chemicals. Based in Miami Beach, FL with a wide catalog and strong customer service track record.',
  'peptide_brands', 'Research Peptides',
  'Miami Beach', 'miami-beach-peptide-pros', 'FL', 'US', 'national',
  '1602 Alton Rd, Suite 371, Miami Beach, FL 33139', '(888) 995-1591', 'info@peptidepros.com', 'https://peptidepros.net',
  false, false, true, 'free', 72, 'web_scrape'
),
(
  'AAPPTec',
  'aapptec-louisville',
  'American peptide synthesis company in Louisville, KY providing custom peptides from milligram to kilogram quantities. Also manufactures peptide synthesizers and laboratory equipment for research institutions.',
  'peptide_brands', 'Custom Synthesis',
  'Louisville', 'louisville', 'KY', 'US', 'national',
  '6309 Shepherdsville Road, Louisville, KY 40228', '+1 (502) 968-2223', 'sales@aapptec.com', 'https://www.peptide.com',
  false, false, true, 'free', 82, 'web_scrape'
),

-- ─── CLINICS ──────────────────────────────────────────────────────────────────

-- New York
(
  'Michael Aziz MD',
  'michael-aziz-md-new-york',
  'Board-certified internal medicine physician and anti-aging specialist in Manhattan offering a wide range of FDA-approved and research peptides including Cerebrolysin, BPC-157, and growth hormone peptides.',
  'clinics', 'Longevity / Functional Medicine',
  'New York', 'new-york-michael-aziz', 'NY', 'US', 'local',
  '515 Madison Ave, Suite 602, New York, NY 10022', '(212) 906-9111', NULL, 'https://www.michaelazizmd.com',
  false, false, true, 'free', 80, 'web_scrape'
),
(
  'Manhattan Medical Arts',
  'manhattan-medical-arts-new-york',
  'Primary care and anti-aging practice in Manhattan offering personalized peptide therapy with FDA-approved peptides prescribed by board-certified physicians for weight loss, energy, and anti-aging goals.',
  'clinics', 'Peptide Therapy',
  'New York', 'new-york-manhattan-medical', 'NY', 'US', 'local',
  '492 6th Avenue, Manhattan, NY 10011', '(646) 454-9000', NULL, 'https://manhattanmedicalarts.com',
  false, false, true, 'free', 78, 'web_scrape'
),
(
  'Abundant Health MD',
  'abundant-health-md-new-york',
  'Integrative medicine practice in Manhattan led by Dr. Nidia Carrero, specializing in peptide therapy, IV vitamin therapy, bio-identical hormones, and regenerative medicine for chronic conditions.',
  'clinics', 'Functional Medicine',
  'New York', 'new-york-abundant-health', 'NY', 'US', 'local',
  '545 Madison Ave, Suite 1205, New York, NY 10022', '(212) 988-0406', NULL, 'https://www.abundanthealthmd.com',
  false, false, true, 'free', 75, 'web_scrape'
),

-- Los Angeles / Beverly Hills
(
  'Angel Longevity Medical Center',
  'angel-longevity-studio-city',
  'Functional medicine and longevity center in Studio City, CA offering peptide therapy, IV therapy, hormone replacement, and exosome therapy. Focuses on optimizing health and extending longevity.',
  'clinics', 'Longevity / Functional Medicine',
  'Studio City', 'studio-city', 'CA', 'US', 'local',
  '12840 Riverside Dr, Suite 402, Studio City, CA 91607', '(818) 961-2055', 'info@angelmedcenter.com', 'https://www.angellongevity.com',
  false, false, true, 'free', 78, 'web_scrape'
),
(
  'Citrin Wellness',
  'citrin-wellness-beverly-hills',
  'Beverly Hills naturopathic doctor offering comprehensive peptide therapy including BPC-157, GHK-Cu, CJC-1295, and Semaglutide, sourced from pharmaceutical-grade compounding pharmacies.',
  'clinics', 'Longevity / Peptide Therapy',
  'Beverly Hills', 'beverly-hills-citrin', 'CA', 'US', 'local',
  '8920 Wilshire Blvd, Suite 610, Beverly Hills, CA 90211', '(424) 389-3547', NULL, 'https://citrinwellness.com',
  false, false, true, 'free', 78, 'web_scrape'
),
(
  'Beverly Hills Concierge Doctor',
  'beverly-hills-concierge-doctor',
  'Beverly Hills concierge physician offering physician-grade peptide therapy including BPC-157, Sermorelin, Ipamorelin, and Tesamorelin. Available seven days a week with same-day appointments and a premium privacy-focused model.',
  'clinics', 'Concierge Medicine',
  'Beverly Hills', 'beverly-hills-concierge', 'CA', 'US', 'local',
  '9400 Brighton Way, Suite 303, Beverly Hills, CA 90210', '(310) 683-0180', 'info@beverlyhillsconciergedoctor.com', 'https://beverlyhillsconciergedoctor.com',
  false, false, true, 'free', 80, 'web_scrape'
),
(
  'Dr. Daniel Benhuri MD',
  'daniel-benhuri-md-beverly-hills',
  'Board-certified internist in Beverly Hills specializing in concierge peptide therapy including Semaglutide, BPC-157, and growth hormone secretagogues. Offers same-day and next-day availability with personalized protocols.',
  'clinics', 'Concierge Medicine',
  'Beverly Hills', 'beverly-hills-benhuri', 'CA', 'US', 'local',
  '9400 Brighton Way, Suite 210, Beverly Hills, CA 90210', '(310) 362-1255', NULL, 'https://danielbenhurimd.com',
  false, false, true, 'free', 78, 'web_scrape'
),

-- Miami / Florida
(
  'Covalent Health',
  'covalent-health-miami',
  'Medically supervised peptide therapy clinic in Miami led by Dr. Gabriel Suarez, IFMCP. Offers BPC-157, CJC-1295/Ipamorelin, Thymosin Alpha-1, Semax/Selank, and GLP-1 peptides.',
  'clinics', 'Functional Medicine',
  'Miami', 'miami-covalent', 'FL', 'US', 'local',
  '9835 SW 72nd St, Suite 208, Miami, FL 33173', '(786) 953-8867', NULL, 'https://covalenthealth.org',
  false, false, true, 'free', 80, 'web_scrape'
),
(
  'Genesis Health Institute',
  'genesis-health-institute-fort-lauderdale',
  'Fort Lauderdale functional medicine clinic offering physician-supervised peptide therapy including Sermorelin and PT-141, alongside bioidentical hormone replacement and medical aesthetics services.',
  'clinics', 'Functional Medicine',
  'Fort Lauderdale', 'fort-lauderdale-genesis', 'FL', 'US', 'local',
  '1001 NE 26th Street, Fort Lauderdale, FL 33305', '(954) 561-3175', NULL, 'https://ghinstitute.com',
  false, false, true, 'free', 78, 'web_scrape'
),
(
  'Naples Longevity Clinic',
  'naples-longevity-clinic-bonita-springs',
  'Board-certified internal medicine practice offering peptide therapy, bioidentical hormone replacement, metabolic profiling, and nutrition services in the Naples and Bonita Springs, Florida area.',
  'clinics', 'Longevity Medicine',
  'Bonita Springs', 'bonita-springs', 'FL', 'US', 'local',
  '10971 Bonita Beach Road SE, Suite 1, Bonita Springs, FL 34135', '(239) 659-3266', NULL, 'https://napleslongevity.com',
  false, false, true, 'free', 75, 'web_scrape'
),
(
  'Coastal Integrative Healthcare',
  'coastal-integrative-healthcare-edgewater',
  'Multi-location Florida integrative health center offering peptide therapy combined with chiropractic care, physical therapy, and functional medicine. Serves Edgewater, Palm Coast, New Smyrna Beach, and surrounding areas.',
  'clinics', 'Integrative Medicine',
  'Edgewater', 'edgewater-fl', 'FL', 'US', 'local',
  '315 N Ridgewood Ave, Edgewater, FL 32132', '(386) 427-8403', NULL, 'https://coastalintegrativehealthcare.com',
  false, false, true, 'free', 72, 'web_scrape'
),
(
  'South Tampa Regenerative Medicine',
  'south-tampa-regenerative',
  'Tampa-based regenerative medicine practice offering a self-inject peptide therapy program alongside medical weight loss and low testosterone treatment for men and women.',
  'clinics', 'Regenerative Medicine',
  'Tampa', 'tampa-regenerative', 'FL', 'US', 'local',
  '3205 W Paul Ave, Tampa, FL 33611', '(813) 462-1450', NULL, 'https://southtamparegenerative.com',
  false, false, true, 'free', 75, 'web_scrape'
),

-- Texas
(
  'Executive Medicine of Texas',
  'executive-medicine-of-texas-southlake',
  'Southlake, Texas executive health clinic providing CJC-1295 and Ipamorelin peptide therapy as part of a comprehensive age management and functional medicine program. Also offers bioidentical hormone therapy and executive physicals.',
  'clinics', 'Executive Health',
  'Southlake', 'southlake', 'TX', 'US', 'local',
  '2106 East State Hwy 114, Suite 300, Southlake, TX 76092', '(817) 552-4300', NULL, 'https://emtexas.com',
  false, false, true, 'free', 80, 'web_scrape'
),
(
  'Revive Health and Beauty',
  'revive-health-and-beauty-frisco',
  'Frisco, Texas med spa and wellness clinic offering physician-prescribed peptide therapy alongside testosterone replacement and hormone optimization. Serves patients Monday through Saturday.',
  'clinics', 'Med Spa / Hormone Therapy',
  'Frisco', 'frisco', 'TX', 'US', 'local',
  '11500 State Highway 121, Suite 320, Frisco, TX 75035', '(214) 618-0048', NULL, 'https://revivehealthandbeauty.com',
  false, false, true, 'free', 75, 'web_scrape'
),
(
  'Formula Wellness Center',
  'formula-wellness-dallas',
  'Dallas wellness center led by Dr. Brian Rudman offering peptide therapy, hormone optimization, regenerative therapy, and IV hydration. Located in the prestigious Park Cities neighborhood.',
  'clinics', 'Hormone Therapy',
  'Dallas', 'dallas-formula-wellness', 'TX', 'US', 'local',
  '4342 Lovers Ln, Dallas, TX 75225', '(214) 931-9443', NULL, 'https://formulawellness.com',
  false, false, true, 'free', 78, 'web_scrape'
),
(
  'Integrative Wellness Fx',
  'integrative-wellness-fx-dallas',
  'Functional medicine practice led by Dr. David Morcom, PharmD, certified in Advanced Peptide Therapy. Offers personalized peptide protocols in the Dallas-Fort Worth area.',
  'clinics', 'Functional Medicine',
  'Dallas', 'dallas-integrative-wellness', 'TX', 'US', 'local',
  '10670 N Central Expy, Suite 110, Dallas, TX 75231', '(469) 333-1298', NULL, 'https://integrativewellnessfx.com',
  false, false, true, 'free', 75, 'web_scrape'
),

-- DC / Mid-Atlantic
(
  'Performance Rejuvenation Center',
  'performance-rejuvenation-center-dc',
  'Washington, DC anti-aging and hormone specialist clinic providing TRT, peptide therapy, and HGH replacement therapy. A dedicated longevity-focused practice serving the greater DC metro area.',
  'clinics', 'Anti-Aging / Hormone Therapy',
  'Washington', 'washington-dc', 'DC', 'US', 'local',
  '6856 Eastern Ave NW, Suite 205, Washington, DC 20012', '(202) 251-4472', NULL, 'https://prcindc.com',
  false, false, true, 'free', 75, 'web_scrape'
),

-- Colorado
(
  'Vitalogy Health',
  'vitalogy-health-denver',
  'Cherry Creek North Denver clinic offering personalized peptide therapy, hormone replacement, and integrative wellness services. Combines functional medicine diagnostics with individualized treatment plans for optimization and longevity.',
  'clinics', 'Integrative Medicine',
  'Denver', 'denver-vitalogy', 'CO', 'US', 'local',
  '90 Madison Street, Suite 101, Denver, CO 80206', '(720) 805-1989', NULL, 'https://vitalogydenver.com',
  false, false, true, 'free', 75, 'web_scrape'
),
(
  'R2 Medical Clinic',
  'r2-medical-clinic-greenwood-village',
  'Denver area premier anti-aging center with multiple Colorado locations offering expert peptide therapy, TRT, hormone optimization, NAD+ therapy, and medical weight loss with same-day appointments.',
  'clinics', 'Anti-Aging / Longevity',
  'Greenwood Village', 'greenwood-village', 'CO', 'US', 'local',
  '1873 S Bellaire St, Suite 1215, Greenwood Village, CO 80222', '(720) 640-2333', NULL, 'https://r2medicalclinic.com',
  false, false, true, 'free', 78, 'web_scrape'
),

-- Illinois
(
  'Fulcrum Aesthetics and Surgery',
  'fulcrum-aesthetics-chicago',
  'Chicago plastic surgery and med spa offering peptide therapy as part of a comprehensive wellness and aesthetics platform. Positioned as an advanced method for enhancing physical performance and recovery.',
  'clinics', 'Medical Spa',
  'Chicago', 'chicago-fulcrum', 'IL', 'US', 'local',
  '1457 W Belmont Ave, Chicago, IL 60657', '(773) 598-7003', NULL, 'https://fulcrumaesthetics.com',
  false, false, true, 'free', 75, 'web_scrape'
),
(
  'WholeHealth Chicago',
  'wholehealth-chicago',
  'The Midwest''s oldest integrative care center blending conventional medicine with alternative therapies including peptide therapy using thymosin and BPC-157. Serving Chicago since the 1990s.',
  'clinics', 'Functional Medicine',
  'Chicago', 'chicago-wholehealth', 'IL', 'US', 'local',
  '2265 N Clybourn Ave, Chicago, IL 60614', '(773) 296-6700', NULL, 'https://wholehealthchicago.com',
  false, false, true, 'free', 78, 'web_scrape'
),

-- Seattle / Pacific Northwest
(
  'Pinnacle Integrative Health',
  'pinnacle-integrative-health-seattle',
  'Nationally recognized Seattle functional medicine clinic founded in 2010 blending Eastern medicine, clinical nutrition, and advanced diagnostics. Offers peptide injections for energy, joint health, and recovery.',
  'clinics', 'Functional Medicine',
  'Seattle', 'seattle-pinnacle-integrative', 'WA', 'US', 'local',
  '509 Olive Way, Suite 803, Seattle, WA 98101', '(206) 624-0397', NULL, 'https://pinnacleintegrative.com',
  false, false, true, 'free', 78, 'web_scrape'
),
(
  'Marketplace Naturopathic',
  'marketplace-naturopathic-seattle',
  'Downtown Seattle naturopathic clinic specializing in Lyme disease, mold toxicity, and complex chronic illness. Offers peptide therapy as a cutting-edge healing modality alongside functional diagnostics.',
  'clinics', 'Functional Medicine',
  'Seattle', 'seattle-marketplace-naturo', 'WA', 'US', 'local',
  '2107 Elliott Ave, Suite 307, Seattle, WA 98121', '(206) 853-6809', 'info@marketplacenaturopathic.com', 'https://www.marketplacenaturopathic.com',
  false, false, true, 'free', 75, 'web_scrape'
),

-- Boston
(
  'Vega Vitality',
  'vega-vitality-boston',
  'MedSpa and wellness center in Boston''s Back Bay offering peptide injections alongside aesthetic treatments in a modern clinical environment. Convenient location with same-day appointment availability.',
  'clinics', 'Med Spa / Peptide Therapy',
  'Boston', 'boston-vega', 'MA', 'US', 'local',
  '551 Boylston St, 4th Floor, Boston, MA 02116', '(617) 658-3421', NULL, 'https://vegavitality.com',
  false, false, true, 'free', 75, 'web_scrape'
),

-- Phoenix / Southwest
(
  'TriMotus',
  'trimotus-phoenix',
  'Functional and physical health clinic in Phoenix serving Paradise Valley under Dr. Cameron Khavari. Offers personalized peptide therapy tracks as part of holistic health optimization.',
  'clinics', 'Functional Medicine',
  'Phoenix', 'phoenix-trimotus', 'AZ', 'US', 'local',
  '4417 N 40th St, Suite 400A, Phoenix, AZ 85018', '(480) 619-2020', NULL, 'https://trimotus.com',
  false, false, true, 'free', 75, 'web_scrape'
),

-- Las Vegas
(
  'American Medical Wellness',
  'american-medical-wellness-las-vegas',
  'Vertically integrated physician-led wellness clinic in Las Vegas with an in-house 503A compounding pharmacy. Offers AOD9604, Thymogen, and other targeted peptide therapies alongside hormone optimization.',
  'clinics', 'Longevity / Peptide Therapy',
  'Las Vegas', 'las-vegas-american-medical', 'NV', 'US', 'local',
  '241 N Buffalo Dr, Suite 200, Las Vegas, NV 89145', '(702) 347-7000', NULL, 'https://www.americanmedicalwellness.com',
  false, false, true, 'free', 78, 'web_scrape'
),

-- Canada — Toronto area
(
  'Canadian Centres for Regenerative Therapy',
  'ccrt-toronto',
  'Yorkville-based Toronto clinic specializing in regenerative and translational medicine. Offers peptide therapy as part of advanced regenerative protocols for longevity and chronic condition management.',
  'clinics', 'Regenerative Medicine',
  'Toronto', 'toronto-ccrt', 'ON', 'CA', 'local',
  '162 Cumberland St, Suite 222, Toronto, ON M5R 1A8', '+1 (416) 479-8667', 'info@ccrttoronto.ca', 'https://ccrttoronto.ca',
  false, false, true, 'free', 78, 'web_scrape'
),
(
  'ID Cosmetic Clinic',
  'id-cosmetic-clinic-markham',
  'Toronto-area medical spa in Markham led by Dr. Dan Xu offering peptide therapy for anti-aging, vitality, lean muscle, and sleep quality alongside aesthetic treatments.',
  'clinics', 'Med Spa / Peptide Therapy',
  'Markham', 'markham', 'ON', 'CA', 'local',
  '30 Gibson Dr, Units 113-117, Markham, ON L3R 2S3', '(905) 477-2225', NULL, 'https://idcosmeticclinic.ca',
  false, false, true, 'free', 72, 'web_scrape'
),

-- Canada — Vancouver area
(
  'Richmond Anti-Aging Clinic',
  'richmond-anti-aging-clinic',
  'Premier anti-aging and aesthetics clinic in Greater Vancouver offering peptide therapy (BPC-157), hormone replacement, NAD+ therapy, exosomes, and medical weight loss.',
  'clinics', 'Longevity / Anti-Aging',
  'Richmond', 'richmond-bc-raac', 'BC', 'CA', 'local',
  '110-5580 No. 3 Rd, Richmond, BC V6X 3P6', '(604) 277-9006', NULL, 'https://richmondantiaging.ca',
  false, false, true, 'free', 78, 'web_scrape'
),

-- Canada — Calgary
(
  'Neurvana Health',
  'neurvana-health-calgary',
  'Integrative medical clinic in Calgary offering evidence-based peptide therapy alongside naturopathic medicine for chronic conditions, pain, and longevity. Recognized by the International Peptide Society.',
  'clinics', 'Functional Medicine',
  'Calgary', 'calgary-neurvana', 'AB', 'CA', 'local',
  '2020 4 St SW, Suite 330, Calgary, AB T2S 1W3', '(587) 997-4649', NULL, 'https://neurvanahealth.com',
  false, false, true, 'free', 80, 'web_scrape'
)

ON CONFLICT (slug) DO NOTHING;
