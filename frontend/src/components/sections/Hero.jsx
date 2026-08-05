import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import encurtido from '../../assets/encurtido.png';
import logo from '../../assets/logo.jpeg';
import Button from '../ui/Button';

gsap.registerPlugin(ScrollTrigger);

export default function Hero() {
  const imagenRef = useRef(null);

  useEffect(() => {
    const contexto = gsap.context(() => {
      gsap.to(imagenRef.current, {
        yPercent: 12,
        ease: 'none',
        scrollTrigger: {
          trigger: imagenRef.current,
          start: 'top top',
          end: 'bottom top',
          scrub: true,
        },
      });
    });

    return () => contexto.revert();
  }, []);

  return (
    <section id="inicio" className="relative overflow-hidden bg-cream pt-10 sm:pt-16">
      <div className="mx-auto grid max-w-6xl items-center gap-10 px-4 pb-16 sm:px-6 md:grid-cols-2 md:gap-8 md:pb-24">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="flex flex-col items-start gap-6"
        >
          <span className="rounded-full bg-olive/15 px-4 py-1 text-xs font-semibold uppercase tracking-wider text-olive-dark">
            Encurtidos artesanales
          </span>
          <h1 className="font-display text-4xl font-semibold leading-tight text-navy sm:text-5xl">
            El sabor que transforma cada comida
          </h1>
          <p className="max-w-md text-base text-ink/80 sm:text-lg">
            Encurtidos artesanales preparados con ingredientes seleccionados, frescos, crujientes y con el nivel de
            picante perfecto.
          </p>
          <div className="flex flex-wrap gap-3">
            <Button as="a" href="#productos" variant="primary">
              Comprar encurtidos
            </Button>
            <Button as="a" href="#nosotros" variant="outline">
              Conocer nuestros ingredientes
            </Button>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, ease: 'easeOut', delay: 0.15 }}
          className="relative mx-auto flex aspect-square w-full max-w-sm items-center justify-center"
        >
          <div className="absolute inset-0 rounded-full bg-gradient-to-br from-olive/20 via-carrot/15 to-chili/15 blur-2xl" />
          <div ref={imagenRef} className="relative aspect-square w-4/5 overflow-hidden rounded-full border-8 border-white bg-white shadow-2xl shadow-olive-dark/20">
            <img
              src={encurtido}
              alt="Frasco de encurtido artesanal El Piquete"
              className="h-full w-full object-cover"
              style={{ transform: 'scale(1.3)', transformOrigin: '70% 35%' }}
            />
            <div className="absolute bottom-4 left-4 h-16 w-16 -rotate-6 overflow-hidden rounded-full border-4 border-white shadow-lg">
              <img src={logo} alt="" className="h-full w-full object-cover" />
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
