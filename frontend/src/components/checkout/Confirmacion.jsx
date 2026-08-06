import { Link } from 'react-router-dom';
import Button from '../ui/Button';
import { buildWhatsAppLink } from '../../lib/whatsapp';

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

export default function Confirmacion({ pedido }) {
  const mensaje = [
    `¡Hola! Quiero confirmar mi pedido ${pedido.codigo} de Encurtidos El Piquete.`,
    `Total: ${formatoLempiras.format(pedido.total)}`,
    `Método de pago: ${ETIQUETAS_PAGO[pedido.metodoPago] || pedido.metodoPago}`,
  ].join('\n');

  return (
    <div className="flex flex-col items-center gap-4 text-center">
      <span className="flex h-16 w-16 items-center justify-center rounded-full bg-olive/15 text-3xl">✓</span>
      <h2 className="font-display text-3xl font-semibold text-navy">¡Gracias por tu compra!</h2>
      <p className="text-ink/70">
        Tu pedido <span className="font-semibold text-chili">#{pedido.codigo}</span> ha sido recibido.
      </p>

      <div className="w-full max-w-sm rounded-xl border border-olive/15 bg-white/60 p-4 text-left text-sm">
        <p><span className="font-medium text-navy">Estado:</span> Pendiente de pago</p>
        <p><span className="font-medium text-navy">Total:</span> {formatoLempiras.format(pedido.total)}</p>
        <p><span className="font-medium text-navy">Entrega estimada:</span> {pedido.tiempoEstimado}</p>
      </div>

      <div className="flex w-full max-w-sm flex-col gap-2">
        <Button as="a" variant="primary" target="_blank" rel="noopener noreferrer" href={buildWhatsAppLink(mensaje)} className="justify-center">
          Confirmar por WhatsApp
        </Button>
        <Button as={Link} to="/" variant="outline" className="justify-center">
          Volver al inicio
        </Button>
      </div>
    </div>
  );
}
