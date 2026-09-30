import { useId, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Aparecer, TituloRevelado } from '../tienda/Revelar';
import { EASE_EP } from '../../lib/tienda';

const PREGUNTAS = [
  {
    pregunta: '¿Cuánto dura el encurtido?',
    respuesta: 'Estamos finalizando nuestro estudio de vida útil. Publicaremos esta información en cuanto esté validada.',
  },
  {
    pregunta: '¿Debe mantenerse refrigerado?',
    respuesta: 'Las instrucciones de conservación se confirmarán junto con el estudio de vida útil del producto.',
  },
  {
    pregunta: '¿Qué nivel de picante tiene?',
    respuesta: 'Ofrecemos tres niveles: suave, tradicional y picante, para que elijas el que más te guste.',
  },
  {
    pregunta: '¿Qué ingredientes contiene?',
    respuesta: 'Cebolla, zanahoria, jalapeño, vinagre, sal y especias.',
  },
  {
    pregunta: '¿Dónde realizan entregas?',
    respuesta: 'Por ahora entregamos en Tegucigalpa. Estamos trabajando para llegar a más zonas del país.',
  },
  {
    pregunta: '¿Cuánto cuesta el envío?',
    respuesta: 'El costo varía según la zona de entrega dentro de Tegucigalpa.',
  },
  {
    pregunta: '¿Puedo comprar al por mayor?',
    respuesta: 'Sí, contamos con un combo para negocios. Escríbenos para solicitar una cotización.',
  },
  {
    pregunta: '¿Qué métodos de pago aceptan?',
    respuesta: 'Transferencia bancaria y pago contra entrega en zonas seleccionadas. Pronto sumaremos más opciones.',
  },
];

function PreguntaItem({ pregunta, respuesta }) {
  const [abierta, setAbierta] = useState(false);
  const id = useId();

  return (
    <div className={`ep-pregunta ${abierta ? 'ep-pregunta--abierta' : ''}`}>
      <h3>
        <button
          type="button"
          onClick={() => setAbierta((valor) => !valor)}
          aria-expanded={abierta}
          aria-controls={id}
          className="ep-pregunta__boton"
        >
          <span>{pregunta}</span>
          <span className="ep-pregunta__signo" aria-hidden="true" />
        </button>
      </h3>
      <AnimatePresence initial={false}>
        {abierta && (
          <motion.div
            id={id}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.35, ease: EASE_EP }}
            className="ep-pregunta__respuesta"
          >
            <p>{respuesta}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function Preguntas() {
  return (
    <section id="preguntas" className="ep-seccion ep-preguntas scroll-mt-24">
      <div className="ep-contenedor ep-preguntas__grid">
        <div className="ep-preguntas__fijo">
          <Aparecer as="p" className="ep-kicker" y={12}>
            10 · Preguntas
          </Aparecer>
          <TituloRevelado texto="Preguntas frecuentes" />
        </div>
        <Aparecer className="ep-preguntas__lista">
          {PREGUNTAS.map((item) => (
            <PreguntaItem key={item.pregunta} {...item} />
          ))}
        </Aparecer>
      </div>
    </section>
  );
}
