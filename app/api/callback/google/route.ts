import { NextRequest, NextResponse } from "next/server";
import { clerkClient , auth } from "@clerk/nextjs/server";
import { google } from "googleapis";
 

// Read your credentials from environment variables
const CLIENT_ID = process.env.GOOGLE_CLIENT_ID!;
const CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET!;
const REDIRECT_URI =  process.env.GOOGLE_REDIRECT_URI || "http://localhost:3000/api/callback";

// Initialize OAuth2 client
const oauth2Client = new google.auth.OAuth2(
  CLIENT_ID,
  CLIENT_SECRET,
  REDIRECT_URI
);

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const code = searchParams.get("code");

  if (!code) {
    return NextResponse.json(
      { error: "Missing code parameter" },
      { status: 400 }
    );
  }

  // Get the authenticated Clerk user
  const { userId} =  auth();
 
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    // Exchange the code for tokens
    const { tokens } = await oauth2Client.getToken(code);

    const ticket = await oauth2Client.verifyIdToken({
      idToken: tokens.id_token!,
      
      audience: CLIENT_ID,
    });
 const useremail = (await clerkClient.users.getUser(userId)).emailAddresses[0].emailAddress
    console.log(useremail)

    if (
      
      useremail !== ticket.getPayload()?.email
    ) {
      return NextResponse.json(
        {
          error:
            "The authorized Google account does not match the previously connected account. Please reauthorize with the same account.",
        },
        { status: 400 }
      );
    }
    // Update the user's private metadata in Clerk with the Google tokens
    await clerkClient.users.updateUserMetadata(userId, {
      privateMetadata: {
        google_access_token: tokens.access_token,
        google_refresh_token: tokens.refresh_token,
        google_token_expiry: tokens.expiry_date,
        google_scopes: tokens.scope?.split(" "),
        google_gmail: ticket.getPayload()?.email ?? "", // expiry_date is typically a Unix timestamp in milliseconds
      },
    });

  
    return NextResponse.json(`${process.env.NEXT_PUBLIC_APP_URL}/intrigation`);
  } catch (error) {
    console.error("Error exchanging code for token:", error);
    return NextResponse.json(
      { error: "Failed to exchange code for tokens" },
      { status: 500 }
    );
  }
}
