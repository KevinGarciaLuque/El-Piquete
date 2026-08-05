import { useEffect, useState } from 'react';
import { obtenerCuponesAdmin, crearCuponAdmin, actualizarCuponAdmin } from '../../services/adminApi';
import { inputClass } from '../../components/checkout/Field';
import Button from '../../components/ui/Button';

const VACIO = { codigo: '', tipo: 'porcentaje', valor: '', fecha_inicio: '', fecha_fin: '', usos_maximos: '' };

const formatoLempiras = new Intl.NumberFormat('es-HN', { style: 'currency', currency: 'HNL', minimumFractionDigits: 0 });

export default function Cupones() {
  const [cupones, setCupones] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [form, setForm] = useState(VACIO);
  const [editandoId, setEditandoId] = useState(null);
  const [error, setError] = useState('');

  function cargar() {
    setCargando(true);
    obtenerCuponesAdmin()
      .then(setCupones)
      .finally(() => setCargando(false));
  }

  useEffect(cargar, []);

  function editar(cupon) {
    setEditandoId(cupon.id);
    setForm({
      codigo: cupon.codigo,
      tipo: cupon.tipo,
      valor: cupon.valor,
      fecha_inicio: cupon.fecha_inicio?.slice(0, 10) || '',
      fecha_fin: cupon.fecha_fin?.slice(0, 10) || '',
      usos_maximos: cupon.usos_maximos ?? '',
    });
  }

  function cancelarEdicion() {
    setEditandoId(null);
    setForm(VACIO);
  }

  async function guardar() {
    if (!form.codigo || !form.valor) {
      setError('Código y valor son obligatorios');
      return;
    }
    setError('');
    try {
      if (editandoId) {
        await actualizarCuponAdmin(editandoId, form);
      } else {
        await crearCuponAdmin(form);
      }
      cancelarEdicion();
      cargar();
    } catch (err) {
      setError(err.response?.data?.mensaje || 'Error al guardar el cupón');
    }
  }

  async function alternarActivo(cupon) {
    await actualizarCuponAdmin(cupon.id, { activo: !cupon.activo });
    cargar();
  }

  return (
    <div className="flex flex-col gap-6">
      <h1 className="font-display text-2xl font-semibold text-navy">Cupones</h1>

      <div className="grid gap-3 rounded-xl border border-olive/15 bg-white/60 p-4 sm:grid-cols-5">
        <input className={inputClass} placeholder="Código" value={form.codigo} onChange={(e) => setForm({ ...form, codigo: e.target.value })} />
        <select className={inputClass} value={form.tipo} onChange={(e) => setForm({ ...form, tipo: e.target.value })}>
          <option value="porcentaje">Porcentaje</option>
          <option value="monto_fijo">Monto fijo</option>
        </select>
        <input type="number" step="0.01" className={inputClass} placeholder="Valor" value={form.valor} onChange={(e) => setForm({ ...form, valor: e.target.value })} />
        <input type="date" className={inputClass} value={form.fecha_inicio} onChange={(e) => setForm({ ...form, fecha_inicio: e.target.value })} />
        <input type="date" className={inputClass} value={form.fecha_fin} onChange={(e) => setForm({ ...form, fecha_fin: e.target.value })} />
        <input type="number" className={inputClass} placeholder="Usos máximos (opcional)" value={form.usos_maximos} onChange={(e) => setForm({ ...form, usos_maximos: e.target.value })} />
        <div className="flex gap-2 sm:col-span-2">
          <Button variant="primary" onClick={guardar}>{editandoId ? 'Guardar cambios' : '+ Crear cupón'}</Button>
          {editandoId && <Button variant="outline" onClick={cancelarEdicion}>Cancelar</Button>}
        </div>
        {error && <p className="text-sm text-chili sm:col-span-5">{error}</p>}
      </div>

      {cargando && <p className="text-sm text-ink/60">Cargando cupones…</p>}

      {!cargando && (
        <div className="overflow-x-auto rounded-xl border border-olive/15 bg-white/60">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead className="border-b border-olive/15 text-xs uppercase tracking-wide text-ink/50">
              <tr>
                <th className="px-4 py-3">Código</th>
                <th className="px-4 py-3">Tipo</th>
                <th className="px-4 py-3">Valor</th>
                <th className="px-4 py-3">Vigencia</th>
                <th className="px-4 py-3">Estado</th>
                <th className="px-4 py-3">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {cupones.map((cupon) => (
                <tr key={cupon.id} className="border-b border-olive/10 last:border-0">
                  <td className="px-4 py-3 font-medium text-navy">{cupon.codigo}</td>
                  <td className="px-4 py-3 capitalize">{cupon.tipo.replace('_', ' ')}</td>
                  <td className="px-4 py-3">{cupon.tipo === 'porcentaje' ? `${cupon.valor}%` : formatoLempiras.format(Number(cupon.valor))}</td>
                  <td className="px-4 py-3 text-xs text-ink/60">
                    {cupon.fecha_inicio ? cupon.fecha_inicio.slice(0, 10) : 'Sin inicio'} — {cupon.fecha_fin ? cupon.fecha_fin.slice(0, 10) : 'Sin fin'}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${cupon.activo ? 'bg-olive/20 text-olive-dark' : 'bg-ink/10 text-ink/60'}`}>
                      {cupon.activo ? 'Activo' : 'Inactivo'}
                    </span>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <button type="button" onClick={() => editar(cupon)} className="mr-3 text-sm font-medium text-olive-dark hover:underline">Editar</button>
                    <button type="button" onClick={() => alternarActivo(cupon)} className="text-sm font-medium text-chili hover:underline">
                      {cupon.activo ? 'Desactivar' : 'Activar'}
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
