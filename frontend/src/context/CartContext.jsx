import { createContext, useContext, useEffect, useMemo, useState } from 'react';

const CartContext = createContext(null);
const STORAGE_KEY = 'elpiquete_cart';

function leerCarritoGuardado() {
  try {
    const guardado = localStorage.getItem(STORAGE_KEY);
    return guardado ? JSON.parse(guardado) : [];
  } catch {
    return [];
  }
}

export function CartProvider({ children }) {
  const [items, setItems] = useState(leerCarritoGuardado);
  const [abierto, setAbierto] = useState(false);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  function addItem(producto, variante, cantidad = 1) {
    setItems((actuales) => {
      const existente = actuales.find((item) => item.varianteId === variante.id);
      const limite = variante.cantidad_disponible ?? Infinity;

      if (existente) {
        return actuales.map((item) =>
          item.varianteId === variante.id
            ? { ...item, cantidad: Math.min(item.cantidad + cantidad, limite) }
            : item,
        );
      }

      return [
        ...actuales,
        {
          varianteId: variante.id,
          productoId: producto.id,
          nombre: producto.nombre,
          presentacion: variante.presentacion,
          precio: Number(variante.precio),
          sku: variante.sku,
          disponible: limite,
          cantidad: Math.min(cantidad, limite),
        },
      ];
    });
  }

  function removeItem(varianteId) {
    setItems((actuales) => actuales.filter((item) => item.varianteId !== varianteId));
  }

  function setQty(varianteId, cantidad) {
    setItems((actuales) =>
      actuales
        .map((item) =>
          item.varianteId === varianteId
            ? { ...item, cantidad: Math.min(Math.max(cantidad, 1), item.disponible ?? Infinity) }
            : item,
        )
        .filter((item) => item.cantidad > 0),
    );
  }

  function clear() {
    setItems([]);
  }

  const totalItems = items.reduce((total, item) => total + item.cantidad, 0);
  const subtotal = items.reduce((total, item) => total + item.cantidad * item.precio, 0);

  const value = useMemo(
    () => ({
      items,
      totalItems,
      subtotal,
      addItem,
      removeItem,
      setQty,
      clear,
      abierto,
      abrirCarrito: () => setAbierto(true),
      cerrarCarrito: () => setAbierto(false),
      alternarCarrito: () => setAbierto((valor) => !valor),
    }),
    [items, totalItems, subtotal, abierto],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const contexto = useContext(CartContext);
  if (!contexto) throw new Error('useCart debe usarse dentro de CartProvider');
  return contexto;
}
