const request = require('supertest');
const { stubPool } = require('./helpers/mockPool');

const { pool: mockPool } = stubPool();
const app = require('../app');

const pedidoEntregado = { id: 10, estado: 'entregado', cliente_id: 5, telefono: '99999999' };

function bodyOpinion(overrides = {}) {
  return {
    codigoPedido: 'ENC-000010',
    telefono: '99999999',
    nombre: 'María G.',
    calificacion: 5,
    comentario: 'Tiene un picante equilibrado y las verduras permanecen crujientes.',
    ...overrides,
  };
}

function setupQueries({ pedido = pedidoEntregado, existente = null } = {}) {
  mockPool.query.mockImplementation(async (sql) => {
    if (sql.includes('FROM pedidos p')) return [[pedido]];
    if (sql.includes('SELECT id FROM opiniones WHERE pedido_id')) return [[existente].filter(Boolean)];
    if (sql.includes('INSERT INTO opiniones')) return [{ insertId: 1 }];
    throw new Error(`Query no mockeada: ${sql}`);
  });
}

beforeEach(() => {
  mockPool.query.mockReset();
});

describe('POST /api/opiniones', () => {
  it('rechaza si faltan datos obligatorios', async () => {
    const res = await request(app).post('/api/opiniones').send(bodyOpinion({ comentario: '' }));
    expect(res.status).toBe(400);
  });

  it('rechaza una calificacion fuera de rango', async () => {
    const res = await request(app).post('/api/opiniones').send(bodyOpinion({ calificacion: 8 }));
    expect(res.status).toBe(400);
  });

  it('responde 404 si el pedido no existe', async () => {
    setupQueries({ pedido: null });
    const res = await request(app).post('/api/opiniones').send(bodyOpinion());
    expect(res.status).toBe(404);
  });

  it('responde 400 si el telefono no coincide', async () => {
    setupQueries();
    const res = await request(app).post('/api/opiniones').send(bodyOpinion({ telefono: '88888888' }));
    expect(res.status).toBe(400);
  });

  it('responde 400 si el pedido no esta entregado', async () => {
    setupQueries({ pedido: { ...pedidoEntregado, estado: 'en_camino' } });
    const res = await request(app).post('/api/opiniones').send(bodyOpinion());
    expect(res.status).toBe(400);
  });

  it('responde 409 si ya existe una opinion para el pedido', async () => {
    setupQueries({ existente: { id: 1 } });
    const res = await request(app).post('/api/opiniones').send(bodyOpinion());
    expect(res.status).toBe(409);
  });

  it('crea la opinion en estado pendiente', async () => {
    setupQueries();
    const res = await request(app).post('/api/opiniones').send(bodyOpinion());
    expect(res.status).toBe(201);
    expect(mockPool.query).toHaveBeenCalledWith(
      expect.stringContaining('INSERT INTO opiniones'),
      expect.arrayContaining([10, 5, 'María G.', 5, bodyOpinion().comentario, null]),
    );
  });
});

describe('GET /api/opiniones', () => {
  it('devuelve solo opiniones aprobadas', async () => {
    mockPool.query.mockResolvedValueOnce([[{ id: 1, nombre: 'Ana', calificacion: 5 }]]);

    const res = await request(app).get('/api/opiniones');

    expect(res.status).toBe(200);
    expect(mockPool.query).toHaveBeenCalledWith(expect.stringContaining("estado = 'aprobada'"));
    expect(res.body).toEqual([{ id: 1, nombre: 'Ana', calificacion: 5 }]);
  });
});
