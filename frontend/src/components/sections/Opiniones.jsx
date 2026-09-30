import { Link } from 'react-router-dom';
import useOpiniones from '../../hooks/useOpiniones';
import { urlImagen } from '../../lib/media';
import { Aparecer, Encabezado } from '../tienda/Revelar';
import LineaSalmuera from '../tienda/LineaSalmuera';

function Estrellas({ calificacion }) {
  return (
    <span className="ep-estrellas" aria-label={`${calificacion} de 5 estrellas`}>
      {[1, 2, 3, 4, 5].map((n) => (
        <span key={n} aria-hidden="true" className={n <= calificacion ? 'ep-estrellas__llena' : ''}>
          ★
        </span>
      ))}
    </span>
  );
}

function Avatar({ nombre, foto }) {
  if (foto) {
    return <img src={foto} alt={`Foto de ${nombre}`} loading="lazy" decoding="async" className="ep-opinion__avatar" />;
  }
  return (
    <span className="ep-opinion__avatar ep-opinion__avatar--inicial" aria-hidden="true">
      {nombre.trim().charAt(0).toUpperCase()}
    </span>
  );
}

// Solo opiniones reales publicadas desde el panel; nada inventado.
export default function Opiniones() {
  const { opiniones, estado } = useOpiniones();

  return (
    <section id="opiniones" className="ep-seccion ep-opiniones scroll-mt-24">
      <LineaSalmuera tono="crema" />
      <div className="ep-contenedor">
        <Encabezado kicker="09 · Opiniones" titulo="Lo dicen quienes ya lo probaron." />

        {estado === 'cargando' && <p className="ep-aviso">Cargando opiniones…</p>}
        {estado === 'error' && <p className="ep-aviso">No pudimos cargar las opiniones en este momento.</p>}

        {estado === 'listo' && opiniones.length === 0 && (
          <p className="ep-aviso">
            Aún no tenemos opiniones publicadas. <Link to="/opinion">Sé la primera persona en dejar la tuya.</Link>
          </p>
        )}

        {estado === 'listo' && opiniones.length > 0 && (
          <div className="ep-opiniones__rejilla">
            {opiniones.map((opinion, indice) => (
              <Aparecer as="figure" key={opinion.id} retraso={Math.min(indice, 5) * 0.08} className="ep-opinion">
                <Estrellas calificacion={opinion.calificacion} />
                <blockquote className="ep-opinion__texto">&ldquo;{opinion.comentario}&rdquo;</blockquote>
                <figcaption className="ep-opinion__autor">
                  <Avatar nombre={opinion.nombre} foto={opinion.foto_url && urlImagen(opinion.foto_url)} />
                  <span>{opinion.nombre}</span>
                </figcaption>
              </Aparecer>
            ))}
          </div>
        )}

        <Aparecer className="ep-opiniones__pie">
          <Link to="/opinion" className="ep-boton ep-boton--linea">
            Déjanos tu opinión
          </Link>
        </Aparecer>
      </div>
    </section>
  );
}
