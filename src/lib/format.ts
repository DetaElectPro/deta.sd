export function formatUSD(value: number | null | undefined, lang: 'ar' | 'en'): string {
  if (value === null || value === undefined || Number.isNaN(value)) {
    return '—';
  }
  const locale = lang === 'ar' ? 'ar-EG' : 'en-US';
  return new Intl.NumberFormat(locale, { style: 'currency', currency: 'USD' }).format(value);
}

export function formatDate(iso: string | null | undefined, lang: 'ar' | 'en'): string {
  if (iso === null || iso === undefined || iso === '') {
    return '—';
  }
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) {
    return '—';
  }
  const locale = lang === 'ar' ? 'ar-EG-u-ca-gregory' : 'en-US';
  return new Intl.DateTimeFormat(locale, { year: 'numeric', month: 'long', day: 'numeric' }).format(date);
}
