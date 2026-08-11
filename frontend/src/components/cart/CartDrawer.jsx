import { AnimatePresence, motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import Button from '../ui/Button';
import { buildWhatsAppLink } from '../../lib/whatsapp';

const formatoLempiras = new Intl.NumberFormat('es-HN', {
  style: 'currency',
  currency: 'HNL',
  minimumFractionDigits: 0,
});

function construirMensajePedido(items, subtotal) {
  const lineas = items.map(
    (item) => `• ${item.nombre} (${item.presentacion}) x${item.cantidad} - ${formatoLempiras.format(item.precio * item.cantidad)}`,
  );

  return [
    '¡Hola! Quiero hacer este pedido de Encurtidos El Piquete:',
    '',
    ...lineas,
    '',
    `Subtotal: ${formatoLempiras.format(subtotal)}`,
  ].join('\n');
}

export default function CartDrawer() {
  const { items, totalItems, subtotal, removeItem, setQty, clear, abierto, cerrarCarrito } = useCart();
  const navigate = useNavigate();

  function irAlCheckout() {
    cerrarCarrito();
    navigate('/checkout');
  }

  return (
    <AnimatePresence>
      {abierto && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={cerrarCarrito}
            className="fixed inset-0 z-50 bg-ink/40"
          />

          <motion.aside
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'tween', duration: 0.3, ease: 'easeInOut' }}
            className="fixed right-0 top-0 z-50 flex h-full w-full max-w-md flex-col bg-cream shadow-2xl"
            role="dialog"
            aria-label="Carrito de compras"
          >
            <div className="flex items-center justify-between border-b border-olive/15 px-5 py-4">
              <h2 className="font-display text-xl font-semibold text-navy">
                Tu carrito {totalItems > 0 && <span className="text-base font-normal text-ink/60">({totalItems})</span>}
              </h2>
              <button
                type="button"
                onClick={cerrarCarrito}
                aria-label="Cerrar carrito"
                className="flex h-9 w-9 items-center justify-center rounded-full text-navy hover:bg-olive/10"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-5 w-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 6l12 12M18 6L6 18" />
                </svg>
              </button>
            </div>

            {items.length === 0 ? (
              <div className="flex flex-1 flex-col items-center justify-center gap-3 px-6 text-center">
                <p className="text-ink/70">Tu carrito está vacío.</p>
                <Button variant="primary" onClick={cerrarCarrito} as={Link} to="/#productos">
                  Ver productos
                </Button>
              </div>
            ) : (
              <>
                <div className="flex-1 overflow-y-auto px-5 py-4">
                  <ul className="flex flex-col gap-4">
                    {items.map((item) => (
                      <li key={item.varianteId} className="flex gap-3 border-b border-olive/10 pb-4">
                        <div className="flex-1">
                          <p className="font-medium text-navy">{item.nombre}</p>
                          <p className="text-xs uppercase tracking-wide text-ink/50">{item.presentacion}</p>
                          <p className="mt-1 font-display text-lg font-semibold text-chili">
                            {formatoLempiras.format(item.precio)}
                          </p>

                          <div className="mt-2 flex items-center gap-3">
                            <div className="flex items-center rounded-full border border-olive/30">
                              <button
                                type="button"
                                onClick={() => setQty(item.varianteId, item.cantidad - 1)}
                                aria-label="Disminuir cantidad"
                                className="flex h-8 w-8 items-center justify-center text-navy hover:bg-olive/10"
                              >
                                −
                              </button>
                              <span className="w-6 text-center text-sm font-medium">{item.cantidad}</span>
                              <button
                                type="button"
                                onClick={() => setQty(item.varianteId, item.cantidad + 1)}
                                aria-label="Aumentar cantidad"
                                disabled={item.cantidad >= (item.disponible ?? Infinity)}
                                className="flex h-8 w-8 items-center justify-center text-navy hover:bg-olive/10 disabled:opacity-30"
                              >
                                +
                              </button>
                            </div>
                            <button
                              type="button"
                              onClick={() => removeItem(item.varianteId)}
                              className="text-xs font-medium text-chili/80 hover:text-chili"
                            >
                              Eliminar
                            </button>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>

                  <button type="button" onClick={clear} className="mt-4 text-xs text-ink/50 underline hover:text-ink/70">
                    Vaciar carrito
                  </button>
                </div>

                <div className="border-t border-olive/15 px-5 py-4">
                  <div className="mb-4 flex items-center justify-between">
                    <span className="text-ink/70">Subtotal</span>
                    <span className="font-display text-2xl font-semibold text-navy">
                      {formatoLempiras.format(subtotal)}
                    </span>
                  </div>
                  <div className="flex flex-col gap-2">
                    <Button variant="primary" onClick={irAlCheckout} className="justify-center">
                      Continuar con el pedido
                    </Button>
                    <Button
                      as="a"
                      variant="outline"
                      target="_blank"
                      rel="noopener noreferrer"
                      href={buildWhatsAppLink(construirMensajePedido(items, subtotal))}
                      className="justify-center"
                    >
                      Pedir por WhatsApp
                    </Button>
                    <button
                      type="button"
                      onClick={cerrarCarrito}
                      className="mx-auto text-xs font-medium text-ink/60 underline hover:text-ink/80"
                    >
                      Seguir comprando
                    </button>
                  </div>
                </div>
              </>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
