import { Fragment, useMemo } from 'react';

// Generador pseudoaleatorio con semilla: los desfases "aleatorios" son idénticos en cada carga.
function generador(semilla) {
  let s = semilla >>> 0;
  return () => (s = (s * 1664525 + 1013904223) >>> 0) / 4294967296;
}

function dividir(texto, semilla) {
  const azar = generador(semilla);
  const palabras = texto.split(' ');
  const totalCaracteres = texto.replace(/ /g, '').length;
  let indice = 0;

  return palabras.map((palabra, posicion) => ({
    palabra,
    umbral: posicion / palabras.length,
    caracteres: [...palabra].map((caracter) => {
      const orden = totalCaracteres > 1 ? indice / (totalCaracteres - 1) : 0.5;
      indice += 1;
      return {
        caracter,
        umbral: azar() * 0.5,
        desvioX: (azar() - 0.5) * 18,
        centro: orden - 0.5,
      };
    }),
  }));
}

// Cada palabra y cada letra reciben variables CSS; la hoja de estilos de la portada
// decide cómo usarlas según la entrada de cada banda (--k va de 0 a 1 con el scroll).
export default function TextoDividido({ texto, semilla = 1, as: Etiqueta = 'p', className = '' }) {
  const palabras = useMemo(() => dividir(texto, semilla), [texto, semilla]);

  return (
    <Etiqueta className={className}>
      <span className="sr-only">{texto}</span>
      <span aria-hidden="true" className="cine-split">
        {palabras.map((palabra, posicion) => (
          <Fragment key={posicion}>
            <span className="w" style={{ '--wth': palabra.umbral.toFixed(3) }}>
              {palabra.caracteres.map((letra, n) => (
                <span
                  key={n}
                  className="c"
                  style={{
                    '--th': letra.umbral.toFixed(3),
                    '--jx': `${letra.desvioX.toFixed(1)}px`,
                    '--d': letra.centro.toFixed(3),
                    '--ad': Math.abs(letra.centro).toFixed(3),
                  }}
                >
                  {letra.caracter}
                </span>
              ))}
            </span>
            {posicion < palabras.length - 1 && ' '}
          </Fragment>
        ))}
      </span>
    </Etiqueta>
  );
}
