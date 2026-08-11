import ProductCard from '../ui/ProductCard';
import VeggieAccent from '../ui/VeggieAccent';
import zanahoria from '../../assets/zanahoria.webp';

export default function Combos({ combos, estado }) {
  return (
    <section id="combos" className="relative scroll-mt-24 overflow-hidden bg-olive/8 py-20 lg:py-28">
      <VeggieAccent
        src={zanahoria}
        side="right"
        className="top-0 translate-x-1/4 opacity-90"
        style={{ width: 'clamp(170px, 46vw, 960px)' }}
      />

      <div className="relative mx-auto max-w-6xl px-4 sm:px-6">
        <div className="mb-10 max-w-xl">
          <h2 className="font-display text-3xl font-semibold text-navy sm:text-4xl">Combos</h2>
          <p className="mt-3 text-ink/70">
            Combos pensados para probar, compartir en familia y abastecer tu negocio.
          </p>
        </div>

        {estado === 'cargando' && <p className="text-sm text-ink/60">Cargando combos…</p>}
        {estado === 'error' && (
          <p className="text-sm text-chili">
            No pudimos cargar los combos en este momento. Verifica que el backend esté corriendo.
          </p>
        )}

        {estado === 'listo' && (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {combos.map((combo, indice) => (
              <ProductCard
                key={combo.id}
                producto={combo}
                index={indice}
                cotizacion={combo.slug === 'combo-negocio'}
                etiquetaPicante={combo.slug === 'combo-para-probar' ? 'Variedad de niveles 🌶️' : undefined}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
