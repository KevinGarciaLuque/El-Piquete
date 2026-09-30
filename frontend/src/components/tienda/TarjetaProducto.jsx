import { useEffect, useRef, useState } from 'react';
import { useCart } from '../../context/CartContext';
import { formatoLempiras, imagenProducto } from '../../lib/tienda';
import MedidorPicante from './MedidorPicante';
import { Aparecer } from './Revelar';

function Disponibilidad({ cantidad }) {
  const disponible = cantidad > 0;
  return (
    <span className={`ep-disponible ${disponible ? '' : 'ep-disponible--agotado'}`}>
      <span className="ep-disponible__punto" />
      {disponible ? 'En existencia' : 'Agotado'}
    </span>
  );
}

// Tarjeta editorial de producto. Mantiene el mismo comportamiento de compra que la
// tarjeta anterior: añadir al carrito o comprar ahora (añade y abre el carrito).
export default function TarjetaProducto({ producto, formato = 'vertical', etiquetaPicante, insignia, retraso = 0 }) {
  const { addItem, abrirCarrito } = useCart();
  const [agregadoId, setAgregadoId] = useState(null);
  const temporizador = useRef(null);
  const marco = useRef(null);

  useEffect(() => () => clearTimeout(temporizador.current), []);

  function handleAgregar(variante) {
    addItem(producto, variante, 1);
    setAgregadoId(variante.id);
    clearTimeout(temporizador.current);
    temporizador.current = setTimeout(() => setAgregadoId((actual) => (actual === variante.id ? null : actual)), 1500);
  }

  function handleComprarAhora(variante) {
    addItem(producto, variante, 1);
    abrirCarrito();
  }

  // La luz sigue al cursor sobre la foto (solo con mouse; se escribe directo en CSS).
  function alMoverPuntero(evento) {
    if (evento.pointerType !== 'mouse') return;
    const caja = marco.current.getBoundingClientRect();
    marco.current.style.setProperty('--mx', ((evento.clientX - caja.left) / caja.width).toFixed(3));
    marco.current.style.setProperty('--my', ((evento.clientY - caja.top) / caja.height).toFixed(3));
  }

  const etiquetaInsignia = insignia ?? (producto.mas_vendido ? 'Más vendido' : null);

  return (
    <Aparecer as="article" retraso={retraso} className={`ep-tarjeta ep-tarjeta--${formato}`}>
      <div ref={marco} className="ep-tarjeta__foto" onPointerMove={alMoverPuntero}>
        <img src={imagenProducto(producto)} alt={producto.nombre} width="800" height="1000" loading="lazy" decoding="async" />
        <span className="ep-tarjeta__luz" aria-hidden="true" />
        {etiquetaInsignia && <span className="ep-insignia">{etiquetaInsignia}</span>}
      </div>

      <div className="ep-tarjeta__cuerpo">
        <MedidorPicante nivel={producto.nivel_picante} etiqueta={etiquetaPicante} />
        <h3 className="ep-tarjeta__nombre">{producto.nombre}</h3>
        <p className="ep-tarjeta__descripcion">{producto.descripcion}</p>

        <div className="ep-tarjeta__variantes">
          {producto.variantes.map((variante) => {
            const agotado = !variante.cantidad_disponible;
            return (
              <div key={variante.id} className="ep-variante">
                <div className="ep-variante__datos">
                  <span className="ep-variante__presentacion">{variante.presentacion}</span>
                  <span className="ep-variante__precio">{formatoLempiras.format(Number(variante.precio))}</span>
                  <Disponibilidad cantidad={variante.cantidad_disponible} />
                </div>
                <div className="ep-variante__acciones">
                  <button
                    type="button"
                    className="ep-boton ep-boton--primario"
                    disabled={agotado}
                    onClick={() => handleAgregar(variante)}
                  >
                    {agregadoId === variante.id ? 'Agregado ✓' : 'Añadir al carrito'}
                  </button>
                  <button
                    type="button"
                    className="ep-boton ep-boton--linea"
                    disabled={agotado}
                    onClick={() => handleComprarAhora(variante)}
                  >
                    Comprar ahora
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </Aparecer>
  );
}
