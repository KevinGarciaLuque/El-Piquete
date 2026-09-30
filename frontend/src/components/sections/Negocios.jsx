import { formatoLempiras } from '../../lib/tienda';
import { buildWhatsAppLink } from '../../lib/whatsapp';
import { Aparecer, Encabezado, ImagenRevelada } from '../tienda/Revelar';
import LineaSalmuera from '../tienda/LineaSalmuera';

export default function Negocios({ combos }) {
  const producto = combos.find((combo) => combo.slug === 'combo-negocio');

  return (
    <section id="negocios" className="ep-seccion ep-oscura ep-negocios scroll-mt-24">
      <LineaSalmuera />
      <div className="ep-contenedor ep-negocios__grid">
        <div className="ep-negocios__media">
          <ImagenRevelada
            src="/media/C3-negocio.webp"
            alt="Caja de madera con doce frascos de encurtido sobre el mesón de una cocina profesional"
            className="ep-negocios__principal"
            ancho="1600"
            alto="905"
          />
          <ImagenRevelada
            src="/media/F1-plato.webp"
            alt="Pollo con tajadas servido con encurtido de zanahoria, cebolla y jalapeño"
            className="ep-negocios__inserto"
            ancho="1600"
            alto="905"
            retraso={0.25}
          />
        </div>

        <div className="ep-negocios__texto">
          <Encabezado
            claro
            kicker="08 · Restaurantes y negocios"
            titulo="Que tus clientes pregunten por el encurtido."
            lede="Presentaciones de 6 y 12 frascos para restaurantes, comedores y ventas de comida. Precio mayorista según volumen."
          />

          {producto ? (
            <Aparecer as="ul" className="ep-negocios__opciones" retraso={0.2}>
              {producto.variantes.map((variante) => (
                <li key={variante.id} className="ep-negocios__opcion">
                  <span className="ep-negocios__presentacion">{variante.presentacion}</span>
                  <span className="ep-negocios__precio">{formatoLempiras.format(Number(variante.precio))}</span>
                  <a
                    className="ep-boton ep-boton--primario"
                    target="_blank"
                    rel="noopener noreferrer"
                    href={buildWhatsAppLink(
                      `¡Hola! Quiero solicitar una cotización de ${producto.nombre} (${variante.presentacion}).`,
                    )}
                  >
                    Cotizar por WhatsApp
                  </a>
                </li>
              ))}
            </Aparecer>
          ) : (
            <Aparecer retraso={0.2}>
              <a
                className="ep-boton ep-boton--primario ep-boton--grande"
                target="_blank"
                rel="noopener noreferrer"
                href={buildWhatsAppLink('¡Hola! Quiero solicitar una cotización de encurtidos para mi negocio.')}
              >
                Cotizar por WhatsApp
              </a>
            </Aparecer>
          )}
          <p className="ep-nota ep-nota--clara">Precio final sujeto a cotización.</p>
        </div>
      </div>
    </section>
  );
}
