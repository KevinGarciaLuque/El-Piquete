import { Fragment, useRef } from 'react';
import useEnVista from '../../hooks/useEnVista';

const PLATOS = ['Pollo con tajadas', 'Carne asada', 'Baleadas', 'Pastelitos', 'Pescado frito', 'Tacos'];

function Separador() {
  return (
    <svg viewBox="0 0 16 24" className="ep-marquesina__chile" aria-hidden="true">
      <path d="M5.2 6.2c1.9-1.3 5-1.2 6.4.4 1.5 1.8.9 5.6-.6 9.3-1.1 2.8-2.9 5.8-4.6 6.6-.9.4-1.4-.3-1.2-1.3.5-2.6.7-5.4.2-8.4-.4-2.5-1.1-5.2-.2-6.6Z" />
    </svg>
  );
}

// Franja en movimiento lento; se repite lo suficiente para cubrir pantallas de 2560px.
export default function ConQueSeCome() {
  const franjaRef = useRef(null);
  const enVista = useEnVista(franjaRef);
  const repetidos = [...PLATOS, ...PLATOS, ...PLATOS];

  return (
    <aside ref={franjaRef} className={`ep-marquesina ${enVista ? 'ep-vivo' : ''}`} aria-label="Con qué se come">
      <p className="ep-marquesina__titulo">Va con lo que ya te gusta:</p>
      <p className="sr-only">{PLATOS.join(', ')}.</p>
      <div className="ep-marquesina__ventana" aria-hidden="true">
        <div className="ep-marquesina__pista">
          {[0, 1].map((copia) => (
            <span key={copia} className="ep-marquesina__grupo">
              {repetidos.map((plato, indice) => (
                <Fragment key={`${copia}-${indice}`}>
                  <span className="ep-marquesina__plato">{plato}</span>
                  <Separador />
                </Fragment>
              ))}
            </span>
          ))}
        </div>
      </div>
    </aside>
  );
}
