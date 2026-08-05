const pool = require('../config/db');

const METODOS_ENTREGA = ['domicilio', 'recoger'];
const METODOS_PAGO = ['transferencia', 'contra_entrega'];

function errorHttp(status, mensaje) {
  const error = new Error(mensaje);
  error.status = status;
  return error;
}

async function crearPedido(req, res, next) {
  const { cliente, direccion, metodoEntrega, zonaEntregaId, metodoPago, items } = req.body;

  if (!cliente?.nombre || !cliente?.telefono) {
    return next(errorHttp(400, 'Nombre y teléfono son obligatorios'));
  }
  if (!METODOS_ENTREGA.includes(metodoEntrega)) {
    return next(errorHttp(400, 'Método de entrega inválido'));
  }
  if (!METODOS_PAGO.includes(metodoPago)) {
    return next(errorHttp(400, 'Método de pago inválido'));
  }
  if (metodoEntrega === 'domicilio' && (!direccion?.direccion || !zonaEntregaId)) {
    return next(errorHttp(400, 'La dirección y la zona de entrega son obligatorias para entrega a domicilio'));
  }
  if (!Array.isArray(items) || items.length === 0) {
    return next(errorHttp(400, 'El pedido no tiene productos'));
  }

  const conn = await pool.getConnection();

  try {
    await conn.beginTransaction();

    const varianteIds = items.map((item) => item.varianteId);
    const [variantes] = await conn.query(
      `SELECT v.id, v.precio, v.sku, i.cantidad_disponible
       FROM variantes_producto v
       JOIN inventario i ON i.variante_id = v.id
       WHERE v.id IN (?)
       FOR UPDATE`,
      [varianteIds],
    );

    const variantesPorId = new Map(variantes.map((v) => [v.id, v]));
    let subtotal = 0;

    for (const item of items) {
      const variante = variantesPorId.get(item.varianteId);
      if (!variante) {
        throw errorHttp(400, `Variante ${item.varianteId} no encontrada`);
      }
      if (item.cantidad < 1 || item.cantidad > variante.cantidad_disponible) {
        throw errorHttp(409, `No hay suficiente inventario para ${variante.sku}`);
      }
      subtotal += Number(variante.precio) * item.cantidad;
    }

    let costoEnvio = 0;
    let tiempoEstimado = 'Coordinaremos el horario de recogida por WhatsApp.';

    if (metodoEntrega === 'domicilio') {
      const [[zona]] = await conn.query(
        'SELECT costo_envio, tiempo_estimado FROM zonas_entrega WHERE id = ? AND activo = TRUE',
        [zonaEntregaId],
      );
      if (!zona) throw errorHttp(400, 'Zona de entrega inválida');
      costoEnvio = Number(zona.costo_envio);
      tiempoEstimado = zona.tiempo_estimado;
    }

    const total = subtotal + costoEnvio;

    const [clienteResult] = await conn.query(
      'INSERT INTO clientes (nombre, telefono, correo) VALUES (?, ?, ?)',
      [cliente.nombre, cliente.telefono, cliente.correo || null],
    );
    const clienteId = clienteResult.insertId;

    let direccionId = null;
    if (metodoEntrega === 'domicilio') {
      const [direccionResult] = await conn.query(
        `INSERT INTO direcciones (cliente_id, departamento, ciudad, direccion, punto_referencia, zona_entrega_id)
         VALUES (?, ?, ?, ?, ?, ?)`,
        [
          clienteId,
          direccion.departamento || null,
          direccion.ciudad || null,
          direccion.direccion,
          direccion.puntoReferencia || null,
          zonaEntregaId,
        ],
      );
      direccionId = direccionResult.insertId;
    }

    const [pedidoResult] = await conn.query(
      `INSERT INTO pedidos
         (codigo, cliente_id, direccion_id, metodo_entrega, zona_entrega_id, metodo_pago, estado, subtotal, descuento, costo_envio, total)
       VALUES ('', ?, ?, ?, ?, ?, 'pendiente_pago', ?, 0, ?, ?)`,
      [clienteId, direccionId, metodoEntrega, metodoEntrega === 'domicilio' ? zonaEntregaId : null, metodoPago, subtotal, costoEnvio, total],
    );
    const pedidoId = pedidoResult.insertId;
    const codigo = `ENC-${String(pedidoId).padStart(6, '0')}`;

    await conn.query('UPDATE pedidos SET codigo = ? WHERE id = ?', [codigo, pedidoId]);

    for (const item of items) {
      const variante = variantesPorId.get(item.varianteId);
      await conn.query(
        'INSERT INTO detalle_pedido (pedido_id, variante_id, cantidad, precio_unitario, subtotal) VALUES (?, ?, ?, ?, ?)',
        [pedidoId, item.varianteId, item.cantidad, variante.precio, Number(variante.precio) * item.cantidad],
      );
      await conn.query(
        'UPDATE inventario SET cantidad_disponible = cantidad_disponible - ? WHERE variante_id = ?',
        [item.cantidad, item.varianteId],
      );
    }

    await conn.commit();

    res.status(201).json({
      codigo,
      estado: 'pendiente_pago',
      subtotal,
      costoEnvio,
      total,
      metodoPago,
      metodoEntrega,
      tiempoEstimado,
    });
  } catch (error) {
    await conn.rollback();
    next(error);
  } finally {
    conn.release();
  }
}

module.exports = { crearPedido };
