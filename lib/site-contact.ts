/** Public contact details aligned with parolegy.com / FAQ. */

export const SITE_CONTACT = {
  phoneDisplay: '1-888-318-3525',
  /** E.164 — callers press 0 for a live representative (per site FAQ). */
  phoneTel: '+18883183525',
  emailPrimary: 'info@parolegy.com',
  office: {
    name: 'Parolegy',
    street: '600 W 6th Street, Fourth Floor',
    cityStateZip: 'Fort Worth, TX 76102',
    country: 'United States',
  },
  mailing: {
    line1: 'Parolegy',
    line2: 'PO Box 703',
    line3: 'Fort Worth, TX 76101',
  },
  hours: 'Monday–Friday, 9:00 a.m.–6:00 p.m. (CT)',
} as const

export function mapsUrlOffice(): string {
  const q = encodeURIComponent(
    `${SITE_CONTACT.office.street}, ${SITE_CONTACT.office.cityStateZip}`
  )
  return `https://www.google.com/maps/search/?api=1&query=${q}`
}
