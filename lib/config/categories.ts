/**
 * categories.ts — Business categories for The Peptide Alliance directory.
 *
 * When you change category IDs here you must also update the database
 * enum in supabase/migrations.
 */

export type Subcategory = {
  id: string
  label: { en: string }
}

export type Category = {
  id: string
  slug: { en: string }
  label: { en: string }
  icon: string
  color: string
  subcategories: Subcategory[]
}

// ─── PEPTIDE ALLIANCE CATEGORIES ─────────────────────────────────────────────

export const CATEGORIES: Category[] = [
  {
    id:    'peptide_brands',
    slug:  { en: 'peptide-brands' },
    label: { en: 'Peptide Brands' },
    icon:  '💊',
    color: 'bg-sky-50',
    subcategories: [
      { id: 'research-peptides',        label: { en: 'Research Peptides' } },
      { id: 'pharmaceutical-peptides',  label: { en: 'Pharmaceutical Peptides' } },
      { id: 'cosmetic-peptides',        label: { en: 'Cosmetic Peptides' } },
      { id: 'custom-synthesis',         label: { en: 'Custom Synthesis' } },
    ],
  },
  {
    id:    'clinics',
    slug:  { en: 'clinics' },
    label: { en: 'Clinics' },
    icon:  '🏥',
    color: 'bg-emerald-50',
    subcategories: [
      { id: 'peptide-therapy',     label: { en: 'Peptide Therapy' } },
      { id: 'longevity-clinics',   label: { en: 'Longevity & Anti-Aging' } },
      { id: 'sports-medicine',     label: { en: 'Sports Medicine' } },
      { id: 'hormone-therapy',     label: { en: 'Hormone Therapy' } },
      { id: 'functional-medicine', label: { en: 'Functional Medicine' } },
    ],
  },
  {
    id:    'compounding_pharmacies',
    slug:  { en: 'compounding-pharmacies' },
    label: { en: 'Compounding Pharmacies' },
    icon:  '⚗️',
    color: 'bg-violet-50',
    subcategories: [
      { id: 'sterile-compounding',   label: { en: 'Sterile Compounding' } },
      { id: 'non-sterile-compounding', label: { en: 'Non-Sterile Compounding' } },
      { id: '503b-outsourcing',      label: { en: '503B Outsourcing Facilities' } },
    ],
  },
  {
    id:    'research_labs',
    slug:  { en: 'research-labs' },
    label: { en: 'Research Labs' },
    icon:  '🔬',
    color: 'bg-amber-50',
    subcategories: [
      { id: 'third-party-testing', label: { en: 'Third-Party Testing' } },
      { id: 'peptide-research',    label: { en: 'Peptide Research' } },
      { id: 'clinical-trials',     label: { en: 'Clinical Trials' } },
    ],
  },
  {
    id:    'wholesale_suppliers',
    slug:  { en: 'wholesale-suppliers' },
    label: { en: 'Wholesale Suppliers' },
    icon:  '📦',
    color: 'bg-orange-50',
    subcategories: [
      { id: 'raw-materials',       label: { en: 'Raw Materials' } },
      { id: 'finished-products',   label: { en: 'Finished Products' } },
      { id: 'equipment-supplies',  label: { en: 'Equipment & Supplies' } },
    ],
  },
  {
    id:    'manufacturers',
    slug:  { en: 'manufacturers' },
    label: { en: 'Manufacturers' },
    icon:  '🏭',
    color: 'bg-teal-50',
    subcategories: [
      { id: 'gmp-manufacturing',      label: { en: 'GMP Manufacturing' } },
      { id: 'contract-manufacturing',  label: { en: 'Contract Manufacturing' } },
      { id: 'api-manufacturing',       label: { en: 'API Manufacturing' } },
    ],
  },
]

// ─── HELPERS ──────────────────────────────────────────────────────────────────

/** Look up a category by its id */
export function getCategoryById(id: string): Category | undefined {
  return CATEGORIES.find(c => c.id === id)
}

/** Look up a category by a slug */
export function getCategoryBySlug(slug: string): Category | undefined {
  return CATEGORIES.find(c => c.slug.en === slug)
}

/** Get the slug string for a category id */
export function getCategorySlug(id: string): string {
  const cat = CATEGORIES.find(c => c.id === id)
  return cat?.slug.en ?? id
}
