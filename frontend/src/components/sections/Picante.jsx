import { useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { useCart } from '../../context/CartContext';
import useEnVista from '../../hooks/useEnVista';
import { EASE_EP, formatoLempiras, NIVELES_PICANTE } from '../../lib/tienda';
import { Aparecer, TituloRevelado } from '../tienda/Revelar';
import LineaSalmuera from '../tienda/LineaSalmuera';

const NIVELES = ['suave', 'tradicional', 'picante'];

const TEXTO_NIVEL = {
  suave: 'Crujiente y ácido, con un picor que apenas saluda. Para toda la familia.',
  tradicional: 'El balance de la casa: acidez, crujido y un picante que se nota sin tapar la comida.',
  picante: 'Para quien pide más chile. El mismo frasco, con un piquete que se queda.',
};

const AROS_POR_NIVEL = [3, 7, 12];
const CHISPAS_POR_NIVEL = [6, 14, 28];

// Posiciones fijas de los aros de jalapeño dentro del frasco dibujado (viewBox 240 x 320).
const AROS = [
  [92, 228], [150, 196], [118, 262], [80, 176], [164, 244], [126, 150],
  [98, 118], [168, 140], [140, 104], [76, 250], [172, 280], [110, 200],
];

function generador(semilla) {
  let s = semilla;
  return () => (s = (s * 1664525 + 1013904223) >>> 0) / 4294967296;
}

function FrascoPicante({ aros }) {
  return (
    <svg viewBox="0 0 240 320" className="ep-frasco" aria-hidden="true">
      <defs>
        <linearGradient id="ep-salmuera-frasco" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#e9c774" stopOpacity="0.34" />
          <stop offset="1" stopColor="#c8892f" stopOpacity="0.42" />
        </linearGradient>
      </defs>
      <rect x="62" y="20" width="116" height="30" rx="8" className="ep-frasco__tapa" />
      <path d="M70 52h100v14c18 10 26 24 26 44v160c0 22-14 34-36 34H80c-22 0-36-12-36-34V110c0-20 8-34 26-44Z" className="ep-frasco__vidrio" />
      <path d="M52 134c20-6 40-6 68 0s48 6 68 0v136c0 18-11 28-30 28H82c-19 0-30-10-30-28Z" className="ep-frasco__salmuera" />
      <g className="ep-frasco__tiras">
        <path d="M64 284l34-128M78 290l22-150M92 292l40-140M108 294l8-156M124 292l30-150M140 292l-6-152M156 290l22-140M170 284l-24-138M182 276l-12-130M72 262l62-100M100 280l60-120M136 280l-50-116M160 270l-44-110M176 250l-60-84" />
      </g>
      <g className="ep-frasco__cebolla">
        <path d="M66 214c24-18 52-18 70 0M120 170c20-14 44-12 62 4M72 146c18-10 38-8 52 6" />
      </g>
      {AROS.map(([x, y], indice) => (
        <g
          key={indice}
          className={`ep-frasco__aro ${indice < aros ? 'ep-frasco__aro--visible' : ''}`}
          style={{ '--retardo': `${(indice % 6) * 45}ms` }}
          transform={`translate(${x} ${y})`}
        >
          <g className="ep-frasco__aro-escala">
            <circle r="13" className="ep-frasco__aro-piel" />
            <circle r="7" className="ep-frasco__aro-centro" />
            <circle r="1.6" cx="-2.5" cy="-1" className="ep-frasco__aro-semilla" />
            <circle r="1.6" cx="2.5" cy="1.5" className="ep-frasco__aro-semilla" />
          </g>
        </g>
      ))}
      <path d="M78 70c-10 8-14 18-14 30" className="ep-frasco__brillo" />
    </svg>
  );
}

export default function Picante({ productos }) {
  const [nivel, setNivel] = useState('tradicional');
  const [agregado, setAgregado] = useState(false);
  const { addItem } = useCart();
  const seccionRef = useRef(null);
  const grupoRef = useRef(null);
  const arrastrando = useRef(false);
  const temporizador = useRef(null);
  const enVista = useEnVista(seccionRef);

  const indice = NIVELES.indexOf(nivel);
  const producto = productos.find((item) => item.nivel_picante === nivel);
  const variante = producto?.variantes[0];

  const chispas = useMemo(() => {
    const azar = generador(11);
    return Array.from({ length: CHISPAS_POR_NIVEL[2] }, () => ({
      x: azar() * 100,
      y: 30 + azar() * 70,
      demora: -azar() * 9,
      duracion: 7 + azar() * 6,
      giro: Math.round(azar() * 360),
    }));
  }, []);

  useEffect(() => () => clearTimeout(temporizador.current), []);

  function elegir(nuevoIndice, enfocar = false) {
    const limitado = Math.max(0, Math.min(NIVELES.length - 1, nuevoIndice));
    setNivel(NIVELES[limitado]);
    setAgregado(false);
    if (enfocar) grupoRef.current?.querySelectorAll('[role="radio"]')[limitado]?.focus();
  }

  function alPulsarTecla(evento) {
    if (evento.key === 'ArrowRight' || evento.key === 'ArrowUp') {
      evento.preventDefault();
      elegir(indice + 1, true);
    } else if (evento.key === 'ArrowLeft' || evento.key === 'ArrowDown') {
      evento.preventDefault();
      elegir(indice - 1, true);
    } else if (evento.key === 'Home') {
      evento.preventDefault();
      elegir(0, true);
    } else if (evento.key === 'End') {
      evento.preventDefault();
      elegir(NIVELES.length - 1, true);
    }
  }

  // Arrastrar sobre la pista elige la parada más cercana.
  function nivelDesdePuntero(evento) {
    const caja = grupoRef.current.getBoundingClientRect();
    const fraccion = (evento.clientX - caja.left) / caja.width;
    elegir(Math.round(fraccion * (NIVELES.length - 1)));
  }

  function alAgregar() {
    if (!producto || !variante) return;
    addItem(producto, variante, 1);
    setAgregado(true);
    clearTimeout(temporizador.current);
    temporizador.current = setTimeout(() => setAgregado(false), 1600);
  }

  return (
    <section
      id="picante"
      ref={seccionRef}
      className={`ep-seccion ep-oscura ep-picante scroll-mt-24 ${enVista ? 'ep-vivo' : ''}`}
      data-nivel={indice}
    >
      <LineaSalmuera />
      <div className="ep-picante__calor" aria-hidden="true">
        {NIVELES.map((clave, posicion) => (
          <span key={clave} className={`ep-picante__capa ep-picante__capa--${posicion}`} />
        ))}
      </div>
      <div className="ep-contenedor ep-picante__grid">
        <div className="ep-picante__texto">
          <Aparecer as="p" className="ep-kicker" y={12}>
            03 · Tu nivel
          </Aparecer>
          <TituloRevelado texto="¿Qué tan valiente eres?" />

          <div
            ref={grupoRef}
            role="radiogroup"
            aria-label="Nivel de picante"
            className="ep-selector"
            style={{ '--pos': indice }}
            onKeyDown={alPulsarTecla}
            onPointerDown={(evento) => {
              arrastrando.current = true;
              evento.currentTarget.setPointerCapture(evento.pointerId);
            }}
            onPointerMove={(evento) => arrastrando.current && nivelDesdePuntero(evento)}
            onPointerUp={(evento) => {
              if (arrastrando.current) nivelDesdePuntero(evento);
              arrastrando.current = false;
            }}
            onPointerCancel={() => {
              arrastrando.current = false;
            }}
          >
            <span className="ep-selector__pista" aria-hidden="true">
              <span className="ep-selector__relleno" />
              <span className="ep-selector__pulgar" />
            </span>
            {NIVELES.map((clave, posicion) => (
              <button
                key={clave}
                type="button"
                role="radio"
                aria-checked={clave === nivel}
                tabIndex={clave === nivel ? 0 : -1}
                className="ep-selector__opcion"
                onClick={() => elegir(posicion)}
              >
                {NIVELES_PICANTE[clave].etiqueta}
              </button>
            ))}
          </div>

          <div className="ep-picante__detalle" aria-live="polite">
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={nivel}
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.45, ease: EASE_EP }}
              >
                <p className="ep-picante__nivel">{NIVELES_PICANTE[nivel].etiqueta}</p>
                <p className="ep-picante__copia">{TEXTO_NIVEL[nivel]}</p>
                {producto && variante && (
                  <p className="ep-picante__precio">
                    {producto.nombre} · {variante.presentacion} · {formatoLempiras.format(Number(variante.precio))}
                  </p>
                )}
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="ep-picante__acciones">
            <button
              type="button"
              className="ep-boton ep-boton--primario ep-boton--grande"
              onClick={alAgregar}
              disabled={!producto || !variante || !variante.cantidad_disponible}
            >
              {agregado ? 'Agregado ✓' : 'Añadir al carrito'}
            </button>
            <Link to="/#productos" className="ep-boton ep-boton--fantasma ep-boton--grande">
              Ver en la colección
            </Link>
          </div>
        </div>

        <div className="ep-picante__visual">
          <div className="ep-picante__chispas" aria-hidden="true">
            {chispas.map((chispa, posicion) => (
              <span
                key={posicion}
                className={`ep-chispa ${posicion < CHISPAS_POR_NIVEL[indice] ? 'ep-chispa--visible' : ''}`}
                style={{
                  left: `${chispa.x}%`,
                  top: `${chispa.y}%`,
                  '--giro': `${chispa.giro}deg`,
                  animationDelay: `${chispa.demora}s`,
                  animationDuration: `${chispa.duracion}s`,
                }}
              />
            ))}
          </div>
          <FrascoPicante aros={AROS_POR_NIVEL[indice]} />
        </div>
      </div>
    </section>
  );
}
