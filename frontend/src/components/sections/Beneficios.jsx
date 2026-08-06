import VeggieAccent from '../ui/VeggieAccent';
import jalapeno from '../../assets/jalapeno.webp';
import cebolla from '../../assets/cebolla.webp';

const BENEFICIOS = [
  {
    titulo: 'Ingredientes frescos',
    descripcion: 'Cebolla, zanahoria y jalapeños seleccionados.',
    icono: (
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v4m0 0a5 5 0 0 0-5 5v7h10v-7a5 5 0 0 0-5-5Z" />
    ),
  },
  {
    titulo: 'Preparación artesanal',
    descripcion: 'Elaborados por lotes para conservar su sabor y textura.',
    icono: (
      <path strokeLinecap="round" strokeLinejoin="round" d="M4 13a8 8 0 1 0 16 0M4 13a8 8 0 1 1 16 0M4 13h16" />
    ),
  },
  {
    titulo: 'Diferentes niveles de picante',
    descripcion: 'Suave, tradicional y extra picante.',
    icono: (
      <path strokeLinecap="round" strokeLinejoin="round" d="M8 3c0 4-4 5-4 9a4 4 0 0 0 8 0c0-2-1-3-1-5 2 1 3 3 3 5a6 6 0 1 1-12 0c0-5 5-6 6-9Z" />
    ),
  },
  {
    titulo: 'Entrega segura',
    descripcion: 'Empaque protegido y seguimiento de tu pedido.',
    icono: (
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 7h13v9H3zM16 10h3l2 3v3h-5zM6 19a2 2 0 1 0 0-4 2 2 0 0 0 0 4Zm12 0a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z" />
    ),
  },
];

export default function Beneficios() {
  return (
    <section className="relative overflow-hidden py-24 lg:py-32">
      <VeggieAccent src={jalapeno} side="left" className="top-1/2 w-56 -translate-x-1/3 -translate-y-1/2 opacity-90 sm:w-64 xl:w-80" />
      <VeggieAccent src={cebolla} side="right" className="top-1/2 w-56 -translate-y-1/2 translate-x-1/3 opacity-90 sm:w-64 xl:w-80" />

      <div className="relative mx-auto max-w-6xl px-4 sm:px-6 xl:px-24">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {BENEFICIOS.map((beneficio) => (
            <div key={beneficio.titulo} className="flex flex-col items-start gap-3">
              <span className="flex h-12 w-12 items-center justify-center rounded-full bg-olive/15 text-olive-dark">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" className="h-6 w-6">
                  {beneficio.icono}
                </svg>
              </span>
              <h3 className="font-display text-lg font-semibold text-navy">{beneficio.titulo}</h3>
              <p className="text-sm text-ink/70">{beneficio.descripcion}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
