import { useEffect, useState } from 'react';
import { obtenerPedidosAdmin, actualizarEstadoPedidoAdmin } from '../../services/adminApi';

const ESTADOS = [
  { valor: 'pendiente_pago', etiqueta: 'Pendiente de pago', color: 'bg-carrot/20 text-carrot' },
  { valor: 'pagado', etiqueta: 'Pagado', color: 'bg-olive/20 text-olive-dark' },
  { valor: 'en_preparacion', etiqueta: 'En preparación', color: 'bg-navy/10 text-navy' },
  { valor: 'listo', etiqueta: 'Listo', color: 'bg-navy/10 text-navy' },
  { valor: 'en_camino', etiqueta: 'En camino', color: 'bg-navy/10 text-navy' },
  { valor: 'entregado', etiqueta: 'Entregado', color: 'bg-olive/30 text-olive-dark' },
  { valor: 'cancelado', etiqueta: 'Cancelado', color: 'bg-chili/15 text-chili' },
];

const formatoLempiras = new Intl.NumberFormat('es-HN', {
  style: 'currency',
  currency: 'HNL',
  minimumFractionDigits: 0,
});

const formatoFecha = new Intl.DateTimeFormat('es-HN', { dateStyle: 'short', timeStyle: 'short' });

function Badge({ estado }) {
  const info = ESTADOS.find((e) => e.valor === estado);
  return <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${info?.color || 'bg-ink/10 text-ink'}`}>{info?.etiqueta || estado}</span>;
}

export default function Pedidos() {
  const [pedidos, setPedidos] = useState([]);
  const [estado, setEstado] = useState('');
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');

  function cargar() {
    setCargando(true);
    obtenerPedidosAdmin(estado || undefined)
      .then(setPedidos)
      .catch(() => setError('No se pudieron cargar los pedidos'))
      .finally(() => setCargando(false));
  }

  useEffect(cargar, [estado]);

  async function handleCambiarEstado(pedido, nuevoEstado) {
    const anteriores = pedidos;
    setPedidos((actuales) => actuales.map((p) => (p.id === pedido.id ? { ...p, estado: nuevoEstado } : p)));

    try {
      await actualizarEstadoPedidoAdmin(pedido.id, nuevoEstado);
    } catch {
      setPedidos(anteriores);
      setError('No se pudo actualizar el estado');
    }
  }

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <h1 className="font-display text-2xl font-semibold text-navy">Pedidos</h1>
        <select value={estado} onChange={(e) => setEstado(e.target.value)} className="rounded-lg border border-olive/30 bg-white px-3 py-2 text-sm">
          <option value="">Todos los estados</option>
          {ESTADOS.map((e) => (
            <option key={e.valor} value={e.valor}>{e.etiqueta}</option>
          ))}
        </select>
      </div>

      {error && <p className="mb-4 text-sm text-chili">{error}</p>}
      {cargando && <p className="text-sm text-ink/60">Cargando pedidos…</p>}

      {!cargando && pedidos.length === 0 && <p className="text-sm text-ink/60">No hay pedidos para mostrar.</p>}

      {!cargando && pedidos.length > 0 && (
        <div className="overflow-x-auto rounded-xl border border-olive/15 bg-white/60">
          <table className="w-full min-w-[720px] text-left text-sm">
            <thead className="border-b border-olive/15 text-xs uppercase tracking-wide text-ink/50">
              <tr>
                <th className="px-4 py-3">Código</th>
                <th className="px-4 py-3">Cliente</th>
                <th className="px-4 py-3">Entrega</th>
                <th className="px-4 py-3">Total</th>
                <th className="px-4 py-3">Fecha</th>
                <th className="px-4 py-3">Estado</th>
                <th className="px-4 py-3">Cambiar estado</th>
              </tr>
            </thead>
            <tbody>
              {pedidos.map((pedido) => (
                <tr key={pedido.id} className="border-b border-olive/10 last:border-0">
                  <td className="px-4 py-3 font-medium text-navy">{pedido.codigo}</td>
                  <td className="px-4 py-3">
                    <div>{pedido.cliente_nombre}</div>
                    <div className="text-xs text-ink/50">{pedido.cliente_telefono}</div>
                  </td>
                  <td className="px-4 py-3 capitalize">{pedido.metodo_entrega}</td>
                  <td className="px-4 py-3">{formatoLempiras.format(Number(pedido.total))}</td>
                  <td className="px-4 py-3 text-xs text-ink/60">{formatoFecha.format(new Date(pedido.created_at))}</td>
                  <td className="px-4 py-3"><Badge estado={pedido.estado} /></td>
                  <td className="px-4 py-3">
                    <select
                      value={pedido.estado}
                      onChange={(e) => handleCambiarEstado(pedido, e.target.value)}
                      className="rounded-lg border border-olive/30 bg-white px-2 py-1 text-xs"
                    >
                      {ESTADOS.map((e) => (
                        <option key={e.valor} value={e.valor}>{e.etiqueta}</option>
                      ))}
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
