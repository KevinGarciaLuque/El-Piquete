import Field, { inputClass } from './Field';

const formatoLempiras = new Intl.NumberFormat('es-HN', {
  style: 'currency',
  currency: 'HNL',
  minimumFractionDigits: 0,
});

function OpcionEntrega({ valor, actual, disabled, titulo, descripcion, onSelect }) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={() => onSelect(valor)}
      className={`flex flex-col items-start gap-1 rounded-xl border p-4 text-left transition-colors ${
        actual === valor
          ? 'border-olive-dark bg-olive/10'
          : 'border-olive/20 bg-white hover:border-olive/40'
      } ${disabled ? 'cursor-not-allowed opacity-50' : ''}`}
    >
      <span className="font-medium text-navy">{titulo}</span>
      <span className="text-xs text-ink/60">{descripcion}</span>
    </button>
  );
}

export default function StepEntrega({ datos, actualizar, zonas, cargandoZonas }) {
  return (
    <div className="flex flex-col gap-4">
      <h2 className="font-display text-2xl font-semibold text-navy">Método de entrega</h2>

      <div className="grid gap-3 sm:grid-cols-3">
        <OpcionEntrega
          valor="domicilio"
          actual={datos.metodoEntrega}
          onSelect={(valor) => actualizar({ metodoEntrega: valor })}
          titulo="Entrega a domicilio"
          descripcion="Recíbelo donde estés"
        />
        <OpcionEntrega
          valor="recoger"
          actual={datos.metodoEntrega}
          onSelect={(valor) => actualizar({ metodoEntrega: valor })}
          titulo="Recoger en punto de venta"
          descripcion="Coordinamos por WhatsApp"
        />
        <OpcionEntrega valor="nacional" actual={datos.metodoEntrega} disabled titulo="Envío nacional" descripcion="Próximamente" onSelect={() => {}} />
      </div>

      {datos.metodoEntrega === 'domicilio' && (
        <div className="mt-2 flex flex-col gap-4 rounded-xl border border-olive/15 bg-white/60 p-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Departamento" required>
              <input
                type="text"
                value={datos.departamento}
                onChange={(e) => actualizar({ departamento: e.target.value })}
                className={inputClass}
                placeholder="Francisco Morazán"
              />
            </Field>
            <Field label="Ciudad / Municipio" required>
              <input
                type="text"
                value={datos.ciudad}
                onChange={(e) => actualizar({ ciudad: e.target.value })}
                className={inputClass}
                placeholder="Tegucigalpa"
              />
            </Field>
          </div>
          <Field label="Dirección exacta" required>
            <input
              type="text"
              value={datos.direccion}
              onChange={(e) => actualizar({ direccion: e.target.value })}
              className={inputClass}
              placeholder="Colonia, calle, número de casa"
            />
          </Field>
          <Field label="Punto de referencia">
            <input
              type="text"
              value={datos.puntoReferencia}
              onChange={(e) => actualizar({ puntoReferencia: e.target.value })}
              className={inputClass}
              placeholder="Frente a..., a un lado de..."
            />
          </Field>

          <Field label="Zona de entrega" required>
            {cargandoZonas ? (
              <p className="text-sm text-ink/60">Cargando zonas…</p>
            ) : (
              <select
                value={datos.zonaEntregaId}
                onChange={(e) => actualizar({ zonaEntregaId: e.target.value })}
                className={inputClass}
              >
                <option value="">Selecciona una zona</option>
                {zonas.map((zona) => (
                  <option key={zona.id} value={zona.id}>
                    {zona.nombre} — {formatoLempiras.format(Number(zona.costo_envio))} ({zona.tiempo_estimado})
                  </option>
                ))}
              </select>
            )}
          </Field>
        </div>
      )}

      {datos.metodoEntrega === 'recoger' && (
        <p className="rounded-xl border border-olive/15 bg-white/60 p-4 text-sm text-ink/70">
          Sin costo de envío. Te contactaremos por WhatsApp para coordinar el punto y horario de recogida.
        </p>
      )}
    </div>
  );
}
