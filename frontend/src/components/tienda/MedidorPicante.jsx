import { NIVELES_PICANTE } from '../../lib/tienda';

function Chile({ lleno }) {
  return (
    <svg viewBox="0 0 16 24" className={`ep-chile ${lleno ? 'ep-chile--lleno' : ''}`} aria-hidden="true">
      <path d="M8.6 1.5c-.2 1.6.4 2.6 1.6 3.1" fill="none" strokeWidth="1.4" strokeLinecap="round" />
      <path d="M5.2 6.2c1.9-1.3 5-1.2 6.4.4 1.5 1.8.9 5.6-.6 9.3-1.1 2.8-2.9 5.8-4.6 6.6-.9.4-1.4-.3-1.2-1.3.5-2.6.7-5.4.2-8.4-.4-2.5-1.1-5.2-.2-6.6Z" />
    </svg>
  );
}

// Tres chiles dibujados en lugar de emojis; el texto accesible nombra el nivel.
export default function MedidorPicante({ nivel, etiqueta }) {
  const info = NIVELES_PICANTE[nivel] ?? NIVELES_PICANTE.tradicional;
  const texto = etiqueta ?? info.etiqueta;

  return (
    <span className="ep-medidor" aria-label={`Nivel de picante: ${texto}`}>
      <span className="ep-medidor__chiles">
        {[1, 2, 3].map((n) => (
          <Chile key={n} lleno={etiqueta ? true : n <= info.intensidad} />
        ))}
      </span>
      <span className="ep-medidor__texto" aria-hidden="true">
        {texto}
      </span>
    </span>
  );
}
