import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { obtenerProductos } from '../../services/api';
import SpiceLevel from '../ui/SpiceLevel';
import Button from '../ui/Button';

const formatoLempiras = new Intl.NumberFormat('es-HN', {
  style: 'currency',
  currency: 'HNL',
  minimumFractionDigits: 0,
});

export default function Productos() {
  const [productos, setProductos] = useState([]);
  const [estado, setEstado] = useState('cargando');

  useEffect(() => {
    let activo = true;

    obtenerProductos()
      .then((datos) => {
        if (!activo) return;
        setProductos(datos.filter((producto) => producto.tipo === 'individual'));
        setEstado('listo');
      })
      .catch(() => {
        if (activo) setEstado('error');
      });

    return () => {
      activo = false;
    };
  }, []);

  return (
    <section id="productos" className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
      <div className="mb-10 max-w-xl">
        <h2 className="font-display text-3xl font-semibold text-navy sm:text-4xl">Productos destacados</h2>
        <p className="mt-3 text-ink/70">
          Cada frasco se prepara por lotes para conservar su frescura, textura y el nivel de picante justo.
        </p>
      </div>

      {estado === 'cargando' && <p className="text-sm text-ink/60">Cargando productos…</p>}
      {estado === 'error' && (
        <p className="text-sm text-chili">
          No pudimos cargar los productos en este momento. Verifica que el backend esté corriendo.
        </p>
      )}

      {estado === 'listo' && (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {productos.map((producto, indice) => {
            const variante = producto.variantes[0];

            return (
              <motion.article
                key={producto.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.5, delay: indice * 0.08 }}
                className="relative flex flex-col gap-3 rounded-2xl border border-olive/15 bg-white/70 p-6 shadow-sm shadow-olive-dark/5"
              >
                {producto.mas_vendido && (
                  <span className="absolute -top-3 left-6 rounded-full bg-carrot px-3 py-1 text-xs font-semibold text-white">
                    Más vendido
                  </span>
                )}
                <h3 className="font-display text-xl font-semibold text-navy">{producto.nombre}</h3>
                <p className="text-sm text-ink/70">{producto.descripcion}</p>
                <SpiceLevel nivel={producto.nivel_picante} />
                {variante && (
                  <div className="mt-2 flex items-center justify-between">
                    <div>
                      <p className="text-xs uppercase tracking-wide text-ink/50">{variante.presentacion}</p>
                      <p className="font-display text-2xl font-semibold text-chili">
                        {formatoLempiras.format(Number(variante.precio))}
                      </p>
                    </div>
                    <Button variant="secondary" disabled title="Disponible en la próxima fase">
                      Añadir al carrito
                    </Button>
                  </div>
                )}
              </motion.article>
            );
          })}
        </div>
      )}
    </section>
  );
}
