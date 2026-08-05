import { useEffect, useState } from 'react';
import { obtenerProductos } from '../services/api';

export default function useProductos() {
  const [productos, setProductos] = useState([]);
  const [estado, setEstado] = useState('cargando');

  useEffect(() => {
    let activo = true;

    obtenerProductos()
      .then((datos) => {
        if (!activo) return;
        setProductos(datos);
        setEstado('listo');
      })
      .catch(() => {
        if (activo) setEstado('error');
      });

    return () => {
      activo = false;
    };
  }, []);

  return {
    productos,
    estado,
    individuales: productos.filter((producto) => producto.tipo === 'individual'),
    combos: productos.filter((producto) => producto.tipo === 'combo'),
  };
}
