// ─── Peptide Alliance Database Types ──────────────────────────────────────────

export type BusinessCategory =
  | 'peptide_brands'
  | 'clinics'
  | 'compounding_pharmacies'
  | 'research_labs'
  | 'wholesale_suppliers'
  | 'manufacturers';

export type SubscriptionTier = 'free' | 'verified' | 'featured' | 'industry_leader';

export type ServiceArea = 'national' | 'online_only' | 'regional' | 'local';

export type Business = {
  id: string;
  name: string;
  slug: string;
  description_en: string | null;
  category: BusinessCategory;
  subcategory: string;
  city: string;
  city_slug: string;
  province: string;
  country: 'US' | 'CA';
  service_area: ServiceArea;
  address: string | null;
  phone: string | null;
  email: string | null;
  website: string | null;
  instagram: string | null;
  tiktok: string | null;
  facebook: string | null;
  linkedin: string | null;
  google_maps_url: string | null;
  keywords: string[] | null;
  long_description_en: string | null;
  rating: number | null;
  review_count: number;
  trust_score: number;
  is_verified: boolean;
  is_premium: boolean;
  is_active: boolean;
  claimed_by: string | null;
  source: 'google_places' | 'web_scrape' | 'manual' | 'claimed';
  source_id: string | null;
  stripe_customer_id: string | null;
  stripe_subscription_id: string | null;
  subscription_tier: SubscriptionTier;
  subscription_started_at: string | null;
  subscription_ends_at: string | null;
  expires_at: string | null;
  owner_title: string | null;
  logo_url: string | null;
  hours: Record<string, string> | null;
  latitude: number | null;
  longitude: number | null;
  created_at: string;
  updated_at: string;
  last_scraped_at: string | null;
};

export type Profile = {
  id: string;
  full_name: string | null;
  role: 'admin' | 'business_owner' | 'user';
  business_id: string | null;
  email: string | null;
  preferred_language: 'en';
  created_at: string;
};

export type SubscriptionEvent = {
  id: string;
  business_id: string;
  stripe_event_id: string;
  event_type: string;
  tier: string | null;
  amount: number | null;
  currency: string;
  created_at: string;
};

export type BlogPost = {
  id: string;
  title_en: string;
  slug: string;
  content_en: string;
  excerpt_en: string | null;
  category: string | null;
  city: string | null;
  is_published: boolean;
  meta_title_en: string | null;
  meta_description_en: string | null;
  generated_by: string;
  reviewed_by: string | null;
  published_at: string | null;
  created_at: string;
};

export type NewsletterSubscriber = {
  id: string;
  email: string;
  preferred_language: 'en';
  city: string | null;
  subscribed: boolean;
  unsubscribe_token: string;
  created_at: string;
};

export type BusinessPhoto = {
  id: string;
  business_id: string;
  url: string;
  photo_type: 'logo' | 'storefront' | 'products' | 'team' | 'other';
  sort_order: number;
  created_at: string;
};

export type Review = {
  id: string;
  business_id: string;
  user_id: string;
  rating: number;
  comment: string | null;
  owner_reply: string | null;
  owner_replied_at: string | null;
  created_at: string;
  updated_at: string;
  reviewer_name?: string;
};

export type Lead = {
  id: string;
  business_id: string;
  user_name: string;
  user_email: string;
  user_phone: string | null;
  message: string | null;
  notified: boolean;
  created_at: string;
  name?: string;
  email?: string;
  phone?: string | null;
};

// ─── Phase 2: Enhanced Profile Types ──────────────────────────────────────────

export type Product = {
  id: string;
  business_id: string;
  name: string;
  product_type: 'peptide' | 'supplement' | 'pharmaceutical' | 'equipment' | 'service' | 'other';
  description: string | null;
  sku: string | null;
  price: number | null;
  quantity_duration: string | null;
  product_url: string | null;
  is_active: boolean;
  sort_order: number;
  created_at: string;
};

export type BusinessBlogPost = {
  id: string;
  business_id: string;
  title: string;
  content: string;
  auto_generated: boolean;
  published_at: string;
  created_at: string;
};

export type Certification = {
  id: string;
  business_id: string;
  name: string;
  issuing_body: string | null;
  certificate_url: string | null;
  verified_by_admin: boolean;
  expires_at: string | null;
  created_at: string;
};

export type LabResult = {
  id: string;
  business_id: string;
  product_name: string | null;
  test_type: 'identity' | 'purity' | 'potency' | 'sterility' | 'endotoxin' | 'heavy_metals' | 'other';
  result_url: string | null;
  description: string | null;
  testing_lab: string | null;
  test_date: string | null;
  verified_by_admin: boolean;
  created_at: string;
};
