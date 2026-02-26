// Resend - Servicio de correo transaccional
const { Resend } = require('resend');

const resend = new Resend(process.env.RESEND_API_KEY);

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
