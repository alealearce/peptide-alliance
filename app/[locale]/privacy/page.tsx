import type { Metadata } from 'next';

export async function generateMetadata({
  params: { locale },
}: {
  params: { locale: string };
}): Promise<Metadata> {
  const isEs = locale === 'es';
  return {
    title: isEs ? 'Política de Privacidad — InfoSylvita' : 'Privacy Policy — InfoSylvita',
    description: isEs
      ? 'Cómo InfoSylvita recopila, utiliza y protege tu información personal.'
      : 'How InfoSylvita collects, uses, and protects your personal information.',
    alternates: {
      canonical: locale === 'en'
        ? 'https://infosylvita.com/en/privacy'
        : 'https://infosylvita.com/es/privacy',
    },
  };
}

export default function PrivacyPage({
  params: { locale },
}: {
  params: { locale: string };
}) {
  const isEs = locale === 'es';

  if (isEs) {
    return <PrivacyEs />;
  }
  return <PrivacyEn />;
}

// ── English ────────────────────────────────────────────────────────────────────

function PrivacyEn() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-14">
      <p className="text-sm text-muted mb-2">Last updated: March 2026</p>
      <h1 className="font-heading text-4xl font-bold text-text mb-4">Privacy Policy</h1>
      <p className="text-muted leading-relaxed mb-10">
        InfoSylvita (&ldquo;we&rdquo;, &ldquo;us&rdquo;, &ldquo;our&rdquo;) is a Canadian online directory
        connecting Latin-owned businesses with their communities across Canada. We are committed to protecting
        your privacy and handling your personal information responsibly, in accordance with Canada&rsquo;s{' '}
        <strong>Personal Information Protection and Electronic Documents Act (PIPEDA)</strong> and the{' '}
        <strong>Canadian Anti-Spam Legislation (CASL)</strong>.
      </p>

      <Section title="1. Who This Policy Applies To">
        <p>This Privacy Policy applies to:</p>
        <ul>
          <li><strong>Visitors</strong> who browse InfoSylvita without an account.</li>
          <li><strong>Business owners</strong> who claim or list their business on our platform.</li>
          <li><strong>Users</strong> who create an account, subscribe to our newsletter, or submit a lead (inquiry) to a business.</li>
        </ul>
      </Section>

      <Section title="2. What Information We Collect">
        <h3>Information you provide directly</h3>
        <ul>
          <li><strong>Account registration:</strong> full name, email address, preferred language.</li>
          <li><strong>Business listings:</strong> business name, address, city, province, phone number, website, social media links, category, description, and photos.</li>
          <li><strong>Lead / contact forms:</strong> your name, email, phone number, and message when you contact a business through our platform.</li>
          <li><strong>Newsletter subscription:</strong> email address and preferred language.</li>
          <li><strong>Suggest a business:</strong> any information you voluntarily submit about a business.</li>
        </ul>

        <h3>Information collected automatically</h3>
        <ul>
          <li><strong>Search events:</strong> search queries, city filters, category filters, and the number of results returned — used to improve the directory.</li>
          <li><strong>Listing views:</strong> which business profiles are viewed, and from which city (derived from your IP address, which is then one-way hashed and discarded — your actual IP is never stored).</li>
          <li><strong>Usage analytics:</strong> pages visited, session duration, and general device type, collected via Google Analytics 4 (anonymised).</li>
          <li><strong>Cookies:</strong> session cookies for authentication, and analytics cookies placed by Google Analytics.</li>
        </ul>

        <h3>Payment information</h3>
        <p>
          Subscription payments are processed by <strong>Stripe</strong>. We never see or store your full
          credit card number — Stripe handles all payment data under their own PCI-DSS compliant systems.
          We retain only a Stripe customer ID and subscription status.
        </p>
      </Section>

      <Section title="3. How We Use Your Information">
        <ul>
          <li>To operate and improve the InfoSylvita directory and its search features.</li>
          <li>To display business listings publicly on the platform.</li>
          <li>To forward leads (inquiries) from users to the relevant business owner via email.</li>
          <li>To send business owners monthly performance reports about their listing (Premium and Featured tiers).</li>
          <li>To send subscribers our monthly newsletter (with your explicit opt-in consent).</li>
          <li>To send transactional emails: email verification, claim confirmations, subscription receipts.</li>
          <li>To generate anonymised platform analytics and trends (e.g. most-searched categories).</li>
          <li>To communicate important service updates, security notices, or policy changes.</li>
          <li>To prevent fraud and abuse of the platform.</li>
        </ul>
        <p>
          We do <strong>not</strong> sell, rent, or trade your personal information to third parties for
          marketing purposes.
        </p>
      </Section>

      <Section title="4. Legal Basis for Processing">
        <p>We process personal information under the following bases:</p>
        <ul>
          <li><strong>Consent:</strong> newsletter subscriptions, analytics cookies.</li>
          <li><strong>Contract:</strong> account registration, business listing management, payment processing.</li>
          <li><strong>Legitimate interests:</strong> fraud prevention, platform security, anonymised analytics to improve search results.</li>
          <li><strong>Legal obligation:</strong> retaining transaction records as required by Canadian tax law.</li>
        </ul>
      </Section>

      <Section title="5. Sharing Your Information">
        <p>We share personal information only where necessary:</p>
        <ul>
          <li><strong>Supabase:</strong> our database and authentication provider, hosted in data centres compliant with Canadian and international privacy standards.</li>
          <li><strong>Resend:</strong> our transactional email provider, used to deliver verification, claim confirmation, lead notification, newsletter, and report emails.</li>
          <li><strong>Stripe:</strong> our payment processor for subscription billing.</li>
          <li><strong>Google Analytics:</strong> anonymised usage statistics. IP addresses are anonymised before being sent to Google.</li>
          <li><strong>Anthropic (Claude AI):</strong> used to generate newsletter content and business tips. No personal identifying information is included in AI prompts.</li>
          <li><strong>Law enforcement:</strong> where required by law or valid legal process.</li>
        </ul>
        <p>All third-party providers are bound by data processing agreements and are prohibited from using your data for their own purposes.</p>
      </Section>

      <Section title="6. Data Retention">
        <ul>
          <li><strong>Account data:</strong> retained while your account is active. Deleted within 30 days of a verified account deletion request.</li>
          <li><strong>Business listings:</strong> retained while active on the platform. Business owners may request removal at any time (see Section 8).</li>
          <li><strong>Leads / inquiries:</strong> retained for 2 years to support business owner records, then deleted.</li>
          <li><strong>Search event logs:</strong> retained for 13 months to support analytics, then deleted.</li>
          <li><strong>Newsletter subscriber records:</strong> retained until unsubscribe is requested. Unsubscribed records are soft-deleted (email address retained only to honour the unsubscribe preference).</li>
          <li><strong>Payment records:</strong> retained for 7 years as required by Canadian tax regulations.</li>
        </ul>
      </Section>

      <Section title="7. Cookies">
        <p>We use the following cookies:</p>
        <ul>
          <li><strong>Strictly necessary:</strong> Supabase session cookies that keep you logged in. These cannot be disabled without breaking core functionality.</li>
          <li><strong>Analytics:</strong> Google Analytics cookies (GA4) that collect anonymised usage data. You may opt out via your browser settings or by using a browser extension such as the Google Analytics Opt-out Add-on.</li>
        </ul>
        <p>We do not use advertising or tracking cookies.</p>
      </Section>

      <Section title="8. Your Rights">
        <p>Under PIPEDA and applicable provincial privacy laws, you have the right to:</p>
        <ul>
          <li><strong>Access</strong> the personal information we hold about you.</li>
          <li><strong>Correct</strong> inaccurate or incomplete information.</li>
          <li><strong>Request deletion</strong> of your personal information (subject to legal retention requirements).</li>
          <li><strong>Withdraw consent</strong> for newsletter communications at any time via the unsubscribe link in any email.</li>
          <li><strong>Request your business listing be updated or removed</strong> — see Section 9 below.</li>
          <li><strong>Lodge a complaint</strong> with the Office of the Privacy Commissioner of Canada if you believe your rights have been violated.</li>
        </ul>
        <p>
          To exercise any of these rights, contact us at{' '}
          <a href="mailto:hola@infosylvita.com" className="text-primary underline underline-offset-2">
            hola@infosylvita.com
          </a>. We will respond within <strong>30 days</strong>.
        </p>
      </Section>

      <Section title="9. Business Listing Data">
        <div className="bg-primary/5 border border-primary/20 rounded-2xl p-5 mb-4">
          <h3 className="font-bold text-text mt-0">Claiming, updating, or removing your listing</h3>
          <p>
            If you are a business owner and your business appears in our directory, you can:
          </p>
          <ul>
            <li>
              <strong>Claim your listing:</strong> create a free account, find your business, and click &ldquo;Claim this listing&rdquo;. Your claim is reviewed by our team within 3 business days. Once approved, you have full control to edit your information.
            </li>
            <li>
              <strong>Update your information:</strong> log in to your dashboard at any time and edit your listing details, photos, contact information, and description.
            </li>
            <li>
              <strong>Remove your listing:</strong> contact us at{' '}
              <a href="mailto:hola@infosylvita.com" className="text-primary underline underline-offset-2">
                hola@infosylvita.com
              </a>{' '}
              with your business name and we will remove your listing within 5 business days.
            </li>
          </ul>
          <p className="mb-0">
            Unclaimed listings may have been sourced from publicly available information. By claiming your listing, you take ownership of the data and agree to our Terms of Service.
          </p>
        </div>
      </Section>

      <Section title="10. Data Security">
        <ul>
          <li>All data is transmitted over <strong>HTTPS / TLS encryption</strong>.</li>
          <li>Passwords are hashed using industry-standard algorithms — we never store plaintext passwords.</li>
          <li>IP addresses used to track listing views are <strong>one-way hashed</strong> using a secret salt before storage — the original IP cannot be recovered.</li>
          <li>Database access is restricted via row-level security (RLS) policies — users can only access their own data.</li>
          <li>Administrative access requires multi-factor authentication.</li>
          <li>We conduct regular security reviews of our platform and third-party services.</li>
        </ul>
        <p>
          In the event of a data breach that poses a real risk of significant harm, we will notify affected
          individuals and the Office of the Privacy Commissioner of Canada as required under PIPEDA.
        </p>
      </Section>

      <Section title="11. Children's Privacy">
        <p>
          InfoSylvita is not directed at children under the age of 13. We do not knowingly collect personal
          information from children. If you believe a child has provided us with personal information, please
          contact us and we will delete it promptly.
        </p>
      </Section>

      <Section title="12. Changes to This Policy">
        <p>
          We may update this Privacy Policy from time to time. When we do, we will update the &ldquo;Last updated&rdquo;
          date at the top of this page. For material changes, we will notify registered users by email.
          Continued use of InfoSylvita after the effective date constitutes acceptance of the updated policy.
        </p>
      </Section>

      <Section title="13. Contact Us">
        <p>
          For any privacy-related questions, requests, or concerns, please contact our Privacy Officer:
        </p>
        <div className="bg-surface border border-border rounded-xl px-5 py-4 text-sm">
          <p className="mb-1"><strong>InfoSylvita</strong></p>
          <p className="mb-1">Canada</p>
          <p className="mb-0">
            Email:{' '}
            <a href="mailto:hola@infosylvita.com" className="text-primary underline underline-offset-2">
              hola@infosylvita.com
            </a>
          </p>
        </div>
        <p className="text-sm text-muted mt-4">
          You also have the right to file a complaint with the{' '}
          <a
            href="https://www.priv.gc.ca"
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary underline underline-offset-2"
          >
            Office of the Privacy Commissioner of Canada
          </a>.
        </p>
      </Section>
    </div>
  );
}

// ── Spanish ────────────────────────────────────────────────────────────────────

function PrivacyEs() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-14">
      <p className="text-sm text-muted mb-2">Última actualización: marzo de 2026</p>
      <h1 className="font-heading text-4xl font-bold text-text mb-4">Política de Privacidad</h1>
      <p className="text-muted leading-relaxed mb-10">
        InfoSylvita (&ldquo;nosotros&rdquo;, &ldquo;nuestro&rdquo;) es un directorio en línea canadiense que conecta negocios
        latinos con sus comunidades en todo Canadá. Nos comprometemos a proteger tu privacidad y manejar
        tu información personal de forma responsable, de acuerdo con la{' '}
        <strong>Ley de Protección de Información Personal y Documentos Electrónicos (PIPEDA)</strong> de
        Canadá y la <strong>Legislación Canadiense Antispam (CASL)</strong>.
      </p>

      <Section title="1. A quién aplica esta política">
        <p>Esta Política de Privacidad aplica a:</p>
        <ul>
          <li><strong>Visitantes</strong> que navegan InfoSylvita sin cuenta.</li>
          <li><strong>Dueños de negocios</strong> que reclaman o publican su negocio en nuestra plataforma.</li>
          <li><strong>Usuarios</strong> que crean una cuenta, se suscriben al boletín o envían una consulta a un negocio.</li>
        </ul>
      </Section>

      <Section title="2. Qué información recopilamos">
        <h3>Información que proporcionas directamente</h3>
        <ul>
          <li><strong>Registro de cuenta:</strong> nombre completo, correo electrónico, idioma preferido.</li>
          <li><strong>Listados de negocios:</strong> nombre, dirección, ciudad, provincia, teléfono, sitio web, redes sociales, categoría, descripción y fotos.</li>
          <li><strong>Formularios de contacto:</strong> nombre, correo, teléfono y mensaje al contactar a un negocio.</li>
          <li><strong>Suscripción al boletín:</strong> correo electrónico e idioma preferido.</li>
          <li><strong>Sugerir un negocio:</strong> cualquier información que envíes voluntariamente.</li>
        </ul>

        <h3>Información recopilada automáticamente</h3>
        <ul>
          <li><strong>Eventos de búsqueda:</strong> consultas, filtros de ciudad y categoría, y número de resultados — para mejorar el directorio.</li>
          <li><strong>Vistas de listados:</strong> qué perfiles se ven y desde qué ciudad (derivada de tu IP, que luego se cifra de forma irreversible y se descarta — tu IP real nunca se almacena).</li>
          <li><strong>Análisis de uso:</strong> páginas visitadas, duración de sesión y tipo de dispositivo, recopilados mediante Google Analytics 4 (anonimizados).</li>
          <li><strong>Cookies:</strong> cookies de sesión para autenticación y cookies de análisis de Google Analytics.</li>
        </ul>

        <h3>Información de pago</h3>
        <p>
          Los pagos son procesados por <strong>Stripe</strong>. Nunca vemos ni almacenamos tu número de
          tarjeta completo — Stripe gestiona todos los datos de pago bajo sus propios sistemas compatibles
          con PCI-DSS. Solo conservamos un ID de cliente de Stripe y el estado de la suscripción.
        </p>
      </Section>

      <Section title="3. Cómo usamos tu información">
        <ul>
          <li>Para operar y mejorar el directorio InfoSylvita y sus funciones de búsqueda.</li>
          <li>Para mostrar listados de negocios públicamente en la plataforma.</li>
          <li>Para reenviar consultas de usuarios al dueño del negocio correspondiente por correo.</li>
          <li>Para enviar a los dueños de negocios informes mensuales de rendimiento (planes Premium y Destacado).</li>
          <li>Para enviar a los suscriptores nuestro boletín mensual (con tu consentimiento explícito).</li>
          <li>Para enviar correos transaccionales: verificación de correo, confirmación de reclamo, recibos.</li>
          <li>Para generar estadísticas anónimas de la plataforma (p. ej., categorías más buscadas).</li>
          <li>Para comunicar actualizaciones importantes del servicio o cambios de política.</li>
          <li>Para prevenir fraudes y abusos de la plataforma.</li>
        </ul>
        <p>
          <strong>No</strong> vendemos, alquilamos ni intercambiamos tu información personal a terceros
          con fines de marketing.
        </p>
      </Section>

      <Section title="4. Base legal del procesamiento">
        <ul>
          <li><strong>Consentimiento:</strong> suscripciones al boletín, cookies de análisis.</li>
          <li><strong>Contrato:</strong> registro de cuenta, gestión de listados, procesamiento de pagos.</li>
          <li><strong>Intereses legítimos:</strong> prevención de fraudes, seguridad, estadísticas anónimas.</li>
          <li><strong>Obligación legal:</strong> conservación de registros de transacciones según la ley fiscal canadiense.</li>
        </ul>
      </Section>

      <Section title="5. Compartir tu información">
        <ul>
          <li><strong>Supabase:</strong> nuestro proveedor de base de datos y autenticación, con centros de datos que cumplen estándares canadienses e internacionales de privacidad.</li>
          <li><strong>Resend:</strong> nuestro proveedor de correo transaccional para verificaciones, confirmaciones, boletines e informes.</li>
          <li><strong>Stripe:</strong> nuestro procesador de pagos para suscripciones.</li>
          <li><strong>Google Analytics:</strong> estadísticas de uso anonimizadas. Las IPs se anonimizan antes de enviarse a Google.</li>
          <li><strong>Anthropic (Claude IA):</strong> usado para generar contenido del boletín y consejos de negocios. No se incluye información personal identificable en los prompts.</li>
          <li><strong>Autoridades:</strong> cuando lo exija la ley o un proceso legal válido.</li>
        </ul>
        <p>Todos los proveedores terceros están sujetos a acuerdos de procesamiento de datos y tienen prohibido usar tus datos para sus propios fines.</p>
      </Section>

      <Section title="6. Retención de datos">
        <ul>
          <li><strong>Datos de cuenta:</strong> retenidos mientras la cuenta esté activa. Eliminados en 30 días tras una solicitud verificada de eliminación.</li>
          <li><strong>Listados de negocios:</strong> retenidos mientras estén activos. Los dueños pueden solicitar la eliminación en cualquier momento (ver Sección 8).</li>
          <li><strong>Consultas / leads:</strong> retenidos 2 años para los registros del dueño del negocio, luego eliminados.</li>
          <li><strong>Registros de búsquedas:</strong> retenidos 13 meses para análisis, luego eliminados.</li>
          <li><strong>Suscriptores del boletín:</strong> retenidos hasta que se solicite la baja. Los registros dados de baja se eliminan en forma suave (solo se conserva el correo para respetar la preferencia de baja).</li>
          <li><strong>Registros de pago:</strong> retenidos 7 años según la normativa fiscal canadiense.</li>
        </ul>
      </Section>

      <Section title="7. Cookies">
        <ul>
          <li><strong>Estrictamente necesarias:</strong> cookies de sesión de Supabase que te mantienen conectado. No se pueden desactivar sin afectar la funcionalidad principal.</li>
          <li><strong>Análisis:</strong> cookies de Google Analytics (GA4) que recopilan datos de uso anonimizados. Puedes desactivarlas en la configuración de tu navegador.</li>
        </ul>
        <p>No usamos cookies de publicidad ni de rastreo.</p>
      </Section>

      <Section title="8. Tus derechos">
        <ul>
          <li><strong>Acceder</strong> a la información personal que tenemos sobre ti.</li>
          <li><strong>Corregir</strong> información inexacta o incompleta.</li>
          <li><strong>Solicitar la eliminación</strong> de tu información personal (sujeto a requisitos legales de retención).</li>
          <li><strong>Retirar el consentimiento</strong> para comunicaciones del boletín en cualquier momento mediante el enlace de baja en cualquier correo.</li>
          <li><strong>Solicitar que tu listado se actualice o elimine</strong> — ver Sección 9 a continuación.</li>
          <li><strong>Presentar una queja</strong> ante la Oficina del Comisionado de Privacidad de Canadá.</li>
        </ul>
        <p>
          Para ejercer cualquiera de estos derechos, contáctanos en{' '}
          <a href="mailto:hola@infosylvita.com" className="text-primary underline underline-offset-2">
            hola@infosylvita.com
          </a>. Responderemos en un plazo de <strong>30 días</strong>.
        </p>
      </Section>

      <Section title="9. Datos de listados de negocios">
        <div className="bg-primary/5 border border-primary/20 rounded-2xl p-5 mb-4">
          <h3 className="font-bold text-text mt-0">Reclamar, actualizar o eliminar tu listado</h3>
          <ul>
            <li>
              <strong>Reclamar tu listado:</strong> crea una cuenta gratuita, encuentra tu negocio y haz clic en &ldquo;Reclamar este listado&rdquo;. Nuestro equipo revisará tu solicitud en 3 días hábiles. Una vez aprobada, tendrás control total para editar tu información.
            </li>
            <li>
              <strong>Actualizar tu información:</strong> inicia sesión en tu panel en cualquier momento y edita los detalles, fotos, contacto y descripción de tu listado.
            </li>
            <li>
              <strong>Eliminar tu listado:</strong> escríbenos a{' '}
              <a href="mailto:hola@infosylvita.com" className="text-primary underline underline-offset-2">
                hola@infosylvita.com
              </a>{' '}
              con el nombre de tu negocio y lo eliminaremos en 5 días hábiles.
            </li>
          </ul>
          <p className="mb-0">
            Los listados no reclamados pueden haberse obtenido de información disponible públicamente. Al reclamar tu listado, tomas la propiedad de los datos y aceptas nuestros Términos de Servicio.
          </p>
        </div>
      </Section>

      <Section title="10. Seguridad de los datos">
        <ul>
          <li>Todos los datos se transmiten mediante <strong>cifrado HTTPS / TLS</strong>.</li>
          <li>Las contraseñas se cifran con algoritmos estándar — nunca almacenamos contraseñas en texto plano.</li>
          <li>Las IPs usadas para rastrear vistas se cifran de forma <strong>irreversible</strong> antes de almacenarse — no se puede recuperar la IP original.</li>
          <li>El acceso a la base de datos está restringido mediante políticas de seguridad a nivel de fila (RLS).</li>
          <li>El acceso administrativo requiere autenticación multifactor.</li>
        </ul>
        <p>
          En caso de una brecha de datos que represente un riesgo real de daño significativo, notificaremos
          a los afectados y a la Oficina del Comisionado de Privacidad de Canadá según lo exige PIPEDA.
        </p>
      </Section>

      <Section title="11. Privacidad de menores">
        <p>
          InfoSylvita no está dirigido a menores de 13 años. Si crees que un menor nos ha proporcionado
          información personal, contáctanos y la eliminaremos de inmediato.
        </p>
      </Section>

      <Section title="12. Cambios en esta política">
        <p>
          Podemos actualizar esta Política de Privacidad en cualquier momento. La fecha de &ldquo;Última
          actualización&rdquo; en la parte superior refleja la versión más reciente. Para cambios
          significativos, notificaremos a los usuarios registrados por correo electrónico.
        </p>
      </Section>

      <Section title="13. Contáctanos">
        <div className="bg-surface border border-border rounded-xl px-5 py-4 text-sm">
          <p className="mb-1"><strong>InfoSylvita</strong></p>
          <p className="mb-1">Canadá</p>
          <p className="mb-0">
            Correo:{' '}
            <a href="mailto:hola@infosylvita.com" className="text-primary underline underline-offset-2">
              hola@infosylvita.com
            </a>
          </p>
        </div>
        <p className="text-sm text-muted mt-4">
          También puedes presentar una queja ante la{' '}
          <a
            href="https://www.priv.gc.ca"
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary underline underline-offset-2"
          >
            Oficina del Comisionado de Privacidad de Canadá
          </a>.
        </p>
      </Section>
    </div>
  );
}

// ── Shared layout helper ───────────────────────────────────────────────────────

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mb-10">
      <h2 className="font-heading text-xl font-bold text-text mb-4 pb-2 border-b border-border">
        {title}
      </h2>
      <div className="prose-legal text-muted leading-relaxed space-y-3 [&_h3]:font-semibold [&_h3]:text-text [&_h3]:mt-5 [&_h3]:mb-2 [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:space-y-2 [&_li]:leading-relaxed [&_strong]:text-text [&_a]:text-primary [&_a]:underline [&_a]:underline-offset-2 [&_p]:leading-relaxed">
        {children}
      </div>
    </section>
  );
}
