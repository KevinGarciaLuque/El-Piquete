import logo from '../../assets/logo.webp';

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer id="contacto" className="bg-olive-dark text-cream">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-12 sm:px-6 md:grid-cols-3">
        <div className="flex flex-col gap-3">
          <img src={logo} alt="Encurtidos El Piquete" width="64" height="64" loading="lazy" decoding="async" className="h-16 w-16 rounded-full object-cover" />
          <p className="text-sm text-cream/80">
            El sabor que transforma cada comida. Encurtidos artesanales preparados con ingredientes seleccionados.
          </p>
        </div>

        <div className="flex flex-col gap-2 text-sm">
          <h3 className="mb-1 font-display text-base font-semibold">Contacto</h3>
          <a href="mailto:contacto@elpiquete.com" className="text-cream/80 hover:text-cream">
            contacto@elpiquete.com
          </a>
          <a href="tel:+50400000000" className="text-cream/80 hover:text-cream">
            +504 0000-0000
          </a>
          <p className="text-cream/80">Tegucigalpa, Honduras</p>
        </div>

        <div className="flex flex-col gap-2 text-sm">
          <h3 className="mb-1 font-display text-base font-semibold">Enlaces</h3>
          <a href="#productos" className="text-cream/80 hover:text-cream">Productos</a>
          <a href="#combos" className="text-cream/80 hover:text-cream">Combos</a>
          <a href="#preguntas" className="text-cream/80 hover:text-cream">Preguntas frecuentes</a>
        </div>
      </div>

      <div className="border-t border-cream/15 px-4 py-4 text-center text-xs text-cream/60 sm:px-6">
        © {year} Encurtidos El Piquete. Todos los derechos reservados.
      </div>
    </footer>
  );
}
