const request = require("supertest");
const path = require("path");
const app = require("./app");

let agent;

beforeAll(async () => {
  agent = request.agent(app);
  await agent.post("/login").send({ usuario: "hola@hola", password: "hola" }); 
});


test("Login funciona", async () => {
  const res = await agent
    .post("/login")
    .send({ usuario: "user@user", password: "user" });
  expect([200, 302]).toContain(res.statusCode);
});

describe("Pruebas - Registrar Mascota", () => {
  test("✅ Registro exitoso de mascota", async () => {
    const res = await agent
      .post("/mascotas/registrar")
      .field("nombre", "Luna")
      .field("edad", "3")
      .field("raza", "Labrador")
      .field("color", "Marrón")
      .attach("foto", path.resolve(__dirname, "public/img/pet.png"));

    expect(res.statusCode).toBe(302);
    expect(res.headers.location).toBe("/dashboard");
  });

test("❌ Campos vacíos", async () => {
  const res = await agent.post("/mascotas/registrar")
    .field("nombre", "")
    .field("raza", "")
    .field("edad", "")
    .field("color", "");
  expect(res.statusCode).toBe(400);
  expect(res.text).toMatch(/completados/i);
});

  test("❌ Edad negativa", async () => {
    const res = await agent
      .post("/mascotas/registrar")
      .field("nombre", "Max")
      .field("edad", "-5")
      .field("raza", "Persa")
      .field("color", "Blanco")
      .attach("foto", path.resolve(__dirname, "./files/perro.jpg"));

    expect(res.statusCode).toBe(400);
    expect(res.text).toMatch(/Edad inválida/i);
  });

  test("❌ Edad no numérica", async () => {
    const res = await agent
      .post("/mascotas/registrar")
      .field("nombre", "Rocky")
      .field("edad", "tres")
      .field("raza", "Pitbull")
      .field("color", "Negro")
      .attach("foto", path.resolve(__dirname, "./files/perro.jpg"));

    expect(res.statusCode).toBe(400);
    expect(res.text).toMatch(/Edad inválida/i);
  });

  test("❌ Imagen faltante", async () => {
    const res = await agent
      .post("/mascotas/registrar")
      .field("nombre", "Milo")
      .field("edad", "2")
      .field("raza", "Beagle")
      .field("color", "Tricolor");

    expect(res.statusCode).toBe(400);
    expect(res.text).toMatch(/imagen/i);
  });

  test("❌ Imagen con formato no permitido", async () => {
    const res = await agent
      .post("/mascotas/registrar")
      .field("nombre", "Toby")
      .field("edad", "2")
      .field("raza", "Siamés")
      .field("color", "Gris")
      .attach("foto", path.resolve(__dirname, "./files/foto.exe"));

    expect(res.statusCode).toBe(400);
    expect(res.text).toMatch(/formato/i);
  });

  test("⚠️ Nombre demasiado largo", async () => {
    const nombreLargo = "a".repeat(256);
    const res = await agent
      .post("/mascotas/registrar")
      .field("nombre", nombreLargo)
      .field("edad", "3")
      .field("raza", "Bulldog")
      .field("color", "Blanco")
      .attach("foto", path.resolve(__dirname, "./files/perro.jpg"));

    expect(res.statusCode).toBe(400);
    expect(res.text).toMatch(/Nombre demasiado largo/i);
  });

  test("⚠️ Edad igual a 0", async () => {
    const res = await agent
      .post("/mascotas/registrar")
      .field("nombre", "Boby")
      .field("edad", "0")
      .field("raza", "Pug")
      .field("color", "Beige")
      .attach("foto", path.resolve(__dirname, "./files/perro.jpg"));

    expect(res.statusCode).toBe(400);
    expect(res.text).toMatch(/Edad inválida/i);
  });

  test("❌ Registro sin sesión iniciada", async () => {
    const unauthenticated = request(app);
    const res = await unauthenticated
      .post("/mascotas/registrar")
      .field("nombre", "Nina")
      .field("edad", "2")
      .field("raza", "Pomerania")
      .field("color", "Naranja")
      .attach("foto", path.resolve(__dirname, "./files/perro.jpg"));

    expect([302, 401]).toContain(res.statusCode);
  });

  test("✅ Registro con raza exótica", async () => {
    const res = await agent
      .post("/mascotas/registrar")
      .field("nombre", "Chispa")
      .field("edad", "5")
      .field("raza", "Affenpinscher")
      .field("color", "Negro")
      .attach("foto", path.resolve(__dirname, "public/img/pet.png"));

    expect(res.statusCode).toBe(302);
    expect(res.headers.location).toBe("/dashboard");
  });
});

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
