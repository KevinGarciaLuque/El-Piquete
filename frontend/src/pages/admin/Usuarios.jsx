import { useEffect, useState } from 'react';
import {
  obtenerUsuariosAdmin,
  crearUsuarioAdmin,
  actualizarUsuarioAdmin,
  cambiarPasswordUsuarioAdmin,
  eliminarUsuarioAdmin,
} from '../../services/adminApi';
import { useAuth } from '../../context/AuthContext';
import { inputClass } from '../../components/checkout/Field';
import Button from '../../components/ui/Button';
import PasswordInput from '../../components/ui/PasswordInput';

const VACIO = { nombre: '', correo: '', password: '' };
const formatoFecha = new Intl.DateTimeFormat('es-HN', { dateStyle: 'medium' });

function FilaContrasena({ usuario, onGuardado }) {
  const [abierto, setAbierto] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [guardando, setGuardando] = useState(false);

  async function guardar() {
    if (password.length < 6) {
      setError('Mínimo 6 caracteres');
      return;
    }
    setGuardando(true);
    setError('');
    try {
      await cambiarPasswordUsuarioAdmin(usuario.id, password);
      setPassword('');
      setAbierto(false);
      onGuardado();
    } catch (err) {
      setError(err.response?.data?.mensaje || 'Error al cambiar la contraseña');
    } finally {
      setGuardando(false);
    }
  }

  if (!abierto) {
    return (
      <button type="button" onClick={() => setAbierto(true)} className="text-sm font-medium text-olive-dark hover:underline">
        Cambiar contraseña
      </button>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <PasswordInput
        placeholder="Nueva contraseña"
        className="w-40"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button type="button" onClick={guardar} disabled={guardando} className="text-sm font-medium text-olive-dark hover:underline">
        Guardar
      </button>
      <button type="button" onClick={() => { setAbierto(false); setError(''); }} className="text-sm text-ink/50 hover:underline">
        Cancelar
      </button>
      {error && <span className="text-xs text-chili">{error}</span>}
    </div>
  );
}

export default function Usuarios() {
  const { admin } = useAuth();
  const [usuarios, setUsuarios] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [form, setForm] = useState(VACIO);
  const [error, setError] = useState('');
  const [creando, setCreando] = useState(false);

  function cargar() {
    setCargando(true);
    obtenerUsuariosAdmin()
      .then(setUsuarios)
      .finally(() => setCargando(false));
  }

  useEffect(cargar, []);

  async function handleCrear() {
    if (!form.nombre || !form.correo || !form.password) {
      setError('Nombre, correo y contraseña son obligatorios');
      return;
    }
    if (form.password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres');
      return;
    }
    setCreando(true);
    setError('');
    try {
      await crearUsuarioAdmin(form);
      setForm(VACIO);
      cargar();
    } catch (err) {
      setError(err.response?.data?.mensaje || 'Error al crear el usuario');
    } finally {
      setCreando(false);
    }
  }

  async function alternarActivo(usuario) {
    try {
      await actualizarUsuarioAdmin(usuario.id, { activo: !usuario.activo });
      cargar();
    } catch (err) {
      setError(err.response?.data?.mensaje || 'Error al actualizar el usuario');
    }
  }

  async function eliminar(usuario) {
    if (!confirm(`¿Eliminar al usuario ${usuario.nombre}? Esta acción no se puede deshacer.`)) return;
    try {
      await eliminarUsuarioAdmin(usuario.id);
      cargar();
    } catch (err) {
      setError(err.response?.data?.mensaje || 'Error al eliminar el usuario');
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <h1 className="font-display text-2xl font-semibold text-navy">Usuarios administradores</h1>

      <div className="grid gap-3 rounded-xl border border-olive/15 bg-white/60 p-4 sm:grid-cols-4">
        <input className={inputClass} placeholder="Nombre" value={form.nombre} onChange={(e) => setForm({ ...form, nombre: e.target.value })} />
        <input type="email" className={inputClass} placeholder="Correo" value={form.correo} onChange={(e) => setForm({ ...form, correo: e.target.value })} />
        <PasswordInput placeholder="Contraseña" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
        <Button variant="primary" onClick={handleCrear} disabled={creando}>
          {creando ? 'Creando…' : '+ Crear usuario'}
        </Button>
        {error && <p className="text-sm text-chili sm:col-span-4">{error}</p>}
      </div>

      {cargando && <p className="text-sm text-ink/60">Cargando usuarios…</p>}

      {!cargando && (
        <div className="overflow-x-auto rounded-xl border border-olive/15 bg-white/60">
          <table className="w-full min-w-[720px] text-left text-sm">
            <thead className="border-b border-olive/15 text-xs uppercase tracking-wide text-ink/50">
              <tr>
                <th className="px-4 py-3">Nombre</th>
                <th className="px-4 py-3">Correo</th>
                <th className="px-4 py-3">Desde</th>
                <th className="px-4 py-3">Estado</th>
                <th className="px-4 py-3">Contraseña</th>
                <th className="px-4 py-3">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {usuarios.map((usuario) => {
                const esUsuarioActual = usuario.correo === admin?.correo;
                return (
                  <tr key={usuario.id} className="border-b border-olive/10 last:border-0">
                    <td className="px-4 py-3 font-medium text-navy">
                      {usuario.nombre} {esUsuarioActual && <span className="text-xs font-normal text-ink/50">(tú)</span>}
                    </td>
                    <td className="px-4 py-3">{usuario.correo}</td>
                    <td className="px-4 py-3 text-xs text-ink/60">{formatoFecha.format(new Date(usuario.created_at))}</td>
                    <td className="px-4 py-3">
                      <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${usuario.activo ? 'bg-olive/20 text-olive-dark' : 'bg-ink/10 text-ink/60'}`}>
                        {usuario.activo ? 'Activo' : 'Inactivo'}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <FilaContrasena usuario={usuario} onGuardado={cargar} />
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <button
                        type="button"
                        onClick={() => alternarActivo(usuario)}
                        disabled={esUsuarioActual}
                        className="mr-3 text-sm font-medium text-olive-dark hover:underline disabled:cursor-not-allowed disabled:opacity-40"
                      >
                        {usuario.activo ? 'Desactivar' : 'Activar'}
                      </button>
                      <button
                        type="button"
                        onClick={() => eliminar(usuario)}
                        disabled={esUsuarioActual}
                        className="text-sm font-medium text-chili hover:underline disabled:cursor-not-allowed disabled:opacity-40"
                      >
                        Eliminar
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
