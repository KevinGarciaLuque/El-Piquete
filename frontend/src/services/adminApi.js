import axios from 'axios';

const TOKEN_KEY = 'elpiquete_admin_token';

const adminApi = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

adminApi.interceptors.request.use((config) => {
  const token = localStorage.getItem(TOKEN_KEY);
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

adminApi.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem(TOKEN_KEY);
      if (!window.location.pathname.startsWith('/admin/login')) {
        window.location.href = '/admin/login';
      }
    }
    return Promise.reject(error);
  },
);

export async function loginAdmin(correo, password) {
  const { data } = await adminApi.post('/auth/login', { correo, password });
  return data;
}

export async function obtenerPedidosAdmin(estado) {
  const { data } = await adminApi.get('/pedidos', { params: estado ? { estado } : undefined });
  return data;
}

export async function obtenerPedidoAdmin(codigo) {
  const { data } = await adminApi.get(`/pedidos/${codigo}`);
  return data;
}

export async function actualizarEstadoPedidoAdmin(id, estado) {
  const { data } = await adminApi.patch(`/pedidos/${id}/estado`, { estado });
  return data;
}

// Productos
export async function obtenerProductosAdmin() {
  const { data } = await adminApi.get('/admin/productos');
  return data;
}

export async function obtenerProductoAdmin(id) {
  const { data } = await adminApi.get(`/admin/productos/${id}`);
  return data;
}

export async function crearProductoAdmin(payload) {
  const { data } = await adminApi.post('/admin/productos', payload);
  return data;
}

export async function actualizarProductoAdmin(id, payload) {
  const { data } = await adminApi.put(`/admin/productos/${id}`, payload);
  return data;
}

export async function eliminarProductoAdmin(id) {
  const { data } = await adminApi.delete(`/admin/productos/${id}`);
  return data;
}

export async function subirImagenProductoAdmin(id, archivo) {
  const formData = new FormData();
  formData.append('imagen', archivo);
  const { data } = await adminApi.post(`/admin/productos/${id}/imagen`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return data;
}

export async function crearVarianteAdmin(productoId, payload) {
  const { data } = await adminApi.post(`/admin/productos/${productoId}/variantes`, payload);
  return data;
}

export async function actualizarVarianteAdmin(varianteId, payload) {
  const { data } = await adminApi.put(`/admin/productos/variantes/${varianteId}`, payload);
  return data;
}

export async function eliminarVarianteAdmin(varianteId) {
  const { data } = await adminApi.delete(`/admin/productos/variantes/${varianteId}`);
  return data;
}

export async function actualizarInventarioAdmin(varianteId, cantidad_disponible) {
  const { data } = await adminApi.patch(`/admin/productos/variantes/${varianteId}/inventario`, { cantidad_disponible });
  return data;
}

// Cupones
export async function obtenerCuponesAdmin() {
  const { data } = await adminApi.get('/admin/cupones');
  return data;
}

export async function crearCuponAdmin(payload) {
  const { data } = await adminApi.post('/admin/cupones', payload);
  return data;
}

export async function actualizarCuponAdmin(id, payload) {
  const { data } = await adminApi.put(`/admin/cupones/${id}`, payload);
  return data;
}

// Zonas de entrega
export async function obtenerZonasAdmin() {
  const { data } = await adminApi.get('/admin/zonas');
  return data;
}

export async function crearZonaAdmin(payload) {
  const { data } = await adminApi.post('/admin/zonas', payload);
  return data;
}

export async function actualizarZonaAdmin(id, payload) {
  const { data } = await adminApi.put(`/admin/zonas/${id}`, payload);
  return data;
}

// Reportes
export async function obtenerResumenReportes() {
  const { data } = await adminApi.get('/admin/reportes/resumen');
  return data;
}

export async function descargarPedidosCsv() {
  const { data } = await adminApi.get('/admin/reportes/pedidos.csv', { responseType: 'blob' });
  return data;
}

// Usuarios administradores
export async function obtenerUsuariosAdmin() {
  const { data } = await adminApi.get('/admin/usuarios');
  return data;
}

export async function crearUsuarioAdmin(payload) {
  const { data } = await adminApi.post('/admin/usuarios', payload);
  return data;
}

export async function actualizarUsuarioAdmin(id, payload) {
  const { data } = await adminApi.put(`/admin/usuarios/${id}`, payload);
  return data;
}

export async function cambiarPasswordUsuarioAdmin(id, password) {
  const { data } = await adminApi.patch(`/admin/usuarios/${id}/password`, { password });
  return data;
}

export async function eliminarUsuarioAdmin(id) {
  const { data } = await adminApi.delete(`/admin/usuarios/${id}`);
  return data;
}

export { TOKEN_KEY };
export default adminApi;
