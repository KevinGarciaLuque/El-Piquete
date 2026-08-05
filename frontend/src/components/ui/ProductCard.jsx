import { motion } from 'framer-motion';
import SpiceLevel from './SpiceLevel';
import Button from './Button';
import { buildWhatsAppLink } from '../../lib/whatsapp';

const formatoLempiras = new Intl.NumberFormat('es-HN', {
  style: 'currency',
  currency: 'HNL',
  minimumFractionDigits: 0,
});

function Disponibilidad({ cantidad }) {
  const disponible = cantidad > 0;

  return (
    <span className={`inline-flex items-center gap-1.5 text-xs font-medium ${disponible ? 'text-olive-dark' : 'text-ink/50'}`}>
      <span className={`h-1.5 w-1.5 rounded-full ${disponible ? 'bg-olive' : 'bg-ink/30'}`} />
      {disponible ? 'En existencia' : 'Agotado'}
    </span>
  );
}

export default function ProductCard({ producto, index = 0, cotizacion = false, etiquetaPicante }) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.5, delay: index * 0.08 }}
      className="relative flex flex-col gap-3 rounded-2xl border border-olive/15 bg-white/70 p-6 shadow-sm shadow-olive-dark/5"
    >
      {producto.mas_vendido && (
        <span className="absolute -top-3 left-6 rounded-full bg-carrot px-3 py-1 text-xs font-semibold text-white">
          Más vendido
        </span>
      )}

      <h3 className="font-display text-xl font-semibold text-navy">{producto.nombre}</h3>
      <p className="text-sm text-ink/70">{producto.descripcion}</p>

      {etiquetaPicante ? (
        <span className="text-sm text-chili">{etiquetaPicante}</span>
      ) : (
        <SpiceLevel nivel={producto.nivel_picante} />
      )}

      <div className="mt-2 flex flex-col gap-3">
        {producto.variantes.map((variante) => (
          <div key={variante.id} className="flex items-center justify-between gap-3 border-t border-olive/10 pt-3 first:border-t-0 first:pt-0">
            <div>
              <p className="text-xs uppercase tracking-wide text-ink/50">{variante.presentacion}</p>
              <p className="font-display text-xl font-semibold text-chili">
                {formatoLempiras.format(Number(variante.precio))}
              </p>
              <Disponibilidad cantidad={variante.cantidad_disponible} />
            </div>

            {cotizacion ? (
              <Button
                as="a"
                variant="secondary"
                target="_blank"
                rel="noopener noreferrer"
                href={buildWhatsAppLink(
                  `¡Hola! Quiero solicitar una cotización de ${producto.nombre} (${variante.presentacion}).`,
                )}
              >
                Cotizar
              </Button>
            ) : (
              <div className="flex flex-col gap-2">
                <Button variant="secondary" disabled title="Disponible en la próxima fase">
                  Añadir al carrito
                </Button>
                <Button variant="outline" disabled title="Disponible en la próxima fase">
                  Comprar ahora
                </Button>
              </div>
            )}
          </div>
        ))}
      </div>
    </motion.article>
  );
}
