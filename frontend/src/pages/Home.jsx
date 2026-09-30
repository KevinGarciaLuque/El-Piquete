import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { MotionConfig } from 'framer-motion';
import CinematicHero from '../components/sections/CinematicHero';
import Productos from '../components/sections/Productos';
import Picante from '../components/sections/Picante';
import Ingredientes from '../components/sections/Ingredientes';
import ConQueSeCome from '../components/sections/ConQueSeCome';
import Combos from '../components/sections/Combos';
import Historia from '../components/sections/Historia';
import Proceso from '../components/sections/Proceso';
import Negocios from '../components/sections/Negocios';
import Opiniones from '../components/sections/Opiniones';
import Preguntas from '../components/sections/Preguntas';
import Cierre from '../components/sections/Cierre';
import useProductos from '../hooks/useProductos';
import '../components/tienda/tienda.css';

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

  // Con la pestaña oculta se pausan todas las animaciones decorativas en bucle.
  useEffect(() => {
    const alCambiarVisibilidad = () => document.body.classList.toggle('ep-pausado', document.hidden);
    document.addEventListener('visibilitychange', alCambiarVisibilidad);
    return () => {
      document.removeEventListener('visibilitychange', alCambiarVisibilidad);
      document.body.classList.remove('ep-pausado');
    };
  }, []);

  return (
    <MotionConfig reducedMotion="user">
      <div className="ep-tienda">
        <CinematicHero />
        <Productos productos={individuales} estado={estado} />
        <Picante productos={individuales} />
        <Ingredientes />
        <ConQueSeCome />
        <Combos combos={combos} estado={estado} />
        <Historia />
        <Proceso />
        <Negocios combos={combos} />
        <Opiniones />
        <Preguntas />
        <Cierre />
        <div className="ep-grano" aria-hidden="true" />
      </div>
    </MotionConfig>
  );
}
