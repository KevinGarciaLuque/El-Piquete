import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { obtenerProductosAdmin } from '../../services/adminApi';
import { urlImagen } from '../../lib/media';
import encurtido from '../../assets/encurtido.webp';

const formatoLempiras = new Intl.NumberFormat('es-HN', {
  style: 'currency',
  currency: 'HNL',
  minimumFractionDigits: 0,
});

export default function Productos() {
  const [productos, setProductos] = useState([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    obtenerProductosAdmin()
      .then(setProductos)
      .finally(() => setCargando(false));
  }, []);

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="font-display text-2xl font-semibold text-navy">Productos y combos</h1>
        <Link to="/admin/productos/nuevo" className="rounded-full bg-chili px-5 py-2.5 text-sm font-semibold text-cream hover:bg-chili/90">
          + Nuevo producto
        </Link>
      </div>

      {cargando && <p className="text-sm text-ink/60">Cargando productos…</p>}

      {!cargando && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {productos.map((producto) => (
            <Link
              key={producto.id}
              to={`/admin/productos/${producto.id}`}
              className={`flex flex-col gap-2 rounded-xl border p-4 transition-colors hover:border-olive-dark ${
                producto.activo ? 'border-olive/15 bg-white/60' : 'border-ink/10 bg-ink/5 opacity-60'
              }`}
            >
              <div className="flex items-center gap-3">
                <img
                  src={urlImagen(producto.imagen_url) || encurtido}
                  alt={producto.nombre}
                  loading="lazy"
                  decoding="async"
                  className="h-14 w-14 rounded-lg object-cover"
                />
                <div>
                  <p className="font-medium text-navy">{producto.nombre}</p>
                  <p className="text-xs uppercase tracking-wide text-ink/50">
                    {producto.tipo} · {producto.variantes.length} variante(s)
                  </p>
                </div>
              </div>
              <div className="flex flex-wrap gap-1">
                {producto.destacado === 1 && <span className="rounded-full bg-olive/15 px-2 py-0.5 text-xs text-olive-dark">Destacado</span>}
                {producto.mas_vendido === 1 && <span className="rounded-full bg-carrot/20 px-2 py-0.5 text-xs text-carrot">Más vendido</span>}
                {!producto.activo && <span className="rounded-full bg-ink/10 px-2 py-0.5 text-xs text-ink/60">Inactivo</span>}
              </div>
              <p className="text-sm text-ink/70">
                {producto.variantes.length > 0
                  ? producto.variantes.map((v) => formatoLempiras.format(Number(v.precio))).join(' · ')
                  : 'Sin variantes'}
              </p>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
