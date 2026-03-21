#!/usr/bin/env node
// ─── Peptide Alliance — Demo seed script ──────────────────────────────────────────
// Run: node scripts/seed-demo.mjs
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://jypneygzfjwknimanvxm.supabase.co';
const SERVICE_ROLE = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp5cG5leWd6Zmp3a25pbWFudnhtIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MjE2Mjg0OCwiZXhwIjoyMDg3NzM4ODQ4fQ.e49Kz9ZEOkdIUG7E5NYCpZRY46AIlUkQsjGYTHFH41E';

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE, {
  auth: { autoRefreshToken: false, persistSession: false },
});

const PASSWORD = 'LatinTest2024!';

function slugify(name, city) {
  const base = `${name}-${city}`.toLowerCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 55);
  const suffix = Math.random().toString(36).slice(2, 7);
  return `${base}-${suffix}`;
}

function daysFromNow(n) {
  const d = new Date();
  d.setDate(d.getDate() + n);
  return d.toISOString();
}

const subStarted = new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString();

// ─── TEST USERS ──────────────────────────────────────────────────────────────
const TEST_USERS = [
  { email: 'maria.garcia@peptidealliance-test.io', name: 'Maria Garcia',   lang: 'es', key: 'maria' },
  { email: 'carlos.lopez@peptidealliance-test.io',  name: 'Carlos López',  lang: 'es', key: 'carlos' },
  { email: 'ana.martinez@peptidealliance-test.io',  name: 'Ana Martínez',  lang: 'en', key: 'ana' },
];

// ─── BUSINESSES (36 total — 6 per category × 6 categories) ──────────────────
// Tier distribution per category: 2 free (maria), 2 premium (carlos), 2 featured (ana)
const BUSINESSES = [

  // ════════════════════════════════════════════════════════════
  // COMIDA
  // ════════════════════════════════════════════════════════════
  {
    name: 'Casa del Taco',
    category: 'comida', subcategory: 'restaurante',
    city: 'Toronto', province: 'ON',
    address: '123 Queen St W, Toronto, ON M5H 2M9',
    phone: '+1 (416) 555-0101', website: 'https://casadeltaco.example.com',
    logo_url: 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=400&q=80',
    description_en: 'Authentic Mexican street tacos made with family recipes from Jalisco. Our handmade corn tortillas and slow-braised meats bring the flavours of Mexico City right to downtown Toronto.',
    owner: 'maria', subscription_tier: 'free',    is_premium: false, is_verified: false, review_count: 4, latin_confidence: 92,
  },
  {
    name: 'El Rincón Colombiano',
    category: 'comida', subcategory: 'restaurante',
    city: 'Montreal', province: 'QC',
    address: '456 Rue Sainte-Catherine O, Montréal, QC H3B 1A6',
    phone: '+1 (514) 555-0202', website: 'https://rincon-colombiano.example.com',
    logo_url: 'https://images.unsplash.com/photo-1552332386-f8dd00dc2f85?w=400&q=80',
    description_en: 'A cozy Colombian kitchen bringing bandeja paisa, arepas, and fresh jugos naturales to the heart of Montreal. Family-run since 2018.',
    owner: 'maria', subscription_tier: 'free',    is_premium: false, is_verified: false, review_count: 7, latin_confidence: 95,
  },
  {
    name: 'La Pupusería Salvadoreña',
    category: 'comida', subcategory: 'restaurante',
    city: 'Vancouver', province: 'BC',
    address: '789 Robson St, Vancouver, BC V6Z 1A1',
    phone: '+1 (604) 555-0303', website: 'https://lapupuseria.example.com',
    logo_url: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=400&q=80',
    description_en: "Vancouver's only dedicated Salvadoran pupusería, serving handmade pupusas filled with loroco, chicharrón, and cheese. Pairs perfectly with our house-made curtido.",
    owner: 'carlos', subscription_tier: 'premium', is_premium: true, is_verified: true, review_count: 23, latin_confidence: 98,
  },
  {
    name: 'Taquería Los Compadres',
    category: 'comida', subcategory: 'comida_rapida',
    city: 'Calgary', province: 'AB',
    address: '321 17th Ave SW, Calgary, AB T2S 0B1',
    phone: '+1 (403) 555-0404', website: 'https://loscompadres.example.com',
    logo_url: 'https://images.unsplash.com/photo-1551218808-94e220e084d2?w=400&q=80',
    description_en: "Fast-casual taquería serving Calgary's best al pastor, carnitas, and veggie tacos. Catering available for offices, quinceañeras, and corporate events.",
    owner: 'carlos', subscription_tier: 'premium', is_premium: true, is_verified: true, review_count: 31, latin_confidence: 90,
  },
  {
    name: 'Restaurante Lima',
    category: 'comida', subcategory: 'restaurante',
    city: 'Ottawa', province: 'ON',
    address: '555 Bank St, Ottawa, ON K1P 1B5',
    phone: '+1 (613) 555-0505', website: 'https://restaurantelima.example.com',
    logo_url: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=400&q=80',
    description_en: "A premium Peruvian dining experience in the nation's capital. Featuring ceviche, lomo saltado, and causa rellena crafted with imported Peruvian chiles and fresh Atlantic seafood.",
    owner: 'ana', subscription_tier: 'featured', is_premium: true, is_verified: true, review_count: 52, latin_confidence: 97,
  },
  {
    name: 'Parrilla Argentina',
    category: 'comida', subcategory: 'restaurante',
    city: 'Edmonton', province: 'AB',
    address: '987 Jasper Ave, Edmonton, AB T5J 1W8',
    phone: '+1 (780) 555-0606', website: 'https://parrillaargentina.example.com',
    logo_url: 'https://images.unsplash.com/photo-1529692236671-f1f6cf9683ba?w=400&q=80',
    description_en: "Edmonton's premier Argentine steakhouse. Our wood-fired parilla grill crafts the finest grass-fed Alberta beef with authentic chimichurri and Malbec wine pairings.",
    owner: 'ana', subscription_tier: 'featured', is_premium: true, is_verified: true, review_count: 68, latin_confidence: 94,
  },

  // ════════════════════════════════════════════════════════════
  // SERVICIOS PROFESIONALES
  // ════════════════════════════════════════════════════════════
  {
    name: 'García & Asociados Contadores',
    category: 'servicios_profesionales', subcategory: 'contabilidad',
    city: 'Toronto', province: 'ON',
    address: '200 Bay St Suite 1000, Toronto, ON M5J 2W4',
    phone: '+1 (416) 555-0107', website: 'https://garcia-contadores.example.com',
    logo_url: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=400&q=80',
    description_en: 'Bilingual CPA firm specializing in tax returns, incorporation, and bookkeeping for Latin-owned small businesses across Ontario. We speak your language — literally.',
    owner: 'maria', subscription_tier: 'free',    is_premium: false, is_verified: false, review_count: 11, latin_confidence: 88,
  },
  {
    name: 'Migración Latina Services',
    category: 'servicios_profesionales', subcategory: 'immigracion',
    city: 'Montreal', province: 'QC',
    address: '1000 Rue De La Gauchetière O, Montréal, QC H3B 4W5',
    phone: '+1 (514) 555-0208', website: 'https://migracionlatina.example.com',
    logo_url: 'https://images.unsplash.com/photo-1521791136064-7986c2920216?w=400&q=80',
    description_en: 'Regulated immigration consultants helping Latin families navigate the Canadian immigration system. Permanent residency, work permits, study visas, and citizenship applications.',
    owner: 'maria', subscription_tier: 'free',    is_premium: false, is_verified: false, review_count: 19, latin_confidence: 85,
  },
  {
    name: 'López & Associates Law',
    category: 'servicios_profesionales', subcategory: 'legal',
    city: 'Vancouver', province: 'BC',
    address: '1055 W Hastings St, Vancouver, BC V6E 2E9',
    phone: '+1 (604) 555-0309', website: 'https://lopezlaw.example.com',
    logo_url: 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=400&q=80',
    description_en: 'Full-service law firm with Spanish-speaking attorneys. We handle immigration, real estate, business law, and family law for the Latin community in BC.',
    owner: 'carlos', subscription_tier: 'premium', is_premium: true, is_verified: true, review_count: 28, latin_confidence: 87,
  },
  {
    name: 'Traducciones Profesionales',
    category: 'servicios_profesionales', subcategory: 'traduccion',
    city: 'Calgary', province: 'AB',
    address: '639 5th Ave SW, Calgary, AB T2P 0M9',
    phone: '+1 (403) 555-0410', website: 'https://traducciones-pro.example.com',
    logo_url: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400&q=80',
    description_en: 'Certified translation services for legal, medical, and government documents. Spanish-English-French translation with 48-hour turnaround. Notarized translations available.',
    owner: 'carlos', subscription_tier: 'premium', is_premium: true, is_verified: true, review_count: 17, latin_confidence: 82,
  },
  {
    name: 'Consultoría Empresarial Latina',
    category: 'servicios_profesionales', subcategory: 'consultoria',
    city: 'Ottawa', province: 'ON',
    address: '66 Slater St Suite 900, Ottawa, ON K1P 5H1',
    phone: '+1 (613) 555-0511', website: 'https://cela-consulting.example.com',
    logo_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80',
    description_en: 'Business consulting and government grant assistance for Latin entrepreneurs in Canada. We help you access CEBA funds, BDC loans, and provincial grants — all explained in Spanish.',
    owner: 'ana', subscription_tier: 'featured', is_premium: true, is_verified: true, review_count: 43, latin_confidence: 90,
  },
  {
    name: 'Latina Financial Group',
    category: 'servicios_profesionales', subcategory: 'financiero',
    city: 'Edmonton', province: 'AB',
    address: '10020 100 St NW, Edmonton, AB T5J 0N3',
    phone: '+1 (780) 555-0612', website: 'https://latinafinancial.example.com',
    logo_url: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&q=80',
    description_en: 'Fee-only financial planning for Latin families. Bilingual advisors specializing in first-generation wealth building, RRSP, TFSA, RESP, and mortgage planning.',
    owner: 'ana', subscription_tier: 'featured', is_premium: true, is_verified: true, review_count: 36, latin_confidence: 86,
  },

  // ════════════════════════════════════════════════════════════
  // SERVICIOS PERSONALES
  // ════════════════════════════════════════════════════════════
  {
    name: 'Peluquería Latina',
    category: 'servicios_personales', subcategory: 'peluqueria',
    city: 'Toronto', province: 'ON',
    address: '800 Bloor St W, Toronto, ON M6G 1L7',
    phone: '+1 (416) 555-0113', website: null,
    logo_url: 'https://images.unsplash.com/photo-1560869713-bf7cf7159cba?w=400&q=80',
    description_en: 'Specializing in curly Latina hair textures, blowouts, keratin treatments, and traditional Latin braiding. Walk-ins welcome on weekdays.',
    owner: 'maria', subscription_tier: 'free',    is_premium: false, is_verified: false, review_count: 9, latin_confidence: 91,
  },
  {
    name: 'Belleza Caribeña',
    category: 'servicios_personales', subcategory: 'spa',
    city: 'Montreal', province: 'QC',
    address: '5110 Ave du Parc, Montréal, QC H2V 4G5',
    phone: '+1 (514) 555-0214', website: null,
    logo_url: 'https://images.unsplash.com/photo-1600948836101-f9ffda59d250?w=400&q=80',
    description_en: 'Caribbean-inspired beauty studio offering facials, waxing, eyebrow shaping, and body treatments. All products are natural and cruelty-free.',
    owner: 'maria', subscription_tier: 'free',    is_premium: false, is_verified: false, review_count: 14, latin_confidence: 89,
  },
  {
    name: 'Salón Moderno',
    category: 'servicios_personales', subcategory: 'salon',
    city: 'Vancouver', province: 'BC',
    address: '2148 W 4th Ave, Vancouver, BC V6K 1N6',
    phone: '+1 (604) 555-0315', website: 'https://salonmoderno.example.com',
    logo_url: 'https://images.unsplash.com/photo-1562322140-8baeececf3df?w=400&q=80',
    description_en: 'A modern Latin beauty salon in Kitsilano offering haircuts, colour, balayage, and bridal styling. Our team is trained in both European and Latin hair techniques.',
    owner: 'carlos', subscription_tier: 'premium', is_premium: true, is_verified: true, review_count: 41, latin_confidence: 93,
  },
  {
    name: 'Barbería El Maestro',
    category: 'servicios_personales', subcategory: 'barberia',
    city: 'Calgary', province: 'AB',
    address: '1212 9th Ave SE, Calgary, AB T2G 0T5',
    phone: '+1 (403) 555-0416', website: null,
    logo_url: 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=400&q=80',
    description_en: 'Old-school Latin barbershop meets modern grooming. We specialize in fades, lineups, beard sculpting, and hot towel shaves. Sports bar atmosphere, cold drinks included.',
    owner: 'carlos', subscription_tier: 'premium', is_premium: true, is_verified: true, review_count: 55, latin_confidence: 96,
  },
  {
    name: 'Uñas & Más',
    category: 'servicios_personales', subcategory: 'estetica',
    city: 'Ottawa', province: 'ON',
    address: '230 Rideau St, Ottawa, ON K1N 5Y3',
    phone: '+1 (613) 555-0517', website: 'https://unas-y-mas.example.com',
    logo_url: 'https://images.unsplash.com/photo-1604654894610-df63bc536371?w=400&q=80',
    description_en: 'Premium nail salon and beauty bar. Gel nails, acrylics, nail art, eyebrow threading, and waxing. Latin-inspired nail designs are our specialty!',
    owner: 'ana', subscription_tier: 'featured', is_premium: true, is_verified: true, review_count: 72, latin_confidence: 90,
  },
  {
    name: 'Spa Andino Wellness',
    category: 'servicios_personales', subcategory: 'spa',
    city: 'Edmonton', province: 'AB',
    address: '10250 101 St NW Suite 200, Edmonton, AB T5J 3P4',
    phone: '+1 (780) 555-0618', website: 'https://spaandino.example.com',
    logo_url: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=400&q=80',
    description_en: 'A luxury Andean-inspired wellness spa offering therapeutic massage, stone therapy, aromatherapy, and traditional South American healing treatments.',
    owner: 'ana', subscription_tier: 'featured', is_premium: true, is_verified: true, review_count: 48, latin_confidence: 94,
  },

  // ════════════════════════════════════════════════════════════
  // SALUD
  // ════════════════════════════════════════════════════════════
  {
    name: 'Clínica Dr. Ramírez',
    category: 'salud', subcategory: 'medico',
    city: 'Toronto', province: 'ON',
    address: '1 Dundas St W Suite 500, Toronto, ON M5G 2C2',
    phone: '+1 (416) 555-0119', website: 'https://clinicaRamirez.example.com',
    logo_url: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=400&q=80',
    description_en: 'Bilingual family medicine clinic accepting new patients. Dr. Ramírez has 20+ years of experience and understands the unique health challenges of the Latin community in Canada.',
    owner: 'maria', subscription_tier: 'free',    is_premium: false, is_verified: false, review_count: 33, latin_confidence: 88,
  },
  {
    name: 'Dra. González Medicina',
    category: 'salud', subcategory: 'medico',
    city: 'Montreal', province: 'QC',
    address: '1001 Bd De Maisonneuve O, Montréal, QC H3A 1G4',
    phone: '+1 (514) 555-0220', website: null,
    logo_url: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=400&q=80',
    description_en: 'Doctora González offers general medicine, womens health, and preventive care. Spanish-language consultations available Monday through Friday.',
    owner: 'maria', subscription_tier: 'free',    is_premium: false, is_verified: false, review_count: 25, latin_confidence: 86,
  },
  {
    name: 'Dental Sonrisa',
    category: 'salud', subcategory: 'dentista',
    city: 'Vancouver', province: 'BC',
    address: '400 Burrard St Suite 300, Vancouver, BC V6C 3A6',
    phone: '+1 (604) 555-0321', website: 'https://dentalsonrisa.example.com',
    logo_url: 'https://images.unsplash.com/photo-1588776814546-1ffedbe47425?w=400&q=80',
    description_en: 'Modern dental clinic with Spanish-speaking staff. We offer cleanings, whitening, orthodontics, and emergency dental care. Evening and weekend appointments available.',
    owner: 'carlos', subscription_tier: 'premium', is_premium: true, is_verified: true, review_count: 47, latin_confidence: 89,
  },
  {
    name: 'FisioAndina Rehabilitation',
    category: 'salud', subcategory: 'fisioterapia',
    city: 'Calgary', province: 'AB',
    address: '840 6th Ave SW, Calgary, AB T2P 3E5',
    phone: '+1 (403) 555-0422', website: 'https://fisioandia.example.com',
    logo_url: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&q=80',
    description_en: 'Bilingual physiotherapy clinic specializing in sports injuries, back pain, and post-surgical rehab. Traditional Latin healing methods integrated with evidence-based techniques.',
    owner: 'carlos', subscription_tier: 'premium', is_premium: true, is_verified: true, review_count: 29, latin_confidence: 85,
  },
  {
    name: 'Centro Psicología Latina',
    category: 'salud', subcategory: 'psicologia',
    city: 'Ottawa', province: 'ON',
    address: '100 Argyle Ave, Ottawa, ON K2P 1B6',
    phone: '+1 (613) 555-0523', website: 'https://psicologialatina.example.com',
    logo_url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&q=80',
    description_en: 'Culturally sensitive mental health services for the Latin community. Individual therapy, couples counselling, and family therapy in Spanish and English. Sliding scale fees available.',
    owner: 'ana', subscription_tier: 'featured', is_premium: true, is_verified: true, review_count: 61, latin_confidence: 92,
  },
  {
    name: 'Naturista Vida Sana',
    category: 'salud', subcategory: 'natural',
    city: 'Edmonton', province: 'AB',
    address: '10160 103 St NW, Edmonton, AB T5J 0X6',
    phone: '+1 (780) 555-0624', website: 'https://vidasana.example.com',
    logo_url: 'https://images.unsplash.com/photo-1505751172876-fa1923c5c528?w=400&q=80',
    description_en: 'Natural health store and naturopathic clinic. We carry Latin herbal remedies, teas, vitamins, and offer consultations with our bilingual naturopath.',
    owner: 'ana', subscription_tier: 'featured', is_premium: true, is_verified: true, review_count: 38, latin_confidence: 87,
  },

  // ════════════════════════════════════════════════════════════
  // EVENTOS (has expires_at)
  // ════════════════════════════════════════════════════════════
  {
    name: 'Quinceañera Dreams Events',
    category: 'eventos', subcategory: 'celebracion',
    city: 'Toronto', province: 'ON',
    address: '100 Princes Blvd, Toronto, ON M6K 3C3',
    phone: '+1 (416) 555-0125', website: null,
    logo_url: 'https://images.unsplash.com/photo-1527529482837-4698179dc6ce?w=400&q=80',
    description_en: "Full-service quinceañera planning for your princess's special day! Venue, décor, DJ, catering, and photography packages. The most magical day deserves the best team.",
    owner: 'maria', subscription_tier: 'free',    is_premium: false, is_verified: false, review_count: 6, latin_confidence: 95, expires_at: daysFromNow(30),
  },
  {
    name: 'Festival Salsa Montreal 2025',
    category: 'eventos', subcategory: 'festival',
    city: 'Montreal', province: 'QC',
    address: '285 Rue Sainte-Catherine E, Montréal, QC H2X 1L2',
    phone: '+1 (514) 555-0226', website: 'https://salsaMTL.example.com',
    logo_url: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=400&q=80',
    description_en: '2-day salsa festival featuring international instructors, live music, outdoor performances, and a closing gala night. Workshops for all levels. Join 3,000+ dancers!',
    owner: 'maria', subscription_tier: 'free',    is_premium: false, is_verified: false, review_count: 8, latin_confidence: 90, expires_at: daysFromNow(45),
  },
  {
    name: 'Noche Latina Vancouver',
    category: 'eventos', subcategory: 'musica',
    city: 'Vancouver', province: 'BC',
    address: '750 Pacific Blvd, Vancouver, BC V6B 5E7',
    phone: '+1 (604) 555-0327', website: 'https://nochelatina-van.example.com',
    logo_url: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=400&q=80',
    description_en: 'Monthly Latin night at a premier Vancouver venue featuring top DJs from Mexico, Colombia, and Argentina. Cumbia, reggaeton, bachata, and salsa. Open bar from 9–11pm.',
    owner: 'carlos', subscription_tier: 'premium', is_premium: true, is_verified: true, review_count: 21, latin_confidence: 88, expires_at: daysFromNow(21),
  },
  {
    name: 'Feria Gastronómica Latina YYC',
    category: 'eventos', subcategory: 'gastronomia',
    city: 'Calgary', province: 'AB',
    address: '1410 Olympic Way SE, Calgary, AB T2G 2W1',
    phone: '+1 (403) 555-0428', website: 'https://feria-gastronomica.example.com',
    logo_url: 'https://images.unsplash.com/photo-1555244162-803834f70033?w=400&q=80',
    description_en: '20+ Latin food vendors, cooking demos, live mariachi band, artisan crafts market, and kids activities. Free entry! A celebration of Latin food culture in Calgary.',
    owner: 'carlos', subscription_tier: 'premium', is_premium: true, is_verified: true, review_count: 15, latin_confidence: 91, expires_at: daysFromNow(60),
  },
  {
    name: 'Carnaval Latino Ottawa 2025',
    category: 'eventos', subcategory: 'carnaval',
    city: 'Ottawa', province: 'ON',
    address: '1000 Colonel By Dr, Ottawa, ON K1S 5B6',
    phone: '+1 (613) 555-0529', website: 'https://carnaval-ottawa.example.com',
    logo_url: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=400&q=80',
    description_en: "Ottawa's largest Latin carnival with 5 stages, 30+ performers, carnival rides, and an international food court. Family friendly. 2-day spectacular on the Ottawa River.",
    owner: 'ana', subscription_tier: 'featured', is_premium: true, is_verified: true, review_count: 89, latin_confidence: 97, expires_at: daysFromNow(14),
  },
  {
    name: 'Festival de Verano Latino YEG',
    category: 'eventos', subcategory: 'festival',
    city: 'Edmonton', province: 'AB',
    address: '9405 100 Ave NW, Edmonton, AB T5J 5E6',
    phone: '+1 (780) 555-0630', website: 'https://verano-yeg.example.com',
    logo_url: 'https://images.unsplash.com/photo-1506157786151-b8491531f063?w=400&q=80',
    description_en: '3-day summer festival celebrating Latin culture in Edmonton. Live music, dance performances, artisan market, food trucks, and fireworks finale. Expected 8,000+ attendees.',
    owner: 'ana', subscription_tier: 'featured', is_premium: true, is_verified: true, review_count: 57, latin_confidence: 93, expires_at: daysFromNow(90),
  },

  // ════════════════════════════════════════════════════════════
  // TRABAJOS (has expires_at)
  // ════════════════════════════════════════════════════════════
  {
    name: 'Se Busca Cocinero — Casa del Taco',
    category: 'trabajos', subcategory: 'gastronomia',
    city: 'Toronto', province: 'ON',
    address: '123 Queen St W, Toronto, ON M5H 2M9',
    phone: '+1 (416) 555-0131', website: null,
    logo_url: 'https://images.unsplash.com/photo-1577219491135-ce391730fb2c?w=400&q=80',
    description_en: 'Experienced line cook or prep cook needed for busy taquería in downtown Toronto. Must have knowledge of Mexican cuisine. Full-time, competitive salary + tips. Spanish speakers preferred.',
    owner: 'maria', subscription_tier: 'free',    is_premium: false, is_verified: false, review_count: 0, latin_confidence: 80, expires_at: daysFromNow(21),
  },
  {
    name: 'Recepcionista Bilingüe — Clínica',
    category: 'trabajos', subcategory: 'administracion',
    city: 'Montreal', province: 'QC',
    address: '1001 Bd De Maisonneuve O, Montréal, QC H3A 1G4',
    phone: '+1 (514) 555-0232', website: null,
    logo_url: 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=400&q=80',
    description_en: 'Bilingual (Spanish/French or Spanish/English) receptionist for a busy medical clinic in Montreal. Experience with EMR software an asset. Part-time available. $20–22/hr.',
    owner: 'maria', subscription_tier: 'free',    is_premium: false, is_verified: false, review_count: 0, latin_confidence: 80, expires_at: daysFromNow(30),
  },
  {
    name: 'Asistente Legal Bilingüe',
    category: 'trabajos', subcategory: 'legal',
    city: 'Vancouver', province: 'BC',
    address: '1055 W Hastings St, Vancouver, BC V6E 2E9',
    phone: '+1 (604) 555-0333', website: null,
    logo_url: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=400&q=80',
    description_en: 'Immigration law firm seeks a bilingual Spanish-English legal assistant. Responsibilities include file management, client correspondence, and court document preparation. $25–30/hr.',
    owner: 'carlos', subscription_tier: 'premium', is_premium: true, is_verified: true, review_count: 0, latin_confidence: 80, expires_at: daysFromNow(14),
  },
  {
    name: 'Técnico HVAC — Empresa Latina',
    category: 'trabajos', subcategory: 'tecnico',
    city: 'Calgary', province: 'AB',
    address: '321 17th Ave SW, Calgary, AB T2S 0B1',
    phone: '+1 (403) 555-0434', website: null,
    logo_url: 'https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?w=400&q=80',
    description_en: 'Latin-owned HVAC company hiring certified Red Seal technicians. Commercial and residential installations. Sign-on bonus $2,000. Benefits package + company truck. $40–55/hr.',
    owner: 'carlos', subscription_tier: 'premium', is_premium: true, is_verified: true, review_count: 0, latin_confidence: 80, expires_at: daysFromNow(45),
  },
  {
    name: 'Gerente de Restaurante — Lima',
    category: 'trabajos', subcategory: 'gastronomia',
    city: 'Ottawa', province: 'ON',
    address: '555 Bank St, Ottawa, ON K1P 1B5',
    phone: '+1 (613) 555-0535', website: null,
    logo_url: 'https://images.unsplash.com/photo-1550525811-e5869dd03032?w=400&q=80',
    description_en: 'Upscale Peruvian restaurant seeks an experienced restaurant manager. Must have 3+ years FOH management. Bilingual Spanish/English required. $65K–$75K + benefits.',
    owner: 'ana', subscription_tier: 'featured', is_premium: true, is_verified: true, review_count: 0, latin_confidence: 80, expires_at: daysFromNow(7),
  },
  {
    name: 'Desarrollador Web Bilingüe',
    category: 'trabajos', subcategory: 'tecnologia',
    city: 'Edmonton', province: 'AB',
    address: '10250 101 St NW, Edmonton, AB T5J 3P4',
    phone: '+1 (780) 555-0636', website: 'https://latintech.example.com',
    logo_url: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=400&q=80',
    description_en: 'Latin-founded tech startup hiring a full-stack developer (React/Node). Remote-friendly. Spanish speakers preferred for client communication. $90K–$120K + equity.',
    owner: 'ana', subscription_tier: 'featured', is_premium: true, is_verified: true, review_count: 0, latin_confidence: 80, expires_at: daysFromNow(60),
  },
];

// ─── MAIN ────────────────────────────────────────────────────────────────────
async function main() {
  console.log('🌮 Peptide Alliance Demo Seed Starting...\n');

  // ── 1. Create / verify users ─────────────────────────────────────────────
  console.log('👤 Creating test users...');
  // Users pre-created via migration 015_seed_demo_users.sql
  const userIdMap = {
    maria:  'cb4ae95f-21b5-43ab-9d2c-bbd627b5fc2f',
    carlos: '14595252-16e9-42f1-8c51-d516d1001f41',
    ana:    '276404e9-cde6-4137-9039-803d4787c1b5',
  };
  for (const u of TEST_USERS) {
    console.log(`  ✓  ${u.email} → ${userIdMap[u.key]}`);
  }

  // ── 2. Insert businesses ──────────────────────────────────────────────────
  console.log(`\n🏪 Inserting ${BUSINESSES.length} businesses...`);
  const results = [];

  for (const biz of BUSINESSES) {
    const ownerId = userIdMap[biz.owner];
    if (!ownerId) { console.error(`  ✗  No user ID for owner key "${biz.owner}"`); continue; }

    const slug = slugify(biz.name, biz.city);
    const { owner, expires_at, ...rest } = biz;

    const record = {
      ...rest,
      slug,
      claimed_by: ownerId,
      is_active: true,
      source: 'claimed',
      subscription_started_at: biz.is_premium ? subStarted : null,
      expires_at: expires_at ?? null,
    };

    const { data, error } = await supabase
      .from('businesses')
      .insert(record)
      .select('id, slug')
      .single();

    if (error) {
      console.error(`  ✗  ${biz.name}: ${error.message}`);
      results.push({ biz, slug, id: null, ownerId, error: error.message });
    } else {
      console.log(`  ✓  [${biz.subscription_tier.toUpperCase().padEnd(8)}] ${biz.name} → /en/${biz.category}/${data.slug}`);
      results.push({ biz, slug: data.slug, id: data.id, ownerId, error: null });
    }
  }

  const ok = results.filter(r => !r.error).length;
  const fail = results.filter(r => r.error).length;

  // ── 3. Print summary ──────────────────────────────────────────────────────
  console.log(`\n${'═'.repeat(60)}`);
  console.log('✅ SEED COMPLETE');
  console.log(`${'═'.repeat(60)}`);
  console.log(`Businesses inserted: ${ok} ✓   ${fail > 0 ? fail + ' ✗' : ''}`);
  console.log('\n🔑 TEST USER LOGINS (all share same password)');
  console.log('─'.repeat(60));
  console.log(`Login URL : https://peptidealliance.io/en/login`);
  console.log(`Password  : ${PASSWORD}`);
  console.log('─'.repeat(60));
  for (const u of TEST_USERS) {
    const uid = userIdMap[u.key];
    const count = results.filter(r => !r.error && r.biz.owner === u.key).length;
    console.log(`  ${u.email.padEnd(42)} owns ${count} listings`);
  }

  // ── 4. Excel TSV output ───────────────────────────────────────────────────
  const emailOf = key => TEST_USERS.find(u => u.key === key)?.email ?? '';
  const cols = [
    'Business Name','Category','Subcategory','City','Province',
    'Phone','Website','Tier','Verified','Active',
    'Owner Email','Password','Login URL','Preview URL',
    'Expires (eventos/trabajos)',
  ];
  console.log('\n\n' + '═'.repeat(60));
  console.log('📊 EXCEL DATA — copy everything below this line');
  console.log('═'.repeat(60));
  console.log(cols.join('\t'));

  for (const r of results) {
    const b = r.biz;
    const expiry = b.expires_at
      ? new Date(b.expires_at).toLocaleDateString('en-CA', { year:'numeric', month:'short', day:'numeric' })
      : '';
    const preview = r.slug
      ? `https://peptidealliance.io/en/business/${r.slug}`
      : '';
    const row = [
      b.name,
      b.category,
      b.subcategory,
      b.city,
      b.province,
      b.phone ?? '',
      b.website ?? '',
      b.subscription_tier,
      b.is_verified ? 'Yes' : 'No',
      'Yes',
      emailOf(b.owner),
      PASSWORD,
      'https://peptidealliance.io/en/login',
      preview,
      expiry,
    ];
    console.log(row.join('\t'));
  }
}

main().catch(err => { console.error('Fatal:', err); process.exit(1); });
