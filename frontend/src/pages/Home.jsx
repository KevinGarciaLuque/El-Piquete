import Hero from '../components/sections/Hero';
import Productos from '../components/sections/Productos';
import Combos from '../components/sections/Combos';
import Beneficios from '../components/sections/Beneficios';
import Historia from '../components/sections/Historia';
import Preguntas from '../components/sections/Preguntas';

export default function Home() {
  return (
    <>
      <Hero />
      <Productos />
      <Combos />
      <Beneficios />
      <Historia />
      <Preguntas />
    </>
  );
}
