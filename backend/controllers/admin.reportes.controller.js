const pool = require('../config/db');

async function resumen(req, res, next) {
  try {
    const [[totales]] = await pool.query(
      `SELECT COUNT(*) AS totalPedidos, COALESCE(SUM(total), 0) AS totalVentas
       FROM pedidos WHERE estado != 'cancelado'`,
    );

    const [porEstado] = await pool.query(
      `SELECT estado, COUNT(*) AS cantidad FROM pedidos GROUP BY estado`,
    );

    const [masVendidos] = await pool.query(
      `SELECT pr.nombre, SUM(dp.cantidad) AS cantidad
       FROM detalle_pedido dp
       JOIN variantes_producto v ON v.id = dp.variante_id
       JOIN productos pr ON pr.id = v.producto_id
       JOIN pedidos p ON p.id = dp.pedido_id
       WHERE p.estado != 'cancelado'
       GROUP BY pr.id
       ORDER BY cantidad DESC
       LIMIT 5`,
    );

    res.json({
      totalPedidos: totales.totalPedidos,
      totalVentas: Number(totales.totalVentas),
      pedidosPorEstado: porEstado,
      productosMasVendidos: masVendidos,
    });
  } catch (error) {
    next(error);
  }
}

function escaparCsv(valor) {
  const texto = String(valor ?? '');
  return /[",\n]/.test(texto) ? `"${texto.replace(/"/g, '""')}"` : texto;
}

async function exportarPedidosCsv(req, res, next) {
  try {
    const { desde, hasta } = req.query;
    const condiciones = [];
    const parametros = [];

    if (desde) {
      condiciones.push('p.created_at >= ?');
      parametros.push(desde);
    }
    if (hasta) {
      condiciones.push('p.created_at <= ?');
      parametros.push(hasta);
    }

    const where = condiciones.length ? `WHERE ${condiciones.join(' AND ')}` : '';

    const [pedidos] = await pool.query(
      `SELECT p.codigo, c.nombre AS cliente, c.telefono, p.metodo_entrega, p.metodo_pago, p.estado,
              p.subtotal, p.costo_envio, p.total, p.created_at
       FROM pedidos p
       JOIN clientes c ON c.id = p.cliente_id
       ${where}
       ORDER BY p.created_at DESC`,
      parametros,
    );

    const encabezado = ['Codigo', 'Cliente', 'Telefono', 'Entrega', 'Pago', 'Estado', 'Subtotal', 'Envio', 'Total', 'Fecha'];
    const filas = pedidos.map((p) =>
      [p.codigo, p.cliente, p.telefono, p.metodo_entrega, p.metodo_pago, p.estado, p.subtotal, p.costo_envio, p.total, p.created_at.toISOString()]
        .map(escaparCsv)
        .join(','),
    );

    const csv = [encabezado.join(','), ...filas].join('\n');

    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
    res.setHeader('Content-Disposition', 'attachment; filename="pedidos.csv"');
    res.send(`﻿${csv}`);
  } catch (error) {
    next(error);
  }
}

module.exports = { resumen, exportarPedidosCsv };
