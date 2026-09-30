import { Encabezado } from '../tienda/Revelar';
import TarjetaProducto from '../tienda/TarjetaProducto';
import { ORDEN_NIVELES, tieneFotoPropia } from '../../lib/tienda';
import { buildWhatsAppLink } from '../../lib/whatsapp';
import LineaSalmuera from '../tienda/LineaSalmuera';

function ordenar(productos) {
  return [...productos].sort(
    (a, b) =>
      Number(b.mas_vendido) - Number(a.mas_vendido) ||
      ORDEN_NIVELES.indexOf(a.nivel_picante) - ORDEN_NIVELES.indexOf(b.nivel_picante),
  );
}

export function AvisoSinCatalogo({ que }) {
  return (
    <p className="ep-aviso">
      No pudimos cargar {que} en este momento.{' '}
      <a href={buildWhatsAppLink('¡Hola! Quiero hacer un pedido de Encurtidos El Piquete.')} target="_blank" rel="noopener noreferrer">
        Escríbenos por WhatsApp
      </a>{' '}
      y te ayudamos con tu pedido.
    </p>
  );
}

export function TarjetasCargando({ cantidad = 3 }) {
  return (
    <div className="ep-cargando" aria-label="Cargando productos">
      {Array.from({ length: cantidad }, (_, indice) => (
        <span key={indice} className="ep-cargando__tarjeta" />
      ))}
    </div>
  );
}

export default function Productos({ productos, estado }) {
  const lista = ordenar(productos);
  const [destacado, ...resto] = lista;

  return (
    <section id="productos" className="ep-seccion ep-productos scroll-mt-24">
      <LineaSalmuera tono="crema" />
      <div className="ep-contenedor">
        <Encabezado
          kicker="02 · La colección"
          titulo="Tres frascos. Un mismo origen."
          lede="La misma receta de cebolla, zanahoria y jalapeño, en tres niveles de picante. Preparada por lotes para que llegue crujiente a tu mesa."
        />

        {estado === 'cargando' && <TarjetasCargando />}
        {estado === 'error' && <AvisoSinCatalogo que="los productos" />}

        {estado === 'listo' && destacado && (
          <>
            <div className="ep-productos__rejilla">
              <TarjetaProducto producto={destacado} formato="destacada" />
              <div className="ep-productos__pila">
                {resto.map((producto, indice) => (
                  <TarjetaProducto key={producto.id} producto={producto} formato="horizontal" retraso={0.12 * (indice + 1)} />
                ))}
              </div>
            </div>
            {lista.some((producto) => !tieneFotoPropia(producto)) && <p className="ep-nota">Imágenes de referencia.</p>}
          </>
        )}
      </div>
    </section>
  );
}
