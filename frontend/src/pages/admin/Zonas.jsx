import { useEffect, useState } from 'react';
import { obtenerZonasAdmin, crearZonaAdmin, actualizarZonaAdmin } from '../../services/adminApi';
import { inputClass } from '../../components/checkout/Field';
import Button from '../../components/ui/Button';

const VACIO = { nombre: '', costo_envio: '', tiempo_estimado: '' };
const formatoLempiras = new Intl.NumberFormat('es-HN', { style: 'currency', currency: 'HNL', minimumFractionDigits: 0 });

export default function Zonas() {
  const [zonas, setZonas] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [form, setForm] = useState(VACIO);
  const [editandoId, setEditandoId] = useState(null);
  const [error, setError] = useState('');

  function cargar() {
    setCargando(true);
    obtenerZonasAdmin()
      .then(setZonas)
      .finally(() => setCargando(false));
  }

  useEffect(cargar, []);

  function editar(zona) {
    setEditandoId(zona.id);
    setForm({ nombre: zona.nombre, costo_envio: zona.costo_envio, tiempo_estimado: zona.tiempo_estimado || '' });
  }

  function cancelarEdicion() {
    setEditandoId(null);
    setForm(VACIO);
  }

  async function guardar() {
    if (!form.nombre || form.costo_envio === '') {
      setError('Nombre y costo de envío son obligatorios');
      return;
    }
    setError('');
    try {
      if (editandoId) {
        await actualizarZonaAdmin(editandoId, form);
      } else {
        await crearZonaAdmin(form);
      }
      cancelarEdicion();
      cargar();
    } catch (err) {
      setError(err.response?.data?.mensaje || 'Error al guardar la zona');
    }
  }

  async function alternarActivo(zona) {
    await actualizarZonaAdmin(zona.id, { activo: !zona.activo });
    cargar();
  }

  return (
    <div className="flex flex-col gap-6">
      <h1 className="font-display text-2xl font-semibold text-navy">Zonas de entrega</h1>

      <div className="grid gap-3 rounded-xl border border-olive/15 bg-white/60 p-4 sm:grid-cols-4">
        <input className={inputClass} placeholder="Nombre de la zona" value={form.nombre} onChange={(e) => setForm({ ...form, nombre: e.target.value })} />
        <input type="number" step="0.01" className={inputClass} placeholder="Costo de envío" value={form.costo_envio} onChange={(e) => setForm({ ...form, costo_envio: e.target.value })} />
        <input className={inputClass} placeholder="Tiempo estimado (ej. 24-48 horas)" value={form.tiempo_estimado} onChange={(e) => setForm({ ...form, tiempo_estimado: e.target.value })} />
        <div className="flex gap-2">
          <Button variant="primary" onClick={guardar}>{editandoId ? 'Guardar' : '+ Crear zona'}</Button>
          {editandoId && <Button variant="outline" onClick={cancelarEdicion}>Cancelar</Button>}
        </div>
        {error && <p className="text-sm text-chili sm:col-span-4">{error}</p>}
      </div>

      {cargando && <p className="text-sm text-ink/60">Cargando zonas…</p>}

      {!cargando && (
        <div className="overflow-x-auto rounded-xl border border-olive/15 bg-white/60">
          <table className="w-full min-w-[560px] text-left text-sm">
            <thead className="border-b border-olive/15 text-xs uppercase tracking-wide text-ink/50">
              <tr>
                <th className="px-4 py-3">Nombre</th>
                <th className="px-4 py-3">Costo de envío</th>
                <th className="px-4 py-3">Tiempo estimado</th>
                <th className="px-4 py-3">Estado</th>
                <th className="px-4 py-3">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {zonas.map((zona) => (
                <tr key={zona.id} className="border-b border-olive/10 last:border-0">
                  <td className="px-4 py-3 font-medium text-navy">{zona.nombre}</td>
                  <td className="px-4 py-3">{formatoLempiras.format(Number(zona.costo_envio))}</td>
                  <td className="px-4 py-3 text-ink/70">{zona.tiempo_estimado}</td>
                  <td className="px-4 py-3">
                    <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${zona.activo ? 'bg-olive/20 text-olive-dark' : 'bg-ink/10 text-ink/60'}`}>
                      {zona.activo ? 'Activa' : 'Inactiva'}
                    </span>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <button type="button" onClick={() => editar(zona)} className="mr-3 text-sm font-medium text-olive-dark hover:underline">Editar</button>
                    <button type="button" onClick={() => alternarActivo(zona)} className="text-sm font-medium text-chili hover:underline">
                      {zona.activo ? 'Desactivar' : 'Activar'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
