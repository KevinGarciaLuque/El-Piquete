import { useEffect, useState } from 'react';
import { obtenerOpiniones } from '../services/api';

export default function useOpiniones() {
  const [opiniones, setOpiniones] = useState([]);
  const [estado, setEstado] = useState('cargando');

  useEffect(() => {
    let activo = true;

    obtenerOpiniones()
      .then((datos) => {
        if (!activo) return;
        setOpiniones(datos);
        setEstado('listo');
      })
      .catch(() => {
        if (activo) setEstado('error');
      });

    return () => {
      activo = false;
    };
  }, []);

  return { opiniones, estado };
}
