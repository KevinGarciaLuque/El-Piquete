import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { obtenerPedidoAdmin, actualizarEstadoPedidoAdmin } from '../../services/adminApi';
import { normalizarTelefonoHN } from '../../lib/phone';
import { inputClass } from '../../components/checkout/Field';
import Button from '../../components/ui/Button';

const ESTADOS = [
  { valor: 'pendiente_pago', etiqueta: 'Pendiente de pago' },
  { valor: 'pagado', etiqueta: 'Pagado' },
  { valor: 'en_preparacion', etiqueta: 'En preparación' },
  { valor: 'listo', etiqueta: 'Listo' },
  { valor: 'en_camino', etiqueta: 'En camino' },
  { valor: 'entregado', etiqueta: 'Entregado' },
  { valor: 'cancelado', etiqueta: 'Cancelado' },
];

const ETIQUETAS_PAGO = {
  tarjeta: 'Tarjeta (BAC Compra-Click)',
  transferencia: 'Transferencia bancaria',
  contra_entrega: 'Pago contra entrega',
};

const formatoLempiras = new Intl.NumberFormat('es-HN', { style: 'currency', currency: 'HNL', minimumFractionDigits: 0 });
const formatoFecha = new Intl.DateTimeFormat('es-HN', { dateStyle: 'long', timeStyle: 'short' });

function EnviarEnlaceBac({ pedido }) {
  const [enlace, setEnlace] = useState('');

  const mensaje = [
    `¡Hola ${pedido.cliente_nombre}! Aquí tienes el enlace seguro para pagar tu pedido ${pedido.codigo} de Encurtidos El Piquete:`,
    enlace || '[pega aquí el enlace de BAC Compra-Click]',
    `Total a pagar: ${formatoLempiras.format(Number(pedido.total))}`,
  ].join('\n');

  const href = `https://wa.me/${normalizarTelefonoHN(pedido.cliente_telefono)}?text=${encodeURIComponent(mensaje)}`;

  return (
    <div className="rounded-xl border border-olive/15 bg-white/60 p-4">
      <h2 className="mb-2 font-medium text-navy">Enviar enlace de pago BAC Compra-Click</h2>
      <p className="mb-3 text-sm text-ink/60">
        Genera el enlace desde tu portal de BAC Compra-Click, pégalo aquí y envíalo al cliente por WhatsApp.
      </p>
      <div className="flex flex-col gap-2 sm:flex-row">
        <input
          className={`${inputClass} flex-1`}
          placeholder="https://compraclick.baccredomatic.com/..."
          value={enlace}
          onChange={(e) => setEnlace(e.target.value)}
        />
        <Button as="a" variant="primary" target="_blank" rel="noopener noreferrer" href={href}>
          Enviar por WhatsApp
        </Button>
      </div>
    </div>
  );
}

export default function PedidoDetalle() {
  const { codigo } = useParams();
  const [pedido, setPedido] = useState(null);
  const [cargando, setCargando] = useState(true);

  function cargar() {
    setCargando(true);
    obtenerPedidoAdmin(codigo)
      .then(setPedido)
      .finally(() => setCargando(false));
  }

  useEffect(cargar, [codigo]);

  async function cambiarEstado(nuevoEstado) {
    await actualizarEstadoPedidoAdmin(pedido.id, nuevoEstado);
    setPedido((p) => ({ ...p, estado: nuevoEstado }));
  }

  if (cargando) return <p className="text-sm text-ink/60">Cargando pedido…</p>;
  if (!pedido) return <p className="text-sm text-chili">Pedido no encontrado.</p>;

  return (
    <div className="flex flex-col gap-6">
      <div>
        <Link to="/admin/pedidos" className="text-sm text-ink/60 hover:underline">← Volver a pedidos</Link>
        <h1 className="mt-1 font-display text-2xl font-semibold text-navy">Pedido {pedido.codigo}</h1>
        <p className="text-sm text-ink/60">{formatoFecha.format(new Date(pedido.created_at))}</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="flex flex-col gap-4">
          <div className="rounded-xl border border-olive/15 bg-white/60 p-4 text-sm">
            <h2 className="mb-2 font-medium text-navy">Cliente</h2>
            <p>{pedido.cliente_nombre} — {pedido.cliente_telefono}</p>
            {pedido.cliente_correo && <p className="text-ink/60">{pedido.cliente_correo}</p>}
          </div>

          <div className="rounded-xl border border-olive/15 bg-white/60 p-4 text-sm">
            <h2 className="mb-2 font-medium text-navy">Entrega</h2>
            {pedido.metodo_entrega === 'domicilio' ? (
              <>
                <p>{pedido.direccion}, {pedido.ciudad}, {pedido.departamento}</p>
                {pedido.punto_referencia && <p className="text-ink/60">Referencia: {pedido.punto_referencia}</p>}
                <p className="text-ink/60">Zona: {pedido.zona_nombre}</p>
              </>
            ) : (
              <p>Recoger en punto de venta</p>
            )}
          </div>

          <div className="rounded-xl border border-olive/15 bg-white/60 p-4 text-sm">
            <h2 className="mb-2 font-medium text-navy">Estado del pedido</h2>
            <p className="mb-2 text-ink/60">Pago: {ETIQUETAS_PAGO[pedido.metodo_pago] || pedido.metodo_pago}</p>
            <select value={pedido.estado} onChange={(e) => cambiarEstado(e.target.value)} className={inputClass}>
              {ESTADOS.map((e) => (
                <option key={e.valor} value={e.valor}>{e.etiqueta}</option>
              ))}
            </select>
          </div>

          {pedido.metodo_pago === 'tarjeta' && pedido.estado === 'pendiente_pago' && <EnviarEnlaceBac pedido={pedido} />}
        </div>

        <div className="rounded-xl border border-olive/15 bg-white/60 p-4 text-sm">
          <h2 className="mb-3 font-medium text-navy">Productos</h2>
          <ul className="flex flex-col gap-2">
            {pedido.items.map((item, indice) => (
              <li key={indice} className="flex justify-between border-b border-olive/10 pb-2 last:border-0">
                <span>{item.producto_nombre} ({item.presentacion}) x{item.cantidad}</span>
                <span>{formatoLempiras.format(Number(item.subtotal))}</span>
              </li>
            ))}
          </ul>
          <div className="mt-3 flex flex-col gap-1 border-t border-olive/15 pt-3">
            <div className="flex justify-between text-ink/70"><span>Subtotal</span><span>{formatoLempiras.format(Number(pedido.subtotal))}</span></div>
            <div className="flex justify-between text-ink/70"><span>Envío</span><span>{formatoLempiras.format(Number(pedido.costo_envio))}</span></div>
            <div className="flex justify-between font-display text-lg font-semibold text-navy"><span>Total</span><span>{formatoLempiras.format(Number(pedido.total))}</span></div>
          </div>
        </div>
      </div>
    </div>
  );
}
