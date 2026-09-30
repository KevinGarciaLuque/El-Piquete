import { useRef, useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Aparecer, TituloRevelado } from '../tienda/Revelar';
import LineaSalmuera from '../tienda/LineaSalmuera';

const INGREDIENTES = [
  {
    numero: '01',
    nombre: 'Zanahoria.',
    texto: 'En tiras finas, para que cada bocado cruja.',
    imagen: '/media/I1-zanahoria.webp',
    profundidad: 70,
  },
  {
    numero: '02',
    nombre: 'Cebolla morada.',
    texto: 'En media luna. Aporta el color y la dulzura que equilibra el vinagre.',
    imagen: '/media/I2-cebolla.webp',
    profundidad: 40,
  },
  {
    numero: '03',
    nombre: 'Jalapeño.',
    texto: 'En rodajas. De él depende tu nivel de picante.',
    imagen: '/media/I3-jalapeno.webp',
    profundidad: 90,
  },
];

// Cada ingrediente flota a su propia profundidad: el desplazamiento acompaña al scroll.
function FilaIngrediente({ ingrediente, indice }) {
  const filaRef = useRef(null);
  // En teléfonos la columna es angosta: la deriva se reduce para no montar la foto sobre el texto.
  const [escala] = useState(() => (window.matchMedia('(max-width: 640px)').matches ? 0.25 : 1));
  const recorrido = ingrediente.profundidad * escala;
  const { scrollYProgress } = useScroll({ target: filaRef, offset: ['start end', 'end start'] });
  const y = useTransform(scrollYProgress, [0, 1], [recorrido, -recorrido]);
  const giro = useTransform(scrollYProgress, [0, 1], [indice % 2 ? 4 : -4, indice % 2 ? -3 : 3]);

  return (
    <div ref={filaRef} className={`ep-ingrediente ${indice % 2 ? 'ep-ingrediente--invertido' : ''}`}>
      <motion.img
        src={ingrediente.imagen}
        alt=""
        aria-hidden="true"
        width="720"
        height="720"
        loading="lazy"
        decoding="async"
        className="ep-ingrediente__imagen"
        style={{ y, rotate: giro }}
      />
      <Aparecer className="ep-ingrediente__texto">
        <span className="ep-ingrediente__numero">{ingrediente.numero}</span>
        <h3 className="ep-ingrediente__nombre">{ingrediente.nombre}</h3>
        <p>{ingrediente.texto}</p>
      </Aparecer>
    </div>
  );
}

export default function Ingredientes() {
  return (
    <section id="ingredientes" className="ep-seccion ep-ingredientes scroll-mt-24">
      <LineaSalmuera tono="crema" />
      <div className="ep-contenedor ep-ingredientes__grid">
        <div className="ep-ingredientes__fijo">
          <Aparecer as="p" className="ep-kicker" y={12}>
            04 · Lo que lleva
          </Aparecer>
          <TituloRevelado texto="Lo que ves es lo que lleva." />
          <Aparecer as="p" className="ep-lede" retraso={0.2}>
            Vinagre, sal y especias hacen el resto.
          </Aparecer>
        </div>
        <div className="ep-ingredientes__lista">
          {INGREDIENTES.map((ingrediente, indice) => (
            <FilaIngrediente key={ingrediente.numero} ingrediente={ingrediente} indice={indice} />
          ))}
        </div>
      </div>
    </section>
  );
}
