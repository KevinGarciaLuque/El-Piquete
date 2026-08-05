import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import logo from '../../assets/logo.jpeg';
import Button from '../ui/Button';

const NAV_LINKS = [
  { href: '#inicio', label: 'Inicio' },
  { href: '#productos', label: 'Productos' },
  { href: '#combos', label: 'Combos' },
  { href: '#nosotros', label: 'Nosotros' },
  { href: '#preguntas', label: 'Preguntas' },
  { href: '#contacto', label: 'Contacto' },
];

function CartIcon({ count = 0 }) {
  return (
    <button
      type="button"
      aria-label="Carrito de compras"
      className="relative flex h-10 w-10 items-center justify-center rounded-full text-navy transition-colors hover:bg-olive/10"
    >
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-6 w-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h1.5l1.9 10.6a2 2 0 0 0 2 1.65h7.7a2 2 0 0 0 2-1.63L19.5 7.5H6" />
        <circle cx="9.5" cy="19.5" r="1.4" />
        <circle cx="16.5" cy="19.5" r="1.4" />
      </svg>
      {count > 0 && (
        <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-chili text-xs font-semibold text-cream">
          {count}
        </span>
      )}
    </button>
  );
}

export default function Header() {
  const [menuAbierto, setMenuAbierto] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-olive/15 bg-cream/95 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
        <a href="#inicio" className="flex items-center gap-2">
          <img src={logo} alt="Encurtidos El Piquete" className="h-12 w-12 rounded-full object-cover sm:h-14 sm:w-14" />
        </a>

        <nav className="hidden items-center gap-6 lg:flex">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-ink/80 transition-colors hover:text-chili"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-2 sm:gap-3">
          <span className="hidden sm:inline-flex">
            <Button as="a" href="#productos" variant="primary">
              Comprar ahora
            </Button>
          </span>
          <CartIcon count={0} />
          <button
            type="button"
            aria-label="Abrir menú"
            aria-expanded={menuAbierto}
            onClick={() => setMenuAbierto((abierto) => !abierto)}
            className="flex h-10 w-10 items-center justify-center rounded-full text-navy hover:bg-olive/10 lg:hidden"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-6 w-6">
              {menuAbierto ? (
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 6l12 12M18 6L6 18" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 7h16M4 12h16M4 17h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      <AnimatePresence>
        {menuAbierto && (
          <motion.nav
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: 'easeInOut' }}
            className="overflow-hidden border-t border-olive/15 bg-cream lg:hidden"
          >
            <div className="flex flex-col gap-1 px-4 py-3">
              {NAV_LINKS.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={() => setMenuAbierto(false)}
                  className="rounded-lg px-3 py-2 text-sm font-medium text-ink/80 hover:bg-olive/10 hover:text-chili"
                >
                  {link.label}
                </a>
              ))}
              <Button as="a" href="#productos" variant="primary" className="mt-2 justify-center" onClick={() => setMenuAbierto(false)}>
                Comprar ahora
              </Button>
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}
