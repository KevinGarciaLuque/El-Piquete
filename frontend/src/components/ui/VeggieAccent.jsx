import { motion } from 'framer-motion';

export default function VeggieAccent({ src, side = 'left', className = '', style }) {
  const slideOffset = side === 'left' ? -40 : 40;

  return (
    <div
      style={style}
      className={`pointer-events-none absolute select-none ${side === 'left' ? 'left-0' : 'right-0'} ${className}`}
    >
      <motion.img
        src={src}
        alt=""
        aria-hidden="true"
        loading="lazy"
        decoding="async"
        initial={{ opacity: 0, x: slideOffset }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true, amount: 'some' }}
        transition={{ duration: 0.7, ease: 'easeOut' }}
        className="block w-full"
      />
    </div>
  );
}
