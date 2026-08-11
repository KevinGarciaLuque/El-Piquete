function stubPool() {
  const pool = require('../../config/db');

  const mockConn = {
    query: vi.fn(),
    beginTransaction: vi.fn(),
    commit: vi.fn(),
    rollback: vi.fn(),
    release: vi.fn(),
  };

  pool.query = vi.fn();
  pool.getConnection = vi.fn(async () => mockConn);

  return { pool, mockConn };
}

function stubMailer() {
  const mailer = require('../../config/mailer');
  mailer.enviarCorreo = vi.fn().mockResolvedValue(undefined);
  return mailer;
}

module.exports = { stubPool, stubMailer };
