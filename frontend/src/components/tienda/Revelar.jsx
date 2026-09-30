import { Fragment } from 'react';
import { motion } from 'framer-motion';
import { EASE_EP } from '../../lib/tienda';

const contenedor = {
  oculto: {},
  visible: (retraso = 0) => ({ transition: { staggerChildren: 0.055, delayChildren: retraso } }),
};

const palabra = {
  oculto: { y: '108%' },
  visible: { y: '0%', transition: { duration: 0.9, ease: EASE_EP } },
};

// Titular que sube palabra por palabra desde una máscara (sin fundido genérico).
export function TituloRevelado({ as = 'h2', texto, className = '', retraso = 0 }) {
  const Etiqueta = motion[as];
  const palabras = texto.split(' ');

  return (
    <Etiqueta
      className={`ep-titulo-revelado ${className}`}
      variants={contenedor}
      custom={retraso}
      initial="oculto"
      whileInView="visible"
      viewport={{ once: true, amount: 0.6 }}
    >
      {palabras.map((fragmento, indice) => (
        // El espacio va fuera de la máscara: dentro de un inline-block se descartaría.
        <Fragment key={indice}>
          <span className="ep-palabra">
            <motion.span variants={palabra}>{fragmento}</motion.span>
          </span>
          {indice < palabras.length - 1 && ' '}
        </Fragment>
      ))}
    </Etiqueta>
  );
}

// Bloque que entra desde abajo con un desplazamiento corto; se usa con moderación.
export function Aparecer({ as = 'div', children, retraso = 0, y = 22, className = '', ...props }) {
  const Etiqueta = motion[as];
  return (
    <Etiqueta
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.8, ease: EASE_EP, delay: retraso }}
      {...props}
    >
      {children}
    </Etiqueta>
  );
}

// Imagen que se descubre con una cortina y un leve acercamiento (solo transform y opacity).
export function ImagenRevelada({ src, alt = '', className = '', imgClassName = '', ancho, alto, retraso = 0, carga = 'lazy', foco }) {
  return (
    <motion.div
      className={`ep-imagen-revelada ${className}`}
      initial="oculto"
      whileInView="visible"
      viewport={{ once: true, amount: 0.25 }}
    >
      <motion.img
        src={src}
        alt={alt}
        width={ancho}
        height={alto}
        loading={carga}
        decoding="async"
        className={imgClassName}
        style={foco ? { objectPosition: foco } : undefined}
        variants={{ oculto: { scale: 1.12 }, visible: { scale: 1, transition: { duration: 1.4, ease: EASE_EP, delay: retraso } } }}
      />
      <motion.span
        aria-hidden="true"
        className="ep-imagen-revelada__cortina"
        variants={{ oculto: { y: '0%' }, visible: { y: '-101%', transition: { duration: 1.05, ease: EASE_EP, delay: retraso } } }}
      />
    </motion.div>
  );
}

export function Encabezado({ kicker, titulo, lede, className = '', claro = false }) {
  return (
    <header className={`ep-encabezado ${claro ? 'ep-encabezado--claro' : ''} ${className}`}>
      <Aparecer as="p" className="ep-kicker" y={12}>
        {kicker}
      </Aparecer>
      <TituloRevelado texto={titulo} />
      {lede && (
        <Aparecer as="p" className="ep-lede" retraso={0.25}>
          {lede}
        </Aparecer>
      )}
    </header>
  );
}
