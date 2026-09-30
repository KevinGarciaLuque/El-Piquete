import { Link } from 'react-router-dom';
import { buildWhatsAppLink } from '../../lib/whatsapp';
import { Aparecer, TituloRevelado } from '../tienda/Revelar';
import LineaSalmuera from '../tienda/LineaSalmuera';

export default function Cierre() {
  return (
    <section id="pedido" className="ep-seccion ep-oscura ep-cierre scroll-mt-24">
      <LineaSalmuera />
      <picture className="ep-cierre__fondo" aria-hidden="true">
        <source media="(orientation: portrait)" type="image/webp" srcSet="/cinematic/hero-ending-portrait.webp" />
        <img src="/cinematic/hero-ending.webp" alt="" width="1920" height="1086" loading="lazy" decoding="async" />
      </picture>

      <div className="ep-contenedor ep-cierre__contenido">
        <TituloRevelado texto="Tu próxima comida merece un piquete." />
        <Aparecer as="p" className="ep-lede" retraso={0.25}>
          Entregas en Tegucigalpa. Pago contra entrega en zonas seleccionadas.
        </Aparecer>
        <Aparecer className="ep-cierre__acciones" retraso={0.35}>
          <Link to="/#productos" className="ep-boton ep-boton--primario ep-boton--grande">
            Comprar ahora
          </Link>
          <a
            href={buildWhatsAppLink('¡Hola! Quiero hacer un pedido de Encurtidos El Piquete.')}
            target="_blank"
            rel="noopener noreferrer"
            className="ep-boton ep-boton--fantasma ep-boton--grande"
          >
            Pedir por WhatsApp
          </a>
        </Aparecer>
        <Aparecer as="ul" className="ep-cierre__confianza" retraso={0.45}>
          <li>Hecho por lotes</li>
          <li>Entregas en Tegucigalpa</li>
          <li>Pedidos por WhatsApp</li>
        </Aparecer>
      </div>
    </section>
  );
}
