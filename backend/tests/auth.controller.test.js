const request = require('supertest');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { stubPool } = require('./helpers/mockPool');

const { pool: mockPool, mockConn } = stubPool();
const app = require('../app');

const PASSWORD = 'secret123';
const adminRow = {
  id: 1,
  nombre: 'Admin',
  correo: 'admin@test.com',
  password_hash: bcrypt.hashSync(PASSWORD, 4),
  rol: 'admin',
};

beforeEach(() => {
  mockConn.query.mockReset();
  mockPool.query.mockReset();
  mockPool.getConnection.mockReset();
  mockPool.getConnection.mockImplementation(async () => mockConn);
});

describe('POST /api/auth/login', () => {
  it('responde 400 si falta correo o password', async () => {
    const res = await request(app).post('/api/auth/login').send({ correo: 'admin@test.com' });
    expect(res.status).toBe(400);
  });

  it('responde 401 si el admin no existe', async () => {
    mockPool.query.mockResolvedValueOnce([[]]);

    const res = await request(app)
      .post('/api/auth/login')
      .send({ correo: 'nadie@test.com', password: PASSWORD });

    expect(res.status).toBe(401);
  });

  it('responde 401 si la contrasena es incorrecta', async () => {
    mockPool.query.mockResolvedValueOnce([[adminRow]]);

    const res = await request(app)
      .post('/api/auth/login')
      .send({ correo: adminRow.correo, password: 'incorrecta' });

    expect(res.status).toBe(401);
  });

  it('responde 200 con un token valido cuando las credenciales son correctas', async () => {
    mockPool.query.mockResolvedValueOnce([[adminRow]]);

    const res = await request(app)
      .post('/api/auth/login')
      .send({ correo: adminRow.correo, password: PASSWORD });

    expect(res.status).toBe(200);
    expect(res.body.admin).toMatchObject({ id: 1, correo: adminRow.correo });

    const payload = jwt.verify(res.body.token, process.env.JWT_SECRET);
    expect(payload).toMatchObject({ sub: 1, correo: adminRow.correo, rol: 'admin' });
  });
});

describe('GET /api/auth/me', () => {
  it('responde 401 sin header de autorizacion', async () => {
    const res = await request(app).get('/api/auth/me');
    expect(res.status).toBe(401);
  });

  it('responde 401 con un token invalido', async () => {
    const res = await request(app).get('/api/auth/me').set('Authorization', 'Bearer token-invalido');
    expect(res.status).toBe(401);
  });

  it('responde 401 con un token expirado', async () => {
    const expirado = jwt.sign({ sub: 1, correo: adminRow.correo, rol: 'admin' }, process.env.JWT_SECRET, {
      expiresIn: -10,
    });

    const res = await request(app).get('/api/auth/me').set('Authorization', `Bearer ${expirado}`);
    expect(res.status).toBe(401);
  });

  it('responde 200 con el admin del token cuando es valido', async () => {
    const token = jwt.sign({ sub: 1, correo: adminRow.correo, rol: 'admin' }, process.env.JWT_SECRET);

    const res = await request(app).get('/api/auth/me').set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.admin).toMatchObject({ sub: 1, correo: adminRow.correo, rol: 'admin' });
  });
});
