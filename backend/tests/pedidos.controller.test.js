const request = require('supertest');
const jwt = require('jsonwebtoken');
const { stubPool, stubMailer } = require('./helpers/mockPool');

const { pool: mockPool, mockConn } = stubPool();
const mailer = stubMailer();
const app = require('../app');

const varianteDefault = {
  id: 1,
  precio: 100,
  sku: 'ENC-TRAD-250',
  presentacion: '250 ml',
  producto_nombre: 'Encurtido tradicional',
  cantidad_disponible: 10,
};

const zonaDefault = { costo_envio: 50, tiempo_estimado: '24-48h', acepta_contra_entrega: true };

function bodyDomicilio(overrides = {}) {
  return {
    cliente: { nombre: 'Ana', telefono: '99999999' },
    direccion: { direccion: 'Col. Kennedy' },
    metodoEntrega: 'domicilio',
    zonaEntregaId: 1,
    metodoPago: 'transferencia',
    items: [{ varianteId: 1, cantidad: 2 }],
    ...overrides,
  };
}

function setupHappyPathQueries({ variante = varianteDefault, zona = zonaDefault, failOn } = {}) {
  mockConn.query.mockImplementation(async (sql) => {
    if (failOn && sql.includes(failOn)) throw new Error(`Fallo simulado en: ${failOn}`);
    if (sql.includes('FROM variantes_producto')) return [[variante]];
    if (sql.includes('FROM zonas_entrega')) return [[zona]];
    if (sql.includes('INSERT INTO clientes')) return [{ insertId: 1 }];
    if (sql.includes('INSERT INTO direcciones')) return [{ insertId: 1 }];
    if (sql.includes('INSERT INTO pedidos')) return [{ insertId: 123 }];
    if (sql.includes('UPDATE pedidos SET codigo')) return [{}];
    if (sql.includes('INSERT INTO detalle_pedido')) return [{}];
    if (sql.includes('UPDATE inventario')) return [{}];
    throw new Error(`Query no mockeada: ${sql}`);
  });
}

beforeEach(() => {
  mockConn.query.mockReset();
  mockConn.beginTransaction.mockReset();
  mockConn.commit.mockReset();
  mockConn.rollback.mockReset();
  mockConn.release.mockReset();
  mockPool.query.mockReset();
  mockPool.getConnection.mockReset();
  mockPool.getConnection.mockImplementation(async () => mockConn);
  mailer.enviarCorreo.mockReset();
  mailer.enviarCorreo.mockResolvedValue(undefined);
});

describe('POST /api/pedidos', () => {
  it('rechaza si falta nombre o telefono del cliente', async () => {
    const res = await request(app)
      .post('/api/pedidos')
      .send(bodyDomicilio({ cliente: { nombre: '', telefono: '' } }));

    expect(res.status).toBe(400);
  });

  it('rechaza un metodoEntrega invalido', async () => {
    const res = await request(app).post('/api/pedidos').send(bodyDomicilio({ metodoEntrega: 'dron' }));
    expect(res.status).toBe(400);
  });

  it('rechaza un metodoPago invalido', async () => {
    const res = await request(app).post('/api/pedidos').send(bodyDomicilio({ metodoPago: 'bitcoin' }));
    expect(res.status).toBe(400);
  });

  it('rechaza entrega a domicilio sin direccion ni zona', async () => {
    const res = await request(app)
      .post('/api/pedidos')
      .send(bodyDomicilio({ direccion: {}, zonaEntregaId: undefined }));

    expect(res.status).toBe(400);
  });

  it('rechaza un pedido sin items', async () => {
    const res = await request(app).post('/api/pedidos').send(bodyDomicilio({ items: [] }));
    expect(res.status).toBe(400);
  });

  it('responde 409 cuando el inventario es insuficiente', async () => {
    setupHappyPathQueries({ variante: { ...varianteDefault, cantidad_disponible: 1 } });

    const res = await request(app).post('/api/pedidos').send(bodyDomicilio());

    expect(res.status).toBe(409);
    expect(mockConn.rollback).toHaveBeenCalledTimes(1);
    expect(mockConn.commit).not.toHaveBeenCalled();
  });

  it('crea el pedido, calcula subtotal/envio/total y genera el codigo', async () => {
    setupHappyPathQueries();

    const res = await request(app).post('/api/pedidos').send(bodyDomicilio());

    expect(res.status).toBe(201);
    expect(res.body).toMatchObject({
      codigo: 'ENC-000123',
      estado: 'pendiente_pago',
      subtotal: 200,
      costoEnvio: 50,
      total: 250,
    });
    expect(mockConn.commit).toHaveBeenCalledTimes(1);
    expect(mockConn.rollback).not.toHaveBeenCalled();
  });

  it('no cobra envio ni exige direccion cuando el metodo es recoger', async () => {
    setupHappyPathQueries();

    const res = await request(app).post('/api/pedidos').send(
      bodyDomicilio({
        metodoEntrega: 'recoger',
        zonaEntregaId: undefined,
        direccion: undefined,
      }),
    );

    expect(res.status).toBe(201);
    expect(res.body.costoEnvio).toBe(0);
    expect(res.body.total).toBe(200);
  });

  it('revierte la transaccion si una query intermedia falla', async () => {
    setupHappyPathQueries({ failOn: 'INSERT INTO pedidos' });

    const res = await request(app).post('/api/pedidos').send(bodyDomicilio());

    expect(res.status).toBe(500);
    expect(mockConn.rollback).toHaveBeenCalledTimes(1);
    expect(mockConn.commit).not.toHaveBeenCalled();
  });

  it('envia correo de confirmacion solo si el cliente proporciono correo', async () => {
    setupHappyPathQueries();

    await request(app)
      .post('/api/pedidos')
      .send(bodyDomicilio({ cliente: { nombre: 'Ana', telefono: '99999999', correo: 'ana@test.com' } }));

    expect(mailer.enviarCorreo).toHaveBeenCalledTimes(1);
    expect(mailer.enviarCorreo.mock.calls[0][0]).toMatchObject({ to: 'ana@test.com' });
  });

  it('no envia correo si el cliente no dio correo', async () => {
    setupHappyPathQueries();

    await request(app).post('/api/pedidos').send(bodyDomicilio());

    expect(mailer.enviarCorreo).not.toHaveBeenCalled();
  });

  it('rechaza pago contra entrega si la zona no lo acepta', async () => {
    setupHappyPathQueries({ zona: { ...zonaDefault, acepta_contra_entrega: false } });

    const res = await request(app).post('/api/pedidos').send(bodyDomicilio({ metodoPago: 'contra_entrega' }));

    expect(res.status).toBe(400);
  });

  it('permite pago contra entrega cuando la zona lo acepta', async () => {
    setupHappyPathQueries({ zona: { ...zonaDefault, acepta_contra_entrega: true } });

    const res = await request(app).post('/api/pedidos').send(bodyDomicilio({ metodoPago: 'contra_entrega' }));

    expect(res.status).toBe(201);
  });

  it('permite pago contra entrega al recoger sin importar zonas', async () => {
    setupHappyPathQueries();

    const res = await request(app).post('/api/pedidos').send(
      bodyDomicilio({
        metodoEntrega: 'recoger',
        metodoPago: 'contra_entrega',
        zonaEntregaId: undefined,
        direccion: undefined,
      }),
    );

    expect(res.status).toBe(201);
  });
});

describe('PATCH /api/pedidos/:id/estado', () => {
  function tokenAdmin() {
    return jwt.sign({ sub: 1, correo: 'admin@test.com', rol: 'admin' }, process.env.JWT_SECRET);
  }

  it('responde 401 sin token', async () => {
    const res = await request(app).patch('/api/pedidos/1/estado').send({ estado: 'pagado' });
    expect(res.status).toBe(401);
  });

  it('responde 400 con un estado invalido', async () => {
    const res = await request(app)
      .patch('/api/pedidos/1/estado')
      .set('Authorization', `Bearer ${tokenAdmin()}`)
      .send({ estado: 'volando' });

    expect(res.status).toBe(400);
  });

  it('responde 404 si el pedido no existe', async () => {
    mockPool.query.mockResolvedValueOnce([{ affectedRows: 0 }]);

    const res = await request(app)
      .patch('/api/pedidos/999/estado')
      .set('Authorization', `Bearer ${tokenAdmin()}`)
      .send({ estado: 'pagado' });

    expect(res.status).toBe(404);
  });

  it('actualiza el estado cuando el pedido existe', async () => {
    mockPool.query.mockResolvedValueOnce([{ affectedRows: 1 }]);

    const res = await request(app)
      .patch('/api/pedidos/1/estado')
      .set('Authorization', `Bearer ${tokenAdmin()}`)
      .send({ estado: 'pagado' });

    expect(res.status).toBe(200);
    expect(res.body).toEqual({ id: 1, estado: 'pagado' });
  });
});
