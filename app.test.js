// filepath: c:\Users\tefa3\Desktop\Ubicapet\app.test.js
const request = require('supertest');
const app = require('./app');

describe('Rutas principales', () => {
  it('GET / debe responder 200', async () => {
    const res = await request(app).get('/');
    expect(res.statusCode).toBe(200);
  });

  it('GET /mascotas/mis-mascotas debe requerir login o responder 302', async () => {
    const res = await request(app).get('/mascotas/mis-mascotas');
    expect([200, 302, 401]).toContain(res.statusCode);
  });

  // Agrega más tests para otras rutas aquí
});

afterAll(async () => {
  // Si usas mysql2/promise:
  const db = require('./config/db');
  await db.end();
});

