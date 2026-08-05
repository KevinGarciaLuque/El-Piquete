import logo from '../../assets/logo.jpeg';

export default function Historia() {
  return (
    <section id="nosotros" className="bg-navy py-16 text-cream">
      <div className="mx-auto grid max-w-6xl items-center gap-10 px-4 sm:px-6 md:grid-cols-2">
        <div className="flex flex-col gap-4">
          <span className="text-xs font-semibold uppercase tracking-wider text-carrot">Nuestra historia</span>
          <h2 className="font-display text-3xl font-semibold sm:text-4xl">De receta tradicional a marca artesanal</h2>
          <p className="text-cream/80">
            Nacimos con la idea de convertir una receta tradicional en un producto práctico, delicioso y
            cuidadosamente preparado. Cada frasco combina frescura, acidez y el toque justo de picante.
          </p>
        </div>
        <div className="mx-auto flex aspect-square w-full max-w-xs items-center justify-center overflow-hidden rounded-3xl border border-cream/20 bg-cream/5">
          <img src={logo} alt="El Piquete" className="h-3/4 w-3/4 object-contain" />
        </div>
      </div>
    </section>
  );
}
