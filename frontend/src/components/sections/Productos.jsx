import ProductCard from '../ui/ProductCard';
import Reveal from '../ui/Reveal';

export default function Productos({ productos, estado }) {
  return (
    <section id="productos" className="mx-auto max-w-6xl scroll-mt-24 px-4 py-16 sm:px-6">
      <Reveal className="mb-10 max-w-xl">
        <h2 className="font-display text-3xl font-semibold text-navy sm:text-4xl">Productos destacados</h2>
        <p className="mt-3 text-ink/70">
          Cada frasco se prepara por lotes para conservar su frescura, textura y el nivel de picante justo.
        </p>
      </Reveal>

      {estado === 'cargando' && <p className="text-sm text-ink/60">Cargando productos…</p>}
      {estado === 'error' && (
        <p className="text-sm text-chili">
          No pudimos cargar los productos en este momento. Verifica que el backend esté corriendo.
        </p>
      )}

      {estado === 'listo' && (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {productos.map((producto, indice) => (
            <ProductCard key={producto.id} producto={producto} index={indice} />
          ))}
        </div>
      )}
    </section>
  );
}
