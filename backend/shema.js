const mongoose = require('mongoose');
const { update } = require('moongose/models/user_model');

const ProductosSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  descripcion: String,
  precio: Number,
  stock: Number,
  creadoPor: { type: mongoose.Schema.Types.ObjectId, ref: 'Usuario' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

const UsuariosSchema = new mongoose.Schema({
  email: { type: String, required: true },
  password: { type: String, required: true }
});

module.exports = {
  Producto: mongoose.model('Producto', ProductosSchema),
  Usuario: mongoose.model('Usuario', UsuariosSchema)
};