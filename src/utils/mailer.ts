import nodemailer from "nodemailer";
import { MailtrapClient } from "mailtrap";

export const transporter = nodemailer.createTransport({
  host: "sandbox.smtp.mailtrap.io",
  port: 587,
  secure: false,
  auth: {
    user: process.env.MAILTRAP_USER,
    pass: process.env.MAILTRAP_PASS,
  },
});

transporter.verify(function (error, success) {
  if (error) {
    console.log("Error verifying mail transporter:", error);
  } else {
    console.log("Mailer is ready to send messages");
  }
});

export async function sendConfirmationEmail(to: string, token: string) {
  const confirmationUrl = `http://localhost:3000/api/v1/user/confirm-registration?token=${token}`;
  console.log(to);
  try {
    await transporter.sendMail({
      from: "Echolink <no-reply@echolink.fr",
      to,
      subject: "Validation de l'inscription",
      html: `
        <h1>Valider votre email</h1>
        <p>Cliquez sur le lien ci-dessous pour valider votre adresse mail:</p>
        <a href="${confirmationUrl}">${confirmationUrl}</a>
      `,
    });
  } catch (err) {
    console.error("Error when seding email: ", err);
  }
}
