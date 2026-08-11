import { useState } from 'react';

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

  return (
    <div className="border-b border-olive/15">
      <button
        type="button"
        onClick={() => setAbierta((valor) => !valor)}
        aria-expanded={abierta}
        className="flex w-full items-center justify-between gap-4 py-4 text-left"
      >
        <span className="font-medium text-navy">{pregunta}</span>
        <span className={`shrink-0 text-olive-dark transition-transform ${abierta ? 'rotate-45' : ''}`}>+</span>
      </button>
      {abierta && <p className="pb-4 text-sm text-ink/70">{respuesta}</p>}
    </div>
  );
}

export default function Preguntas() {
  return (
    <section id="preguntas" className="mx-auto max-w-3xl scroll-mt-24 px-4 py-16 sm:px-6">
      <h2 className="mb-8 font-display text-3xl font-semibold text-navy sm:text-4xl">Preguntas frecuentes</h2>
      <div>
        {PREGUNTAS.map((item) => (
          <PreguntaItem key={item.pregunta} {...item} />
        ))}
      </div>
    </section>
  );
}
