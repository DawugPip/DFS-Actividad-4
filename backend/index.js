require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const mongoURL = process.env.MONGO_URI || 'mongodb://localhost:27017/gestion_productos';

app.use(cors({origin: 'dfs-actividad-4.vercel.app'}));
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