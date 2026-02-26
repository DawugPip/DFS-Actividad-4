const nodemailer = require('nodemailer');

// 1. Configuramos quién envía el correo
// 1. Configuramos quién envía el correo
const transporter = nodemailer.createTransport({
    service: 'gmail', // Puedes usar 'gmail' o un servidor SMTP
    auth: {
        user: process.env.EMAIL_USER, // Tu correo
        pass: process.env.EMAIL_PASS  // Tu "Contraseña de aplicación" (no tu clave normal)
    }
});

// 2. Función para enviar el correo
const enviarCorreoBienvenida = async (emailUsuario) => {
    try {
        // Verificar conexión primero
        await transporter.verify();
        console.log("Conexión con SMTP verificada");
        
        await transporter.sendMail({
            from: `"Gestión de Productos" <${process.env.EMAIL_USER}>`,
            to: emailUsuario,
            subject: "¡Bienvenido al sistema!",
            html: `<h1>Hola ${emailUsuario}</h1><p>Tu cuenta ha sido creada exitosamente.</p>`
        });
        console.log("Correo enviado");
    } catch (error) {
        console.error("Error al enviar correo:", error);
    }
};

module.exports = { enviarCorreoBienvenida };