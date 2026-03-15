-- ═══════════════════════════════════════════════════════════════════════════════
-- Migration 035: Seed More Real Businesses — Verified from Research Agents
-- Source: Web research agents, March 2026. No duplicates from 030–034.
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
  'Regen Peptide Solutions',
  'regen-peptide-solutions-colorado-springs',
  'Colorado-based research peptide supplier providing high-purity BPC-157, GHK-Cu, and TB-500 with a minimum 99% purity standard. Third-party tested with batch-specific Certificates of Analysis.',
  'peptide_brands', 'Research Peptides',
  'Colorado Springs', 'colorado-springs-regen', 'CO', 'US', 'national',
  '3609 Austin Bluffs Pkwy, Suite 31-1289, Colorado Springs, CO 80918', NULL, NULL, 'https://regenpeptidesolutions.com',
  false, false, true, 'free', 65, 'web_scrape'
),
(
  'Pinnacle Peptides',
  'pinnacle-peptides-sc',
  'US-sourced and manufactured research peptides and chemicals with a focus on quality assurance. Provides high-purity research compounds including BPC-157, TB-500, and growth hormone secretagogues.',
  'peptide_brands', 'Research Peptides',
  'Columbia', 'columbia-sc', 'SC', 'US', 'national',
  'Columbia, SC', '(803) 281-0800', 'pinnaclepeptidesinus@gmail.com', 'https://pinnaclepeptides.com',
  false, false, true, 'free', 62, 'web_scrape'
),

-- ─── CLINICS ──────────────────────────────────────────────────────────────────

(
  'Manhattan Medical Arts',
  'manhattan-medical-arts-new-york',
  'Primary care and anti-aging practice led by Dr. Syra Hanif offering personalized peptide therapy with FDA-approved peptides for weight loss, energy, and anti-aging. Board-certified physicians in Manhattan.',
  'clinics', 'Peptide Therapy',
  'New York', 'new-york-mma', 'NY', 'US', 'local',
  '492 6th Ave, Manhattan, NY 10011', '(646) 454-9000', NULL, 'https://manhattanmedicalarts.com',
  false, false, true, 'free', 72, 'web_scrape'
),
(
  'Abundant Health MD',
  'abundant-health-md-new-york',
  'Integrative medicine practice led by Dr. Nidia Carrero specializing in peptide therapy, IV vitamin therapy, bio-identical hormones, and regenerative medicine for chronic conditions in New York City.',
  'clinics', 'Functional Medicine',
  'New York', 'new-york-abundant', 'NY', 'US', 'local',
  '500 Madison Ave, Suite 1205, New York, NY 10022', '(212) 988-0406', NULL, 'https://abundanthealthmd.com',
  false, false, true, 'free', 70, 'web_scrape'
),
(
  'Angel Longevity Medical Center',
  'angel-longevity-studio-city',
  'Los Angeles functional medicine and longevity center offering peptide therapy, IV therapy, hormone replacement, and exosome therapy. Located in Studio City, serving the greater Los Angeles area.',
  'clinics', 'Longevity & Anti-Aging',
  'Studio City', 'studio-city-angel', 'CA', 'US', 'local',
  '12840 Riverside Dr, Suite 402, Studio City, CA 91607', '(818) 961-2055', 'info@angelmedcenter.com', 'https://angellongevity.com',
  false, false, true, 'free', 72, 'web_scrape'
),
(
  'Citrin Wellness',
  'citrin-wellness-beverly-hills',
  'Beverly Hills naturopathic doctor offering comprehensive peptide therapy including BPC-157, GHK-Cu, CJC-1295, and Semaglutide sourced from pharmaceutical-grade compounding pharmacies.',
  'clinics', 'Functional Medicine',
  'Beverly Hills', 'beverly-hills-citrin', 'CA', 'US', 'local',
  '8920 Wilshire Blvd, Suite 610, Beverly Hills, CA 90211', '(424) 389-3547', NULL, 'https://citrinwellness.com',
  false, false, true, 'free', 72, 'web_scrape'
),
(
  'Covalent Health',
  'covalent-health-miami',
  'Medically supervised peptide therapy clinic in Miami led by Dr. Gabriel Suarez, IFMCP. Offers BPC-157, CJC-1295/Ipamorelin, Thymosin Alpha-1, Semax/Selank, and GLP-1 peptides.',
  'clinics', 'Functional Medicine',
  'Miami', 'miami-covalent', 'FL', 'US', 'local',
  '9835 SW 72nd St, Suite 208, Miami, FL 33173', '(786) 953-8867', NULL, 'https://covalenthealth.org',
  false, false, true, 'free', 72, 'web_scrape'
),
(
  'WholeHealth Chicago',
  'wholehealth-chicago',
  'The Midwest''s oldest integrative care center blending conventional medicine with alternative therapies including peptide therapy using thymosin and BPC-157. Serving Chicago since 1993.',
  'clinics', 'Functional Medicine',
  'Chicago', 'chicago-wholehealth', 'IL', 'US', 'local',
  '2265 N Clybourn Ave, Chicago, IL 60614', '(773) 296-6700', NULL, 'https://wholehealthchicago.com',
  false, false, true, 'free', 72, 'web_scrape'
),
(
  'Formula Wellness Center',
  'formula-wellness-dallas',
  'Dallas wellness center led by Dr. Brian Rudman (board-certified anesthesiologist) offering peptide therapy, hormone optimization, regenerative therapy, and IV hydration. Multiple DFW locations.',
  'clinics', 'Hormone Therapy',
  'Dallas', 'dallas-formula', 'TX', 'US', 'regional',
  '4342 Lovers Ln, Dallas, TX 75225', '(214) 931-9443', NULL, 'https://formulawellness.com',
  false, false, true, 'free', 72, 'web_scrape'
),
(
  'Integrative Wellness Fx',
  'integrative-wellness-fx-dallas',
  'Functional medicine practice led by Dr. David Morcom, PharmD, certified in Advanced Peptide Therapy. Offers personalized peptide protocols in Dallas-Fort Worth for optimization and longevity.',
  'clinics', 'Functional Medicine',
  'Dallas', 'dallas-wellness-fx', 'TX', 'US', 'local',
  '10670 N Central Expy, Suite 110, Dallas, TX 75231', '(469) 333-1298', NULL, 'https://integrativewellnessfx.com',
  false, false, true, 'free', 70, 'web_scrape'
),
(
  'R2 Medical Clinic',
  'r2-medical-clinic-denver',
  'Denver''s premier anti-aging center with multiple Colorado locations offering expert peptide therapy, TRT, hormone optimization, NAD+ therapy, and medical weight loss. Same-day appointments available.',
  'clinics', 'Longevity & Anti-Aging',
  'Greenwood Village', 'greenwood-village', 'CO', 'US', 'regional',
  '1873 S Bellaire St, Suite 1215, Greenwood Village, CO 80222', '(720) 640-2333', NULL, 'https://r2medicalclinic.com',
  false, false, true, 'free', 72, 'web_scrape'
),
(
  'Marketplace Naturopathic',
  'marketplace-naturopathic-seattle',
  'Downtown Seattle naturopathic clinic specializing in Lyme disease, mold toxicity, and complex chronic illness. Offers peptide therapy as a cutting-edge healing modality alongside evidence-based naturopathic protocols.',
  'clinics', 'Functional Medicine',
  'Seattle', 'seattle-marketplace', 'WA', 'US', 'local',
  '2107 Elliott Ave, Suite 307, Seattle, WA 98121', '(206) 853-6809', 'info@marketplacenaturopathic.com', 'https://marketplacenaturopathic.com',
  false, false, true, 'free', 68, 'web_scrape'
),
(
  'Vega Vitality',
  'vega-vitality-boston',
  'Boston Back Bay MedSpa and wellness center offering peptide injections alongside aesthetic treatments in a modern clinical environment. Personalized protocols tailored to individual health and performance goals.',
  'clinics', 'Peptide Therapy',
  'Boston', 'boston', 'MA', 'US', 'local',
  '551 Boylston St, 4th Floor, Boston, MA 02116', '(617) 658-3421', NULL, 'https://vegavitality.com',
  false, false, true, 'free', 68, 'web_scrape'
),
(
  'TriMotus',
  'trimotus-phoenix',
  'Functional and physical health clinic in Phoenix serving Paradise Valley under Dr. Cameron Khavari. Offers personalized peptide therapy tracks as part of holistic health optimization and performance medicine.',
  'clinics', 'Functional Medicine',
  'Phoenix', 'phoenix-trimotus', 'AZ', 'US', 'local',
  '4417 N 40th St, Suite 400A, Phoenix, AZ 85018', '(480) 619-2020', NULL, 'https://trimotus.com',
  false, false, true, 'free', 70, 'web_scrape'
),
(
  'American Medical Wellness',
  'american-medical-wellness-las-vegas',
  'Vertically integrated physician-led wellness clinic in Las Vegas with an in-house 503A compounding pharmacy. Offers AOD9604, Thymogen, and other targeted peptide therapies as part of a comprehensive longevity program.',
  'clinics', 'Peptide Therapy',
  'Las Vegas', 'las-vegas-amw', 'NV', 'US', 'local',
  '241 N Buffalo Dr, Suite 200, Las Vegas, NV 89145', '(702) 347-7000', NULL, 'https://americanmedicalwellness.com',
  false, false, true, 'free', 72, 'web_scrape'
),
(
  'South Tampa Regenerative Medicine',
  'south-tampa-regenerative',
  'Tampa-based regenerative medicine practice offering a self-inject peptide therapy program alongside medical weight loss and low testosterone treatment. Physician-supervised protocols with home delivery of compounds.',
  'clinics', 'Peptide Therapy',
  'Tampa', 'tampa-regenerative', 'FL', 'US', 'local',
  '3205 W Paul Ave, Tampa, FL 33611', '(813) 462-1450', NULL, 'https://southtamparegenerative.com',
  false, false, true, 'free', 68, 'web_scrape'
),
(
  'Canadian Centres for Regenerative Therapy',
  'ccrt-toronto',
  'Yorkville-based Toronto clinic specializing in regenerative and translational medicine, offering peptide therapy as part of advanced regenerative protocols for longevity, tissue repair, and immune optimization.',
  'clinics', 'Longevity & Anti-Aging',
  'Toronto', 'toronto-ccrt', 'ON', 'CA', 'regional',
  'Suite 222, 162 Cumberland St, Toronto, ON M5R 1A8', '+1 (416) 479-8667', 'info@ccrttoronto.ca', 'https://ccrttoronto.ca',
  false, false, true, 'free', 72, 'web_scrape'
),
(
  'ID Cosmetic Clinic',
  'id-cosmetic-clinic-markham',
  'Toronto-area medical spa led by Dr. Dan Xu offering peptide therapy for anti-aging, vitality, lean muscle development, and sleep quality alongside aesthetic treatments and regenerative medicine services.',
  'clinics', 'Longevity & Anti-Aging',
  'Markham', 'markham-id', 'ON', 'CA', 'regional',
  'Units 113-117, 30 Gibson Dr, Markham, ON L3R 2S3', '(905) 477-2225', NULL, 'https://idcosmeticclinic.ca',
  false, false, true, 'free', 68, 'web_scrape'
),
(
  'Neurvana Health',
  'neurvana-health-calgary',
  'Integrative medical clinic in Calgary offering evidence-based peptide therapy alongside naturopathic medicine for chronic conditions, pain, and longevity. Recognized by the International Peptide Society.',
  'clinics', 'Functional Medicine',
  'Calgary', 'calgary', 'AB', 'CA', 'regional',
  '2020 4 St SW, Suite 330, Calgary, AB T2S 1W3', '(587) 997-4649', NULL, 'https://neurvanahealth.com',
  false, false, true, 'free', 72, 'web_scrape'
)

ON CONFLICT (slug) DO NOTHING;
