const formatoLempiras = new Intl.NumberFormat('es-HN', {
  style: 'currency',
  currency: 'HNL',
  minimumFractionDigits: 0,
});

const ETIQUETAS_PAGO = {
  transferencia: 'Transferencia bancaria',
  contra_entrega: 'Pago contra entrega',
  tarjeta: 'Tarjeta (enlace de pago seguro)',
};

function construirCorreoPedido({ codigo, clienteNombre, items, subtotal, costoEnvio, total, metodoPago, tiempoEstimado }) {
  const filas = items
    .map(
      (item) => `
        <tr>
          <td style="padding:8px 0;color:#2b2a28;">${item.nombre} (${item.presentacion}) x${item.cantidad}</td>
          <td style="padding:8px 0;text-align:right;color:#2b2a28;">${formatoLempiras.format(item.precioUnitario * item.cantidad)}</td>
        </tr>`,
    )
    .join('');

  const html = `
  <div style="font-family:Arial,sans-serif;background-color:#fbf3e7;padding:24px;">
    <div style="max-width:480px;margin:0 auto;background:#ffffff;border-radius:16px;overflow:hidden;border:1px solid #e5ddcc;">
      <div style="background-color:#3e4a28;padding:20px;text-align:center;">
        <h1 style="color:#fbf3e7;margin:0;font-size:20px;">Encurtidos El Piquete</h1>
      </div>
      <div style="padding:24px;">
        <h2 style="color:#1b2a4a;margin-top:0;">¡Gracias por tu compra, ${clienteNombre}!</h2>
        <p style="color:#2b2a28;">Tu pedido <strong style="color:#c1272d;">#${codigo}</strong> ha sido recibido y está <strong>pendiente de pago</strong>.</p>

        <table style="width:100%;border-collapse:collapse;margin:16px 0;">
          ${filas}
          <tr><td colspan="2" style="border-top:1px solid #e5ddcc;padding-top:8px;"></td></tr>
          <tr>
            <td style="padding:4px 0;color:#2b2a28;">Subtotal</td>
            <td style="padding:4px 0;text-align:right;color:#2b2a28;">${formatoLempiras.format(subtotal)}</td>
          </tr>
          <tr>
            <td style="padding:4px 0;color:#2b2a28;">Envío</td>
            <td style="padding:4px 0;text-align:right;color:#2b2a28;">${costoEnvio > 0 ? formatoLempiras.format(costoEnvio) : 'Sin costo'}</td>
          </tr>
          <tr>
            <td style="padding:8px 0;font-weight:bold;color:#1b2a4a;">Total</td>
            <td style="padding:8px 0;text-align:right;font-weight:bold;color:#1b2a4a;">${formatoLempiras.format(total)}</td>
          </tr>
        </table>

        <p style="color:#2b2a28;"><strong>Método de pago:</strong> ${ETIQUETAS_PAGO[metodoPago] || metodoPago}</p>
        <p style="color:#2b2a28;"><strong>Entrega estimada:</strong> ${tiempoEstimado}</p>

        <p style="color:#6b6a68;font-size:13px;margin-top:24px;">
          Te contactaremos por WhatsApp para coordinar los detalles de tu pedido.
        </p>
      </div>
    </div>
  </div>`;

  return { subject: `Pedido ${codigo} recibido - Encurtidos El Piquete`, html };
}

module.exports = { construirCorreoPedido };
