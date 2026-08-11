const pool = require('../config/db');
const { enviarCorreo } = require('../config/mailer');
const { construirCorreoPedido } = require('../emails/pedidoConfirmacion');

const METODOS_ENTREGA = ['domicilio', 'recoger'];
const METODOS_PAGO = ['transferencia', 'contra_entrega', 'tarjeta'];
const ESTADOS_PEDIDO = [
  'pendiente_pago',
  'pagado',
  'en_preparacion',
  'listo',
  'en_camino',
  'entregado',
  'cancelado',
];

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
      `SELECT v.id, v.precio, v.sku, v.presentacion, pr.nombre AS producto_nombre, i.cantidad_disponible
       FROM variantes_producto v
       JOIN productos pr ON pr.id = v.producto_id
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
        'SELECT costo_envio, tiempo_estimado, acepta_contra_entrega FROM zonas_entrega WHERE id = ? AND activo = TRUE',
        [zonaEntregaId],
      );
      if (!zona) throw errorHttp(400, 'Zona de entrega inválida');
      if (metodoPago === 'contra_entrega' && !zona.acepta_contra_entrega) {
        throw errorHttp(400, 'Pago contra entrega no disponible para esta zona');
      }
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

    if (cliente.correo) {
      const { subject, html } = construirCorreoPedido({
        codigo,
        clienteNombre: cliente.nombre,
        items: items.map((item) => {
          const variante = variantesPorId.get(item.varianteId);
          return {
            nombre: variante.producto_nombre,
            presentacion: variante.presentacion,
            cantidad: item.cantidad,
            precioUnitario: Number(variante.precio),
          };
        }),
        subtotal,
        costoEnvio,
        total,
        metodoPago,
        tiempoEstimado,
      });

      enviarCorreo({ to: cliente.correo, subject, html }).catch((error) =>
        console.error('[mailer] Error enviando confirmacion de pedido:', error.message),
      );
    }
  } catch (error) {
    await conn.rollback();
    next(error);
  } finally {
    conn.release();
  }
}

async function listarPedidos(req, res, next) {
  try {
    const { estado } = req.query;
    const condiciones = [];
    const parametros = [];

    if (estado) {
      condiciones.push('p.estado = ?');
      parametros.push(estado);
    }

    const where = condiciones.length ? `WHERE ${condiciones.join(' AND ')}` : '';

    const [filas] = await pool.query(
      `SELECT p.id, p.codigo, p.estado, p.metodo_entrega, p.metodo_pago, p.subtotal, p.costo_envio, p.total,
              p.created_at, c.nombre AS cliente_nombre, c.telefono AS cliente_telefono
       FROM pedidos p
       JOIN clientes c ON c.id = p.cliente_id
       ${where}
       ORDER BY p.created_at DESC`,
      parametros,
    );

    res.json(filas);
  } catch (error) {
    next(error);
  }
}

async function obtenerPedidoPorCodigo(req, res, next) {
  try {
    const [[pedido]] = await pool.query(
      `SELECT p.*, c.nombre AS cliente_nombre, c.telefono AS cliente_telefono, c.correo AS cliente_correo,
              d.departamento, d.ciudad, d.direccion, d.punto_referencia, z.nombre AS zona_nombre
       FROM pedidos p
       JOIN clientes c ON c.id = p.cliente_id
       LEFT JOIN direcciones d ON d.id = p.direccion_id
       LEFT JOIN zonas_entrega z ON z.id = p.zona_entrega_id
       WHERE p.codigo = ?`,
      [req.params.codigo],
    );

    if (!pedido) {
      return res.status(404).json({ mensaje: 'Pedido no encontrado' });
    }

    const [items] = await pool.query(
      `SELECT dp.cantidad, dp.precio_unitario, dp.subtotal, v.presentacion, pr.nombre AS producto_nombre
       FROM detalle_pedido dp
       JOIN variantes_producto v ON v.id = dp.variante_id
       JOIN productos pr ON pr.id = v.producto_id
       WHERE dp.pedido_id = ?`,
      [pedido.id],
    );

    res.json({ ...pedido, items });
  } catch (error) {
    next(error);
  }
}

async function actualizarEstadoPedido(req, res, next) {
  try {
    const { estado } = req.body;

    if (!ESTADOS_PEDIDO.includes(estado)) {
      return next(errorHttp(400, 'Estado inválido'));
    }

    const [resultado] = await pool.query('UPDATE pedidos SET estado = ? WHERE id = ?', [estado, req.params.id]);

    if (resultado.affectedRows === 0) {
      return res.status(404).json({ mensaje: 'Pedido no encontrado' });
    }

    res.json({ id: Number(req.params.id), estado });
  } catch (error) {
    next(error);
  }
}

module.exports = { crearPedido, listarPedidos, obtenerPedidoPorCodigo, actualizarEstadoPedido };
