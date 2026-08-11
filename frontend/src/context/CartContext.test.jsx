import { act, renderHook } from '@testing-library/react';
import { beforeEach, describe, expect, it } from 'vitest';
import { CartProvider, useCart } from './CartContext';

const STORAGE_KEY = 'elpiquete_cart';

function wrapper({ children }) {
  return <CartProvider>{children}</CartProvider>;
}

const producto = { id: 1, nombre: 'Encurtido tradicional' };

function variante(overrides = {}) {
  return {
    id: 10,
    precio: 100,
    sku: 'ENC-TRAD-250',
    presentacion: '250 ml',
    cantidad_disponible: 5,
    ...overrides,
  };
}

beforeEach(() => {
  localStorage.clear();
});

describe('CartContext', () => {
  it('agrega un producto nuevo al carrito', () => {
    const { result } = renderHook(() => useCart(), { wrapper });

    act(() => result.current.addItem(producto, variante(), 2));

    expect(result.current.items).toHaveLength(1);
    expect(result.current.items[0]).toMatchObject({ varianteId: 10, cantidad: 2, precio: 100 });
    expect(result.current.totalItems).toBe(2);
    expect(result.current.subtotal).toBe(200);
  });

  it('suma cantidades si la variante ya esta en el carrito', () => {
    const { result } = renderHook(() => useCart(), { wrapper });

    act(() => result.current.addItem(producto, variante(), 2));
    act(() => result.current.addItem(producto, variante(), 1));

    expect(result.current.items).toHaveLength(1);
    expect(result.current.items[0].cantidad).toBe(3);
  });

  it('no deja acumular mas del stock disponible', () => {
    const { result } = renderHook(() => useCart(), { wrapper });

    act(() => result.current.addItem(producto, variante({ cantidad_disponible: 3 }), 2));
    act(() => result.current.addItem(producto, variante({ cantidad_disponible: 3 }), 5));

    expect(result.current.items[0].cantidad).toBe(3);
  });

  it('setQty clampa la cantidad entre 1 y el stock disponible', () => {
    const { result } = renderHook(() => useCart(), { wrapper });

    act(() => result.current.addItem(producto, variante({ cantidad_disponible: 4 }), 1));

    act(() => result.current.setQty(10, 99));
    expect(result.current.items[0].cantidad).toBe(4);

    act(() => result.current.setQty(10, -3));
    expect(result.current.items[0].cantidad).toBe(1);
  });

  it('setQty quita el item si el stock disponible guardado es 0', () => {
    const { result } = renderHook(() => useCart(), { wrapper });

    act(() => result.current.addItem(producto, variante({ cantidad_disponible: 0 }), 1));
    expect(result.current.items).toHaveLength(1);
    expect(result.current.items[0].cantidad).toBe(0);

    act(() => result.current.setQty(10, 5));
    expect(result.current.items).toHaveLength(0);
  });

  it('removeItem quita solo el item indicado', () => {
    const { result } = renderHook(() => useCart(), { wrapper });

    act(() => result.current.addItem(producto, variante({ id: 10 }), 1));
    act(() => result.current.addItem(producto, variante({ id: 11, sku: 'ENC-PIC-250' }), 1));

    act(() => result.current.removeItem(10));

    expect(result.current.items).toHaveLength(1);
    expect(result.current.items[0].varianteId).toBe(11);
  });

  it('calcula subtotal y totalItems sobre varios items', () => {
    const { result } = renderHook(() => useCart(), { wrapper });

    act(() => result.current.addItem(producto, variante({ id: 10, precio: 100 }), 2));
    act(() => result.current.addItem(producto, variante({ id: 11, sku: 'ENC-PIC-250', precio: 150 }), 1));

    expect(result.current.totalItems).toBe(3);
    expect(result.current.subtotal).toBe(350);
  });

  it('clear vacia el carrito', () => {
    const { result } = renderHook(() => useCart(), { wrapper });

    act(() => result.current.addItem(producto, variante(), 2));
    act(() => result.current.clear());

    expect(result.current.items).toHaveLength(0);
  });

  it('persiste el carrito en localStorage tras cada cambio', () => {
    const { result } = renderHook(() => useCart(), { wrapper });

    act(() => result.current.addItem(producto, variante(), 2));

    const guardado = JSON.parse(localStorage.getItem(STORAGE_KEY));
    expect(guardado).toHaveLength(1);
    expect(guardado[0]).toMatchObject({ varianteId: 10, cantidad: 2 });
  });

  it('lee el carrito guardado en localStorage al montar', () => {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify([
        {
          varianteId: 10,
          productoId: 1,
          nombre: 'Encurtido tradicional',
          presentacion: '250 ml',
          precio: 100,
          sku: 'ENC-TRAD-250',
          disponible: 5,
          cantidad: 2,
        },
      ]),
    );

    const { result } = renderHook(() => useCart(), { wrapper });

    expect(result.current.items).toHaveLength(1);
    expect(result.current.totalItems).toBe(2);
  });
});
