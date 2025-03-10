// import nodemailer
import nodemailer from "nodemailer";
import fs from "fs";
import path from "path";

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: true,
  auth: {
    user: process.env.SMTP_USER_NAME,
    pass: process.env.SMTP_PASSWORD,
  },
});

const loadEmailTemplate = (clientName: string, url: string): string => {
  const templatePath = path.join(
    __dirname,
    `../config/emailTemplates/PlantillaSolicitudDeDocumentos.html`
  );
  let template = fs.readFileSync(templatePath, "utf8");

  const regexName = new RegExp(`{{clientName}}`, "g");
  const regexURL = new RegExp(`{{url}}`, "g");
  template = template.replace(regexName, clientName);
  template = template.replace(regexURL, url);
  return template;
};

export const sendEmail = async (
  to: string,
  subject: string,
  body: string
): Promise<Boolean> => {
  try {
    const info = await transporter.sendMail({
      from: process.env.SENDER_EMAIL!,
      to, // Only verified addresses in sandbox mode
      subject,
      text: body,
    });

    console.log(`Email sent: ${info.messageId}`);
    return true;
  } catch (error) {
    console.error("Error sending email:", error);
    return false;
  }
};

export const sendEmailWithTemplate = async (
  to: string,
  clientName: string,
  url: string
): Promise<boolean> => {
  try {
    const htmlContent = loadEmailTemplate(clientName, url);

    const info = await transporter.sendMail({
      from: process.env.SENDER_EMAIL!,
      to, // Only verified addresses in sandbox mode
      subject: `Solicitud Documentos ${clientName}`,
      html: htmlContent,
    });

    console.log(`Email sent: ${info.messageId}`);
    return true;
  } catch (error) {
    console.error("Error sending email with template:", error);
    return false;
  }
};
