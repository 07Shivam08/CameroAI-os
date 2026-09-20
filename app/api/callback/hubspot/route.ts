// File: app/api/hubspot/callback/route.ts

import { NextRequest, NextResponse } from "next/server";
import axios from "axios";
import { clerkClient } from "@clerk/nextjs/server";
import { auth } from "@clerk/nextjs";
import getUser from "@/actions/get-user";
import { db } from "@/lib/db";

export async function GET(req: NextRequest) {
  // Extract the "code" query parameter from the URL
  const { searchParams } = new URL(req.url);
  const code = searchParams.get("code");
  const { userId } = auth();
  
  if (!code) {
    return NextResponse.json(
      { error: "Missing authorization code" },
      { status: 400 }
    );
  }
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 400 });
  }

  try {
    // Exchange the code for an access token and refresh token from HubSpot
    const tokenResponse = await axios.post(
      "https://api.hubapi.com/oauth/v1/token",
      new URLSearchParams({
        grant_type: "authorization_code",
        client_id: process.env.HUBSPOT_CLIENT_ID || "",
        client_secret: process.env.HUBSPOT_CLIENT_SECRET || "",
        code,
        redirect_uri: process.env.HUBSPOT_REDIRECT_URI || "",
      }),
      {
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
      }
    );

    console.log(tokenResponse.data);
    const { access_token, refresh_token, expires_in, scope } = tokenResponse.data;
    console.log({ access_token, refresh_token, expires_in, scope });

    // (Optional) You can fetch additional HubSpot account details here if needed.
    // For example, call the HubSpot "Get current user" endpoint if required.

    // Save tokens and additional info in Clerk user's private metadata
    await clerkClient.users.updateUserMetadata(userId, {
      privateMetadata: {
        hubspot_access_token: access_token,
        hubspot_refresh_token: refresh_token,
        hubspot_token_expiry: expires_in, // You may convert this to a timestamp if needed
        hubspot_scopes: scope ? scope.split(" ") : [],
      },
    });

    return NextResponse.json("Successful");
  } catch (error) {
    console.error("Error exchanging code for HubSpot token:", error);
    return NextResponse.json(
      { error: "Failed to exchange code" },
      { status: 500 }
    );
  }
}
