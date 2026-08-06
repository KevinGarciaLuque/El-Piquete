export function normalizarTelefonoHN(telefono) {
  const digitos = telefono.replace(/\D/g, '');
  if (digitos.startsWith('504')) return digitos;
  return `504${digitos}`;
}
