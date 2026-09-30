import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import logo from '../../assets/logo.webp';
import { Aparecer, Encabezado, TituloRevelado } from '../tienda/Revelar';
import LineaSalmuera from '../tienda/LineaSalmuera';

export default function Historia() {
  const seccionRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: seccionRef, offset: ['start end', 'end start'] });
  const y = useTransform(scrollYProgress, [0, 1], ['-8%', '8%']);

  return (
    <section id="nosotros" ref={seccionRef} className="ep-seccion ep-oscura ep-historia scroll-mt-24">
      <LineaSalmuera />
      <div className="ep-historia__fondo" aria-hidden="true">
        <motion.img src="/media/historia-salmuera.webp" alt="" width="1920" height="1082" loading="lazy" decoding="async" style={{ y }} />
      </div>

      <div className="ep-contenedor ep-historia__grid">
        <div className="ep-historia__relato">
          <Encabezado claro kicker="06 · Nuestra historia" titulo="De receta de casa a frasco artesanal." />
          <Aparecer as="p" className="ep-historia__cuerpo" retraso={0.2}>
            Nacimos con la idea de convertir una receta tradicional en un producto práctico, delicioso y cuidadosamente
            preparado. Cada frasco combina frescura, acidez y el toque justo de picante.
          </Aparecer>
        </div>

        <figure className="ep-historia__cita">
          <TituloRevelado as="blockquote" texto="El acompañante que nunca falta en la mesa hondureña, hecho con calma." />
          <Aparecer as="figcaption" className="ep-historia__firma" retraso={0.3}>
            <img src={logo} alt="Encurtidos El Piquete" width="56" height="56" loading="lazy" decoding="async" />
            <span>Encurtidos El Piquete · Tegucigalpa</span>
          </Aparecer>
        </figure>
      </div>
    </section>
  );
}
