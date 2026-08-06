const nodemailer = require('nodemailer');

const configurado = Boolean(process.env.SMTP_USER && process.env.SMTP_PASSWORD);

const transporter = configurado
  ? nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD,
      },
    })
  : null;

async function enviarCorreo({ to, subject, html }) {
  if (!transporter) {
    console.warn('[mailer] SMTP no configurado (falta SMTP_USER/SMTP_PASSWORD); correo no enviado a', to);
    return;
  }

  await transporter.sendMail({ from: process.env.SMTP_FROM, to, subject, html });
}

module.exports = { enviarCorreo, configurado };
