const request = require("supertest");
const app = require("./app");

describe("Rutas principales", () => {
  it("GET / debe responder 200", async () => {
    const res = await request(app).get("/");
    expect(res.statusCode).toBe(200);
  });

  it("GET /mascotas/mis-mascotas debe requerir login o responder 302", async () => {
    const res = await request(app).get("/mascotas/mis-mascotas");
    expect([200, 302, 401]).toContain(res.statusCode);
  });

  // 1. Registro de mascota sin login
  it("POST /mascotas/registrar sin login debe responder 302 o 401", async () => {
    const res = await request(app)
      .post("/mascotas/registrar")
      .send({ nombre: "Firulais", raza: "Labrador", edad: 2, color: "Marrón" });
    expect([302, 401]).toContain(res.statusCode);
  });

  // 2. Ver QR de mascota sin login
  it("GET /mascotas/ver_qr/1 sin login debe responder 302 o 401", async () => {
    const res = await request(app).get("/mascotas/ver_qr/1");
    expect([302, 401]).toContain(res.statusCode);
  });

  // 3. Editar mascota sin login
  it("GET /mascotas/editar/1 sin login debe responder 302 o 401", async () => {
    const res = await request(app).get("/mascotas/editar/1");
    expect([302, 401]).toContain(res.statusCode);
  });

  // 4. Eliminar mascota sin login
  it("POST /mascotas/eliminar/1 sin login debe responder 302 o 401", async () => {
    const res = await request(app).post("/mascotas/eliminar/1");
    expect([302, 401]).toContain(res.statusCode);
  });
});

afterAll(async () => {
  const db = require("./config/db");
  await db.end();
});
