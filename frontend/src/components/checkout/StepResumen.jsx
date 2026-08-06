import Button from '../ui/Button';

const formatoLempiras = new Intl.NumberFormat('es-HN', {
  style: 'currency',
  currency: 'HNL',
  minimumFractionDigits: 0,
});

const ETIQUETAS_PAGO = {
  tarjeta: 'Tarjeta (BAC Compra-Click)',
  transferencia: 'Transferencia bancaria',
  contra_entrega: 'Pago contra entrega',
};

export default function StepResumen({ items, datos, costoEnvio, subtotal, enviando, error, onConfirmar }) {
  const total = subtotal + costoEnvio;

  return (
    <div className="flex flex-col gap-4">
      <h2 className="font-display text-2xl font-semibold text-navy">Confirma tu pedido</h2>

      <div className="rounded-xl border border-olive/15 bg-white/60 p-4">
        <h3 className="mb-2 font-medium text-navy">Productos</h3>
        <ul className="flex flex-col gap-2 text-sm">
          {items.map((item) => (
            <li key={item.varianteId} className="flex justify-between">
              <span>
                {item.nombre} ({item.presentacion}) x{item.cantidad}
              </span>
              <span>{formatoLempiras.format(item.precio * item.cantidad)}</span>
            </li>
          ))}
        </ul>
        <div className="mt-3 flex flex-col gap-1 border-t border-olive/15 pt-3 text-sm">
          <div className="flex justify-between text-ink/70">
            <span>Subtotal</span>
            <span>{formatoLempiras.format(subtotal)}</span>
          </div>
          <div className="flex justify-between text-ink/70">
            <span>Envío</span>
            <span>{costoEnvio > 0 ? formatoLempiras.format(costoEnvio) : 'Sin costo'}</span>
          </div>
          <div className="flex justify-between font-display text-lg font-semibold text-navy">
            <span>Total</span>
            <span>{formatoLempiras.format(total)}</span>
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-olive/15 bg-white/60 p-4 text-sm text-ink/70">
        <p><span className="font-medium text-navy">Cliente:</span> {datos.nombre} — {datos.telefono}</p>
        <p>
          <span className="font-medium text-navy">Entrega:</span>{' '}
          {datos.metodoEntrega === 'domicilio'
            ? `${datos.direccion}, ${datos.ciudad}, ${datos.departamento}`
            : 'Recoger en punto de venta'}
        </p>
        <p><span className="font-medium text-navy">Pago:</span> {ETIQUETAS_PAGO[datos.metodoPago]}</p>
      </div>

      {error && <p className="text-sm text-chili">{error}</p>}

      <Button variant="primary" onClick={onConfirmar} disabled={enviando} className="justify-center">
        {enviando ? 'Enviando pedido…' : 'Confirmar pedido'}
      </Button>
    </div>
  );
}
