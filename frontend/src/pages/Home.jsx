import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Hero from '../components/sections/Hero';
import Productos from '../components/sections/Productos';
import Combos from '../components/sections/Combos';
import Beneficios from '../components/sections/Beneficios';
import Historia from '../components/sections/Historia';
import Opiniones from '../components/sections/Opiniones';
import Preguntas from '../components/sections/Preguntas';
import useProductos from '../hooks/useProductos';

export default function Home() {
  const { individuales, combos, estado } = useProductos();
  const location = useLocation();

  useEffect(() => {
    if (!location.hash) return;
    const id = location.hash.slice(1);
    // Se espera a que termine de cerrarse el menú móvil (animación de 250ms) antes de
    // calcular la posición de scroll; si no, el cálculo incluye el espacio del menú
    // todavía abierto y el scroll se pasa de largo una vez este colapsa.
    const timer = setTimeout(() => {
      document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    }, 300);
    return () => clearTimeout(timer);
  }, [location.hash]);

  return (
    <>
      <Hero />
      <Productos productos={individuales} estado={estado} />
      <Combos combos={combos} estado={estado} />
      <Beneficios />
      <Historia />
      <Opiniones />
      <Preguntas />
    </>
  );
}
