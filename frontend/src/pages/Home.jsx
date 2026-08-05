import Hero from '../components/sections/Hero';
import Productos from '../components/sections/Productos';
import Combos from '../components/sections/Combos';
import Beneficios from '../components/sections/Beneficios';
import Historia from '../components/sections/Historia';
import Preguntas from '../components/sections/Preguntas';
import useProductos from '../hooks/useProductos';

export default function Home() {
  const { individuales, combos, estado } = useProductos();

  return (
    <>
      <Hero />
      <Productos productos={individuales} estado={estado} />
      <Combos combos={combos} estado={estado} />
      <Beneficios />
      <Historia />
      <Preguntas />
    </>
  );
}
