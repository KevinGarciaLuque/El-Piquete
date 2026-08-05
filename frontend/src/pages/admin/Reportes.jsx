import { useEffect, useState } from 'react';
import { obtenerResumenReportes, descargarPedidosCsv } from '../../services/adminApi';
import Button from '../../components/ui/Button';

const ETIQUETAS_ESTADO = {
  pendiente_pago: 'Pendiente de pago',
  pagado: 'Pagado',
  en_preparacion: 'En preparación',
  listo: 'Listo',
  en_camino: 'En camino',
  entregado: 'Entregado',
  cancelado: 'Cancelado',
};

const formatoLempiras = new Intl.NumberFormat('es-HN', { style: 'currency', currency: 'HNL', minimumFractionDigits: 0 });

function StatCard({ etiqueta, valor }) {
  return (
    <div className="rounded-xl border border-olive/15 bg-white/60 p-5">
      <p className="text-xs uppercase tracking-wide text-ink/50">{etiqueta}</p>
      <p className="mt-1 font-display text-3xl font-semibold text-navy">{valor}</p>
    </div>
  );
}

export default function Reportes() {
  const [resumen, setResumen] = useState(null);
  const [descargando, setDescargando] = useState(false);

  useEffect(() => {
    obtenerResumenReportes().then(setResumen);
  }, []);

  async function handleDescargar() {
    setDescargando(true);
    try {
      const blob = await descargarPedidosCsv();
      const url = URL.createObjectURL(blob);
      const enlace = document.createElement('a');
      enlace.href = url;
      enlace.download = 'pedidos.csv';
      enlace.click();
      URL.revokeObjectURL(url);
    } finally {
      setDescargando(false);
    }
  }

  if (!resumen) return <p className="text-sm text-ink/60">Cargando reportes…</p>;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="font-display text-2xl font-semibold text-navy">Reportes</h1>
        <Button variant="primary" onClick={handleDescargar} disabled={descargando}>
          {descargando ? 'Generando…' : 'Descargar pedidos (CSV)'}
        </Button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <StatCard etiqueta="Total de ventas" valor={formatoLempiras.format(resumen.totalVentas)} />
        <StatCard etiqueta="Pedidos (no cancelados)" valor={resumen.totalPedidos} />
      </div>

      <div className="rounded-xl border border-olive/15 bg-white/60 p-5">
        <h2 className="mb-3 font-medium text-navy">Pedidos por estado</h2>
        <ul className="flex flex-col gap-2 text-sm">
          {resumen.pedidosPorEstado.map((item) => (
            <li key={item.estado} className="flex justify-between border-b border-olive/10 pb-2 last:border-0">
              <span>{ETIQUETAS_ESTADO[item.estado] || item.estado}</span>
              <span className="font-semibold text-navy">{item.cantidad}</span>
            </li>
          ))}
          {resumen.pedidosPorEstado.length === 0 && <li className="text-ink/50">Sin pedidos todavía</li>}
        </ul>
      </div>

      <div className="rounded-xl border border-olive/15 bg-white/60 p-5">
        <h2 className="mb-3 font-medium text-navy">Productos más vendidos</h2>
        <ul className="flex flex-col gap-2 text-sm">
          {resumen.productosMasVendidos.map((item) => (
            <li key={item.nombre} className="flex justify-between border-b border-olive/10 pb-2 last:border-0">
              <span>{item.nombre}</span>
              <span className="font-semibold text-navy">{item.cantidad} unidades</span>
            </li>
          ))}
          {resumen.productosMasVendidos.length === 0 && <li className="text-ink/50">Sin ventas todavía</li>}
        </ul>
      </div>
    </div>
  );
}
