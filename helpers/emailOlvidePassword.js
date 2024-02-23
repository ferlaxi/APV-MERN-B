import nodemailer from "nodemailer";

const olvidePassword = async (datos) => {
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
    subject: "Reestablece tu Password",
    text: "Reestablece tu Password",
    html: `<p>Hola ${nombre} haz solicitado reestablecer tu password</p>
            <p>Sigue el siguiente enlace para generar un nuevo Password:
            <a href="${process.env.FRONTEND_URL}/olvide-password/${token}">Enlace</a></p>

            <p>Si no solicitaste restaurar tu Password en APV, puedes ignorar este mensaje.</p>
    `
  });
};

export default olvidePassword;
