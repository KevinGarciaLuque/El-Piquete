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

export { TOKEN_KEY };
export default adminApi;
