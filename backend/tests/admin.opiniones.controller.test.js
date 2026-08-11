const request = require('supertest');
const jwt = require('jsonwebtoken');
const { stubPool } = require('./helpers/mockPool');

const { pool: mockPool } = stubPool();
const app = require('../app');

function tokenAdmin() {
  return jwt.sign({ sub: 1, correo: 'admin@test.com', rol: 'admin' }, process.env.JWT_SECRET);
}

beforeEach(() => {
  mockPool.query.mockReset();
});

describe('rutas admin de opiniones requieren autenticacion', () => {
  it('GET / responde 401 sin token', async () => {
    const res = await request(app).get('/api/admin/opiniones');
    expect(res.status).toBe(401);
  });

  it('POST / responde 401 sin token', async () => {
    const res = await request(app).post('/api/admin/opiniones').send({ nombre: 'Ana' });
    expect(res.status).toBe(401);
  });

  it('PUT /:id responde 401 sin token', async () => {
    const res = await request(app).put('/api/admin/opiniones/1').send({ estado: 'aprobada' });
    expect(res.status).toBe(401);
  });

  it('DELETE /:id responde 401 sin token', async () => {
    const res = await request(app).delete('/api/admin/opiniones/1');
    expect(res.status).toBe(401);
  });
});

describe('GET /api/admin/opiniones', () => {
  it('lista opiniones filtrando por estado', async () => {
    mockPool.query.mockResolvedValueOnce([[{ id: 1, estado: 'pendiente' }]]);

    const res = await request(app)
      .get('/api/admin/opiniones?estado=pendiente')
      .set('Authorization', `Bearer ${tokenAdmin()}`);

    expect(res.status).toBe(200);
    expect(mockPool.query).toHaveBeenCalledWith(expect.stringContaining('o.estado = ?'), ['pendiente']);
    expect(res.body).toEqual([{ id: 1, estado: 'pendiente' }]);
  });
});

describe('POST /api/admin/opiniones', () => {
  it('rechaza sin nombre o comentario', async () => {
    const res = await request(app)
      .post('/api/admin/opiniones')
      .set('Authorization', `Bearer ${tokenAdmin()}`)
      .send({ calificacion: 5 });

    expect(res.status).toBe(400);
  });

  it('crea una opinion manual, aprobada por defecto', async () => {
    mockPool.query.mockResolvedValueOnce([{ insertId: 7 }]);

    const res = await request(app)
      .post('/api/admin/opiniones')
      .set('Authorization', `Bearer ${tokenAdmin()}`)
      .send({ nombre: 'Carlos R.', calificacion: 4, comentario: 'Excelente producto' });

    expect(res.status).toBe(201);
    expect(mockPool.query).toHaveBeenCalledWith(
      expect.stringContaining('INSERT INTO opiniones'),
      expect.arrayContaining(['Carlos R.', 4, 'Excelente producto', 'aprobada']),
    );
  });
});

describe('PUT /api/admin/opiniones/:id', () => {
  it('responde 400 con un estado invalido', async () => {
    const res = await request(app)
      .put('/api/admin/opiniones/1')
      .set('Authorization', `Bearer ${tokenAdmin()}`)
      .send({ estado: 'flotando' });

    expect(res.status).toBe(400);
  });

  it('responde 404 si la opinion no existe', async () => {
    mockPool.query.mockResolvedValueOnce([{ affectedRows: 0 }]);

    const res = await request(app)
      .put('/api/admin/opiniones/999')
      .set('Authorization', `Bearer ${tokenAdmin()}`)
      .send({ estado: 'aprobada' });

    expect(res.status).toBe(404);
  });

  it('actualiza el estado y marca moderado_en', async () => {
    mockPool.query.mockResolvedValueOnce([{ affectedRows: 1 }]);

    const res = await request(app)
      .put('/api/admin/opiniones/1')
      .set('Authorization', `Bearer ${tokenAdmin()}`)
      .send({ estado: 'rechazada' });

    expect(res.status).toBe(200);
    expect(mockPool.query).toHaveBeenCalledWith(
      expect.stringContaining('moderado_en = ?'),
      expect.arrayContaining(['rechazada']),
    );
  });
});

describe('DELETE /api/admin/opiniones/:id', () => {
  it('responde 404 si la opinion no existe', async () => {
    mockPool.query.mockResolvedValueOnce([{ affectedRows: 0 }]);

    const res = await request(app).delete('/api/admin/opiniones/999').set('Authorization', `Bearer ${tokenAdmin()}`);

    expect(res.status).toBe(404);
  });

  it('elimina la opinion', async () => {
    mockPool.query.mockResolvedValueOnce([{ affectedRows: 1 }]);

    const res = await request(app).delete('/api/admin/opiniones/1').set('Authorization', `Bearer ${tokenAdmin()}`);

    expect(res.status).toBe(200);
  });
});
