#!/usr/bin/env node
// ─── Peptide Alliance — Canadian Businesses Seed Script ──────────────────────
// Run: node scripts/seed-canada-businesses.mjs
//
// Adds 48 real Canadian peptide suppliers, TRT clinics, regenerative clinics,
// compounding pharmacies, and manufacturers to the directory as unclaimed listings.

import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://jxyaubxjamlojccmneni.supabase.co';
const SERVICE_ROLE  = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp4eWF1YnhqYW1sb2pjY21uZW5pIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MzUwMzI4MCwiZXhwIjoyMDg5MDc5MjgwfQ.1Ix7scPOR9EoSwMQplr2J2DutSFKdGdxy1EUiXtpm84';

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE, {
  auth: { autoRefreshToken: false, persistSession: false },
});

function slugify(name, city) {
  const base = `${name}-${city}`.toLowerCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 55);
  const suffix = Math.random().toString(36).slice(2, 7);
  return `${base}-${suffix}`;
}

function cityToSlug(city) {
  if (!city) return 'canada';
  return city
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

// ─── BUSINESSES ───────────────────────────────────────────────────────────────
const BUSINESSES = [

  // ══════════════════════════════════════════════
  // PEPTIDE BRANDS / SUPPLIERS (Canada)
  // ══════════════════════════════════════════════
  {
    name: 'Amino Pure Canada',
    category: 'peptide_brands',
    city: 'Toronto', province: 'ON',
    address: null,
    phone: null,
    website: 'https://www.aminopurecanada.ca',
    instagram: '@aminopurelabs',
    description: 'Canadian peptide supplier offering HPLC-tested peptides including BPC-157, TB-500, CJC-1295, and NAD+. Ships discreetly to all provinces. Products sold in capsule and atomizer spray formats under GMP conditions. Third-party tested for purity and potency.',
    keywords: ['BPC-157', 'TB-500', 'CJC-1295', 'NAD+', 'research peptides Canada', 'HPLC tested'],
  },
  {
    name: 'Peptide Warehouse Canada',
    category: 'peptide_brands',
    city: 'Oakville', province: 'ON',
    address: '320 Dundas St E, Oakville, ON L6H 6Z9',
    phone: '416-254-9562',
    website: 'https://www.peptidewarehouse.ca',
    instagram: null,
    description: 'Canadian peptide supplier offering HPLC-tested BPC-157, TB-500 combo kits, GHK-Cu, and a wide range of research peptides with bacteriostatic water included. Domestic shipping to all Canadian provinces. 24/7 customer support and COAs on every product.',
    keywords: ['BPC-157', 'TB-500', 'GHK-Cu', 'peptide warehouse', 'Canada peptides', 'HPLC tested'],
  },
  {
    name: 'Polar Peptides',
    category: 'peptide_brands',
    city: 'Vancouver', province: 'BC',
    address: null,
    phone: null,
    website: 'https://polarpeptides.ca',
    instagram: null,
    description: 'Canadian peptide supplier with fast nationwide delivery. Accepts Interac e-Transfer. Offers BPC-157, TB-500, CJC-1295/Ipamorelin blend, MOTS-c, and more. Third-party COA testing on all products. Ships within 24 hours on weekdays from a Canadian fulfillment centre.',
    keywords: ['BPC-157', 'TB-500', 'CJC-1295', 'Ipamorelin', 'MOTS-c', 'research peptides Canada'],
  },
  {
    name: 'XPeptides',
    category: 'peptide_brands',
    city: 'Ottawa', province: 'ON',
    address: null,
    phone: '431-792-8638',
    website: 'https://xpeptides.ca',
    instagram: null,
    description: 'Canadian peptide supplier offering premium research peptides including BPC-157, TB-500, Retatrutide, and MOTS-C. Fast domestic shipping across Canada. All products are independently verified for purity and come with published Certificates of Analysis.',
    keywords: ['BPC-157', 'TB-500', 'Retatrutide', 'MOTS-C', 'research peptides Ottawa', 'Canada peptides'],
  },
  {
    name: 'Canadian Peptides',
    category: 'peptide_brands',
    city: 'Calgary', province: 'AB',
    address: null,
    phone: null,
    website: 'https://canadianpeptides.ca',
    instagram: null,
    description: 'Canadian peptide source offering 99%+ purity research peptides with third-party COA verification and fast domestic shipping. Flagship products include BPC-157 and TB-500. Discreet packaging, reliable delivery, and responsive customer service.',
    keywords: ['BPC-157', 'TB-500', 'research peptides', 'Canadian peptides', 'COA verified'],
  },
  {
    name: 'Great Northern Peptides',
    category: 'peptide_brands',
    city: 'Edmonton', province: 'AB',
    address: null,
    phone: null,
    website: 'https://greatnorthernpeptides.com',
    instagram: null,
    description: 'Canadian premium peptide supplier. All products independently tested for purity, potency, and accurate dosing. COAs publicly posted on the website. Ships via Canada Post Express with 2-3 day delivery nationwide. Specialties include CJC-1295/Ipamorelin blend and BPC-157.',
    keywords: ['CJC-1295', 'Ipamorelin', 'BPC-157', 'Canada Post Express', 'premium peptides Canada'],
  },
  {
    name: 'Pharma Lab Global Canada',
    category: 'peptide_brands',
    city: 'Montreal', province: 'QC',
    address: null,
    phone: null,
    website: 'https://canada.pharmalabglobal.com',
    instagram: null,
    description: 'International peptide research supplier with a dedicated Canadian storefront. Offers high-purity peptides including TB-500/BPC-157 pre-mixed pens, Ipamorelin/CJC-1295 blends, and GHRP-2 combinations. Competes on price, purity, and fast Canadian delivery.',
    keywords: ['TB-500', 'BPC-157', 'Ipamorelin', 'CJC-1295', 'GHRP-2', 'peptide pens Canada'],
  },

  // ══════════════════════════════════════════════
  // MANUFACTURERS
  // ══════════════════════════════════════════════
  {
    name: 'CanPeptide Inc.',
    category: 'manufacturers',
    city: 'Montreal', province: 'QC',
    address: '5990 Rue Vanden Abeele, St-Laurent, Montreal, QC H4S 1R9',
    phone: '514-697-2168',
    website: 'https://www.canpeptide.com',
    instagram: null,
    description: 'Montreal-based custom peptide synthesis and analytical chemistry company serving pharmaceutical and research clients. Specializes in GMP-grade custom synthetic peptides, analytical testing, and B2B supply of research-grade compounds. Established Canadian manufacturer with ISO-aligned quality systems.',
    keywords: ['custom peptide synthesis', 'GMP peptides', 'Montreal peptide manufacturer', 'pharmaceutical peptides', 'analytical chemistry'],
  },

  // ══════════════════════════════════════════════
  // TRT / MEN'S HEALTH CLINICS
  // ══════════════════════════════════════════════
  {
    name: 'Gameday Men\'s Health – Midtown Toronto',
    category: 'clinics',
    subcategory: 'mens_health',
    city: 'Toronto', province: 'ON',
    address: '417 Spadina Rd, Suite 202, Toronto, ON M5P 2W3',
    phone: '(416) 840-8503',
    website: 'https://gamedaymenshealth.ca/midtown-toronto',
    instagram: '@gamedaytorontomidtown',
    description: 'Men\'s health clinic offering physician-guided testosterone replacement therapy (TRT), peptide therapy (Sermorelin, PT-141, B-Complex), medical weight loss programs, erectile dysfunction treatment (Trimix), and hair loss solutions. Discreet, results-driven care for men in Midtown Toronto.',
    keywords: ['TRT Toronto', 'testosterone replacement', 'men\'s health clinic', 'Sermorelin', 'PT-141', 'Gameday Men\'s Health'],
  },
  {
    name: 'Gameday Men\'s Health – Calgary West Springs',
    category: 'clinics',
    subcategory: 'mens_health',
    city: 'Calgary', province: 'AB',
    address: '8561 8A Avenue SW, Unit 2204, Calgary, AB T3H 0V5',
    phone: '(403) 456-6562',
    website: 'https://gamedaymenshealth.ca/calgary-west-springs',
    instagram: null,
    description: 'Calgary men\'s health clinic specializing in physician-guided TRT, peptide therapy, medical weight loss, and erectile dysfunction treatments. Part of Canada\'s fastest growing men\'s health network. West Springs location serving SW Calgary.',
    keywords: ['TRT Calgary', 'testosterone clinic Calgary', 'men\'s health', 'peptide therapy Alberta', 'Gameday Men\'s Health'],
  },
  {
    name: 'Gameday Men\'s Health – West Edmonton',
    category: 'clinics',
    subcategory: 'mens_health',
    city: 'Edmonton', province: 'AB',
    address: '17329 105 Ave, Edmonton, AB T5S 1H2',
    phone: '(780) 800-4448',
    website: 'https://gamedaymenshealth.ca/west-edmonton',
    instagram: null,
    description: 'Edmonton men\'s health clinic offering physician-supervised testosterone replacement therapy, peptide therapy, semaglutide weight management, and ED treatments. Evidence-based protocols with ongoing monitoring. Part of the national Gameday Men\'s Health Canada network.',
    keywords: ['TRT Edmonton', 'testosterone clinic Edmonton', 'men\'s health Alberta', 'peptide therapy', 'ED treatment Edmonton'],
  },
  {
    name: 'Gameday Men\'s Health – Woodbridge',
    category: 'clinics',
    subcategory: 'mens_health',
    city: 'Vaughan', province: 'ON',
    address: '3540 Rutherford Rd Unit 75, Vaughan, ON L4H 3T8',
    phone: '(416) 900-9930',
    website: 'https://gamedaymenshealth.ca/woodbridge',
    instagram: null,
    description: 'Woodbridge and Vaughan men\'s health clinic delivering TRT, peptide protocols, weight loss, and sexual health treatments under physician supervision. Convenient Rutherford Road location serving the Greater Toronto Area northwest corridor.',
    keywords: ['TRT Vaughan', 'TRT Woodbridge', 'testosterone clinic GTA', 'men\'s health clinic', 'peptide therapy Ontario'],
  },
  {
    name: 'Gameday Men\'s Health – London North',
    category: 'clinics',
    subcategory: 'mens_health',
    city: 'London', province: 'ON',
    address: '215 Fanshawe Park Rd W, Suite 102, London, ON N6G 5A9',
    phone: '(519) 804-4670',
    website: 'https://gamedaymenshealth.ca/london-north',
    instagram: null,
    description: 'London, Ontario men\'s health clinic providing physician-guided TRT, peptide therapy, weight loss programs, and ED treatments. North London location at Fanshawe Park. Part of the national Gameday Men\'s Health Canada network.',
    keywords: ['TRT London Ontario', 'testosterone clinic London', 'men\'s health London ON', 'peptide therapy', 'ED treatment Ontario'],
  },
  {
    name: 'Science & Humans',
    category: 'clinics',
    subcategory: 'mens_health',
    city: 'Mississauga', province: 'ON',
    address: '2810 Matheson Blvd East, Unit 702, Mississauga, ON L4W 5J8',
    phone: '(877) 286-6635',
    website: 'https://www.scienceandhumans.com',
    instagram: null,
    description: 'Digital telehealth platform for hormone optimization, anti-aging, longevity medicine, and sexual wellness. Canadian-licensed physicians provide TRT, peptide therapy, and weight management programs. Serves patients in ON, BC, AB, SK, MB, NS, PEI, and QC via virtual consultations.',
    keywords: ['TRT telehealth Canada', 'hormone therapy online', 'testosterone online Canada', 'anti-aging telehealth', 'Science and Humans'],
  },
  {
    name: 'Sovereign Male Wellness Clinic',
    category: 'clinics',
    subcategory: 'mens_health',
    city: 'Toronto', province: 'ON',
    address: '59 Hayden St, Suite 705, Toronto, ON M4Y 0E7',
    phone: '(647) 340-0061',
    website: 'https://sovereignmale.ca',
    instagram: null,
    description: 'Downtown Toronto men\'s health and hormone optimization clinic offering physician-guided TRT, hormone replacement therapy (HRT), IV drip therapy, B12 injections, and longevity medicine. Also serves Montreal and Ottawa patients via telehealth. Personalized protocols with regular monitoring.',
    keywords: ['TRT Toronto downtown', 'men\'s hormone clinic', 'testosterone therapy Toronto', 'IV therapy Toronto', 'B12 shots'],
  },
  {
    name: 'Men\'s Health Clinic Manitoba',
    category: 'clinics',
    subcategory: 'mens_health',
    city: 'Winnipeg', province: 'MB',
    address: 'Unit 3, 655 Sterling Lyon Pkwy, Winnipeg, MB R3P 2S8',
    phone: '204-221-4476',
    website: 'https://mhclinic.ca',
    instagram: '@menshealthclinicmb',
    description: 'One of Canada\'s first specialty men\'s health clinics. Offers testosterone replacement therapy, erectile dysfunction treatments, male fertility support, prostate health care, and surgical interventions. Run by physician specialists in all aspects of men\'s health. In-person consultations.',
    keywords: ['TRT Winnipeg', 'men\'s health Manitoba', 'testosterone clinic Winnipeg', 'ED treatment', 'male fertility Canada'],
  },
  {
    name: '8 West Clinic',
    category: 'clinics',
    subcategory: 'mens_health',
    city: 'North Vancouver', province: 'BC',
    address: '221 Esplanade W #300, North Vancouver, BC V7M 3J3',
    phone: '778-557-2310',
    website: 'https://www.8west.ca',
    instagram: null,
    description: 'North Vancouver hormone optimization clinic offering testosterone replacement therapy (including testosterone pellets as an injection alternative), bioidentical hormone replacement for women (BHRT), and comprehensive hormone optimization. Focus on restoring hormonal balance and improving long-term healthspan and vitality.',
    keywords: ['TRT North Vancouver', 'testosterone pellets BC', 'BHRT Vancouver', 'hormone optimization BC', '8 West Clinic'],
  },
  {
    name: 'Men\'s Vitality Clinic',
    category: 'clinics',
    subcategory: 'mens_health',
    city: 'Vancouver', province: 'BC',
    address: '1433 Cedar Cottage Mews, Vancouver, BC V5N 2R5',
    phone: '(604) 409-4146',
    website: 'https://mensvitality.clinic',
    instagram: null,
    description: 'Physician-led Vancouver men\'s health clinic offering hormone optimization (TRT), GLP-1 weight loss medications (semaglutide/tirzepatide), peptide therapies, hair restoration, and longevity medicine. Personalized protocols with regular blood panel monitoring. Also operates a Port Coquitlam location.',
    keywords: ['TRT Vancouver', 'semaglutide Vancouver', 'peptide therapy Vancouver', 'hormone optimization BC', 'GLP-1 weight loss BC'],
  },
  {
    name: 'Jack Health',
    category: 'clinics',
    subcategory: 'mens_health',
    city: 'Toronto', province: 'ON',
    address: null,
    phone: null,
    website: 'https://jack.health',
    instagram: null,
    description: 'Canadian online men\'s health platform providing TRT, sexual health, and wellness treatments via licensed Canadian practitioners. Reviews intake within 2 hours, orders comprehensive bloodwork (24+ biomarkers), and ships treatments directly from Health Canada-regulated pharmacies within 24 hours.',
    keywords: ['TRT online Canada', 'testosterone online', 'men\'s health telehealth', 'Jack Health', 'TRT delivery Canada'],
  },
  {
    name: 'UPGUYS',
    category: 'clinics',
    subcategory: 'mens_health',
    city: 'Toronto', province: 'ON',
    address: null,
    phone: null,
    website: 'https://upguys.com',
    instagram: null,
    description: 'Canadian online men\'s health platform providing video and phone consultations with licensed Canadian medical practitioners. TRT, erectile dysfunction, and sexual health treatments shipped directly to patients from regulated Canadian pharmacies. Discreet, convenient, and affordable.',
    keywords: ['TRT Canada online', 'ED treatment online Canada', 'UPGUYS', 'men\'s health online', 'testosterone Canada'],
  },
  {
    name: 'Enhanced Men\'s Clinic',
    category: 'clinics',
    subcategory: 'mens_health',
    city: 'Toronto', province: 'ON',
    address: null,
    phone: null,
    website: 'https://www.enhancedmensclinic.ca',
    instagram: null,
    description: 'Online membership-based TRT clinic in Canada with over 2,500 active patients. Connects men with independent Canadian physicians for testosterone therapy. Coordinates pathology, medical consultations, and pharmacy logistics nationwide. Fully virtual service available across Ontario and growing.',
    keywords: ['TRT clinic online Ontario', 'testosterone membership Canada', 'Enhanced Men\'s Clinic', 'TRT physician Canada'],
  },
  {
    name: 'BestLife Canada',
    category: 'clinics',
    subcategory: 'mens_health',
    city: 'Toronto', province: 'ON',
    address: null,
    phone: null,
    website: 'https://bestlifecanada.com',
    instagram: null,
    description: 'Physician-supervised TRT telehealth service available in Ontario and Nova Scotia. Video-based consultations with licensed Canadian physicians. Focused on midlife men\'s wellness, vitality restoration, and hormone optimization. No in-person visits required.',
    keywords: ['TRT Ontario telehealth', 'testosterone replacement Ontario', 'men\'s health Nova Scotia', 'BestLife Canada'],
  },
  {
    name: 'Toronto Functional Medicine Centre',
    category: 'clinics',
    subcategory: 'functional_medicine',
    city: 'Toronto', province: 'ON',
    address: '162 Cumberland St, Suite 222A, Toronto, ON M5R 1A8',
    phone: '(416) 968-6961',
    website: 'https://torontofunctionalmedicine.com',
    instagram: null,
    description: 'Integrative Toronto clinic offering NAD+ IV therapy, testosterone replacement therapy, acupuncture, naturopathic medicine, detoxification protocols, and bio-identical hormone therapy. Combines multiple therapeutic modalities for whole-body optimization and longevity. Both in-person and virtual consultations available.',
    keywords: ['NAD+ Toronto', 'TRT Toronto', 'functional medicine Toronto', 'BHRT Toronto', 'IV therapy Toronto', 'NAD+ IV therapy'],
  },
  {
    name: 'TBT Medical Ottawa',
    category: 'clinics',
    subcategory: 'functional_medicine',
    city: 'Ottawa', province: 'ON',
    address: null,
    phone: null,
    website: 'https://tbtmedicalottawa.com',
    instagram: null,
    description: 'Ottawa-area telehealth clinic operated by Nurse Practitioner Tanya Zboril. Offers peptide therapy, Semaglutide and Ozempic-assisted weight loss programs, and functional medicine. Serves all of Ontario virtually. Specializes in evidence-based integrative approaches to weight management and metabolic health.',
    keywords: ['peptide therapy Ottawa', 'Semaglutide Ottawa', 'Ozempic weight loss Ontario', 'functional medicine Ottawa', 'NP telehealth Ontario'],
  },

  // ══════════════════════════════════════════════
  // REGENERATIVE / ANTI-AGING / LONGEVITY CLINICS
  // ══════════════════════════════════════════════
  {
    name: 'Eterna Health',
    category: 'clinics',
    subcategory: 'regenerative_medicine',
    city: 'Mississauga', province: 'ON',
    address: '3095 Glen Erin Drive, Units 7-10, Mississauga, ON L5L 1J3',
    phone: '(416) 840-3500',
    website: 'https://eterna.health',
    instagram: null,
    description: 'Cutting-edge regenerative medicine, stem cell therapy (Muse Cell technology), and longevity clinic founded by Dr. Adeel Khan MD. Offers PRP, advanced regenerative biologics, comprehensive longevity assessments, and physical optimization programs. One of Canada\'s most advanced regenerative medicine facilities. Additional international locations in Dubai and Los Cabos.',
    keywords: ['regenerative medicine Toronto', 'stem cell therapy Canada', 'PRP Toronto', 'longevity clinic Mississauga', 'Dr Adeel Khan', 'Eterna Health'],
  },
  {
    name: 'Upper Room Clinic',
    category: 'clinics',
    subcategory: 'regenerative_medicine',
    city: 'Toronto', province: 'ON',
    address: '1849 Yonge Street, Suite 810, Toronto, ON M4S 1Y2',
    phone: '(647) 521-8024',
    website: 'https://upperroomclinic.com',
    instagram: null,
    description: 'Toronto and Oakville regenerative medicine clinic offering PRP therapy, Prolotherapy, Prolozone, ozone IV therapy, NAD+ IV infusions, P-Shot, O-Shot, and IV vitamin drips. Specializes in pain management, anti-aging, hair loss reversal, and sexual enhancement using regenerative modalities.',
    keywords: ['PRP Toronto', 'NAD+ IV Toronto', 'prolotherapy Toronto', 'P-Shot Ontario', 'O-Shot', 'ozone therapy Toronto', 'regenerative medicine'],
  },
  {
    name: 'METALAB IV Therapy & Regenerative Medicine',
    category: 'clinics',
    subcategory: 'regenerative_medicine',
    city: 'Markham', province: 'ON',
    address: '201-50 McIntosh Dr, Markham, ON L3R 9T3',
    phone: '905-597-6677',
    website: 'https://www.metatherapylab.com',
    instagram: null,
    description: 'Certified IV therapy and regenerative medicine facility in Markham. Offers PRP injections, NAD+ IV therapy, iron infusions, Myers cocktail, Botox, and holistic naturopathic care. Evidence-based protocols administered by trained medical professionals in a clinical setting.',
    keywords: ['PRP Markham', 'NAD+ IV Markham', 'IV therapy Markham', 'regenerative medicine GTA', 'Myers cocktail Ontario'],
  },
  {
    name: 'Hyper Regen Sports Medicine',
    category: 'clinics',
    subcategory: 'regenerative_medicine',
    city: 'Toronto', province: 'ON',
    address: '400 Wellington Street West, Units 1-2, Toronto, ON M5V 0B5',
    phone: '(416) 257-3999',
    website: 'https://www.hyperregenorthopedics.com',
    instagram: null,
    description: 'Leading Toronto orthopedic and sports medicine clinic specializing in PRP injections, regenerative medicine, physiotherapy, and minimally invasive orthopedic surgery. Treats sports injuries, tendon pathology, osteoarthritis, and chronic musculoskeletal pain using cutting-edge regenerative protocols.',
    keywords: ['PRP Toronto sports', 'regenerative orthopedics Toronto', 'sports medicine Toronto', 'physiotherapy Toronto', 'PRP injections'],
  },
  {
    name: 'Anti-Aging Medical & Laser Clinic Vancouver',
    category: 'clinics',
    subcategory: 'anti_aging',
    city: 'Vancouver', province: 'BC',
    address: '2200 West 4th Avenue, Vancouver, BC V6K 1N8',
    phone: '(604) 261-9121',
    website: 'https://www.antiagingvancouver.com',
    instagram: '@antiagingvan',
    description: 'Vancouver\'s leading anti-aging clinic with 20+ years of experience, led by Dr. Gidon Frame MD (CCFP, ABAARM, NAMS). Offers hormone optimization, testosterone therapy, peptide therapy, skin rejuvenation, hair restoration, and body contouring. Certified in anti-aging medicine and menopause management.',
    keywords: ['anti-aging clinic Vancouver', 'TRT Vancouver', 'peptide therapy Vancouver', 'hormone optimization BC', 'Dr Gidon Frame'],
  },
  {
    name: 'Richmond Anti-Aging Clinic (RAAC)',
    category: 'clinics',
    subcategory: 'anti_aging',
    city: 'Richmond', province: 'BC',
    address: 'Unit 110, 5580 No.3 Rd, Richmond, BC V7X 0R8',
    phone: '604-277-9006',
    website: 'https://richmondantiaging.ca',
    instagram: '@richmondantiagingca',
    description: 'Medical aesthetics and functional medicine clinic serving Richmond BC since 2011. Member of MMC Wellness Group. Offers peptide therapy (BPC-157), NAD+ therapy, hormone and testosterone replacement therapy, semaglutide weight loss, and anti-aging aesthetics. Open 7 days a week.',
    keywords: ['BPC-157 Richmond BC', 'NAD+ therapy Richmond', 'TRT Richmond BC', 'anti-aging clinic Richmond', 'semaglutide BC', 'MMC Wellness'],
  },
  {
    name: 'EnerChanges Optimal Aging Clinic',
    category: 'clinics',
    subcategory: 'anti_aging',
    city: 'Vancouver', province: 'BC',
    address: '601 W Broadway, Unit L6, Vancouver, BC V5Z 4C2',
    phone: '604-565-8380',
    website: 'https://www.enerchanges.com',
    instagram: '@enerchangeshealth',
    description: 'A4M-affiliated optimal aging and longevity clinic offering bio-identical hormone therapy including thyroid, estrogen, progesterone, testosterone, and HGH optimization. Specializes in weight management, anti-aging medicine, and comprehensive hormone restoration programs using naturopathic approaches.',
    keywords: ['BHRT Vancouver', 'HGH therapy BC', 'hormone optimization Vancouver', 'anti-aging naturopath BC', 'A4M clinic Canada'],
  },
  {
    name: 'Clinique Anti Aging Montreal',
    category: 'clinics',
    subcategory: 'anti_aging',
    city: 'Montreal', province: 'QC',
    address: '3431 Stanley, Montreal, QC H3A 1S2',
    phone: '514-482-1262',
    website: 'https://cliniqueantiaging.com',
    instagram: '@cliniqueantiaging',
    description: 'Montreal anti-aging and regenerative medicine clinic led by Dr. Cynthia Stolovitz (family physician, 30+ years of experience). Specializes in bioidentical hormone replacement therapy, urogynecological laser, and regenerative functional aesthetic medicine. Comprehensive approach to women\'s and men\'s hormone health.',
    keywords: ['anti-aging clinic Montreal', 'BHRT Montreal', 'hormone therapy Montreal', 'regenerative medicine Quebec', 'Dr Cynthia Stolovitz'],
  },
  {
    name: 'Aeon Future Health',
    category: 'clinics',
    subcategory: 'longevity',
    city: 'Calgary', province: 'AB',
    address: '903 10th Avenue SW, Suite 201, Calgary, AB T2R 0Z9',
    phone: '403-454-8477',
    website: 'https://aeonfuturehealth.com',
    instagram: '@aeonfuturehealth',
    description: 'Calgary longevity and integrative health optimization clinic. One of the first Canadian facilities to offer a comprehensive longevity package with evidence-based high-tech options. Their CORE program is a year-long hormonal balance and vitality restoration partnership, combining advanced diagnostics with personalized therapeutic protocols.',
    keywords: ['longevity clinic Calgary', 'hormone optimization Calgary', 'anti-aging Calgary', 'integrative health Alberta', 'Aeon Future Health'],
  },
  {
    name: 'Nardella Clinic',
    category: 'clinics',
    subcategory: 'functional_medicine',
    city: 'Calgary', province: 'AB',
    address: '202, 1910 – 20th Avenue NW, Calgary, AB T2M 1H5',
    phone: '403-282-4488',
    website: 'https://nardellaclinic.com',
    instagram: null,
    description: 'Calgary naturopathic clinic specializing in hormone optimization, regenerative medicine, anti-aging medicine, functional medicine, hyperbaric oxygen therapy, and bioidentical hormone replacement. Led by naturopathic doctors with expertise in andropause and menopause management.',
    keywords: ['naturopathic clinic Calgary', 'BHRT Calgary', 'hyperbaric oxygen Calgary', 'hormone optimization naturopath', 'regenerative medicine Calgary'],
  },
  {
    name: 'deRMA Skin Institute',
    category: 'clinics',
    subcategory: 'weight_loss',
    city: 'Guelph', province: 'ON',
    address: '33 Farley Dr Unit #8, Guelph, ON N1L 0B7',
    phone: '(519) 836-8558',
    website: 'https://dermaskininstitute.com',
    instagram: '@dermaskin_institute',
    description: 'Medical spa and dermatology clinic in Guelph and Burlington offering medically supervised semaglutide and tirzepatide weight loss programs (MedFit). GLP-1 injections monitored by experienced medical providers with ongoing support. Also offers medical aesthetics, laser treatments, and skincare.',
    keywords: ['semaglutide Guelph', 'tirzepatide Ontario', 'GLP-1 weight loss clinic', 'Ozempic clinic Ontario', 'medical weight loss Guelph'],
  },
  {
    name: 'MMC Wellness Center',
    category: 'clinics',
    subcategory: 'functional_medicine',
    city: 'Richmond', province: 'BC',
    address: '130-8780 Blundell Rd, Richmond, BC V6Y 1K3',
    phone: '604-277-9006',
    website: 'https://mmcwellness.ca',
    instagram: null,
    description: 'Richmond BC functional medicine clinic offering peptide therapy (Sermorelin, Bremelanotide/PT-141), semaglutide-assisted weight loss, testosterone and hormone replacement therapy, and NAD+ IV therapy. Comprehensive programs combining multiple modalities. Part of the MMC Wellness Group.',
    keywords: ['peptide therapy Richmond BC', 'Sermorelin BC', 'semaglutide Richmond', 'TRT Richmond', 'NAD+ IV BC', 'MMC Wellness'],
  },
  {
    name: 'TruMed Naturopathic Clinic',
    category: 'clinics',
    subcategory: 'functional_medicine',
    city: 'Edmonton', province: 'AB',
    address: '11630 119 St NW, Edmonton, AB T5G 2X7',
    phone: '+1 780-757-8378',
    website: 'https://www.trumed.ca',
    instagram: null,
    description: 'Edmonton naturopathic clinic offering NAD+ IV infusions, IV glutathione, Myers cocktail, iron infusions, and hyperbaric oxygen therapy. Synergistic IV and HBOT protocols for longevity, energy optimization, and performance recovery. Evidence-based naturopathic approach.',
    keywords: ['NAD+ IV Edmonton', 'IV therapy Edmonton', 'hyperbaric oxygen Edmonton', 'glutathione IV Alberta', 'Myers cocktail Edmonton'],
  },
  {
    name: 'Emerald Medical and Wellness Centre',
    category: 'clinics',
    subcategory: 'functional_medicine',
    city: 'Edmonton', province: 'AB',
    address: '9943 109 St NW, Edmonton, AB T5K 1H6',
    phone: '(587) 402-4392',
    website: 'https://emeraldwellness.ca',
    instagram: null,
    description: 'Edmonton integrative medical clinic offering NAD+ IV therapy, comprehensive IV infusion therapy, and functional medicine services. Combines conventional and integrative approaches to support energy, cognitive function, immune health, and overall cellular optimization.',
    keywords: ['NAD+ IV Edmonton', 'IV therapy Edmonton', 'functional medicine Edmonton', 'integrative medicine Alberta'],
  },
  {
    name: 'Longev Clinic',
    category: 'clinics',
    subcategory: 'longevity',
    city: 'Toronto', province: 'ON',
    address: '493 King Street East, Toronto, ON M5A 1L9',
    phone: '(416) 954-9994',
    website: 'https://longevclinictoronto.com',
    instagram: '@longev.clinic',
    description: 'Toronto naturopathic longevity clinic combining naturopathic medicine, osteopathy, chiropractic care, and holistic nutrition for both acute care and long-term health optimization. Founded by NDs with 10+ years of experience in longevity and preventive medicine.',
    keywords: ['longevity clinic Toronto', 'naturopathic Toronto', 'osteopathy Toronto', 'holistic medicine Toronto', 'Longev Clinic'],
  },
  {
    name: 'The Longevity Lab',
    category: 'clinics',
    subcategory: 'longevity',
    city: 'Calgary', province: 'AB',
    address: '45 Crowfoot Terrace NW, Calgary, AB T3G 4J8',
    phone: '(825) 540-8286',
    website: 'https://longevitylab.clinic',
    instagram: null,
    description: 'Integrative longevity clinic in NW Calgary offering naturopathic medicine, comprehensive advanced lab testing, IV therapy, nurse practitioner services, psychological counselling, traditional Chinese medicine and acupuncture, and infrared sauna. A comprehensive one-stop longevity practice.',
    keywords: ['longevity clinic Calgary NW', 'IV therapy Calgary', 'naturopathic Calgary', 'infrared sauna Calgary', 'acupuncture longevity'],
  },

  // ══════════════════════════════════════════════
  // WELL LONGEVITY NETWORK
  // ══════════════════════════════════════════════
  {
    name: 'WELL Longevity – Toronto',
    category: 'clinics',
    subcategory: 'longevity',
    city: 'Toronto', province: 'ON',
    address: '181 University Ave, Suite 1605, Toronto, ON M5H 2X7',
    phone: null,
    website: 'https://welllongevity.ca',
    instagram: null,
    description: 'Canada\'s most advanced private longevity program. Offers comprehensive health optimization, regenerative medicine (ReGen Scientific protocols), in-depth longevity assessments, and executive health services. Located in the financial district. Part of the WELL Health Sciences network.',
    keywords: ['longevity clinic Toronto', 'private health optimization', 'regenerative medicine Toronto', 'executive health Toronto', 'WELL Longevity'],
  },
  {
    name: 'WELL Longevity – Ottawa',
    category: 'clinics',
    subcategory: 'longevity',
    city: 'Ottawa', province: 'ON',
    address: '401-116 Albert Street, Ottawa, ON K1P 5G3',
    phone: '613-216-3932',
    website: 'https://welllongevity.ca',
    instagram: null,
    description: 'Private longevity and health optimization clinic in downtown Ottawa. Offers men\'s health, women\'s health, and comprehensive personalized longevity programs. Part of the WELL Health Sciences national network of longevity clinics.',
    keywords: ['longevity clinic Ottawa', 'men\'s health Ottawa', 'women\'s health Ottawa', 'health optimization Ottawa', 'WELL Longevity'],
  },
  {
    name: 'WELL Longevity – Vancouver',
    category: 'clinics',
    subcategory: 'longevity',
    city: 'Vancouver', province: 'BC',
    address: '555 W 8th Ave, Suite 306, Vancouver, BC V5Z 1C6',
    phone: '604-628-2822',
    website: 'https://welllongevity.ca',
    instagram: null,
    description: 'Private longevity and health optimization clinic near Broadway-City Hall SkyTrain station. Comprehensive longevity programs, private health assessments, and personalized wellness protocols. Part of the WELL Health Sciences national network.',
    keywords: ['longevity clinic Vancouver', 'health optimization Vancouver', 'private health assessment BC', 'WELL Longevity Vancouver'],
  },
  {
    name: 'WELL Longevity – Montreal (ExcelleMD)',
    category: 'clinics',
    subcategory: 'longevity',
    city: 'Montreal', province: 'QC',
    address: '6100 Rue du Boisé, Suite 113, Montréal, QC H3S 2W1',
    phone: null,
    website: 'https://welllongevity.ca',
    instagram: null,
    description: 'Montreal private health and longevity clinic operating under the ExcelleMD brand within the WELL Longevity network. Offers rapid-access private medical care, health optimization services, and longevity programs for Quebec patients.',
    keywords: ['longevity clinic Montreal', 'private clinic Quebec', 'ExcelleMD Montreal', 'WELL Longevity Montreal', 'health optimization Quebec'],
  },

  // ══════════════════════════════════════════════
  // COMPOUNDING PHARMACIES
  // ══════════════════════════════════════════════
  {
    name: 'Aurora Compounding Pharmacy',
    category: 'compounding_pharmacies',
    city: 'Aurora', province: 'ON',
    address: '15017 Yonge St, Suite 204, Aurora, ON L4G 1M5',
    phone: '(905) 727-1343',
    website: 'https://auroracompoundingrx.ca',
    instagram: null,
    description: 'Expert Canadian compounding pharmacy creating customized hormone medications including BHRT (testosterone creams/gels/troches, estrogen, progesterone), thyroid support, and TRT formulations. Ships next-day to all Canadian provinces. Multiple provincial locations in Vancouver, Winnipeg, and Calgary.',
    keywords: ['compounding pharmacy Ontario', 'BHRT compounding', 'testosterone cream compound', 'custom hormone pharmacy Canada', 'Aurora Compounding'],
  },
  {
    name: 'Pace Pharmacy & Compounding Experts',
    category: 'compounding_pharmacies',
    city: 'Toronto', province: 'ON',
    address: '14 Isabella Street, Toronto, ON M4Y 1N1',
    phone: '416-515-7223',
    website: 'https://pacepharmacy.com',
    instagram: null,
    description: 'Specialized Toronto compounding pharmacy focused on bioidentical hormone replacement therapy (BHRT) and custom hormone formulations for men and women. Formulates custom hormone creams, capsules, and troches for Canadian prescriptions only. Ships within Canada. Also operates a Leaside location.',
    keywords: ['BHRT pharmacy Toronto', 'compounding pharmacy Toronto', 'custom hormone therapy', 'bioidentical hormones Toronto', 'Pace Pharmacy'],
  },
  {
    name: 'People\'s Choice Compounding Pharmacy',
    category: 'compounding_pharmacies',
    city: 'Richmond Hill', province: 'ON',
    address: 'Yonge Street, Richmond Hill, ON L4C 5G2',
    phone: '905-770-3113',
    website: 'https://peopleschoicepharmacy.ca',
    instagram: null,
    description: 'State-of-the-art compounding pharmacy with 45 years of experience. Specializes in bioidentical hormones (BHRT), prescription dermatology compounds, and pediatric medications. Free shipping Ontario-wide for compounded BHRT orders. Serving Toronto, Richmond Hill, Markham, and Vaughan.',
    keywords: ['compounding pharmacy Richmond Hill', 'BHRT Ontario', 'bioidentical hormones compounding', 'custom pharmacy Ontario'],
  },
  {
    name: 'Valor Health Compounding Pharmacy',
    category: 'compounding_pharmacies',
    city: 'Windsor', province: 'ON',
    address: '8424 Wyandotte St E, Windsor, ON N8S 1T6',
    phone: '519-974-4114',
    website: null,
    instagram: null,
    description: 'Windsor-based combined compounding pharmacy and medical clinic offering hormone replacement therapy, bioidentical hormones, and customized specialty medications. Convenient one-stop model allowing prescription and compounding services under the same roof.',
    keywords: ['compounding pharmacy Windsor', 'BHRT Windsor Ontario', 'hormone replacement Windsor', 'custom pharmacy Windsor'],
  },
];

// ─── MAIN ─────────────────────────────────────────────────────────────────────
async function main() {
  console.log('🇨🇦 Peptide Alliance — Canadian Business Seed Starting...\n');
  console.log(`📋 Total businesses to insert: ${BUSINESSES.length}\n`);

  const results = [];
  let inserted = 0;
  let failed   = 0;

  for (const biz of BUSINESSES) {
    const slug = slugify(biz.name, biz.city ?? 'canada');

    const record = {
      name:              biz.name,
      slug,
      category:          biz.category,
      subcategory:       biz.subcategory ?? '',
      city:              biz.city ?? null,
      city_slug:         cityToSlug(biz.city),
      province:          biz.province ?? null,
      address:           biz.address ?? null,
      phone:             biz.phone ?? null,
      website:           biz.website ?? null,
      instagram:         biz.instagram ?? null,
      description_en:    biz.description,
      keywords:          biz.keywords ?? [],
      is_active:         true,
      is_verified:       false,
      is_premium:        false,
      subscription_tier: 'free',
      source:            'google_places',
      claimed_by:        null,      // unclaimed — owners can claim via /claim
    };

    const { data, error } = await supabase
      .from('businesses')
      .insert(record)
      .select('id, slug')
      .single();

    if (error) {
      console.error(`  ✗  ${biz.name} (${biz.city}, ${biz.province}): ${error.message}`);
      failed++;
      results.push({ name: biz.name, city: biz.city, province: biz.province, error: error.message });
    } else {
      console.log(`  ✓  [${biz.category.padEnd(22)}] ${biz.name} — ${biz.city ?? '—'}, ${biz.province ?? '—'}`);
      inserted++;
      results.push({ name: biz.name, city: biz.city, province: biz.province, slug: data.slug, id: data.id });
    }
  }

  // ── Summary ───────────────────────────────────────────────────────────────
  console.log(`\n${'═'.repeat(65)}`);
  console.log('✅ SEED COMPLETE');
  console.log(`${'═'.repeat(65)}`);
  console.log(`  Inserted : ${inserted}`);
  console.log(`  Failed   : ${failed}`);

  // Category breakdown
  const byCategory = {};
  for (const biz of BUSINESSES) {
    byCategory[biz.category] = (byCategory[biz.category] ?? 0) + 1;
  }
  console.log('\n📊 By category:');
  for (const [cat, count] of Object.entries(byCategory)) {
    console.log(`  ${cat.padEnd(26)} ${count}`);
  }

  // Province breakdown
  const byProvince = {};
  for (const biz of BUSINESSES) {
    const p = biz.province ?? '??';
    byProvince[p] = (byProvince[p] ?? 0) + 1;
  }
  console.log('\n🗺️  By province:');
  for (const [prov, count] of Object.entries(byProvince).sort()) {
    console.log(`  ${prov.padEnd(6)} ${count}`);
  }

  if (failed > 0) {
    console.log('\n❌ Failures:');
    for (const r of results.filter(r => r.error)) {
      console.log(`  ${r.name}: ${r.error}`);
    }
  }
}

main().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
