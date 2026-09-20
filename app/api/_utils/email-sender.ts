import { User } from "@prisma/client";
import { createTransport } from "nodemailer";

export function generateCredentialEmailTemplate(
  userEmail: any,
  userPassword: any
): string {
  return `
  <!DOCTYPE html>
  <html>
    <head>
      <meta charset="utf-8">
      <title>Your Login Credentials</title>
      <style>
        body {
          background-color: #f7f7f7;
          font-family: Arial, sans-serif;
          margin: 0;
          padding: 0;
          color: #333;
        }
        .container {
          max-width: 600px;
          margin: 30px auto;
          background: #ffffff;
          border-radius: 8px;
          overflow: hidden;
          box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        }
        .header {
          background: #007BFF;
          padding: 20px;
          text-align: center;
          color: #ffffff;
          font-size: 24px;
          font-weight: bold;
        }
        .content {
          padding: 20px;
          line-height: 1.6;
        }
        .credentials {
          background: #f1f1f1;
          padding: 15px;
          border-radius: 4px;
          margin: 20px 0;
        }
        .credentials p {
          margin: 8px 0;
          font-size: 16px;
        }
        .button {
          display: inline-block;
          padding: 12px 20px;
          background: #28a745;
          color: #ffffff !important;
          text-decoration: none;
          border-radius: 4px;
          font-size: 16px;
          margin-top: 20px;
        }
        .footer {
          background: #f1f1f1;
          text-align: center;
          padding: 10px;
          font-size: 12px;
          color: #777;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          Welcome to Our Service!
        </div>
        <div class="content">
          <p>Hello,</p>
          <p>Thank you for joining us. Below are your credentials to log in:</p>
          <div class="credentials">
            <p><strong>Username:</strong> ${userEmail}</p>
            <p><strong>Password:</strong> ${userPassword}</p>
          </div>
          <p>To get started, please click the button below to sign in:</p>
          <p style="text-align: center;">
            <a class="button" href=${process.env.WEBSITE_URL}>Sign In</a>
          </p>
          <p>If you have any questions or need support, feel free to contact our team.</p>
          <p>Best regards,<br>The Team</p>
        </div>
        <div class="footer">
          &copy; ${new Date().getFullYear()} Camero AI. All rights reserved.
        </div>
      </div>
    </body>
  </html>
  `;
}

const sendEmail = async (user: User): Promise<Boolean> => {
  let transporter = createTransport({
    service: "Gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  try {
    const info = await transporter.sendMail({
      from: process.env.EMAIL_USER, // sender address
      to: `${user.email}`, // list of receivers
      subject: "Login credential", // Subject line

      html: generateCredentialEmailTemplate(user.email, user.password),
    });

    console.log("Message Sent", info.messageId);

    return true;
  } catch (error) {
    console.error("Error sending mail: ", error);
    return false;
  }
};

export { sendEmail };
