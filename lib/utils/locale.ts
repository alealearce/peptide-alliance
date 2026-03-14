/**
 * Generate a locale-prefixed path.
 * English (default) gets no prefix: /vancouver/slug
 * Spanish gets /es/ prefix: /es/vancouver/slug
 */
export function lp(locale: string, path: string): string {
  return locale === 'en' ? path : `/${locale}${path}`;
}

/**
 * Generate a full absolute URL with locale-aware prefix.
 */
export function lpAbsolute(base: string, locale: string, path: string): string {
  return locale === 'en' ? `${base}${path}` : `${base}/${locale}${path}`;
}
