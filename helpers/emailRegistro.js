import nodemailer from "nodemailer";

const registroEmail = async (datos) => {
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const { email, nombre, token } = datos;
  //Enviar Email
  const info = await transporter.sendMail({
    from: "APV - Administrador de Pacientes de Veterinaria",
    to: email,
    subject: "Confirma tu Cuenta en APV",
    text: "Comprueba tu Cuenta en APV",
    html: `<p>Hola ${nombre} confirma tu cuenta en APV</p>
            <p>Tu cuenta esta lista, solo debes comprobarla en el siguiente enlace:
            <a href="${process.env.FRONTEND_URL}/confirmar/${token}">Verificar Cuenta</a></p>

            <p>Si no solicitaste una cuenta en APV, puedes ignorar este mensaje.</p>
    `
  });
};

export default registroEmail;
