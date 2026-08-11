import logo from '../../assets/logo.webp';
import Reveal from '../ui/Reveal';

export default function Historia() {
  return (
    <section id="nosotros" className="scroll-mt-24 bg-navy py-16 text-cream">
      <div className="mx-auto grid max-w-6xl items-center gap-10 px-4 sm:px-6 md:grid-cols-2">
        <Reveal x={-24} y={0} className="flex flex-col gap-4">
          <span className="text-xs font-semibold uppercase tracking-wider text-carrot">Nuestra historia</span>
          <h2 className="font-display text-3xl font-semibold sm:text-4xl">De receta tradicional a marca artesanal</h2>
          <p className="text-cream/80">
            Nacimos con la idea de convertir una receta tradicional en un producto práctico, delicioso y
            cuidadosamente preparado. Cada frasco combina frescura, acidez y el toque justo de picante.
          </p>
        </Reveal>
        <Reveal
          x={24}
          y={0}
          delay={0.15}
          className="mx-auto flex aspect-square w-full max-w-xs items-center justify-center overflow-hidden rounded-3xl border border-cream/20 bg-cream/5"
        >
          <img src={logo} alt="El Piquete" width="300" height="300" loading="lazy" decoding="async" className="h-3/4 w-3/4 object-contain" />
        </Reveal>
      </div>
    </section>
  );
}
