import { Encabezado } from '../tienda/Revelar';
import TarjetaProducto from '../tienda/TarjetaProducto';
import LineaSalmuera from '../tienda/LineaSalmuera';
import { tieneFotoPropia } from '../../lib/tienda';
import { AvisoSinCatalogo, TarjetasCargando } from './Productos';

// El combo para negocio vive en su propia sección (Negocios); aquí van los de casa.
export default function Combos({ combos, estado }) {
  const deCasa = combos.filter((combo) => combo.slug !== 'combo-negocio');

  return (
    <section id="combos" className="ep-seccion ep-combos scroll-mt-24">
      <LineaSalmuera tono="crema" />
      <div className="ep-contenedor">
        <Encabezado
          kicker="05 · Para compartir"
          titulo="Arma tu mesa."
          lede="Combos para probar los tres niveles o tener siempre un frasco a mano."
        />

        {estado === 'cargando' && <TarjetasCargando cantidad={2} />}
        {estado === 'error' && <AvisoSinCatalogo que="los combos" />}

        {estado === 'listo' && (
          <>
            <div className="ep-combos__rejilla">
              {deCasa.map((combo, indice) => (
                <TarjetaProducto
                  key={combo.id}
                  producto={combo}
                  formato="paquete"
                  retraso={indice * 0.12}
                  etiquetaPicante={combo.slug === 'combo-para-probar' ? 'Suave, tradicional y picante' : undefined}
                />
              ))}
            </div>
            {deCasa.some((combo) => !tieneFotoPropia(combo)) && <p className="ep-nota">Imágenes de referencia.</p>}
          </>
        )}
      </div>
    </section>
  );
}
