/**
 * geography.ts — US + Canada geography for The Peptide Alliance.
 *
 * Many peptide businesses operate nationally or online-only,
 * so we support a service_area concept beyond just city/province.
 */

export const COUNTRIES = [
  { code: 'US', name: 'United States' },
  { code: 'CA', name: 'Canada' },
] as const

export type CountryCode = typeof COUNTRIES[number]['code']

export type ServiceArea = 'national' | 'online_only' | 'regional' | 'local'

export const SERVICE_AREAS: { value: ServiceArea; label: string }[] = [
  { value: 'national',    label: 'National (serves entire country)' },
  { value: 'online_only', label: 'Online Only' },
  { value: 'regional',    label: 'Regional (serves a state/province)' },
  { value: 'local',       label: 'Local (serves a city/area)' },
]

export const US_STATES: Record<string, string> = {
  AL: 'Alabama', AK: 'Alaska', AZ: 'Arizona', AR: 'Arkansas',
  CA: 'California', CO: 'Colorado', CT: 'Connecticut', DE: 'Delaware',
  FL: 'Florida', GA: 'Georgia', HI: 'Hawaii', ID: 'Idaho',
  IL: 'Illinois', IN: 'Indiana', IA: 'Iowa', KS: 'Kansas',
  KY: 'Kentucky', LA: 'Louisiana', ME: 'Maine', MD: 'Maryland',
  MA: 'Massachusetts', MI: 'Michigan', MN: 'Minnesota', MS: 'Mississippi',
  MO: 'Missouri', MT: 'Montana', NE: 'Nebraska', NV: 'Nevada',
  NH: 'New Hampshire', NJ: 'New Jersey', NM: 'New Mexico', NY: 'New York',
  NC: 'North Carolina', ND: 'North Dakota', OH: 'Ohio', OK: 'Oklahoma',
  OR: 'Oregon', PA: 'Pennsylvania', RI: 'Rhode Island', SC: 'South Carolina',
  SD: 'South Dakota', TN: 'Tennessee', TX: 'Texas', UT: 'Utah',
  VT: 'Vermont', VA: 'Virginia', WA: 'Washington', WV: 'West Virginia',
  WI: 'Wisconsin', WY: 'Wyoming', DC: 'District of Columbia',
}

export const CA_PROVINCES: Record<string, string> = {
  AB: 'Alberta', BC: 'British Columbia', MB: 'Manitoba',
  NB: 'New Brunswick', NL: 'Newfoundland and Labrador',
  NS: 'Nova Scotia', NT: 'Northwest Territories', NU: 'Nunavut',
  ON: 'Ontario', PE: 'Prince Edward Island', QC: 'Quebec',
  SK: 'Saskatchewan', YT: 'Yukon',
}

/** Get states/provinces for a given country */
export function getRegions(country: CountryCode): Record<string, string> {
  return country === 'US' ? US_STATES : CA_PROVINCES
}

/** Get display name for a state/province code */
export function getRegionName(code: string, country: CountryCode): string {
  const regions = getRegions(country)
  return regions[code] || code
}
