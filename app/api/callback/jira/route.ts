// File: app/api/jira/callback/route.ts

import { NextRequest, NextResponse } from "next/server";
import axios from "axios";
import { clerkClient } from "@clerk/nextjs/server";
import { auth } from "@clerk/nextjs";
import getUser from "@/actions/get-user";
import { db } from "@/lib/db";

export async function GET(req: NextRequest) {
  // Extract the "code" query parameter
  const { searchParams } = new URL(req.url);
  const code = searchParams.get("code");
  const { userId } = auth();
  if (!code) {
    return NextResponse.json(
      { error: "Missing authorization code" },
      { status: 400 }
    );
  }

  if (!userId)
    return NextResponse.json({ error: " unauthorization " }, { status: 400 });

  try {
    // Exchange the code for an access token and refresh token
    const tokenResponse = await axios.post(
      "https://auth.atlassian.com/oauth/token",
      {
        grant_type: "authorization_code",
        client_id: process.env.JIRA_CLIENT_ID,
        client_secret: process.env.JIRA_CLIENT_SECRET,
        code,
        redirect_uri: process.env.JIRA_REDIRECT_URI,
      },
      {
        headers: { "Content-Type": "application/json" },
      }
    );

    // Destructure the token fields from the response
    console.log(tokenResponse.data);
    const { access_token, refresh_token, expires_in, scope, token_type } =
      tokenResponse.data;
    console.log({ access_token, refresh_token, expires_in, scope, token_type });

    // Fetch cloud ID using the access token
    const user = await getUser()
    if(user?.role === "ADMIN"){
    const cloudResponse = await axios.get(
      "https://api.atlassian.com/oauth/token/accessible-resources",
      {
        headers: {
          Authorization: `Bearer ${access_token}`,
          Accept: "application/json",
        },
      }
    );

    if (!cloudResponse.data || cloudResponse.data.length === 0) {
      throw new Error("No Jira Cloud resources found");
    }

    const cloudId = cloudResponse.data[0].id; // Extract Cloud ID
      await db.organization.update({
        where: {
          id: user.organizationId || undefined
        },
        data: {
          orgJiraDomain: cloudId
        }
      });
    }
    


    await clerkClient.users.updateUserMetadata(userId, {
      privateMetadata: {
        jira_access_token: access_token,
        jira_refresh_token: refresh_token,
        jira_token_expiry: expires_in, // or a Date.now() + expires_in * 1000, if you prefer a timestamp
        jira_scopes: scope?.split(" "),
        // you can also store `token_type` if needed
        jira_token_type: token_type,
      },
    });

    // (Optional) Store tokens in your DB or Clerk. For now, just return them.
    return NextResponse.json("succesfull");
  } catch (error) {
    console.error("Error exchanging code for token:", error);
    return NextResponse.json(
      { error: "Failed to exchange code" },
      { status: 500 }
    );
  }
}
