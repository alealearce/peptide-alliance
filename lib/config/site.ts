/**
 * site.ts — Central configuration for The Peptide Alliance directory.
 *
 * Every component, email, chatbot, and SEO tag reads from here.
 */

// ─── COLORS ───────────────────────────────────────────────────────────────────
// These must also match tailwind.config.ts (Tailwind can't read TS at runtime)
export const COLORS = {
  primary:     '#0A1F44', // Navy — buttons, links, nav
  primaryDark: '#061430', // Hover state for primary
  accent:      '#98EBCF', // Mint green — badges, highlights, verified
  bg:          '#F8FAFB', // Light clinical background
  card:        '#FFFFFF', // Card background — pure white
  text:        '#1a1a1a', // Body text
  muted:       '#6F727A', // Secondary text (branded gray)
  gold:        '#C9A05D', // Premium/trust/industry leader elements
  sky:         '#73C2FB', // Secondary accent — links, info
} as const

// ─── IDENTITY ─────────────────────────────────────────────────────────────────
export const SITE = {
  /** Public-facing name shown in nav, emails, page titles */
  name: 'The Peptide Alliance',

  /** Short name for tight spaces (mobile nav, email subject lines) */
  shortName: 'PeptideAlliance',

  /** One-line tagline shown in hero and footer */
  tagline: 'The Standard in Regenerative Health.',

  /** Longer description for meta tags and About page */
  description:
    'The most trusted directory for verified peptide sources, clinics, compounding pharmacies, and research labs across the United States and Canada.',

  /** Production domain — no trailing slash */
  domain: 'peptidealliance.io',

  /** Full canonical URL */
  url: 'https://peptidealliance.io',

  /** Support / contact email (shown publicly) */
  supportEmail: 'hello@peptidealliance.io',

  /** Internal admin notifications email (not shown publicly) */
  adminEmail: 'admin@peptidealliance.io',

  /** Copyright line in footer */
  copyrightName: 'The Peptide Alliance Inc.',

  /** Social handles (leave blank to hide) */
  social: {
    instagram: 'thepeptidealliance',
    facebook:  '',
    twitter:   'peptidealliance',
    linkedin:  'the-peptide-alliance',
  },
} as const

// ─── GEOGRAPHY ────────────────────────────────────────────────────────────────
export const GEO = {
  /** Countries served */
  country: 'United States & Canada',

  /** Default city when none is selected (empty — many businesses are national/online) */
  defaultCity: '',

  /** Default province/state code */
  defaultProvince: '',

  /**
   * Cities listed on the homepage and browse pages.
   * For Peptide Alliance, geography is US + Canada wide — see lib/config/geography.ts
   */
  cities: [] as { name: string; province: string }[],

  provinceNames: {} as Record<string, string>,
} as const

// ─── LOCALIZATION ─────────────────────────────────────────────────────────────
export const I18N = {
  multilingual: false,
  defaultLocale: 'en' as const,
  locales: ['en'] as const,
  secondaryLanguageLabel: '',
} as const

// ─── CHATBOT ─────────────────────────────────────────────────────────────────
export const CHATBOT = {
  /** Name shown in the chat widget header */
  name: 'PeptideBot',

  /** One-line persona description fed to Claude as a system prompt */
  persona:
    'a knowledgeable peptide directory assistant who helps users find verified peptide sources, clinics, compounding pharmacies, and research labs. You are authoritative and informative but never give medical advice. You help users navigate the directory.',

  /** Opening message shown when the chat widget opens */
  greeting:
    'Hi! I can help you find verified peptide sources, clinics, and labs. What are you looking for?',

  /** Avatar image path (relative to /public) */
  avatarImage: '/images/logo.png',
} as const

// ─── HOMEPAGE COPY ────────────────────────────────────────────────────────────
export const COPY = {
  hero: {
    badge:    'Verified Peptide Directory',
    headline: 'Search Verified\nPeptide Sources',
    subtext:
      'The most trusted directory for pharmaceutical peptides, compounding pharmacies, clinics, and research labs. Every source verified.',
    ctaPrimary:   'Browse Directory',
    ctaSecondary: 'List Your Business',
  },

  why: {
    heading: 'Why The Peptide Alliance?',
    reasons: [
      {
        icon:  '',
        title: 'Verified Sources',
        body:  'Every listing is reviewed and verified by our team before publication.',
      },
      {
        icon:  '',
        title: 'Trust Score',
        body:  'Proprietary trust scoring based on certifications, lab results, and community reviews.',
      },
      {
        icon:  '',
        title: 'Industry Coverage',
        body:  'From peptide brands to clinics, compounding pharmacies to research labs — the full supply chain.',
      },
    ],
  },

  claimBanner: {
    heading: 'Own a peptide business?',
    subtext: 'Get verified and listed in the most trusted peptide directory in North America.',
    cta:     'Get Listed',
  },

  footer: {
    tagline: 'The Standard in Regenerative Health.',
  },
} as const

// ─── PRICING ─────────────────────────────────────────────────────────────────
export const PRICING = {
  /** Currency code */
  currency: 'USD',

  tiers: {
    free: {
      name:    'Standard',
      price:   0,
      features: [
        'Listed in directory with basic business info',
        'Single category listing',
        'Contact form (no instant notification)',
        'No outbound links',
      ],
    },
    verified: {
      name:    'Verified',
      price:   49,
      interval: 'month' as const,
      features: [
        'Verified badge on your listing',
        'Clickable links: website, social media & Google Maps',
        'Manage and showcase customer reviews',
        'Email notification for every new lead',
        'Listed in up to 3 categories',
        'Instagram shout-out on sign up',
      ],
    },
    featured: {
      name:    'Featured',
      price:   99,
      interval: 'month' as const,
      features: [
        'Everything in Verified, plus:',
        'Featured at top of category pages',
        'Highlighted card design',
        'Monthly performance report',
        'Priority support',
        'A dedicated blog post featuring your business',
      ],
    },
    industry_leader: {
      name:    'Industry Leader',
      price:   499,
      interval: 'month' as const,
      features: [
        'Everything in Featured, plus:',
        'Homepage featured section (rotating spotlight)',
        'Top position in search results',
        'Backlink from a dedicated business profile article',
        'Direct phone number displayed',
        '$200 in paid media spent monthly for your business',
        'Lead generation packages available',
      ],
    },
  },
} as const

// ─── INSTAGRAM BOT ───────────────────────────────────────────────────────────
export const INSTAGRAM = {
  postHour:   10,
  postMinute: 0,
  timezone:   'America/New_York',

  slide2Tagline: `Discover verified peptide sources at ${SITE.domain}`,

  slideColors: {
    background: COLORS.bg,
    primary:    COLORS.primary,
    accent:     COLORS.accent,
    card:       COLORS.card,
    text:       COLORS.text,
    muted:      COLORS.muted,
  },
} as const
