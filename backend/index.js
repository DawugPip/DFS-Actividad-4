require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// Conexión a MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Conectado a MongoDB'))
  .catch(err => console.error(err));

// Rutas
const productosRoutes = require('./routes/productos');
const usuariosRoutes = require('./routes/usuarios');

app.use('/api', productosRoutes);
app.use('/api', usuariosRoutes);

module.exports = app; // Exporta la app para usarla en los tests