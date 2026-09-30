import { useEffect, useState } from 'react';

// Indica si el elemento está en pantalla; sirve para pausar animaciones decorativas fuera de vista.
export default function useEnVista(ref, margen = '120px 0px') {
  const [enVista, setEnVista] = useState(false);

  useEffect(() => {
    const elemento = ref.current;
    if (!elemento) return undefined;
    const observador = new IntersectionObserver(([entrada]) => setEnVista(entrada.isIntersecting), { rootMargin: margen });
    observador.observe(elemento);
    return () => observador.disconnect();
  }, [ref, margen]);

  return enVista;
}
