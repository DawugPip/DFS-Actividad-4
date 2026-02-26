/*Enviar un correo con cualquier servicio de correo electrónico (como Gmail o outlook) utilizando nodemailer en Node.js.
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

NOTA: Ahora tenemos el problema claro! El error es "Connection timeout" (ETIMEDOUT). Esto significa que Render está bloqueando las conexiones salientes al servidor de Gmail.

Este es un problema conocido con Render - su infraestructura bloquea los puertos SMTP salientes (25, 465, 587) en los planes gratuitos.

Solución recomendada: Usa un servicio de correo transaccional gratuito como Resend o Mailgun. Estos funcionan perfectamente con Render."
"

*/

//Resen deidad
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY); //Esa madre es el api key
//el api key es como la contraseña para usar el servicio de correo

const enviarCorreoBienvenida = async (emailUsuario) => {
  try {
    const data = await resend.emails.send({
      from: 'onboarding@resend.dev',
      to: emailUsuario,
      subject: '¡Bienvenido al sistema!',
      html: `<h1>Hola ${emailUsuario}</h1><p>Tu cuenta ha sido creada exitosamente.</p>`
    });
    console.log("Correo enviado:", data);
  } catch (error) {
    console.error("Error al enviar correo:", error);
  }
};

module.exports = { enviarCorreoBienvenida };
