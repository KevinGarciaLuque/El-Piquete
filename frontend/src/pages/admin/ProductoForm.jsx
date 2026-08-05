import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  obtenerProductoAdmin,
  crearProductoAdmin,
  actualizarProductoAdmin,
  eliminarProductoAdmin,
  subirImagenProductoAdmin,
  crearVarianteAdmin,
  actualizarVarianteAdmin,
  eliminarVarianteAdmin,
  actualizarInventarioAdmin,
} from '../../services/adminApi';
import { inputClass } from '../../components/checkout/Field';
import { urlImagen } from '../../lib/media';
import Button from '../../components/ui/Button';
import encurtido from '../../assets/encurtido.png';

const VACIO = {
  nombre: '',
  descripcion: '',
  ingredientes: '',
  nivel_picante: 'tradicional',
  tipo: 'individual',
  destacado: false,
  mas_vendido: false,
  activo: true,
  variantes: [],
};

function VarianteRow({ variante, onActualizado }) {
  const [valores, setValores] = useState({
    presentacion: variante.presentacion,
    contenido_neto: variante.contenido_neto || '',
    precio: variante.precio,
    sku: variante.sku,
  });
  const [cantidad, setCantidad] = useState(variante.cantidad_disponible ?? 0);
  const [guardando, setGuardando] = useState(false);
  const [mensaje, setMensaje] = useState('');

  async function guardar() {
    setGuardando(true);
    setMensaje('');
    try {
      await actualizarVarianteAdmin(variante.id, valores);
      await actualizarInventarioAdmin(variante.id, Number(cantidad));
      setMensaje('Guardado ✓');
      onActualizado();
    } catch {
      setMensaje('Error al guardar');
    } finally {
      setGuardando(false);
    }
  }

  async function eliminar() {
    if (!confirm('¿Desactivar esta variante?')) return;
    await eliminarVarianteAdmin(variante.id);
    onActualizado();
  }

  return (
    <tr className="border-b border-olive/10">
      <td className="p-2">
        <input className={inputClass} value={valores.presentacion} onChange={(e) => setValores({ ...valores, presentacion: e.target.value })} />
      </td>
      <td className="p-2">
        <input className={inputClass} value={valores.contenido_neto} onChange={(e) => setValores({ ...valores, contenido_neto: e.target.value })} />
      </td>
      <td className="p-2">
        <input type="number" step="0.01" className={inputClass} value={valores.precio} onChange={(e) => setValores({ ...valores, precio: e.target.value })} />
      </td>
      <td className="p-2">
        <input className={inputClass} value={valores.sku} onChange={(e) => setValores({ ...valores, sku: e.target.value })} />
      </td>
      <td className="p-2">
        <input type="number" className={inputClass} value={cantidad} onChange={(e) => setCantidad(e.target.value)} />
      </td>
      <td className="p-2 whitespace-nowrap">
        <button type="button" onClick={guardar} disabled={guardando} className="mr-2 text-sm font-medium text-olive-dark hover:underline">
          Guardar
        </button>
        <button type="button" onClick={eliminar} className="text-sm font-medium text-chili hover:underline">
          Desactivar
        </button>
        {mensaje && <span className="ml-2 text-xs text-ink/50">{mensaje}</span>}
      </td>
    </tr>
  );
}

function NuevaVarianteForm({ productoId, onCreada }) {
  const [valores, setValores] = useState({ presentacion: '', contenido_neto: '', precio: '', sku: '', cantidad_disponible: 0 });
  const [error, setError] = useState('');

  async function crear() {
    if (!valores.presentacion || !valores.precio || !valores.sku) {
      setError('Presentación, precio y SKU son obligatorios');
      return;
    }
    try {
      await crearVarianteAdmin(productoId, valores);
      setValores({ presentacion: '', contenido_neto: '', precio: '', sku: '', cantidad_disponible: 0 });
      setError('');
      onCreada();
    } catch (err) {
      setError(err.response?.data?.mensaje || 'Error al crear la variante');
    }
  }

  return (
    <tr>
      <td className="p-2"><input className={inputClass} placeholder="250 ml" value={valores.presentacion} onChange={(e) => setValores({ ...valores, presentacion: e.target.value })} /></td>
      <td className="p-2"><input className={inputClass} placeholder="250 ml" value={valores.contenido_neto} onChange={(e) => setValores({ ...valores, contenido_neto: e.target.value })} /></td>
      <td className="p-2"><input type="number" step="0.01" className={inputClass} placeholder="100" value={valores.precio} onChange={(e) => setValores({ ...valores, precio: e.target.value })} /></td>
      <td className="p-2"><input className={inputClass} placeholder="SKU-001" value={valores.sku} onChange={(e) => setValores({ ...valores, sku: e.target.value })} /></td>
      <td className="p-2"><input type="number" className={inputClass} value={valores.cantidad_disponible} onChange={(e) => setValores({ ...valores, cantidad_disponible: e.target.value })} /></td>
      <td className="p-2">
        <button type="button" onClick={crear} className="text-sm font-medium text-chili hover:underline">+ Agregar</button>
        {error && <p className="text-xs text-chili">{error}</p>}
      </td>
    </tr>
  );
}

export default function ProductoForm() {
  const { id } = useParams();
  const esNuevo = id === 'nuevo';
  const navigate = useNavigate();

  const [producto, setProducto] = useState(VACIO);
  const [cargando, setCargando] = useState(!esNuevo);
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState('');
  const [subiendoImagen, setSubiendoImagen] = useState(false);

  function cargarProducto() {
    if (esNuevo) {
      setProducto(VACIO);
      setCargando(false);
      return;
    }
    setCargando(true);
    obtenerProductoAdmin(id)
      .then(setProducto)
      .finally(() => setCargando(false));
  }

  useEffect(cargarProducto, [id]);

  async function handleGuardar() {
    setGuardando(true);
    setError('');

    try {
      if (esNuevo) {
        const resultado = await crearProductoAdmin(producto);
        navigate(`/admin/productos/${resultado.id}`, { replace: true });
      } else {
        await actualizarProductoAdmin(id, producto);
      }
    } catch (err) {
      setError(err.response?.data?.mensaje || 'Error al guardar el producto');
    } finally {
      setGuardando(false);
    }
  }

  async function handleEliminar() {
    if (!confirm('¿Desactivar este producto? Dejará de mostrarse en la tienda.')) return;
    await eliminarProductoAdmin(id);
    navigate('/admin/productos');
  }

  async function handleImagen(e) {
    const archivo = e.target.files[0];
    if (!archivo) return;
    setSubiendoImagen(true);
    try {
      const { imagen_url } = await subirImagenProductoAdmin(id, archivo);
      setProducto((p) => ({ ...p, imagen_url }));
    } catch {
      setError('Error al subir la imagen');
    } finally {
      setSubiendoImagen(false);
    }
  }

  if (cargando) return <p className="text-sm text-ink/60">Cargando…</p>;

  return (
    <div className="flex flex-col gap-6">
      <h1 className="font-display text-2xl font-semibold text-navy">{esNuevo ? 'Nuevo producto' : producto.nombre}</h1>

      <div className="grid gap-4 rounded-xl border border-olive/15 bg-white/60 p-4 sm:grid-cols-2">
        <label className="flex flex-col gap-1 text-sm sm:col-span-2">
          <span className="font-medium text-navy">Nombre</span>
          <input className={inputClass} value={producto.nombre} onChange={(e) => setProducto({ ...producto, nombre: e.target.value })} />
        </label>
        <label className="flex flex-col gap-1 text-sm sm:col-span-2">
          <span className="font-medium text-navy">Descripción</span>
          <textarea className={inputClass} rows={2} value={producto.descripcion || ''} onChange={(e) => setProducto({ ...producto, descripcion: e.target.value })} />
        </label>
        <label className="flex flex-col gap-1 text-sm sm:col-span-2">
          <span className="font-medium text-navy">Ingredientes</span>
          <input className={inputClass} value={producto.ingredientes || ''} onChange={(e) => setProducto({ ...producto, ingredientes: e.target.value })} />
        </label>
        <label className="flex flex-col gap-1 text-sm">
          <span className="font-medium text-navy">Nivel de picante</span>
          <select className={inputClass} value={producto.nivel_picante} onChange={(e) => setProducto({ ...producto, nivel_picante: e.target.value })}>
            <option value="suave">Suave</option>
            <option value="tradicional">Tradicional</option>
            <option value="picante">Picante</option>
            <option value="extra_picante">Extra picante</option>
          </select>
        </label>
        <label className="flex flex-col gap-1 text-sm">
          <span className="font-medium text-navy">Tipo</span>
          <select className={inputClass} value={producto.tipo} onChange={(e) => setProducto({ ...producto, tipo: e.target.value })}>
            <option value="individual">Individual</option>
            <option value="combo">Combo</option>
          </select>
        </label>

        <div className="flex gap-4 sm:col-span-2">
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={producto.destacado} onChange={(e) => setProducto({ ...producto, destacado: e.target.checked })} />
            Destacado
          </label>
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={producto.mas_vendido} onChange={(e) => setProducto({ ...producto, mas_vendido: e.target.checked })} />
            Más vendido
          </label>
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={producto.activo} onChange={(e) => setProducto({ ...producto, activo: e.target.checked })} />
            Activo (visible en la tienda)
          </label>
        </div>

        {error && <p className="text-sm text-chili sm:col-span-2">{error}</p>}

        <div className="flex gap-2 sm:col-span-2">
          <Button variant="primary" onClick={handleGuardar} disabled={guardando}>
            {guardando ? 'Guardando…' : esNuevo ? 'Crear producto' : 'Guardar cambios'}
          </Button>
          {!esNuevo && (
            <Button variant="outline" onClick={handleEliminar}>
              Desactivar producto
            </Button>
          )}
        </div>
      </div>

      {!esNuevo && (
        <>
          <div className="rounded-xl border border-olive/15 bg-white/60 p-4">
            <h2 className="mb-3 font-medium text-navy">Fotografía</h2>
            <div className="flex items-center gap-4">
              <img src={urlImagen(producto.imagen_url) || encurtido} alt={producto.nombre} className="h-24 w-24 rounded-lg object-cover" />
              <label className="cursor-pointer rounded-full border-2 border-navy px-4 py-2 text-sm font-semibold text-navy hover:bg-navy hover:text-cream">
                {subiendoImagen ? 'Subiendo…' : 'Subir imagen'}
                <input type="file" accept="image/jpeg,image/png,image/webp" className="hidden" onChange={handleImagen} disabled={subiendoImagen} />
              </label>
            </div>
          </div>

          <div className="rounded-xl border border-olive/15 bg-white/60 p-4">
            <h2 className="mb-3 font-medium text-navy">Presentaciones y precios</h2>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[720px] text-left text-sm">
                <thead className="text-xs uppercase tracking-wide text-ink/50">
                  <tr>
                    <th className="p-2">Presentación</th>
                    <th className="p-2">Contenido neto</th>
                    <th className="p-2">Precio (L)</th>
                    <th className="p-2">SKU</th>
                    <th className="p-2">Inventario</th>
                    <th className="p-2">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {producto.variantes.map((variante) => (
                    <VarianteRow key={variante.id} variante={variante} onActualizado={cargarProducto} />
                  ))}
                  <NuevaVarianteForm productoId={id} onCreada={cargarProducto} />
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
