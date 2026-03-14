/**
 * Script: create-blog-posts.mjs
 * Creates the first 4 SEO blog posts for InfoSylvita.
 *
 * Usage: node scripts/create-blog-posts.mjs
 * Requires: NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in .env.local
 */

import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';
import { resolve } from 'path';

// Load .env.local
const envPath = resolve(process.cwd(), '.env.local');
let supabaseUrl, serviceKey;
try {
  const env = readFileSync(envPath, 'utf8');
  for (const line of env.split('\n')) {
    const [key, ...rest] = line.split('=');
    const val = rest.join('=').trim().replace(/^["']|["']$/g, '');
    if (key?.trim() === 'NEXT_PUBLIC_SUPABASE_URL') supabaseUrl = val;
    if (key?.trim() === 'SUPABASE_SERVICE_ROLE_KEY') serviceKey = val;
  }
} catch {
  supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
}

if (!supabaseUrl || !serviceKey) {
  console.error('❌  Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, serviceKey, {
  auth: { persistSession: false, autoRefreshToken: false },
});

function makeSlug(text) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80);
}

const posts = [
  // ── Post 1: Latin Restaurants Toronto ───────────────────────────────────────
  {
    slug: 'best-latin-restaurants-toronto-2026',
    title_en: 'Best Latin Restaurants in Toronto 2026',
    title_es: 'Los Mejores Restaurantes Latinos en Toronto 2026',
    excerpt_en: 'Discover the top Latin restaurants in Toronto — from authentic Colombian arepas and Peruvian ceviche to Mexican tacos and Venezuelan hallacas. Your complete guide to Latino food in the city.',
    excerpt_es: 'Descubre los mejores restaurantes latinos en Toronto — desde arepas colombianas y ceviche peruano hasta tacos mexicanos y hallacas venezolanas. Tu guía completa de comida latina en la ciudad.',
    category: 'comida',
    city: 'Toronto',
    meta_title_en: 'Best Latin Restaurants in Toronto 2026 — InfoSylvita',
    meta_title_es: 'Mejores Restaurantes Latinos en Toronto 2026 — InfoSylvita',
    meta_description_en: 'Find the best Latin restaurants in Toronto in 2026 — Colombian, Mexican, Peruvian, Venezuelan, Salvadoran, and more. All listed on InfoSylvita, Canada\'s Latin business directory.',
    meta_description_es: 'Encuentra los mejores restaurantes latinos en Toronto en 2026 — colombianos, mexicanos, peruanos, venezolanos, salvadoreños y más. Todos en InfoSylvita.',
    content_en: `## Quick Answer

Toronto has a vibrant Latin food scene with restaurants representing more than a dozen Latin American cuisines. From Kensington Market to Scarborough, you'll find authentic Colombian, Mexican, Peruvian, Venezuelan, Salvadoran, and Brazilian food across the city.

## Why Toronto's Latin Food Scene is Special

Toronto is home to one of Canada's largest Latin American communities, with immigrants from Mexico, Colombia, El Salvador, Peru, Venezuela, Brazil, Chile, and beyond. This diversity translates directly into the city's food scene — you'll find dishes and flavours that are hard to find elsewhere in Canada.

## What to Look For in a Latin Restaurant in Toronto

When searching for authentic Latin restaurants in Toronto, here are the key things to look for:

- **Spanish-speaking staff**: A strong indicator of authenticity and community connection
- **Ingredients**: Imported staples like masa harina, sofrito, plantains, and regional chiles
- **Regional specialties**: Each Latin American country has distinct dishes — look for specific regional items on the menu
- **Verified listings**: Businesses with a Verified badge on InfoSylvita have been reviewed and confirmed as Latin-owned

## Popular Latin Cuisines in Toronto

### Colombian Food in Toronto
Colombian restaurants in Toronto are known for their hearty bandeja paisa, arepas, empanadas, and fresh fruit juices. The Colombian community has a strong presence in areas like Thorncliffe Park and Scarborough.

### Mexican Food in Toronto
Beyond Tex-Mex, Toronto has authentic Mexican restaurants serving mole, birria, barbacoa tacos, tlayudas, and regional specialties from Oaxaca, Mexico City, and Jalisco.

### Peruvian Food in Toronto
Peruvian cuisine is having a moment globally, and Toronto's restaurants are at the forefront with fresh ceviche, lomo saltado, causa, and anticuchos.

### Venezuelan Food in Toronto
With a growing Venezuelan community in Canada, Toronto now has several restaurants and food businesses serving hallacas, pabellón criollo, tequeños, and cachapas.

### Salvadoran Food in Toronto
Salvadoran pupusas have earned a loyal following in Toronto. Several Salvadoran-owned restaurants and bakeries serve pupusas, yuca frita, and horchata across the city.

## How to Find Latin Restaurants Near You in Toronto

Use InfoSylvita's search to filter by:
1. **Category**: Food
2. **City**: Toronto
3. **Subcategory**: Restaurants, Food Trucks, Bakeries, etc.

All Latin restaurants on InfoSylvita are verified as Latin-owned or serving the Latin community in Toronto.

## Frequently Asked Questions

**Q: Where is the best area for Latin food in Toronto?**
A: Kensington Market, Scarborough, Thorncliffe Park, and Weston Road are all known for concentrations of Latin restaurants and food businesses in Toronto.

**Q: Are there Spanish-speaking restaurants in Toronto?**
A: Yes — many Latin restaurants in Toronto are operated by Latin immigrants and have Spanish-speaking staff. Search on InfoSylvita and look for the Verified badge.

**Q: How do I find authentic Colombian food in Toronto?**
A: Search for "Colombian" in InfoSylvita's Food category and filter by Toronto to find verified Colombian-owned restaurants and bakeries.

## Add Your Latin Restaurant to InfoSylvita

Are you a Latin restaurant owner in Toronto? List your business for free on InfoSylvita and connect with thousands of customers in the Latin community and beyond. [Claim your listing →](https://infosylvita.com/claim)`,
    content_es: `## Respuesta Rápida

Toronto tiene una vibrante escena de comida latina con restaurantes que representan más de una docena de cocinas latinoamericanas. Desde el Kensington Market hasta Scarborough, encontrarás comida auténtica colombiana, mexicana, peruana, venezolana, salvadoreña y brasileña en toda la ciudad.

## Por Qué la Escena de Comida Latina en Toronto es Especial

Toronto alberga una de las comunidades latinoamericanas más grandes de Canadá, con inmigrantes de México, Colombia, El Salvador, Perú, Venezuela, Brasil, Chile y más. Esta diversidad se refleja directamente en la escena gastronómica de la ciudad — encontrarás platos y sabores difíciles de encontrar en otros lugares de Canadá.

## Qué Buscar en un Restaurante Latino en Toronto

Al buscar restaurantes latinos auténticos en Toronto, estos son los aspectos clave:

- **Personal hispanohablante**: Un fuerte indicador de autenticidad y conexión con la comunidad
- **Ingredientes**: Productos importados como masa harina, sofrito, plátanos y chiles regionales
- **Especialidades regionales**: Cada país latinoamericano tiene platos distintos
- **Listados verificados**: Los negocios con el sello Verificado en InfoSylvita han sido revisados y confirmados como negocios latinos

## Cocinas Latinas Populares en Toronto

### Comida Colombiana en Toronto
Los restaurantes colombianos en Toronto son conocidos por su bandeja paisa, arepas, empanadas y jugos de frutas frescas. La comunidad colombiana tiene una fuerte presencia en áreas como Thorncliffe Park y Scarborough.

### Comida Mexicana en Toronto
Más allá del Tex-Mex, Toronto tiene restaurantes mexicanos auténticos que sirven mole, birria, tacos de barbacoa, tlayudas y especialidades regionales de Oaxaca, Ciudad de México y Jalisco.

### Comida Peruana en Toronto
La cocina peruana está de moda globalmente, y los restaurantes de Toronto están a la vanguardia con ceviche fresco, lomo saltado, causa y anticuchos.

## Cómo Encontrar Restaurantes Latinos Cerca de Ti en Toronto

Usa la búsqueda de InfoSylvita para filtrar por:
1. **Categoría**: Comida
2. **Ciudad**: Toronto
3. **Subcategoría**: Restaurantes, Food Trucks, Panaderías, etc.

## Preguntas Frecuentes

**P: ¿Dónde está la mejor área para comida latina en Toronto?**
R: Kensington Market, Scarborough, Thorncliffe Park y Weston Road son conocidos por la concentración de restaurantes y negocios de comida latina en Toronto.

**P: ¿Hay restaurantes con personal hispanohablante en Toronto?**
R: Sí — muchos restaurantes latinos en Toronto son operados por inmigrantes latinos y tienen personal hispanohablante.

## Agrega tu Restaurante Latino a InfoSylvita

¿Eres dueño de un restaurante latino en Toronto? Publica tu negocio gratis en InfoSylvita y conéctate con miles de clientes en la comunidad latina. [Registra tu listado →](https://infosylvita.com/es/claim)`,
  },

  // ── Post 2: Spanish-Speaking Doctors Vancouver ──────────────────────────────
  {
    slug: 'spanish-speaking-doctors-vancouver',
    title_en: 'How to Find Spanish-Speaking Doctors in Vancouver',
    title_es: 'Cómo Encontrar Médicos que Hablan Español en Vancouver',
    excerpt_en: 'A complete guide to finding Spanish-speaking doctors, dentists, and healthcare providers in Vancouver, BC. Tips from the Latin community on navigating the Canadian healthcare system.',
    excerpt_es: 'Una guía completa para encontrar médicos, dentistas y proveedores de salud que hablan español en Vancouver, BC. Consejos de la comunidad latina para navegar el sistema de salud canadiense.',
    category: 'salud',
    city: 'Vancouver',
    meta_title_en: 'Spanish-Speaking Doctors in Vancouver BC — InfoSylvita',
    meta_title_es: 'Médicos que Hablan Español en Vancouver BC — InfoSylvita',
    meta_description_en: 'Find verified Spanish-speaking doctors, dentists, therapists, and healthcare professionals in Vancouver, BC. InfoSylvita — Canada\'s Latin business directory.',
    meta_description_es: 'Encuentra médicos, dentistas, terapeutas y profesionales de salud que hablan español en Vancouver, BC. InfoSylvita — el directorio de negocios latinos de Canadá.',
    content_en: `## Quick Answer

Vancouver has a growing number of Spanish-speaking healthcare professionals, including doctors (family physicians and specialists), dentists, psychologists, physiotherapists, and nutritionists. Many serve the Latin and broader Hispanic community in Metro Vancouver.

## Why Language Matters in Healthcare

When you're dealing with your health, being able to communicate clearly in your native language isn't a luxury — it's a safety issue. Misunderstandings due to language barriers can lead to:

- Incorrect diagnoses or misunderstood symptoms
- Wrong medication dosages or instructions
- Inability to describe pain or discomfort accurately
- Missed follow-up appointments due to confusion
- Increased anxiety and reduced trust in the healthcare relationship

Finding a Spanish-speaking doctor or healthcare provider removes these barriers and helps you receive the care you deserve.

## Types of Spanish-Speaking Healthcare Providers in Vancouver

### Family Doctors (General Practitioners)
Family physicians who speak Spanish can serve as your primary healthcare provider for general health concerns, referrals to specialists, and ongoing medical management. Finding a Spanish-speaking GP is the first priority for newcomers.

### Dentists
Vancouver has several Latin-owned or Spanish-speaking dental practices that offer full dental services in Spanish, from cleanings and fillings to orthodontics and oral surgery.

### Mental Health Professionals
Psychologists, therapists, and counsellors who speak Spanish are especially valuable — mental health is deeply personal, and being able to express your emotions and experiences in your native language makes a significant difference in treatment outcomes.

### Specialists
Gynecologists, pediatricians, cardiologists, and other specialists in Vancouver may also offer services in Spanish. Ask your family doctor for referrals to Spanish-speaking specialists.

### Physiotherapists and Nutritionists
Wellness professionals including physiotherapists, registered nutritionists, and fitness trainers who speak Spanish are increasingly available in Metro Vancouver.

## How to Find Spanish-Speaking Doctors in Vancouver

### 1. Use InfoSylvita's Health Directory
Browse the [Health category on InfoSylvita](https://infosylvita.com/health) and filter by Vancouver to find verified Spanish-speaking healthcare professionals in your area.

### 2. Ask Your Community
The Latin community in Vancouver — especially in areas like South Vancouver, Burnaby, and Surrey — has informal networks for sharing healthcare recommendations. Community organizations like MOSAIC, ISS of BC, and PICS often maintain referral lists.

### 3. Call Clinics Directly
When calling a new clinic, ask: "¿Tienen médicos que hablan español?" (Do you have doctors who speak Spanish?) Many clinics will note this in their staff profiles.

### 4. Check MSP Resources
If you're covered by BC's Medical Services Plan (MSP), you can ask Health Link BC (8-1-1) for help finding Spanish-speaking providers in your area.

## Navigating MSP as a Latin Newcomer

If you've recently arrived in British Columbia, understanding the MSP (Medical Services Plan) is essential:

- **Eligibility**: Most residents must wait 3 months before MSP coverage kicks in
- **Registration**: Register at the BC Services Card website or by mail
- **Finding a doctor**: BC Family Doctor & Nurse Practitioner Registry (www.bchealthlinks.ca)
- **Walk-in clinics**: Available without a family doctor — some have Spanish-speaking staff

## Frequently Asked Questions

**Q: Are there Spanish-speaking doctors in Vancouver accepting new patients?**
A: Yes, though availability changes frequently. Check InfoSylvita's Health directory, contact clinics directly, or call Health Link BC (8-1-1) for updated information.

**Q: How do I find a Spanish-speaking therapist in Vancouver for mental health?**
A: Browse InfoSylvita's Health category and filter by "Therapists" in Vancouver. Many bilingual therapists work with the Latin community in Metro Vancouver.

**Q: Are there Spanish-speaking dentists in Surrey or Burnaby?**
A: Yes — the broader Metro Vancouver area has Spanish-speaking dental practices. Search InfoSylvita and filter by Surrey, Burnaby, or Richmond to find options near you.

## List Your Health Practice on InfoSylvita

Are you a Spanish-speaking healthcare professional in Vancouver? Help the Latin community find you. [Add your practice to InfoSylvita for free →](https://infosylvita.com/claim)`,
    content_es: `## Respuesta Rápida

Vancouver tiene un número creciente de profesionales de salud hispanohablantes, incluyendo médicos de familia y especialistas, dentistas, psicólogos, fisioterapeutas y nutricionistas. Muchos sirven a la comunidad latina e hispana en el área metropolitana de Vancouver.

## Por Qué el Idioma Importa en la Salud

Cuando se trata de tu salud, poder comunicarte claramente en tu idioma nativo no es un lujo — es una cuestión de seguridad. Los malentendidos por barreras lingüísticas pueden llevar a:

- Diagnósticos incorrectos o síntomas mal entendidos
- Dosis o instrucciones de medicamentos incorrectas
- Incapacidad para describir el dolor o malestar con precisión
- Mayor ansiedad y menor confianza en la relación médico-paciente

Encontrar un médico hispanohablante elimina estas barreras y te ayuda a recibir la atención que mereces.

## Cómo Encontrar Médicos Hispanohablantes en Vancouver

### 1. Usa el Directorio de Salud de InfoSylvita
Explora la [categoría Salud en InfoSylvita](https://infosylvita.com/es/salud) y filtra por Vancouver para encontrar profesionales de salud hispanohablantes verificados en tu área.

### 2. Pregunta a tu Comunidad
La comunidad latina en Vancouver — especialmente en áreas como South Vancouver, Burnaby y Surrey — tiene redes informales para compartir recomendaciones de atención médica.

### 3. Llama a las Clínicas Directamente
Al llamar a una nueva clínica, pregunta: "¿Tienen médicos que hablan español?" Muchas clínicas anotan esto en los perfiles de su personal.

## Preguntas Frecuentes

**P: ¿Hay médicos hispanohablantes en Vancouver aceptando nuevos pacientes?**
R: Sí, aunque la disponibilidad cambia con frecuencia. Revisa el directorio de Salud de InfoSylvita, contacta clínicas directamente o llama a Health Link BC (8-1-1) para información actualizada.

**P: ¿Cómo encuentro un terapeuta hispanohablante en Vancouver para salud mental?**
R: Explora la categoría Salud de InfoSylvita y filtra por "Terapeutas" en Vancouver. Muchos terapeutas bilingües trabajan con la comunidad latina en el área metropolitana.

## Agrega tu Práctica de Salud a InfoSylvita

¿Eres un profesional de salud hispanohablante en Vancouver? Ayuda a la comunidad latina a encontrarte. [Agrega tu práctica a InfoSylvita gratis →](https://infosylvita.com/es/claim)`,
  },

  // ── Post 3: Immigration Lawyers Spanish Canada ───────────────────────────────
  {
    slug: 'immigration-lawyers-spanish-canada',
    title_en: 'Spanish-Speaking Immigration Lawyers in Canada: What to Look For',
    title_es: 'Abogados de Inmigración que Hablan Español en Canadá: Qué Buscar',
    excerpt_en: 'A practical guide to finding qualified Spanish-speaking immigration lawyers and consultants in Canada. What to look for, red flags to avoid, and how to verify credentials.',
    excerpt_es: 'Una guía práctica para encontrar abogados e consultores de inmigración hispanohablantes calificados en Canadá. Qué buscar, señales de alerta y cómo verificar credenciales.',
    category: 'servicios_profesionales',
    city: null,
    meta_title_en: 'Spanish-Speaking Immigration Lawyers Canada — InfoSylvita',
    meta_title_es: 'Abogados de Inmigración Hispanohablantes en Canadá — InfoSylvita',
    meta_description_en: 'Find verified Spanish-speaking immigration lawyers and consultants across Canada — Toronto, Vancouver, Montreal, Calgary, and more. InfoSylvita — Latin business directory.',
    meta_description_es: 'Encuentra abogados e consultores de inmigración hispanohablantes verificados en Canadá — Toronto, Vancouver, Montreal, Calgary y más. InfoSylvita — directorio latino.',
    content_en: `## Quick Answer

Canada has immigration lawyers and regulated immigration consultants (RCICs) who speak Spanish in every major city — Toronto, Vancouver, Montreal, Calgary, Edmonton, Ottawa, and Winnipeg. Many specialize in serving Latin American clients and are familiar with the specific immigration pathways most relevant to that community.

## Immigration Lawyer vs. Immigration Consultant: What's the Difference?

Before searching, understand who can legally provide immigration advice in Canada:

### Immigration Lawyers
- Licensed by a provincial Law Society (e.g., Law Society of Ontario, Law Society of BC)
- Can represent you in Federal Court if your case is refused
- Can handle complex cases including criminal inadmissibility, refugee claims, and judicial reviews
- Typically higher fees than consultants

### Regulated Canadian Immigration Consultants (RCICs)
- Licensed by the College of Immigration and Citizenship Consultants (CICC)
- Can handle most routine immigration applications (Express Entry, spousal sponsorship, study/work permits)
- Cannot represent you in court
- Generally lower fees than lawyers

**Warning**: Anyone who is not a licensed lawyer or registered RCIC cannot legally charge fees for immigration advice in Canada. This is a very common scam targeting Latin American newcomers.

## How to Verify Credentials

Before hiring anyone:

1. **Lawyers**: Verify their law license on the provincial Law Society's website (e.g., lso.ca for Ontario)
2. **RCICs**: Check the CICC's public register at college-ic.ca
3. **Never pay cash**: Always pay by cheque, e-transfer, or credit card — never in cash
4. **Get everything in writing**: Contract, fees, services, and timelines must be in writing

## Common Immigration Cases for Latin Americans in Canada

- **Spousal/common-law sponsorship**: Bringing a partner to Canada
- **Express Entry**: Skilled worker permanent residence
- **Refugee claims / asylum**: Protection for those fleeing persecution
- **Work permit extensions**: Renewing temporary status
- **PR (permanent residence) applications**: From temporary status to permanent residence
- **Citizenship applications**: After obtaining permanent residence
- **Family sponsorship**: Bringing parents, children, or siblings to Canada
- **Criminal inadmissibility**: Cases where previous convictions affect immigration status

## What to Look for in a Spanish-Speaking Immigration Professional

When evaluating a Spanish-speaking immigration lawyer or consultant:

- **Active license**: Verify they are currently licensed and in good standing
- **Latin American experience**: Do they regularly serve clients from Mexico, Colombia, Venezuela, El Salvador, etc.?
- **Transparent fees**: Get a written fee agreement before signing anything
- **References**: Ask for client references (especially from Latin clients)
- **Communication**: Do they respond promptly and explain things clearly in Spanish?
- **No guarantees**: Reputable professionals will never guarantee approval — they can only guarantee their best effort

## Red Flags: Avoid These

- Anyone claiming to be a "notario" (notaries in Latin America provide legal advice, but "notary public" in Canada is a very different, limited role)
- Anyone promising guaranteed visas or PR
- Anyone asking for cash payments
- Extremely low fees compared to market rates
- Unregistered "immigration advisors" or "tramitadores"

## Cities with Spanish-Speaking Immigration Lawyers

### Toronto
Toronto has the largest concentration of Latin immigration professionals in Canada, with many RCICs and lawyers specializing in Latin American cases.

### Vancouver
Metro Vancouver's growing Latin community is served by several Spanish-speaking immigration lawyers and consultants in Vancouver, Burnaby, and Surrey.

### Montreal
Montreal has immigration professionals who speak both Spanish and French — important for Quebec immigration applications which have additional provincial requirements.

### Calgary and Edmonton
Alberta's oil and energy industry has attracted Latin workers, and there are immigration professionals in both cities who serve Spanish-speaking clients.

## Find Spanish-Speaking Immigration Professionals on InfoSylvita

Browse [InfoSylvita's Professional Services](https://infosylvita.com/professional-services) and filter by Immigration to find verified Spanish-speaking immigration lawyers and consultants in your city.

## Frequently Asked Questions

**Q: How much does an immigration lawyer cost in Canada?**
A: Fees vary widely. Routine applications (work permit, study permit) typically range from $500–$2,000 CAD. Complex cases (refugee claims, judicial reviews) can cost $5,000–$15,000+. Always get a written fee agreement.

**Q: Can I do my immigration application without a lawyer?**
A: Yes — many Canadians successfully self-represent on straightforward applications. However, for complex situations or when a lot is at stake, professional help is worth the investment.

**Q: What is the difference between an abogado and a consultor de inmigración in Canada?**
A: An abogado (lawyer) is licensed by a provincial Law Society and can represent you in court. A consultor de inmigración (RCIC) is licensed by the CICC and can handle most applications but cannot appear in court.`,
    content_es: `## Respuesta Rápida

Canadá tiene abogados de inmigración y consultores regulados de inmigración (RCICs) que hablan español en todas las ciudades principales — Toronto, Vancouver, Montreal, Calgary, Edmonton, Ottawa y Winnipeg. Muchos se especializan en servir a clientes latinoamericanos.

## Abogado de Inmigración vs. Consultor de Inmigración: ¿Cuál es la Diferencia?

### Abogados de Inmigración
- Licenciados por el Colegio de Abogados provincial
- Pueden representarte en el Tribunal Federal
- Manejan casos complejos incluyendo inadmisibilidad criminal, solicitudes de refugio y revisiones judiciales
- Honorarios generalmente más altos que los consultores

### Consultores Regulados de Inmigración de Canadá (RCICs)
- Licenciados por el Colegio de Consultores de Inmigración y Ciudadanía (CICC)
- Manejan la mayoría de las solicitudes de inmigración de rutina
- No pueden representarte en la corte
- Honorarios generalmente más bajos que los abogados

**Advertencia**: Cualquier persona que no sea un abogado licenciado o un RCIC registrado no puede cobrar legalmente por asesoría de inmigración en Canadá. Esta es una estafa muy común que afecta a los nuevos inmigrantes latinoamericanos.

## Cómo Verificar Credenciales

Antes de contratar a alguien:

1. **Abogados**: Verifica su licencia en el sitio web del Colegio de Abogados provincial
2. **RCICs**: Consulta el registro público del CICC en college-ic.ca
3. **Nunca pagues en efectivo**: Siempre paga con cheque, e-transfer o tarjeta de crédito
4. **Todo por escrito**: Contrato, honorarios, servicios y plazos deben ser por escrito

## Señales de Alerta: Evita Esto

- Cualquier persona que se llame "notario" (en Canadá, un notario público tiene un rol muy limitado, diferente al de un notario en América Latina)
- Cualquier persona que garantice visas o residencia permanente
- Cualquier persona que pida pagos en efectivo
- Honorarios extremadamente bajos en comparación con el mercado
- "Asesores de inmigración" o "tramitadores" no registrados

## Encuentra Profesionales de Inmigración Hispanohablantes en InfoSylvita

Explora los [Servicios Profesionales de InfoSylvita](https://infosylvita.com/es/servicios-profesionales) y filtra por Inmigración para encontrar abogados e consultores de inmigración hispanohablantes verificados en tu ciudad.

## Preguntas Frecuentes

**P: ¿Cuánto cuesta un abogado de inmigración en Canadá?**
R: Los honorarios varían ampliamente. Las solicitudes de rutina típicamente oscilan entre $500–$2,000 CAD. Los casos complejos pueden costar $5,000–$15,000+. Siempre obtén un acuerdo de honorarios por escrito.

**P: ¿Puedo hacer mi solicitud de inmigración sin un abogado?**
R: Sí — muchos canadienses se representan exitosamente en solicitudes sencillas. Sin embargo, para situaciones complejas, la ayuda profesional vale la inversión.`,
  },

  // ── Post 4: How to add your business to InfoSylvita ─────────────────────────
  {
    slug: 'how-to-add-latin-business-infosylvita',
    title_en: 'How to Add Your Latin Business to InfoSylvita (Step by Step)',
    title_es: 'Cómo Agregar tu Negocio Latino a InfoSylvita (Paso a Paso)',
    excerpt_en: 'A step-by-step guide to listing your Latin business on InfoSylvita for free — from submitting your profile to getting verified and appearing in AI search results across Canada.',
    excerpt_es: 'Una guía paso a paso para publicar tu negocio latino en InfoSylvita gratis — desde enviar tu perfil hasta obtener verificación y aparecer en las búsquedas de IA en todo Canadá.',
    category: null,
    city: null,
    meta_title_en: 'How to List Your Latin Business on InfoSylvita — Free Directory',
    meta_title_es: 'Cómo Publicar tu Negocio Latino en InfoSylvita — Directorio Gratis',
    meta_description_en: 'Learn how to add your Latin business to InfoSylvita for free. Step-by-step guide to getting listed, verified, and found by customers across Canada in Google and AI searches.',
    meta_description_es: 'Aprende cómo agregar tu negocio latino a InfoSylvita gratis. Guía paso a paso para publicarse, verificarse y ser encontrado por clientes en toda Canadá.',
    content_en: `## Quick Answer

Adding your Latin business to InfoSylvita is free and takes less than 5 minutes. Go to [infosylvita.com/claim](https://infosylvita.com/claim), fill out your business details, create a free account, and submit. Our team reviews and activates your listing within 24 hours.

## Why List Your Business on InfoSylvita?

InfoSylvita is Canada's Latin business directory — the only bilingual (English and Spanish) platform specifically designed to connect Latin-owned and Spanish-speaking businesses with customers across Canada.

**Why it matters for your business:**

- **Google visibility**: Listings on InfoSylvita get indexed by Google, helping you appear in search results for "Latin businesses in [your city]" and similar queries
- **AI search**: InfoSylvita's structured data (Schema.org markup) helps AI chatbots like ChatGPT, Claude, and Perplexity find and recommend your business
- **Community reach**: Connect with Latin community members who specifically seek Latin-owned businesses
- **Bilingual presence**: Your listing appears in both English and Spanish searches
- **Free forever**: Basic listings are completely free, with optional Premium and Featured plans for higher visibility

## Who Can List on InfoSylvita?

InfoSylvita accepts listings from:

- Latin-owned businesses (any category)
- Businesses that serve the Latin/Hispanic community
- Spanish-speaking professionals and service providers
- Latin cultural events, organizations, and community groups
- Job postings at Latin-owned businesses
- Any business where speaking Spanish is a key part of the service

## Step-by-Step: How to Add Your Business

### Step 1: Go to the Claim Page
Visit [infosylvita.com/claim](https://infosylvita.com/claim) or click "Claim Your Business" in the navigation menu.

### Step 2: Search for Your Business
Use the search bar to see if your business is already in our directory. If it is, you can claim the existing listing. If not, you'll create a new one.

### Step 3: Fill Out Your Business Profile

Fill in as much information as possible — more complete profiles rank higher and get more clicks:

- **Business name**: Your exact business name as it appears on Google
- **Category**: Choose the most relevant category (Food, Professional Services, Personal Services, Health, Events, or Jobs)
- **Subcategory**: Select the most specific subcategory (e.g., Restaurant, Lawyer, Plumber)
- **City**: Your primary city of operation
- **Address**: Your physical address (can be a service area if you don't have a storefront)
- **Phone**: Your main business phone number
- **Website**: Your business website URL
- **Description**: A clear description of your services in English (and Spanish if you serve Spanish speakers)
- **Social media**: Instagram, Facebook, TikTok, LinkedIn handles

### Step 4: Create Your Free Account

You'll need to create a free InfoSylvita account to manage your listing. Use your business email address.

### Step 5: Submit for Review

Once you submit, our team reviews your listing to verify it meets our community standards. This typically takes less than 24 hours.

### Step 6: Activate Your Listing

Once approved, you'll receive an email confirmation and your listing goes live across InfoSylvita's directory — including in search results and the city and category pages.

## Tips for a Strong InfoSylvita Listing

**Write a great description**: Include your main services, languages spoken, and what makes your business unique. Mention your city and key services for better search visibility.

**Add your logo**: Listings with photos and logos get significantly more clicks than text-only listings.

**Include your Google Maps link**: This makes it easy for customers to find your physical location.

**List your social media**: Customers often want to see your Instagram or Facebook before contacting you.

**Respond to leads quickly**: When customers send you a message through InfoSylvita, fast responses increase conversion.

## Understanding the Verification Badge

The Verified badge (✓) on InfoSylvita means our team has:
- Confirmed the business exists and is active
- Verified it is Latin-owned or serves the Latin community
- Confirmed the contact information is accurate

To request verification for a free listing, contact us. Verified listings also come with the Premium plan.

## Upgrading to Premium or Featured

**Premium (Verified tier)**: Get a verified badge, appear at the top of category pages, receive email notifications for every new lead, and get monthly performance reports.

**Featured**: Everything in Premium, plus your business appears on the homepage and gets highlighted card design — maximum visibility across the entire directory.

## Frequently Asked Questions

**Q: Is listing my business on InfoSylvita really free?**
A: Yes — basic listings are completely free, forever. You can add your business, fill out your full profile, and receive leads at no cost.

**Q: How long until my listing appears on Google?**
A: InfoSylvita's sitemap is submitted to Google and updated automatically. New listings typically appear in Google search results within 2–6 weeks, depending on your business's overall web presence.

**Q: Can I list my business in both English and Spanish?**
A: Yes — InfoSylvita is fully bilingual. You can add descriptions in both languages and your listing will appear in both English and Spanish searches.

**Q: What categories can I list my business under?**
A: InfoSylvita has 6 main categories: Food, Professional Services, Personal Services, Health, Events, and Jobs — each with multiple subcategories.

## Ready to Get Listed?

[Claim your free listing on InfoSylvita today →](https://infosylvita.com/claim)

Your customers are searching for Latin businesses in your city right now. Make sure they can find you.`,
    content_es: `## Respuesta Rápida

Agregar tu negocio latino a InfoSylvita es gratis y toma menos de 5 minutos. Ve a [infosylvita.com/es/claim](https://infosylvita.com/es/claim), completa los datos de tu negocio, crea una cuenta gratis y envíalo. Nuestro equipo revisa y activa tu listado en menos de 24 horas.

## Por Qué Publicar tu Negocio en InfoSylvita

InfoSylvita es el directorio de negocios latinos de Canadá — la única plataforma bilingüe (inglés y español) diseñada específicamente para conectar negocios latinos e hispanohablantes con clientes en toda Canadá.

**Por qué importa para tu negocio:**

- **Visibilidad en Google**: Los listados en InfoSylvita son indexados por Google
- **Búsquedas de IA**: Los datos estructurados de InfoSylvita ayudan a los chatbots de IA como ChatGPT, Claude y Perplexity a encontrar y recomendar tu negocio
- **Alcance comunitario**: Conéctate con miembros de la comunidad latina que buscan específicamente negocios latinos
- **Presencia bilingüe**: Tu listado aparece en búsquedas en inglés y en español
- **Gratis para siempre**: Los listados básicos son completamente gratuitos

## Paso a Paso: Cómo Agregar tu Negocio

### Paso 1: Ve a la Página de Registro
Visita [infosylvita.com/es/claim](https://infosylvita.com/es/claim) o haz clic en "Registra tu Negocio" en el menú de navegación.

### Paso 2: Busca tu Negocio
Usa la barra de búsqueda para ver si tu negocio ya está en nuestro directorio.

### Paso 3: Completa tu Perfil de Negocio

Completa la mayor cantidad de información posible:

- **Nombre del negocio**: Tu nombre exacto como aparece en Google
- **Categoría**: Elige la categoría más relevante (Comida, Servicios Profesionales, Servicios Personales, Salud, Eventos o Trabajos)
- **Ciudad**: Tu ciudad principal de operación
- **Teléfono**: Tu número de teléfono principal
- **Sitio web**: La URL de tu sitio web
- **Descripción**: Una descripción clara de tus servicios en español (e inglés si atiendes a angloparlantes)
- **Redes sociales**: Instagram, Facebook, TikTok, LinkedIn

### Paso 4: Crea tu Cuenta Gratuita

Necesitarás crear una cuenta gratuita de InfoSylvita para gestionar tu listado.

### Paso 5: Envía para Revisión

Una vez que envíes, nuestro equipo revisa tu listado. Esto típicamente toma menos de 24 horas.

## Preguntas Frecuentes

**P: ¿Publicar mi negocio en InfoSylvita es realmente gratis?**
R: Sí — los listados básicos son completamente gratuitos, para siempre.

**P: ¿Cuánto tarda en aparecer mi listado en Google?**
R: Los listados nuevos típicamente aparecen en los resultados de búsqueda de Google en 2–6 semanas, dependiendo de la presencia web general de tu negocio.

**P: ¿Puedo publicar mi negocio en inglés y en español?**
R: Sí — InfoSylvita es completamente bilingüe. Puedes agregar descripciones en ambos idiomas.

## ¿Listo para Publicarte?

[Registra tu listado gratis en InfoSylvita hoy →](https://infosylvita.com/es/claim)

Tus clientes están buscando negocios latinos en tu ciudad ahora mismo. Asegúrate de que puedan encontrarte.`,
  },
];

async function main() {
  console.log(`📝 Creating ${posts.length} blog posts...\n`);

  const now = new Date().toISOString();

  for (const post of posts) {
    const slug = post.slug || makeSlug(post.title_en || post.title_es || 'post');

    // Check if post already exists
    const { data: existing } = await supabase
      .from('blog_posts')
      .select('id, slug')
      .eq('slug', slug)
      .single();

    if (existing) {
      console.log(`⏭️  Skipping "${slug}" — already exists`);
      continue;
    }

    const { data, error } = await supabase
      .from('blog_posts')
      .insert({
        slug,
        title_en: post.title_en,
        title_es: post.title_es,
        excerpt_en: post.excerpt_en,
        excerpt_es: post.excerpt_es,
        content_en: post.content_en,
        content_es: post.content_es,
        meta_title_en: post.meta_title_en,
        meta_title_es: post.meta_title_es,
        meta_description_en: post.meta_description_en,
        meta_description_es: post.meta_description_es,
        category: post.category,
        city: post.city,
        is_published: true,
        published_at: now,
      })
      .select('id, slug')
      .single();

    if (error) {
      console.error(`❌  Failed to create "${slug}":`, error.message);
    } else {
      console.log(`✅  Created: ${slug} (id: ${data.id})`);
    }
  }

  console.log('\n✨ Done! Visit https://infosylvita.com/blog to see the posts.');
}

main().catch(console.error);
