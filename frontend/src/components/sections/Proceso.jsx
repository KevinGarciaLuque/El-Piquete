import { useRef } from 'react';
import { motion, useScroll, useSpring } from 'framer-motion';
import { Aparecer, Encabezado, ImagenRevelada } from '../tienda/Revelar';
import LineaSalmuera from '../tienda/LineaSalmuera';

const PASOS = [
  {
    numero: '1',
    titulo: 'Cortamos.',
    texto: 'Zanahoria en tiras, cebolla en media luna, jalapeño en rodajas. Todo fresco.',
    imagen: '/media/proceso-1-cortamos.webp',
    foco: '80% 50%',
  },
  {
    numero: '2',
    titulo: 'Encurtimos.',
    texto: 'Los vegetales reposan en vinagre, sal y especias hasta tomar su punto.',
    imagen: '/media/proceso-2-encurtimos.webp',
    foco: '66% 50%',
  },
  {
    numero: '3',
    titulo: 'Envasamos.',
    texto: 'Por lotes pequeños, frasco por frasco, para que llegue crujiente.',
    imagen: '/media/proceso-3-envasamos.webp',
    foco: '62% 50%',
  },
];

export default function Proceso() {
  const pasosRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: pasosRef, offset: ['start 85%', 'end 55%'] });
  // La línea de salmuera que une los pasos se dibuja con el scroll (suavizada, sin rebote).
  const trazo = useSpring(scrollYProgress, { stiffness: 120, damping: 30, restDelta: 0.001 });

  return (
    <section id="proceso" className="ep-seccion ep-proceso scroll-mt-24">
      <LineaSalmuera tono="crema" />
      <div className="ep-contenedor">
        <Encabezado kicker="07 · El proceso" titulo="Tres pasos. Sin atajos." />

        <div ref={pasosRef} className="ep-proceso__pasos">
          <svg className="ep-proceso__linea" viewBox="0 0 1200 40" preserveAspectRatio="none" aria-hidden="true">
            <motion.path d="M10 20 C 200 4 400 36 600 20 S 1000 4 1190 20" style={{ pathLength: trazo }} />
          </svg>

          {PASOS.map((paso, indice) => (
            <article key={paso.numero} className="ep-paso">
              <ImagenRevelada
                src={paso.imagen}
                className="ep-paso__imagen"
                foco={paso.foco}
                ancho="1400"
                alto="789"
                retraso={indice * 0.12}
              />
              <Aparecer retraso={0.15 + indice * 0.12}>
                <p className="ep-paso__numero">
                  {paso.numero} <span aria-hidden="true">·</span>
                </p>
                <h3 className="ep-paso__titulo">{paso.titulo}</h3>
                <p className="ep-paso__texto">{paso.texto}</p>
              </Aparecer>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
