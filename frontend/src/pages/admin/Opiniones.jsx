import { useEffect, useState } from 'react';
import {
  obtenerOpinionesAdmin,
  crearOpinionAdmin,
  actualizarOpinionAdmin,
  eliminarOpinionAdmin,
  subirFotoOpinionAdmin,
} from '../../services/adminApi';
import { urlImagen } from '../../lib/media';
import { inputClass } from '../../components/checkout/Field';
import Button from '../../components/ui/Button';

const VACIO = { nombre: '', comentario: '' };
const FILTROS = [
  { valor: '', etiqueta: 'Todas' },
  { valor: 'pendiente', etiqueta: 'Pendientes' },
  { valor: 'aprobada', etiqueta: 'Aprobadas' },
  { valor: 'rechazada', etiqueta: 'Rechazadas' },
];
const formatoFecha = new Intl.DateTimeFormat('es-HN', { dateStyle: 'short', timeStyle: 'short' });

const ESTILOS_ESTADO = {
  pendiente: 'bg-ink/10 text-ink/60',
  aprobada: 'bg-olive/20 text-olive-dark',
  rechazada: 'bg-chili/15 text-chili',
};

function Etiqueta({ children }) {
  return <span className="text-xs font-medium uppercase tracking-wide text-ink/50">{children}</span>;
}

function SelectorEstrellas({ valor, onChange }) {
  return (
    <div className="flex items-center gap-1 rounded-lg border border-olive/30 bg-white px-3 py-2">
      {[1, 2, 3, 4, 5].map((n) => (
        <button
          key={n}
          type="button"
          onClick={() => onChange(n)}
          aria-label={`${n} estrellas`}
          className={`text-xl leading-none transition-colors ${n <= valor ? 'text-carrot' : 'text-olive/20 hover:text-olive/40'}`}
        >
          ★
        </button>
      ))}
    </div>
  );
}

export default function Opiniones() {
  const [opiniones, setOpiniones] = useState([]);
  const [filtro, setFiltro] = useState('');
  const [cargando, setCargando] = useState(true);
  const [form, setForm] = useState(VACIO);
  const [calificacion, setCalificacion] = useState(5);
  const [foto, setFoto] = useState(null);
  const [fotoInputKey, setFotoInputKey] = useState(0);
  const [error, setError] = useState('');
  const [guardando, setGuardando] = useState(false);

  function cargar() {
    setCargando(true);
    obtenerOpinionesAdmin(filtro || undefined)
      .then(setOpiniones)
      .finally(() => setCargando(false));
  }

  useEffect(cargar, [filtro]);

  async function crear() {
    if (!form.nombre || !form.comentario) {
      setError('Nombre y comentario son obligatorios');
      return;
    }
    setError('');
    setGuardando(true);
    try {
      const { id } = await crearOpinionAdmin({ ...form, calificacion });
      if (foto) await subirFotoOpinionAdmin(id, foto);
      setForm(VACIO);
      setCalificacion(5);
      setFoto(null);
      setFotoInputKey((k) => k + 1);
      cargar();
    } catch (err) {
      setError(err.response?.data?.mensaje || 'Error al crear la opinión');
    } finally {
      setGuardando(false);
    }
  }

  async function cambiarEstado(opinion, estado) {
    await actualizarOpinionAdmin(opinion.id, { estado });
    cargar();
  }

  async function eliminar(opinion) {
    if (!confirm(`¿Eliminar la opinión de ${opinion.nombre}? Esta acción no se puede deshacer.`)) return;
    await eliminarOpinionAdmin(opinion.id);
    cargar();
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-display text-2xl font-semibold text-navy">Opiniones</h1>
        <p className="mt-1 text-sm text-ink/60">
          Modera las opiniones que envían los clientes o crea reseñas manuales para la sección pública.
        </p>
      </div>

      <div className="rounded-xl border border-olive/15 bg-white/60 p-5">
        <h2 className="mb-4 font-medium text-navy">Nueva opinión manual</h2>
        <div className="grid gap-4 sm:grid-cols-3">
          <label className="flex flex-col gap-1">
            <Etiqueta>Nombre a mostrar</Etiqueta>
            <input
              className={inputClass}
              placeholder="Ej. María G."
              value={form.nombre}
              onChange={(e) => setForm({ ...form, nombre: e.target.value })}
            />
          </label>

          <label className="flex flex-col gap-1">
            <Etiqueta>Calificación</Etiqueta>
            <SelectorEstrellas valor={calificacion} onChange={setCalificacion} />
          </label>

          <div className="flex flex-col gap-1">
            <Etiqueta>Foto (opcional)</Etiqueta>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-olive/20 bg-white text-ink/30">
                {foto ? (
                  <img src={URL.createObjectURL(foto)} alt="" className="h-full w-full object-cover" />
                ) : (
                  <span className="text-lg">🖼</span>
                )}
              </div>
              <label className="cursor-pointer truncate rounded-full border-2 border-navy px-3 py-1.5 text-xs font-semibold text-navy hover:bg-navy hover:text-cream">
                {foto ? foto.name : 'Elegir foto'}
                <input
                  key={fotoInputKey}
                  type="file"
                  accept="image/png,image/jpeg,image/webp"
                  className="hidden"
                  onChange={(e) => setFoto(e.target.files[0] || null)}
                />
              </label>
            </div>
          </div>

          <label className="flex flex-col gap-1 sm:col-span-3">
            <Etiqueta>Comentario</Etiqueta>
            <textarea
              className={`${inputClass} min-h-[80px]`}
              placeholder="Tiene un picante equilibrado y las verduras permanecen crujientes."
              value={form.comentario}
              onChange={(e) => setForm({ ...form, comentario: e.target.value })}
            />
          </label>
        </div>

        <div className="mt-4 flex items-center gap-3">
          <Button variant="primary" onClick={crear} disabled={guardando}>
            {guardando ? 'Guardando…' : '+ Nueva opinión'}
          </Button>
          <span className="text-xs text-ink/50">Se publica de inmediato como aprobada.</span>
        </div>
        {error && <p className="mt-3 text-sm text-chili">{error}</p>}
      </div>

      <div className="flex flex-wrap gap-2">
        {FILTROS.map((f) => (
          <button
            key={f.valor}
            type="button"
            onClick={() => setFiltro(f.valor)}
            className={`rounded-full px-3 py-1.5 text-sm font-medium transition-colors ${
              filtro === f.valor ? 'bg-olive-dark text-cream' : 'bg-white/60 text-ink/60 hover:bg-olive/10'
            }`}
          >
            {f.etiqueta}
          </button>
        ))}
      </div>

      {cargando && <p className="text-sm text-ink/60">Cargando opiniones…</p>}

      {!cargando && (
        <div className="overflow-x-auto rounded-xl border border-olive/15 bg-white/60">
          <table className="w-full min-w-[820px] text-left text-sm">
            <thead className="border-b border-olive/15 text-xs uppercase tracking-wide text-ink/50">
              <tr>
                <th className="px-4 py-3">Pedido</th>
                <th className="px-4 py-3">Nombre</th>
                <th className="px-4 py-3">Calificación</th>
                <th className="px-4 py-3">Comentario</th>
                <th className="px-4 py-3">Foto</th>
                <th className="px-4 py-3">Estado</th>
                <th className="px-4 py-3">Fecha</th>
                <th className="px-4 py-3">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {opiniones.map((opinion) => (
                <tr key={opinion.id} className="border-b border-olive/10 last:border-0 align-top">
                  <td className="px-4 py-3 text-ink/60">{opinion.pedido_codigo || 'Manual'}</td>
                  <td className="px-4 py-3 font-medium text-navy">{opinion.nombre}</td>
                  <td className="px-4 py-3 whitespace-nowrap text-carrot">{'★'.repeat(opinion.calificacion)}</td>
                  <td className="max-w-xs px-4 py-3 text-ink/70">
                    <p className="line-clamp-2" title={opinion.comentario}>
                      {opinion.comentario}
                    </p>
                  </td>
                  <td className="px-4 py-3">
                    {opinion.foto_url ? (
                      <img
                        src={urlImagen(opinion.foto_url)}
                        alt=""
                        className="h-12 w-12 rounded-lg border border-olive/15 object-cover"
                      />
                    ) : (
                      <span className="text-xs text-ink/40">Sin foto</span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`rounded-full px-2.5 py-1 text-xs font-medium capitalize ${ESTILOS_ESTADO[opinion.estado]}`}>
                      {opinion.estado}
                    </span>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-ink/60">
                    {formatoFecha.format(new Date(opinion.created_at))}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap items-center gap-2">
                      {opinion.estado === 'pendiente' && (
                        <>
                          <button
                            type="button"
                            onClick={() => cambiarEstado(opinion, 'aprobada')}
                            className="rounded-full bg-olive/15 px-3 py-1 text-xs font-semibold text-olive-dark hover:bg-olive/25"
                          >
                            Aprobar
                          </button>
                          <button
                            type="button"
                            onClick={() => cambiarEstado(opinion, 'rechazada')}
                            className="rounded-full bg-chili/10 px-3 py-1 text-xs font-semibold text-chili hover:bg-chili/20"
                          >
                            Rechazar
                          </button>
                        </>
                      )}
                      <button
                        type="button"
                        onClick={() => eliminar(opinion)}
                        className="text-xs font-medium text-ink/50 hover:text-chili hover:underline"
                      >
                        Eliminar
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {opiniones.length === 0 && <p className="p-4 text-sm text-ink/60">No hay opiniones para este filtro.</p>}
        </div>
      )}
    </div>
  );
}
