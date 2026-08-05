const NUMERO = import.meta.env.VITE_WHATSAPP_NUMBER;

export function buildWhatsAppLink(mensaje) {
  return `https://wa.me/${NUMERO}?text=${encodeURIComponent(mensaje)}`;
}
