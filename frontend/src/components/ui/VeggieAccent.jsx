import { motion } from 'framer-motion';

export default function VeggieAccent({ src, side = 'left', className = '' }) {
  const offset = side === 'left' ? -60 : 60;

  return (
    <motion.img
      src={src}
      alt=""
      aria-hidden="true"
      loading="lazy"
      decoding="async"
      initial={{ opacity: 0, x: offset }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, amount: 'some' }}
      transition={{ duration: 0.7, ease: 'easeOut' }}
      className={`pointer-events-none absolute hidden select-none lg:block ${side === 'left' ? 'left-0' : 'right-0'} ${className}`}
    />
  );
}
