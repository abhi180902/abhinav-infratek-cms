export function normalizePhoneForLink(phoneNumber) {
  return String(phoneNumber ?? '').replace(/[^\d+]/g, '')
}

export function buildWhatsAppUrl(phoneNumber) {
  const normalizedNumber = normalizePhoneForLink(phoneNumber).replace(/^\+/, '')
  return normalizedNumber ? `https://wa.me/${normalizedNumber}` : ''
}
