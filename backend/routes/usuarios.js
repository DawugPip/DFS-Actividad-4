const express = require('express');
const router = express.Router();
const { Usuario } = require('../shema');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

router.post('/register', async (req, res) => {
  const { email, password } = req.body;

  //
  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    const newUser = new Usuario({ email, password: hashedPassword });
    await newUser.save();
    res.status(201).json({ message: 'Usuario registrado exitosamente' });
  } catch (error) {
    res.status(500).json({ message: 'Error al registrar usuario', error });
  }
}); 

router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try{
    const newUserFind = await Usuario.findOne({ email });

    if (!newUserFind) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }
    const isPasswordValid = await bcrypt.compare(password, newUserFind.password);

    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Contraseña incorrecta' });
    }

    //Generacion del token
    const token= jwt.sign(
        { userId: newUserFind._id },
        process.env.JWT_SECRET,
        { expiresIn: '1h' }
    );
    res.json({ token });
  } catch (error) {
    res.status(500).json({ message: 'Error al iniciar sesión', error });
  }
});

// Exporta el enrutador para ser utilizado en index.js
module.exports = router;