import { motion } from 'framer-motion';
import { EASE_EP } from '../../lib/tienda';

const ONDA = 'M0 34 C 180 14 360 14 540 30 S 900 50 1080 32 S 1320 16 1440 26';

// Borde superior de una sección que sigue a otra de distinto tono: la superficie de
// la salmuera. La línea dorada se dibuja una sola vez al entrar en pantalla.
export default function LineaSalmuera({ tono = 'noche' }) {
  return (
    <div className={`ep-salmuera ep-salmuera--${tono}`} aria-hidden="true">
      <svg viewBox="0 0 1440 60" preserveAspectRatio="none">
        <path d={`${ONDA} L1440 60 L0 60 Z`} className="ep-salmuera__relleno" />
        <motion.path
          d={ONDA}
          className="ep-salmuera__linea"
          initial={{ pathLength: 0 }}
          whileInView={{ pathLength: 1 }}
          viewport={{ once: true, amount: 0.8 }}
          transition={{ duration: 2.2, ease: EASE_EP }}
        />
      </svg>
    </div>
  );
}
