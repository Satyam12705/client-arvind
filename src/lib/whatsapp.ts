export function whatsappLink(message: string, whatsappNumber: string) {
  const encoded = encodeURIComponent(message);
  return `https://wa.me/${whatsappNumber}?text=${encoded}`;
}

export function telLink(phone: string) {
  return `tel:+91${phone}`;
}

export function mailLink(email: string) {
  return `mailto:${email}`;
}
