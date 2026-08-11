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
    document.getElementById(location.hash.slice(1))?.scrollIntoView({ behavior: 'smooth' });
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
