// backend/routes/pagos.js
const express = require('express');
const router = express.Router();
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const { Producto } = require('../shema');

router.post('/crear-intento-pago', async (req, res) => {
    const { productoId } = req.body;

    try {
        // 1. Buscamos el producto real en la DB para confirmar el precio
        const producto = await Producto.findById(productoId);
        if (!producto) return res.status(404).json({ error: "Producto no encontrado" });

        // 2. Creamos la intención de pago
        const paymentIntent = await stripe.paymentIntents.create({
            amount: Math.round(producto.precio * 100), // Stripe usa centavos
            currency: 'mxn',
            metadata: { productoId: producto._id.toString() }
        });

        res.json({ clientSecret: paymentIntent.client_secret });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
