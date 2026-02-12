const request = require("supertest");
const app = require("../index");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const { Producto } = require("../shema");

// Generar token JWT válido para tests
const JWT_SECRET = process.env.JWT_SECRET || "secreto123";
const generarToken = (userId) => {
  return jwt.sign({ userId }, JWT_SECRET, { expiresIn: "1h" });
};

// ID de usuario mock para tests
const userIdMock = new mongoose.Types.ObjectId();
const tokenValido = generarToken(userIdMock);

// Variable para almacenar ID del producto creado
let productoCreadoId;

describe("Rutas de productos", () => {

  // Limpiar la base de datos antes de cada test
  beforeEach(async () => {
    await Producto.deleteMany({});
  });

  // Cerrar conexión después de todos los tests
  afterAll(async () => {
    await mongoose.connection.close();
  });

  describe("GET /api/productos", () => {
    test("Debe obtener productos (vacío si no hay)", async () => {
      const res = await request(app)
        .get("/api/productos")
        .set("Authorization", `Bearer ${tokenValido}`);

      expect(res.statusCode).toBe(200);
    });

    test("Debe retornar 401 si no hay token", async () => {
      const res = await request(app).get("/api/productos");

      expect(res.statusCode).toBe(401);
      expect(res.body.error).toBe("Token requerido");
    });

    test("Debe retornar 401 si token es inválido", async () => {
      const res = await request(app)
        .get("/api/productos")
        .set("Authorization", "Bearer token-invalido");

      expect(res.statusCode).toBe(401);
    });

    test("Debe obtener productos del usuario autenticado", async () => {
      // Crear producto asociado al usuario mock
      await Producto.create({
        nombre: "Manzana",
        descripcion: "Roja",
        precio: 20,
        stock: 50,
        creadoPor: userIdMock
      });

      const res = await request(app)
        .get("/api/productos")
        .set("Authorization", `Bearer ${tokenValido}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.length).toBe(1);
      expect(res.body[0].nombre).toBe("Manzana");
    });
  });

  describe("POST /api/productos", () => {
    test("Debe crear un producto exitosamente", async () => {
      const producto = {
        nombre: "Pera",
        descripcion: "Verde",
        precio: 15,
        stock: 30
      };

      const res = await request(app)
        .post("/api/productos")
        .set("Authorization", `Bearer ${tokenValido}`)
        .send(producto);

      expect(res.statusCode).toBe(201);
      expect(res.body.nombre).toBe("Pera");
      expect(res.body.precio).toBe(15);
      expect(res.body.stock).toBe(30);
      expect(res.body._id).toBeDefined();

      // Guardar ID para usar en otros tests
      productoCreadoId = res.body._id;
    });

    test("Debe retornar 401 si no hay token", async () => {
      const producto = {
        nombre: "Uva",
        precio: 25,
        stock: 40
      };

      const res = await request(app)
        .post("/api/productos")
        .send(producto);

      expect(res.statusCode).toBe(401);
    });
  });

  describe("PUT /api/productos/:id", () => {
    let productoId;

    beforeEach(async () => {
      // Crear producto para actualizar
      const producto = await Producto.create({
        nombre: "Banana",
        descripcion: "Amarilla",
        precio: 10,
        stock: 100,
        creadoPor: userIdMock
      });
      productoId = producto._id;
    });

    test("Debe actualizar un producto exitosamente", async () => {
      const datosActualizados = {
        nombre: "Banana Modificada",
        descripcion: "Verde",
        precio: 12,
        stock: 80
      };

      const res = await request(app)
        .put(`/api/productos/${productoId}`)
        .set("Authorization", `Bearer ${tokenValido}`)
        .send(datosActualizados);

      expect(res.statusCode).toBe(200);
      expect(res.body.message).toBe("Producto actualizado correctamente");
      expect(res.body.actualizarProducto.nombre).toBe("Banana Modificada");
      expect(res.body.actualizarProducto.precio).toBe(12);
    });

    test("Debe retornar 404 si producto no existe", async () => {
      const idInexistente = new mongoose.Types.ObjectId();
      const datosActualizados = {
        nombre: "Producto Inexistente",
        precio: 50
      };

      const res = await request(app)
        .put(`/api/productos/${idInexistente}`)
        .set("Authorization", `Bearer ${tokenValido}`)
        .send(datosActualizados);

      expect(res.statusCode).toBe(404);
      expect(res.body.message).toBe("Producto no encontrado o no pertenece al usuario");
    });

    test("Debe retornar 400 si ID no es válido", async () => {
      const res = await request(app)
        .put("/api/productos/id-invalido")
        .set("Authorization", `Bearer ${tokenValido}`)
        .send({ nombre: "Test" });

      expect(res.statusCode).toBe(400);
      expect(res.body.message).toBe("ID de producto no válido");
    });

    test("Debe retornar 401 si no hay token", async () => {
      const res = await request(app)
        .put(`/api/productos/${productoId}`)
        .send({ nombre: "Sin Token" });

      expect(res.statusCode).toBe(401);
    });
  });

  describe("DELETE /api/productos/:id", () => {
    let productoId;

    beforeEach(async () => {
      // Crear producto para eliminar
      const producto = await Producto.create({
        nombre: "Naranja",
        descripcion: "Jugosa",
        precio: 8,
        stock: 200,
        creadoPor: userIdMock
      });
      productoId = producto._id;
    });

    test("Debe eliminar un producto exitosamente", async () => {
      const res = await request(app)
        .delete(`/api/productos/${productoId}`)
        .set("Authorization", `Bearer ${tokenValido}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.message).toBe("Producto eliminado correctamente");

      // Verificar que el producto ya no existe
      const productoEliminado = await Producto.findById(productoId);
      expect(productoEliminado).toBeNull();
    });

    test("Debe retornar 404 si producto no existe", async () => {
      const idInexistente = new mongoose.Types.ObjectId();

      const res = await request(app)
        .delete(`/api/productos/${idInexistente}`)
        .set("Authorization", `Bearer ${tokenValido}`);

      expect(res.statusCode).toBe(404);
      expect(res.body.message).toBe("Producto no encontrado o no pertenece al usuario");
    });

    test("Debe retornar 401 si no hay token", async () => {
      const res = await request(app)
        .delete(`/api/productos/${productoId}`);

      expect(res.statusCode).toBe(401);
    });
  });

});
