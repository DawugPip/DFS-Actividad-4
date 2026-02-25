const nodemailer = require('nodemailer');

// 1. Configuramos quién envía el correo
const transporter = nodemailer.createTransport({
    host: "smtp-mail.outlook.com", // Servidor de Outlook
    port: 587,
    secure: false, // TLS
    auth: {
        user: process.env.EMAIL_USER, // Tu correo
        pass: process.env.EMAIL_PASS  // Tu contraseña normal (o de aplicación si tienes 2FA)
    },
    tls: {
        ciphers: 'SSLv3'
    }
});

// 2. Función para enviar el correo
const enviarCorreoBienvenida = async (emailUsuario) => {
    try {
        await transporter.sendMail({
            from: '"Gestión de Productos 📦" <pur@gmail.com>',
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