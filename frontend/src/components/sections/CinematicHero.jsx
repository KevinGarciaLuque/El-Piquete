import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import useModoHero from '../../hooks/useModoHero';
import { cargarVideoHero, FUENTES_HERO, suscribirVideoHero } from '../../lib/videoHero';
import TextoDividido from '../cinematic/TextoDividido';
import '../cinematic/cinematic.css';

// Cada banda ocupa un tramo del progreso del scroll (0 a 1) sobre la película.
const BANDAS = [
  { rango: [0, 0.15], etiqueta: '01 · Ingrediente', texto: 'Todo comienza fresco.', entrada: 'enfoque' },
  { rango: [0.18, 0.32], etiqueta: '02 · Corte', texto: 'Seleccionamos cada ingrediente.', entrada: 'caida' },
  { rango: [0.35, 0.49], etiqueta: '03 · Mezcla', texto: 'Color. Textura. Picante.', entrada: 'golpe' },
  { rango: [0.52, 0.66], etiqueta: '04 · Salmuera', texto: 'El equilibrio está en cada detalle.', entrada: 'burbuja' },
  { rango: [0.69, 0.82], etiqueta: '05 · Frasco', texto: 'Preparado artesanalmente.', entrada: 'empaque' },
];
const RANGO_CIERRE = [0.85, 1];
const RAMPA_CIERRE = 0.07;

const MICRO = 'Encurtidos artesanales · Tegucigalpa';
const TITULAR = 'El sabor que transforma cada comida.';
const SUBTITULO = 'Encurtidos artesanales preparados con ingredientes frescos y el nivel de picante perfecto.';

// Cada versión de la película: horizontal para escritorio y vertical (9:16) para celular.
const RECURSOS = {
  video: {
    fuente: FUENTES_HERO.video,
    poster: '/cinematic/hero-poster.webp',
    posterAncho: 1728,
    posterAlto: 972,
    final: '/cinematic/hero-ending.webp',
  },
  movil: {
    fuente: FUENTES_HERO.movil,
    poster: '/cinematic/hero-poster-movil.webp',
    posterAncho: 540,
    posterAlto: 960,
    final: '/cinematic/hero-ending-movil.webp',
  },
};

// Tres cuadros de la película para la portada fija de teléfonos.
const TIRA = [
  { imagen: '/media/tira-1-fresco.webp', texto: 'Todo comienza fresco.' },
  { imagen: '/media/tira-2-salmuera.webp', texto: 'El equilibrio está en cada detalle.' },
  { imagen: '/media/tira-3-frasco.webp', texto: 'Preparado artesanalmente.' },
];
const SUAVIZADO = 0.16; // por cuadro a 60 fps; se normaliza para pantallas de 120 Hz

const limitar = (valor, minimo, maximo) => Math.min(maximo, Math.max(minimo, valor));
const suavizar = (p, desde, hasta) => {
  const t = limitar((p - desde) / (hasta - desde), 0, 1);
  return t * t * (3 - 2 * t);
};

// Oscurece el header mientras la portada ocupa la parte superior y deja que la
// portada suba por detrás de él.
function useHeaderSobreHero(seccionRef) {
  useEffect(() => {
    const seccion = seccionRef.current;
    const raiz = document.documentElement;
    const header = document.querySelector('.site-header');

    const medirHeader = () => seccion.style.setProperty('--cine-header', `${header?.offsetHeight ?? 0}px`);
    medirHeader();
    const observadorHeader = header ? new ResizeObserver(medirHeader) : null;
    observadorHeader?.observe(header);

    const observador = new IntersectionObserver(
      ([entrada]) => {
        if (entrada.isIntersecting) raiz.dataset.heroActivo = '';
        else delete raiz.dataset.heroActivo;
      },
      { rootMargin: '0px 0px -92% 0px' },
    );
    observador.observe(seccion);

    return () => {
      observadorHeader?.disconnect();
      observador.disconnect();
      delete raiz.dataset.heroActivo;
    };
  }, [seccionRef]);
}

function Acciones({ refAcciones, primero }) {
  const comprar = (
    <Link key="comprar" to="/#productos" className={`cine-btn ${primero === 'comprar' ? 'cine-btn--primario' : 'cine-btn--fantasma'}`}>
      Comprar ahora
    </Link>
  );
  const descubrir = (
    <Link key="descubrir" to="/#picante" className={`cine-btn ${primero === 'descubrir' ? 'cine-btn--primario' : 'cine-btn--fantasma'}`}>
      Descubrir El Piquete
    </Link>
  );

  return (
    <div ref={refAcciones} className="cine-acciones">
      {primero === 'comprar' ? [comprar, descubrir] : [descubrir, comprar]}
    </div>
  );
}

function HeroConVideo({ variante }) {
  const recursos = RECURSOS[variante];
  const seccionRef = useRef(null);
  const escenarioRef = useRef(null);
  const posterRef = useRef(null);
  const imagenFinalRef = useRef(null);
  const videoRef = useRef(null);
  const accionesRef = useRef(null);
  const barraRef = useRef(null);
  const anilloRef = useRef(null);
  const bandasRef = useRef([]);

  useHeaderSobreHero(seccionRef);

  useEffect(() => {
    const seccion = seccionRef.current;
    const escenario = escenarioRef.current;
    const poster = posterRef.current;
    const imagenFinal = imagenFinalRef.current;
    const video = videoRef.current;
    const acciones = accionesRef.current;
    const barra = barraRef.current;
    const anillo = anilloRef.current;

    const bandas = bandasRef.current.map((elemento) => ({
      elemento,
      a: Number(elemento.dataset.a),
      b: Number(elemento.dataset.b),
      rampa: Number(elemento.dataset.rampa) || 0,
      opacidad: -1,
      k: -1,
    }));
    const cierre = bandas[bandas.length - 1];

    let objetivo = 0;
    let mostrado = 0;
    let rafId = null;
    let ultimoTick = 0;
    let enPantalla = true;
    let inicioSeccion = 0;
    let recorrido = 1;
    let cargaK = 0;
    const inicioCarga = performance.now();

    let faseVideo = 'inactivo';
    let videoListo = false;
    let seekOcupado = false;
    let tiempoPendiente = null;

    let ultimaBarra = -1;
    let accionesActivas = null;
    const clases = {};

    function alternarClase(nombre, activa) {
      if (clases[nombre] === activa) return;
      clases[nombre] = activa;
      escenario.classList.toggle(nombre, activa);
    }

    function medir() {
      inicioSeccion = seccion.getBoundingClientRect().top + window.scrollY;
      recorrido = Math.max(1, seccion.offsetHeight - window.innerHeight);
    }

    const progresoActual = () => limitar((window.scrollY - inicioSeccion) / recorrido, 0, 1);

    // Nunca se pide un salto de tiempo mientras otro sigue en curso: se guarda solo el
    // más reciente y se lanza al terminar el anterior.
    function pedirSeek(tiempo) {
      if (!videoListo) return;
      const destino = limitar(tiempo, 0, video.duration - 0.05);
      if (seekOcupado) {
        tiempoPendiente = destino;
        return;
      }
      if (Math.abs(video.currentTime - destino) < 0.02) return;
      seekOcupado = true;
      video.currentTime = destino;
    }

    function alTerminarSeek() {
      seekOcupado = false;
      if (tiempoPendiente !== null) {
        const tiempo = tiempoPendiente;
        tiempoPendiente = null;
        pedirSeek(tiempo);
      }
    }

    function alFallarVideo() {
      // Liberar la compuerta evita que el scrub quede congelado para siempre.
      seekOcupado = false;
      tiempoPendiente = null;
      videoListo = false;
      alternarClase('con-video', false);
      alternarClase('sin-video', true);
      actualizar(mostrado);
    }

    function alPoderMostrar() {
      if (videoListo) return;
      videoListo = true;
      alternarClase('con-video', true);
      pedirSeek(mostrado * video.duration);
    }

    function actualizar(p) {
      for (const banda of bandas) {
        const { a, b } = banda;
        const rampaBorde = Math.min(0.02, (b - a) / 3);
        const entrada = a === 0 ? 1 : suavizar(p, a, a + rampaBorde);
        const salida = b === 1 ? 1 : 1 - suavizar(p, b - rampaBorde, b);
        const opacidad = entrada * salida;

        const rampa = banda.rampa || Math.min(0.025, (b - a) * 0.35);
        let k = limitar((p - a) / rampa, 0, 1);
        if (a === 0) k = Math.max(k, cargaK);

        if (opacidad !== banda.opacidad && (Math.abs(opacidad - banda.opacidad) > 0.004 || opacidad === 0 || opacidad === 1)) {
          banda.opacidad = opacidad;
          banda.elemento.style.opacity = opacidad.toFixed(3);
        }
        if (k !== banda.k && (Math.abs(k - banda.k) > 0.008 || k === 0 || k === 1)) {
          banda.k = k;
          banda.elemento.style.setProperty('--k', k.toFixed(3));
        }
      }

      // Los botones del cierre solo se pueden enfocar o pulsar cuando están a la vista.
      const activas = cierre.opacidad > 0.5 && cierre.k > 0.78;
      if (activas !== accionesActivas) {
        accionesActivas = activas;
        acciones.inert = !activas;
        cierre.elemento.toggleAttribute('data-activa', activas);
      }

      if (Math.abs(p - ultimaBarra) > 0.002 || ((p === 0 || p === 1) && p !== ultimaBarra)) {
        ultimaBarra = p;
        barra.style.setProperty('--p', p.toFixed(4));
      }

      alternarClase('paso-inicio', p > 0.02);

      // Mientras el video no está disponible, la foto del frasco acompaña el cierre.
      if (!videoListo && p > 0.6 && !imagenFinal.getAttribute('src')) imagenFinal.src = recursos.final;
      alternarClase('muestra-final', !videoListo && p > 0.8);
    }

    function tick(ahora) {
      const dt = Math.min(100, ahora - (ultimoTick || ahora));
      ultimoTick = ahora;
      mostrado += (objetivo - mostrado) * (1 - Math.pow(1 - SUAVIZADO, dt / 16.667));
      const convergido = Math.abs(objetivo - mostrado) < 0.0005;
      if (convergido) mostrado = objetivo;

      const t = Math.min(1, (ahora - inicioCarga) / 1400);
      cargaK = 1 - Math.pow(1 - t, 3);

      pedirSeek(mostrado * video.duration);
      actualizar(mostrado);

      if (convergido && cargaK >= 1) {
        rafId = null;
        ultimoTick = 0;
      } else {
        rafId = requestAnimationFrame(tick);
      }
    }

    function despertar() {
      if (rafId === null && enPantalla) rafId = requestAnimationFrame(tick);
    }

    function alHacerScroll() {
      objetivo = progresoActual();
      despertar();
    }

    function alRedimensionar() {
      medir();
      alHacerScroll();
    }

    medir();
    objetivo = progresoActual();
    mostrado = objetivo;
    actualizar(mostrado);
    despertar();

    window.addEventListener('scroll', alHacerScroll, { passive: true });
    window.addEventListener('resize', alRedimensionar);
    const observadorTamano = new ResizeObserver(alRedimensionar);
    observadorTamano.observe(seccion);

    const observadorVisibilidad = new IntersectionObserver(([entrada]) => {
      enPantalla = entrada.isIntersecting;
      if (enPantalla) {
        alHacerScroll();
      } else if (rafId !== null) {
        cancelAnimationFrame(rafId);
        rafId = null;
        ultimoTick = 0;
      }
    });
    observadorVisibilidad.observe(seccion);

    video.addEventListener('seeked', alTerminarSeek);
    video.addEventListener('error', alFallarVideo);
    // Safari en iOS no pinta cuadros de un video que nunca se reprodujo: un play y pausa
    // silenciosos al cargar lo habilitan para los saltos de tiempo.
    function desbloquear() {
      const intento = video.play();
      if (intento) intento.then(() => video.pause()).catch(() => {});
    }

    video.addEventListener('loadeddata', alPoderMostrar);
    video.addEventListener('canplay', alPoderMostrar);
    video.addEventListener('loadedmetadata', desbloquear);
    if (video.readyState >= 2 && video.currentSrc) alPoderMostrar();

    const desuscribir = suscribirVideoHero(recursos.fuente, (estadoVideo) => {
      anillo.style.setProperty('--ld', (126 * (1 - estadoVideo.progreso)).toFixed(1));
      if (estadoVideo.fase === faseVideo) return;
      faseVideo = estadoVideo.fase;
      alternarClase('cargando-video', faseVideo === 'cargando');
      if (faseVideo === 'listo' && video.src !== estadoVideo.url) {
        video.preload = 'auto';
        video.src = estadoVideo.url;
        video.load();
      }
      if (faseVideo === 'fallido') alFallarVideo();
    });

    // El póster gana la carrera por el ancho de banda: el video empieza a bajar
    // cuando el póster ya está pintado (o falló, o tardó demasiado).
    let videoIniciado = false;
    const iniciarVideo = () => {
      if (videoIniciado) return;
      videoIniciado = true;
      cargarVideoHero(recursos.fuente);
    };
    if (poster.complete) iniciarVideo();
    poster.addEventListener('load', iniciarVideo);
    poster.addEventListener('error', iniciarVideo);
    const respaldo = setTimeout(iniciarVideo, 4000);

    return () => {
      if (rafId !== null) cancelAnimationFrame(rafId);
      clearTimeout(respaldo);
      window.removeEventListener('scroll', alHacerScroll);
      window.removeEventListener('resize', alRedimensionar);
      observadorTamano.disconnect();
      observadorVisibilidad.disconnect();
      video.removeEventListener('seeked', alTerminarSeek);
      video.removeEventListener('error', alFallarVideo);
      video.removeEventListener('loadeddata', alPoderMostrar);
      video.removeEventListener('canplay', alPoderMostrar);
      video.removeEventListener('loadedmetadata', desbloquear);
      poster.removeEventListener('load', iniciarVideo);
      poster.removeEventListener('error', iniciarVideo);
      desuscribir();
    };
  }, [recursos]);

  const marcas = [...BANDAS.map((banda) => banda.rango[0]), RANGO_CIERRE[0]];

  return (
    <section id="inicio" ref={seccionRef} className={`cine-hero cine-hero--${variante}`} aria-label="De ingredientes frescos a un frasco de El Piquete">
      <div ref={escenarioRef} className="cine-escenario">
        <div className="cine-marco">
          <img
            ref={posterRef}
            className="cine-capa cine-poster"
            src={recursos.poster}
            alt=""
            width={recursos.posterAncho}
            height={recursos.posterAlto}
            fetchPriority="high"
          />
          <img ref={imagenFinalRef} className="cine-capa cine-imagen-final" alt="" decoding="async" />
          <video
            ref={videoRef}
            className="cine-capa cine-video"
            muted
            playsInline
            preload="none"
            aria-hidden="true"
            tabIndex={-1}
          />
          <div className="cine-velo" aria-hidden="true" />
        </div>

        {BANDAS.map((banda, indice) => (
          <div
            key={banda.texto}
            ref={(elemento) => (bandasRef.current[indice] = elemento)}
            className={`cine-banda cine-banda--${banda.entrada}`}
            data-a={banda.rango[0]}
            data-b={banda.rango[1]}
          >
            <span className="cine-etiqueta">{banda.etiqueta}</span>
            {banda.entrada === 'enfoque' ? (
              <p className="cine-caption cine-enfoque">
                <span className="cine-enfoque__nitido">{banda.texto}</span>
                <span className="cine-enfoque__suave" aria-hidden="true">
                  {banda.texto}
                </span>
              </p>
            ) : (
              <TextoDividido texto={banda.texto} semilla={indice + 7} className="cine-caption" />
            )}
          </div>
        ))}

        <div
          ref={(elemento) => (bandasRef.current[BANDAS.length] = elemento)}
          className="cine-banda cine-banda--cierre"
          data-a={RANGO_CIERRE[0]}
          data-b={RANGO_CIERRE[1]}
          data-rampa={RAMPA_CIERRE}
        >
          <span className="cine-etiqueta">{MICRO}</span>
          <TextoDividido as="h1" texto={TITULAR} semilla={31} className="cine-titular" />
          <p className="cine-subtitulo">{SUBTITULO}</p>
          <Acciones refAcciones={accionesRef} primero="descubrir" />
        </div>

        <div ref={barraRef} className="cine-recorrido" aria-hidden="true">
          <span className="cine-recorrido__relleno" />
          {marcas.map((marca) => (
            <span key={marca} className="cine-recorrido__marca" style={{ top: `${marca * 100}%` }} />
          ))}
        </div>

        <div className="cine-indicador" aria-hidden="true">
          <svg ref={anilloRef} className="cine-anillo" viewBox="0 0 48 48">
            <circle cx="24" cy="24" r="20" className="cine-anillo__pista" />
            <circle cx="24" cy="24" r="20" className="cine-anillo__progreso" />
            <path d="M18 21l6 6 6-6" className="cine-anillo__flecha" />
          </svg>
          <span>Desliza</span>
        </div>
      </div>
    </section>
  );
}

function HeroEstatico() {
  const seccionRef = useRef(null);
  useHeaderSobreHero(seccionRef);

  return (
    <section id="inicio" ref={seccionRef} className="cine-estatica">
      <div className="cine-estatica__media">
        <picture>
          <source media="(orientation: portrait)" type="image/webp" srcSet="/cinematic/hero-ending-portrait.webp" />
          <source media="(orientation: portrait)" srcSet="/cinematic/hero-ending-portrait.jpg" />
          <source type="image/webp" srcSet="/cinematic/hero-ending.webp" />
          <img
            src="/cinematic/hero-ending.jpg"
            alt="Frasco de Encurtidos El Piquete con zanahoria, cebolla morada y jalapeño en salmuera"
            width="1920"
            height="1086"
            fetchPriority="high"
          />
        </picture>
      </div>
      <div className="cine-estatica__texto">
        <span className="cine-etiqueta">{MICRO}</span>
        <h1 className="cine-titular">{TITULAR}</h1>
        <p className="cine-subtitulo">{SUBTITULO}</p>
        <Acciones primero="comprar" />
      </div>
      <div className="cine-tira">
        <p className="cine-etiqueta">De la tabla al frasco</p>
        <ol className="cine-tira__lista">
          {TIRA.map((cuadro) => (
            <li key={cuadro.imagen} className="cine-tira__cuadro">
              <img src={cuadro.imagen} alt="" width="720" height="900" loading="lazy" decoding="async" />
              <span>{cuadro.texto}</span>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

export default function CinematicHero() {
  const modo = useModoHero();
  if (modo === 'estatico') return <HeroEstatico />;
  // La clave fuerza un montaje nuevo al cambiar de versión (por ejemplo al rotar una tableta).
  return <HeroConVideo key={modo} variante={modo} />;
}
