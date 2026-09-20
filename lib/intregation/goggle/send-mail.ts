import nodemailer from "nodemailer";
import { google } from "googleapis";
import { clerkClient } from "@clerk/nextjs/server";
import { auth } from "@clerk/nextjs";
import { getUserPrivateData } from "@/actions/get-user-privatedata";

// OAuth2 credentials from your environment variables
const CLIENT_ID = process.env.GOOGLE_CLIENT_ID!;
const CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET!;
const REDIRECT_URI =
  process.env.GOOGLE_REDIRECT_URI || "http://localhost:3000/api/callback";

// Initialize the OAuth2 client
const oauth2Client = new google.auth.OAuth2(
  CLIENT_ID,
  CLIENT_SECRET,
  REDIRECT_URI
);

export const MailSend = async ({
  to,
  subject,
  text,
}: {
  to: string;
  subject: string;
  text: string;
}) => {
  const { userId } = auth();

  if (!userId) return null;

  const {
    google_access_token,
    google_gmail,
    google_refresh_token,
    google_scopes,
    google_token_expiry,
    hasCalender,
    hasEmail,
  } = await getUserPrivateData(userId);

  if (!google_refresh_token) return "User is not authozire for sending email";
  // Set the refresh token for the OAuth2 client
  oauth2Client.setCredentials({ refresh_token: google_refresh_token });
  try {
    // Get a fresh access token (this will automatically refresh if needed)

    // Create the HTML content for the email
    const content = `
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
            <p style="white-space: pre-wrap; font-family: sans-serif; font-size: 16px; color: black;">${text}</p>
            <div class="footer">
              &copy; ${new Date().getFullYear()} Camero AI. All rights reserved.
            </div>
          </div>
        </body>
      </html>
    `;

    // Create a Nodemailer transporter using OAuth2 authentication
    let transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        type: "OAuth2",
        user: google_gmail, // your Gmail address
        clientId: CLIENT_ID,
        clientSecret: CLIENT_SECRET,
        refreshToken: google_refresh_token,
        accessToken: google_access_token as string,
      },
    });

    // Send the email
    let info = await transporter.sendMail({
      from: google_gmail,
      to,
      subject,
      html: content,
    });

    console.log("Message Sent:", info);
  } catch (error) {
    console.error("Error sending mail:", error);
  }
};
