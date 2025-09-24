import nodemailer from 'nodemailer';
import ServerRequestError from '../errors/ServerRequestError.js';

export const sendMail = async (from: string, to: string, subject: string, html: string) => {
  const transporter = nodemailer.createTransport({
    service: process.env.MAIL_HOST,
    auth: {
      user: process.env.MAIL_USERNAME,
      pass: process.env.MAIL_PASSWORD
    }
  });

  const mailOptions = {
    from: from,
    to: to,
    subject: subject,
    html: html
  };
  try {
    await transporter.sendMail(mailOptions);
  }
  catch (err) {
    throw new ServerRequestError({
      code: 500,
      message: "Failed to send email",
      logging: true,
      context: { error: err }
    });
  }
}