import { Link } from 'react-router-dom';
import useOpiniones from '../../hooks/useOpiniones';
import { urlImagen } from '../../lib/media';

function Estrellas({ calificacion }) {
  return (
    <span className="text-lg text-carrot" aria-label={`${calificacion} de 5 estrellas`}>
      {'★'.repeat(calificacion)}
      <span className="text-olive/20">{'★'.repeat(5 - calificacion)}</span>
    </span>
  );
}

function Avatar({ nombre, foto }) {
  if (foto) {
    return (
      <img
        src={foto}
        alt={`Foto de ${nombre}`}
        loading="lazy"
        decoding="async"
        className="h-16 w-16 shrink-0 rounded-full object-cover ring-2 ring-white shadow-sm"
      />
    );
  }

  const inicial = nombre.trim().charAt(0).toUpperCase();
  return (
    <span className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-olive/15 font-display text-xl font-semibold text-olive-dark ring-2 ring-white shadow-sm">
      {inicial}
    </span>
  );
}

function OpinionCard({ opinion }) {
  return (
    <figure className="flex h-full gap-5 rounded-2xl border border-olive/15 bg-white/60 p-6 shadow-sm transition-shadow hover:shadow-md">
      <Avatar nombre={opinion.nombre} foto={opinion.foto_url && urlImagen(opinion.foto_url)} />
      <div className="flex flex-1 flex-col gap-2">
        <Estrellas calificacion={opinion.calificacion} />
        <blockquote className="flex-1 text-sm leading-relaxed text-ink/80">&ldquo;{opinion.comentario}&rdquo;</blockquote>
        <figcaption className="text-sm font-semibold text-navy">{opinion.nombre}</figcaption>
      </div>
    </figure>
  );
}

export default function Opiniones() {
  const { opiniones, estado } = useOpiniones();

  return (
    <section id="opiniones" className="mx-auto max-w-6xl scroll-mt-24 px-4 py-16 sm:px-6">
      <div className="mb-10 max-w-xl">
        <h2 className="font-display text-3xl font-semibold text-navy sm:text-4xl">Opiniones</h2>
        <p className="mt-3 text-ink/70">Lo que dicen quienes ya probaron Encurtidos El Piquete.</p>
      </div>

      {estado === 'cargando' && <p className="text-sm text-ink/60">Cargando opiniones…</p>}
      {estado === 'error' && (
        <p className="text-sm text-chili">No pudimos cargar las opiniones en este momento.</p>
      )}

      {estado === 'listo' && opiniones.length === 0 && (
        <p className="text-sm text-ink/70">
          Aún no tenemos opiniones publicadas.{' '}
          <Link to="/opinion" className="font-medium text-olive-dark hover:underline">
            ¡Sé el primero en dejarnos la tuya!
          </Link>
        </p>
      )}

      {estado === 'listo' && opiniones.length > 0 && (
        <div className="grid items-stretch gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {opiniones.map((opinion) => (
            <OpinionCard key={opinion.id} opinion={opinion} />
          ))}
        </div>
      )}
    </section>
  );
}
