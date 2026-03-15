import type { Metadata } from 'next';

export async function generateMetadata({
  params: { locale },
}: {
  params: { locale: string };
}): Promise<Metadata> {
  const isEs = locale === 'es';
  return {
    title: isEs ? 'Términos de Servicio — InfoSylvita' : 'Terms of Service — InfoSylvita',
    description: isEs
      ? 'Los términos y condiciones que rigen el uso de InfoSylvita para visitantes y dueños de negocios.'
      : 'The terms and conditions governing use of InfoSylvita for visitors and business owners.',
    alternates: {
      canonical: locale === 'en'
        ? 'https://infosylvita.com/en/terms'
        : 'https://infosylvita.com/es/terms',
    },
  };
}

export default function TermsPage({
  params: { locale },
}: {
  params: { locale: string };
}) {
  const isEs = locale === 'es';

  if (isEs) {
    return <TermsEs />;
  }
  return <TermsEn />;
}

// ── English ────────────────────────────────────────────────────────────────────

function TermsEn() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-14">
      <p className="text-sm text-muted mb-2">Last updated: March 2026</p>
      <h1 className="font-heading text-4xl font-bold text-text mb-4">Terms of Service</h1>
      <p className="text-muted leading-relaxed mb-10">
        These Terms of Service (&ldquo;Terms&rdquo;) govern your access to and use of InfoSylvita
        (&ldquo;the platform&rdquo;, &ldquo;we&rdquo;, &ldquo;us&rdquo;). By accessing InfoSylvita,
        creating an account, claiming a business listing, or subscribing to any of our services, you
        agree to be bound by these Terms. If you do not agree, please do not use our platform.
      </p>

      <Section title="1. About InfoSylvita">
        <p>
          InfoSylvita is an online directory dedicated to connecting Latin-owned and Latin-serving
          businesses with communities across Canada. We provide free and paid listing tiers, business
          owner tools, lead management, and community features in both English and Spanish.
        </p>
        <p>
          InfoSylvita is operated from Canada. All services are subject to Canadian law.
        </p>
      </Section>

      <Section title="2. Eligibility">
        <p>You must be at least 18 years old to create an account or claim a business listing. By using InfoSylvita you represent that:</p>
        <ul>
          <li>You are at least 18 years of age.</li>
          <li>You have the legal authority to agree to these Terms on behalf of yourself or the business you represent.</li>
          <li>All information you provide is accurate, current, and complete.</li>
        </ul>
      </Section>

      <Section title="3. Account Registration">
        <ul>
          <li>You are responsible for maintaining the confidentiality of your login credentials.</li>
          <li>You are responsible for all activity that occurs under your account.</li>
          <li>You must notify us immediately at{' '}
            <a href="mailto:hola@infosylvita.com">hola@infosylvita.com</a> if you suspect unauthorised access to your account.
          </li>
          <li>We reserve the right to suspend or terminate accounts that violate these Terms.</li>
        </ul>
      </Section>

      <Section title="4. Claiming a Business Listing">
        <div className="bg-primary/5 border border-primary/20 rounded-2xl p-5 mb-4">
          <h3 className="font-bold text-text mt-0">How the claim process works</h3>
          <ol className="list-decimal pl-6 space-y-2">
            <li>
              <strong>Find your business:</strong> search for your business name on InfoSylvita. If it appears in the directory, click &ldquo;Claim this listing&rdquo; on the business profile page.
            </li>
            <li>
              <strong>Create or log in to your account:</strong> you must have a registered InfoSylvita account to submit a claim. Registration is free.
            </li>
            <li>
              <strong>Submit your claim:</strong> provide your name, role/title at the business, and confirm your association with it. You confirm that the information you provide is truthful and that you have authority to manage this business&rsquo;s online presence.
            </li>
            <li>
              <strong>Review period:</strong> our team reviews all claims within 3 business days. You will receive an email confirmation once your claim is approved or if we need additional information.
            </li>
            <li>
              <strong>Manage your listing:</strong> once approved, you can edit all listing details — description, contact information, photos, hours, website, and social media links — from your dashboard at any time.
            </li>
          </ol>

          <div className="mt-4 bg-white rounded-xl border border-primary/10 p-4 text-sm">
            <p className="font-semibold text-text mb-1">
              By submitting a claim, you agree to these Terms of Service in full.
            </p>
            <p className="text-muted mb-0">
              Claiming a listing confirms that you are an authorised representative of the business. Fraudulent claims — including claiming a business you do not own or operate — may result in permanent account termination and legal action.
            </p>
          </div>
        </div>

        <h3>Business listing content standards</h3>
        <p>Once you have claimed your listing, you are responsible for the accuracy and legality of all content you publish. You agree not to post:</p>
        <ul>
          <li>False, misleading, or deceptive information.</li>
          <li>Content that infringes any copyright, trademark, or other intellectual property rights.</li>
          <li>Discriminatory, defamatory, or offensive material.</li>
          <li>Spam, promotional content unrelated to your business, or links to malicious sites.</li>
          <li>Personal information of third parties without their consent.</li>
        </ul>
        <p>We reserve the right to edit or remove any listing content that violates these standards.</p>

        <h3>Removing or updating your listing</h3>
        <ul>
          <li><strong>Update:</strong> log in to your dashboard and edit your listing at any time.</li>
          <li><strong>Remove:</strong> contact us at <a href="mailto:hola@infosylvita.com">hola@infosylvita.com</a> and we will remove your listing within 5 business days.</li>
          <li><strong>Unclaimed listings:</strong> businesses that have not been claimed may appear based on publicly available information. Business owners may request removal even without a claimed account.</li>
        </ul>
      </Section>

      <Section title="5. Subscription Plans & Billing">
        <h3>Free tier</h3>
        <p>
          All business owners can claim and manage a basic listing for free. Free listings include your
          business name, address, city, category, description, and phone number displayed as plain text.
        </p>

        <h3>Premium and Featured tiers</h3>
        <p>Paid plans unlock additional features including:</p>
        <ul>
          <li>Clickable links: website, social media, and Google Maps.</li>
          <li>Lead inbox — receive customer inquiries directly to your email.</li>
          <li>Monthly performance reports (listing views, leads received, category search trends).</li>
          <li>Priority placement in search results.</li>
          <li>Customer review showcase (Featured tier).</li>
        </ul>

        <h3>Billing</h3>
        <ul>
          <li>Subscriptions are billed monthly or annually via <strong>Stripe</strong>.</li>
          <li>All prices are in Canadian Dollars (CAD) and include applicable taxes.</li>
          <li>Subscriptions renew automatically unless cancelled before the renewal date.</li>
          <li>To cancel, contact us at <a href="mailto:hola@infosylvita.com">hola@infosylvita.com</a> or manage your subscription from your dashboard.</li>
        </ul>

        <h3>Refunds</h3>
        <p>
          We offer a <strong>7-day refund</strong> for new subscriptions if you are not satisfied.
          After 7 days, subscription fees are non-refundable except where required by Canadian consumer
          protection law. If you cancel mid-cycle, your paid features remain active until the end of
          the billing period.
        </p>
      </Section>

      <Section title="6. User Conduct">
        <p>When using InfoSylvita, you agree not to:</p>
        <ul>
          <li>Violate any applicable federal, provincial, or local laws or regulations.</li>
          <li>Scrape, harvest, or systematically extract data from the platform without our express written consent.</li>
          <li>Attempt to gain unauthorised access to any part of the platform or its infrastructure.</li>
          <li>Submit false, misleading, or fraudulent information.</li>
          <li>Impersonate any person, business, or entity.</li>
          <li>Interfere with the proper working of the platform or burden its infrastructure.</li>
          <li>Use the platform to send spam or unsolicited commercial messages.</li>
          <li>Reverse-engineer, decompile, or disassemble any part of the platform.</li>
        </ul>
      </Section>

      <Section title="7. Leads & Customer Inquiries">
        <ul>
          <li>When a user submits a lead (inquiry) through a business listing, their contact information is forwarded to the business owner by email.</li>
          <li>Business owners agree to use lead information only to respond to the inquiry and not to add users to mailing lists without their consent, in compliance with CASL.</li>
          <li>InfoSylvita is not responsible for the quality, accuracy, or outcome of any interaction between a user and a business owner facilitated through the platform.</li>
        </ul>
      </Section>

      <Section title="8. Newsletter">
        <ul>
          <li>By subscribing to our newsletter, you consent to receiving monthly email communications from InfoSylvita.</li>
          <li>You may unsubscribe at any time via the link included in every newsletter email.</li>
          <li>We comply with CASL requirements, including maintaining subscription records and honouring all unsubscribe requests promptly.</li>
        </ul>
      </Section>

      <Section title="9. Intellectual Property">
        <h3>Our content</h3>
        <p>
          The InfoSylvita name, logo, platform design, original editorial content, and AI-generated content
          are the intellectual property of InfoSylvita. You may not copy, reproduce, or distribute them
          without our written permission.
        </p>

        <h3>Your content</h3>
        <p>
          You retain ownership of the content you submit to InfoSylvita (business descriptions, photos, etc.).
          By submitting content, you grant us a non-exclusive, royalty-free, worldwide licence to display,
          reproduce, and distribute that content on our platform and in associated marketing materials for
          the purpose of promoting your business listing.
        </p>
        <p>You represent that you have all rights necessary to grant this licence and that your content does not infringe any third-party rights.</p>
      </Section>

      <Section title="10. Disclaimers">
        <ul>
          <li>InfoSylvita provides the directory &ldquo;as is&rdquo;. We do not verify the accuracy of all business information, particularly for unclaimed listings.</li>
          <li>We do not endorse, recommend, or guarantee the quality of any business listed on the platform.</li>
          <li>We are not responsible for any loss or damage arising from your reliance on information found in a listing.</li>
          <li>We do not guarantee uninterrupted, error-free access to the platform at all times.</li>
        </ul>
      </Section>

      <Section title="11. Limitation of Liability">
        <p>
          To the fullest extent permitted by Canadian law, InfoSylvita and its operators shall not be liable
          for any indirect, incidental, consequential, or punitive damages arising from your use of the
          platform, including loss of revenue, data, or business opportunities.
        </p>
        <p>
          Our total aggregate liability for any claim arising from these Terms or your use of the platform
          shall not exceed the total amount you paid to InfoSylvita in the 12 months preceding the claim.
          For free users, our liability is limited to CAD $100.
        </p>
      </Section>

      <Section title="12. Indemnification">
        <p>
          You agree to indemnify and hold harmless InfoSylvita and its operators from any claims, losses,
          damages, or expenses (including legal fees) arising from: (a) your use of the platform in
          violation of these Terms; (b) content you submit to the platform; or (c) your violation of any
          third-party rights.
        </p>
      </Section>

      <Section title="13. Termination">
        <ul>
          <li>You may close your account at any time by contacting us at <a href="mailto:hola@infosylvita.com">hola@infosylvita.com</a>.</li>
          <li>We may suspend or terminate your account immediately if you breach these Terms, engage in fraudulent activity, or pose a risk to other users or the platform.</li>
          <li>Upon termination, your right to use the platform ceases. Sections 9 (Intellectual Property), 10 (Disclaimers), 11 (Limitation of Liability), 12 (Indemnification), and 14 (Governing Law) survive termination.</li>
        </ul>
      </Section>

      <Section title="14. Governing Law & Dispute Resolution">
        <p>
          These Terms are governed by the laws of Canada and the province in which InfoSylvita operates,
          without regard to conflict-of-law principles. Any dispute arising from these Terms shall be
          resolved through good-faith negotiation first. If unresolved, disputes shall be submitted to the
          courts of competent jurisdiction in Canada.
        </p>
      </Section>

      <Section title="15. Changes to These Terms">
        <p>
          We may update these Terms from time to time. We will notify registered users of material changes
          by email at least 14 days before the changes take effect. Continued use of the platform after
          the effective date constitutes acceptance of the updated Terms.
        </p>
      </Section>

      <Section title="16. Contact Us">
        <p>Questions about these Terms? We&rsquo;re happy to help.</p>
        <div className="bg-surface border border-border rounded-xl px-5 py-4 text-sm">
          <p className="mb-1"><strong>InfoSylvita</strong></p>
          <p className="mb-0">
            Email:{' '}
            <a href="mailto:hola@infosylvita.com" className="text-primary underline underline-offset-2">
              hola@infosylvita.com
            </a>
          </p>
        </div>
      </Section>
    </div>
  );
}

// ── Spanish ────────────────────────────────────────────────────────────────────

function TermsEs() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-14">
      <p className="text-sm text-muted mb-2">Última actualización: marzo de 2026</p>
      <h1 className="font-heading text-4xl font-bold text-text mb-4">Términos de Servicio</h1>
      <p className="text-muted leading-relaxed mb-10">
        Estos Términos de Servicio (&ldquo;Términos&rdquo;) rigen tu acceso y uso de InfoSylvita
        (&ldquo;la plataforma&rdquo;, &ldquo;nosotros&rdquo;, &ldquo;nuestro&rdquo;). Al acceder a
        InfoSylvita, crear una cuenta, reclamar un listado de negocio o suscribirte a cualquiera de
        nuestros servicios, aceptas quedar vinculado por estos Términos. Si no estás de acuerdo, por
        favor no uses nuestra plataforma.
      </p>

      <Section title="1. Sobre InfoSylvita">
        <p>
          InfoSylvita es un directorio en línea dedicado a conectar negocios latinos y negocios que
          sirven a la comunidad latina con personas en todo Canadá. Ofrecemos planes de listado gratuitos
          y de pago, herramientas para dueños de negocios, gestión de consultas y funciones comunitarias
          en inglés y español.
        </p>
        <p>InfoSylvita opera desde Canadá. Todos los servicios están sujetos a la ley canadiense.</p>
      </Section>

      <Section title="2. Elegibilidad">
        <p>Debes tener al menos 18 años para crear una cuenta o reclamar un listado. Al usar InfoSylvita confirmas que:</p>
        <ul>
          <li>Tienes al menos 18 años de edad.</li>
          <li>Tienes la autoridad legal para aceptar estos Términos en tu nombre o en nombre del negocio que representas.</li>
          <li>Toda la información que proporcionas es precisa, actual y completa.</li>
        </ul>
      </Section>

      <Section title="3. Registro de cuenta">
        <ul>
          <li>Eres responsable de mantener la confidencialidad de tus credenciales de acceso.</li>
          <li>Eres responsable de toda la actividad que ocurra bajo tu cuenta.</li>
          <li>Debes notificarnos de inmediato a <a href="mailto:hola@infosylvita.com">hola@infosylvita.com</a> si sospechas acceso no autorizado a tu cuenta.</li>
          <li>Nos reservamos el derecho de suspender o terminar cuentas que violen estos Términos.</li>
        </ul>
      </Section>

      <Section title="4. Reclamar un listado de negocio">
        <div className="bg-primary/5 border border-primary/20 rounded-2xl p-5 mb-4">
          <h3 className="font-bold text-text mt-0">Cómo funciona el proceso de reclamo</h3>
          <ol className="list-decimal pl-6 space-y-2">
            <li>
              <strong>Encuentra tu negocio:</strong> busca el nombre de tu negocio en InfoSylvita. Si aparece en el directorio, haz clic en &ldquo;Reclamar este listado&rdquo; en la página del perfil.
            </li>
            <li>
              <strong>Crea una cuenta o inicia sesión:</strong> debes tener una cuenta registrada en InfoSylvita para enviar un reclamo. El registro es gratuito.
            </li>
            <li>
              <strong>Envía tu reclamo:</strong> proporciona tu nombre y cargo en el negocio, y confirma tu relación con él. Confirmas que la información que proporcionas es veraz y que tienes autoridad para gestionar la presencia en línea de este negocio.
            </li>
            <li>
              <strong>Período de revisión:</strong> nuestro equipo revisa todos los reclamos en 3 días hábiles. Recibirás un correo de confirmación cuando tu reclamo sea aprobado o si necesitamos información adicional.
            </li>
            <li>
              <strong>Gestiona tu listado:</strong> una vez aprobado, puedes editar todos los detalles del listado — descripción, información de contacto, fotos, horarios, sitio web y redes sociales — desde tu panel en cualquier momento.
            </li>
          </ol>

          <div className="mt-4 bg-white rounded-xl border border-primary/10 p-4 text-sm">
            <p className="font-semibold text-text mb-1">
              Al enviar un reclamo, aceptas estos Términos de Servicio en su totalidad.
            </p>
            <p className="text-muted mb-0">
              Reclamar un listado confirma que eres un representante autorizado del negocio. Los reclamos fraudulentos — incluyendo reclamar un negocio que no posees ni operas — pueden resultar en la terminación permanente de la cuenta y acciones legales.
            </p>
          </div>
        </div>

        <h3>Estándares de contenido del listado</h3>
        <p>Una vez que hayas reclamado tu listado, eres responsable de la exactitud y legalidad de todo el contenido que publiques. Aceptas no publicar:</p>
        <ul>
          <li>Información falsa, engañosa o deceptiva.</li>
          <li>Contenido que infrinja derechos de autor, marcas registradas u otros derechos de propiedad intelectual.</li>
          <li>Material discriminatorio, difamatorio u ofensivo.</li>
          <li>Spam, contenido promocional ajeno a tu negocio o enlaces a sitios maliciosos.</li>
          <li>Información personal de terceros sin su consentimiento.</li>
        </ul>
        <p>Nos reservamos el derecho de editar o eliminar cualquier contenido que viole estos estándares.</p>

        <h3>Eliminar o actualizar tu listado</h3>
        <ul>
          <li><strong>Actualizar:</strong> inicia sesión en tu panel y edita tu listado en cualquier momento.</li>
          <li><strong>Eliminar:</strong> contáctanos en <a href="mailto:hola@infosylvita.com">hola@infosylvita.com</a> y eliminaremos tu listado en 5 días hábiles.</li>
          <li><strong>Listados no reclamados:</strong> los negocios no reclamados pueden aparecer con base en información pública. Los dueños pueden solicitar la eliminación incluso sin una cuenta reclamada.</li>
        </ul>
      </Section>

      <Section title="5. Planes de suscripción y facturación">
        <h3>Plan gratuito</h3>
        <p>
          Todos los dueños de negocios pueden reclamar y gestionar un listado básico de forma gratuita.
          Los listados gratuitos incluyen nombre, dirección, ciudad, categoría, descripción y teléfono
          mostrados como texto sin enlace.
        </p>

        <h3>Planes Premium y Destacado</h3>
        <p>Los planes de pago desbloquean funciones adicionales, incluyendo:</p>
        <ul>
          <li>Enlaces clicables: sitio web, redes sociales y Google Maps.</li>
          <li>Bandeja de consultas — recibe mensajes de clientes directamente en tu correo.</li>
          <li>Informes mensuales de rendimiento (vistas, consultas, tendencias de búsqueda).</li>
          <li>Posición preferencial en los resultados de búsqueda.</li>
          <li>Vitrina de opiniones de clientes (plan Destacado).</li>
        </ul>

        <h3>Facturación</h3>
        <ul>
          <li>Las suscripciones se facturan mensual o anualmente mediante <strong>Stripe</strong>.</li>
          <li>Todos los precios están en Dólares Canadienses (CAD) e incluyen impuestos aplicables.</li>
          <li>Las suscripciones se renuevan automáticamente a menos que se cancelen antes de la fecha de renovación.</li>
          <li>Para cancelar, contáctanos o gestiona tu suscripción desde tu panel.</li>
        </ul>

        <h3>Reembolsos</h3>
        <p>
          Ofrecemos un <strong>reembolso de 7 días</strong> para nuevas suscripciones si no estás satisfecho.
          Después de 7 días, las cuotas de suscripción no son reembolsables, salvo donde lo exija la ley
          de protección al consumidor canadiense.
        </p>
      </Section>

      <Section title="6. Conducta del usuario">
        <p>Al usar InfoSylvita, aceptas no:</p>
        <ul>
          <li>Violar ninguna ley o regulación federal, provincial o local aplicable.</li>
          <li>Extraer, recopilar o descargar datos de la plataforma de forma sistemática sin nuestro consentimiento por escrito.</li>
          <li>Intentar acceder sin autorización a cualquier parte de la plataforma o su infraestructura.</li>
          <li>Enviar información falsa, engañosa o fraudulenta.</li>
          <li>Suplantar a cualquier persona, negocio o entidad.</li>
          <li>Interferir con el funcionamiento correcto de la plataforma.</li>
          <li>Usar la plataforma para enviar spam o mensajes comerciales no solicitados.</li>
        </ul>
      </Section>

      <Section title="7. Consultas y leads de clientes">
        <ul>
          <li>Cuando un usuario envía una consulta a través de un listado, su información de contacto se reenvía al dueño del negocio por correo electrónico.</li>
          <li>Los dueños de negocios aceptan usar la información de los leads solo para responder a la consulta y no para agregar usuarios a listas de correo sin su consentimiento, de acuerdo con CASL.</li>
          <li>InfoSylvita no es responsable de la calidad, exactitud o resultado de cualquier interacción entre un usuario y un dueño de negocio facilitada a través de la plataforma.</li>
        </ul>
      </Section>

      <Section title="8. Boletín informativo">
        <ul>
          <li>Al suscribirte a nuestro boletín, consientes recibir comunicaciones mensuales por correo electrónico de InfoSylvita.</li>
          <li>Puedes darte de baja en cualquier momento mediante el enlace incluido en cada correo del boletín.</li>
          <li>Cumplimos con los requisitos de CASL, incluyendo el mantenimiento de registros de suscripción y el procesamiento oportuno de todas las solicitudes de baja.</li>
        </ul>
      </Section>

      <Section title="9. Propiedad intelectual">
        <h3>Nuestro contenido</h3>
        <p>
          El nombre InfoSylvita, el logotipo, el diseño de la plataforma, el contenido editorial original
          y el contenido generado por IA son propiedad intelectual de InfoSylvita. No puedes copiarlos,
          reproducirlos ni distribuirlos sin nuestro permiso por escrito.
        </p>

        <h3>Tu contenido</h3>
        <p>
          Conservas la propiedad del contenido que envías a InfoSylvita. Al enviarlo, nos otorgas una
          licencia no exclusiva, libre de regalías y mundial para mostrar, reproducir y distribuir ese
          contenido en nuestra plataforma y materiales de marketing asociados con el fin de promover
          tu listado de negocio.
        </p>
      </Section>

      <Section title="10. Descargos de responsabilidad">
        <ul>
          <li>InfoSylvita proporciona el directorio &ldquo;tal cual&rdquo;. No verificamos la exactitud de toda la información de los negocios, en particular los listados no reclamados.</li>
          <li>No respaldamos ni garantizamos la calidad de ningún negocio listado en la plataforma.</li>
          <li>No somos responsables de ninguna pérdida o daño que surja de tu confianza en la información de un listado.</li>
        </ul>
      </Section>

      <Section title="11. Limitación de responsabilidad">
        <p>
          En la máxima medida permitida por la ley canadiense, InfoSylvita y sus operadores no serán
          responsables de ningún daño indirecto, incidental, consecuente o punitivo que surja de tu uso
          de la plataforma, incluyendo pérdida de ingresos, datos u oportunidades de negocio.
        </p>
        <p>
          Nuestra responsabilidad total por cualquier reclamación relacionada con estos Términos o tu
          uso de la plataforma no superará el monto total que hayas pagado a InfoSylvita en los 12 meses
          anteriores a la reclamación. Para usuarios gratuitos, nuestra responsabilidad se limita a CAD $100.
        </p>
      </Section>

      <Section title="12. Indemnización">
        <p>
          Aceptas indemnizar y eximir de responsabilidad a InfoSylvita y sus operadores de cualquier
          reclamación, pérdida, daño o gasto (incluidos honorarios legales) que surjan de: (a) tu uso
          de la plataforma en violación de estos Términos; (b) el contenido que envíes a la plataforma;
          o (c) tu violación de cualquier derecho de terceros.
        </p>
      </Section>

      <Section title="13. Terminación">
        <ul>
          <li>Puedes cerrar tu cuenta en cualquier momento contactándonos en <a href="mailto:hola@infosylvita.com">hola@infosylvita.com</a>.</li>
          <li>Podemos suspender o terminar tu cuenta de inmediato si incumples estos Términos, realizas actividad fraudulenta o representas un riesgo para otros usuarios o la plataforma.</li>
          <li>Tras la terminación, cesa tu derecho a usar la plataforma. Las secciones 9, 10, 11, 12 y 14 sobreviven a la terminación.</li>
        </ul>
      </Section>

      <Section title="14. Ley aplicable y resolución de disputas">
        <p>
          Estos Términos se rigen por las leyes de Canadá y la provincia en la que opera InfoSylvita.
          Cualquier disputa que surja de estos Términos se resolverá primero mediante negociación de buena
          fe. Si no se resuelve, las disputas se someterán a los tribunales competentes en Canadá.
        </p>
      </Section>

      <Section title="15. Cambios en estos Términos">
        <p>
          Podemos actualizar estos Términos en cualquier momento. Notificaremos a los usuarios registrados
          sobre cambios significativos por correo electrónico con al menos 14 días de anticipación. El uso
          continuado de la plataforma después de la fecha de vigencia constituye la aceptación de los
          Términos actualizados.
        </p>
      </Section>

      <Section title="16. Contáctanos">
        <p>¿Tienes preguntas sobre estos Términos? Estamos aquí para ayudarte.</p>
        <div className="bg-surface border border-border rounded-xl px-5 py-4 text-sm">
          <p className="mb-1"><strong>InfoSylvita</strong></p>
          <p className="mb-0">
            Correo:{' '}
            <a href="mailto:hola@infosylvita.com" className="text-primary underline underline-offset-2">
              hola@infosylvita.com
            </a>
          </p>
        </div>
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
      <div className="text-muted leading-relaxed space-y-3 [&_h3]:font-semibold [&_h3]:text-text [&_h3]:mt-5 [&_h3]:mb-2 [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:space-y-2 [&_ol]:pl-6 [&_ol]:space-y-2 [&_li]:leading-relaxed [&_strong]:text-text [&_a]:text-primary [&_a]:underline [&_a]:underline-offset-2 [&_p]:leading-relaxed">
        {children}
      </div>
    </section>
  );
}
