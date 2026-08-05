import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

export async function obtenerProductos() {
  const { data } = await api.get('/productos');
  return data;
}

export async function obtenerZonasEntrega() {
  const { data } = await api.get('/zonas-entrega');
  return data;
}

export async function crearPedido(payload) {
  const { data } = await api.post('/pedidos', payload);
  return data;
}

export default api;
