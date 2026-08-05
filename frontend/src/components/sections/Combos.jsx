const COMBOS_PLANEADOS = [
  { nombre: 'Combo para probar', descripcion: 'Tradicional, picante y suave en un solo pedido.' },
  { nombre: 'Combo familiar', descripcion: '3 frascos grandes a precio especial.' },
  { nombre: 'Combo para negocio', descripcion: '6 o 12 frascos, precio mayorista bajo cotización.' },
];

export default function Combos() {
  return (
    <section id="combos" className="bg-olive/8 py-16">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="mb-10 max-w-xl">
          <h2 className="font-display text-3xl font-semibold text-navy sm:text-4xl">Combos</h2>
          <p className="mt-3 text-ink/70">
            Estamos preparando combos pensados para probar, compartir en familia y abastecer tu negocio.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-3">
          {COMBOS_PLANEADOS.map((combo) => (
            <div
              key={combo.nombre}
              className="flex flex-col gap-2 rounded-2xl border border-dashed border-olive/40 bg-cream/60 p-6"
            >
              <h3 className="font-display text-lg font-semibold text-navy">{combo.nombre}</h3>
              <p className="text-sm text-ink/70">{combo.descripcion}</p>
              <span className="mt-2 text-xs font-semibold uppercase tracking-wide text-olive-dark">
                Próximamente
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
