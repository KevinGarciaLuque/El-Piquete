import { motion } from 'framer-motion';

export default function Reveal({ as = 'div', children, delay = 0, x = 0, y = 24, className = '', ...props }) {
  const Component = motion[as];

  return (
    <Component
      initial={{ opacity: 0, x, y }}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.5, delay, ease: 'easeOut' }}
      className={className}
      {...props}
    >
      {children}
    </Component>
  );
}
