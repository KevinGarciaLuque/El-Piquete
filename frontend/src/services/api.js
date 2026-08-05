import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

export async function obtenerProductos() {
  const { data } = await api.get('/productos');
  return data;
}

export default api;
