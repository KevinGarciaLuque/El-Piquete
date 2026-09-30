import { Link } from 'react-router-dom';
import logo from '../../assets/logo.webp';

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer id="contacto" className="site-footer scroll-mt-24 bg-ep-night-2 text-ep-fog">
      <div className="mx-auto grid max-w-6xl gap-10 px-5 py-16 sm:px-6 md:grid-cols-[1.4fr_1fr_1fr]">
        <div className="flex flex-col gap-4">
          <img src={logo} alt="Encurtidos El Piquete" width="64" height="64" loading="lazy" decoding="async" className="h-16 w-16 rounded-full object-cover" />
          <p className="site-footer__lema">El sabor que transforma cada comida.</p>
          <p className="max-w-sm text-sm leading-relaxed text-ep-fog/70">
            Encurtidos artesanales de cebolla, zanahoria y jalapeño, preparados por lotes en Tegucigalpa.
          </p>
        </div>

        <div className="flex flex-col gap-2 text-sm">
          <h3 className="site-footer__titulo">Contacto</h3>
          <a href="mailto:contacto@elpiquete.com" className="text-ep-fog/80 transition-colors hover:text-white">
            contacto@elpiquete.com
          </a>
          <a href="tel:+50400000000" className="text-ep-fog/80 transition-colors hover:text-white">
            +504 0000-0000
          </a>
          <p className="text-ep-fog/80">Tegucigalpa, Honduras</p>
        </div>

        <div className="flex flex-col gap-2 text-sm">
          <h3 className="site-footer__titulo">Enlaces</h3>
          <Link to="/#productos" className="text-ep-fog/80 transition-colors hover:text-white">Productos</Link>
          <Link to="/#combos" className="text-ep-fog/80 transition-colors hover:text-white">Combos</Link>
          <Link to="/#opiniones" className="text-ep-fog/80 transition-colors hover:text-white">Opiniones</Link>
          <Link to="/#preguntas" className="text-ep-fog/80 transition-colors hover:text-white">Preguntas frecuentes</Link>
          <Link to="/opinion" className="text-ep-fog/80 transition-colors hover:text-white">Déjanos tu opinión</Link>
        </div>
      </div>

      <div className="border-t border-ep-fog/10 px-4 py-5 text-center text-xs text-ep-fog/55 sm:px-6">
        © {year} Encurtidos El Piquete. Todos los derechos reservados.
      </div>
    </footer>
  );
}
