import { clerkClient } from "@clerk/nextjs/server";

type PrivateMetadata = {
  // Google metadata
  google_scopes?: string[];
  google_access_token?: string;
  google_refresh_token?: string;
  google_token_expiry?: number;
  google_gmail?: string;

  // Jira metadata
  jira_access_token?: string;
  jira_refresh_token?: string;
  jira_token_expiry?: number;
  jira_scopes?: string[];

  // HubSpot metadata
  hubspot_access_token?: string;
  hubspot_refresh_token?: string;
  hubspot_token_expiry?: number;
  hubspot_scopes?: string[];
};

export const getUserPrivateDataBoolean = async (
  userId: string
): Promise<{
  hasEmail: boolean;
  hasCalender: boolean;
  hasJira: boolean;
  hasHubspot: boolean;
}> => {
  // Fetch the user from Clerk
  const user = await clerkClient.users.getUser(userId);
  const metaData = user.privateMetadata as PrivateMetadata | null;

  // Safely handle google_scopes
  const google_scopes = metaData?.google_scopes || [];

  // Determine if Jira is connected (by checking for an access token)
  const hasJira = Boolean(metaData?.jira_access_token);

  // Determine if HubSpot is connected (by checking for an access token)
  const hasHubspot = Boolean(metaData?.hubspot_access_token);

  return {
    hasEmail: google_scopes.includes("https://mail.google.com/"),
    hasCalender: google_scopes.includes("https://www.googleapis.com/auth/calendar.events"),
    hasJira,
    hasHubspot,
  };
};

export const getUserPrivateData = async (
  userId: string
): Promise<{
  // Google tokens
  google_access_token: string;
  google_refresh_token: string;
  google_token_expiry: number;
  google_scopes: string[];
  google_gmail: string;
  hasEmail: boolean;
  hasCalender: boolean;

  // Jira tokens
  jira_access_token: string;
  jira_refresh_token: string;
  jira_token_expiry: number;
  jira_scopes: string[];
  hasJira: boolean;

  // HubSpot tokens
  hubspot_access_token: string;
  hubspot_refresh_token: string;
  hubspot_token_expiry: number;
  hubspot_scopes: string[];
  hasHubspot: boolean;
}> => {
  // Fetch user metadata from Clerk
  const user = await clerkClient.users.getUser(userId);
  const metaData = user.privateMetadata as
    | {
        // Google
        google_access_token?: string;
        google_refresh_token?: string;
        google_token_expiry?: number;
        google_scopes?: string[];
        google_gmail?: string;
        // Jira
        jira_access_token?: string;
        jira_refresh_token?: string;
        jira_token_expiry?: number;
        jira_scopes?: string[];
        // HubSpot
        hubspot_access_token?: string;
        hubspot_refresh_token?: string;
        hubspot_token_expiry?: number;
        hubspot_scopes?: string[];
      }
    | null;

  // Extract Google metadata
  const google_access_token = metaData?.google_access_token || "";
  const google_refresh_token = metaData?.google_refresh_token || "";
  const google_token_expiry = metaData?.google_token_expiry || 0;
  const google_scopes: string[] = metaData?.google_scopes || [];
  const google_gmail = metaData?.google_gmail || "";

  // Extract Jira metadata
  const jira_access_token = metaData?.jira_access_token || "";
  const jira_refresh_token = metaData?.jira_refresh_token || "";
  const jira_token_expiry = metaData?.jira_token_expiry || 0;
  const jira_scopes: string[] = metaData?.jira_scopes || [];

  // Extract HubSpot metadata
  const hubspot_access_token = metaData?.hubspot_access_token || "";
  const hubspot_refresh_token = metaData?.hubspot_refresh_token || "";
  const hubspot_token_expiry = metaData?.hubspot_token_expiry || 0;
  const hubspot_scopes: string[] = metaData?.hubspot_scopes || [];

  return {
    // Google tokens
    google_access_token,
    google_refresh_token,
    google_token_expiry,
    google_scopes,
    google_gmail,
    hasEmail: google_scopes.includes("https://mail.google.com/"),
    hasCalender: google_scopes.includes("https://www.googleapis.com/auth/calendar.events"),

    // Jira tokens
    jira_access_token,
    jira_refresh_token,
    jira_token_expiry,
    jira_scopes,
    hasJira: jira_scopes.length > 0,

    // HubSpot tokens
    hubspot_access_token,
    hubspot_refresh_token,
    hubspot_token_expiry,
    hubspot_scopes,
    hasHubspot: hubspot_scopes.length > 0,
  };
};

export type Tverified = Awaited<ReturnType<typeof getUserPrivateDataBoolean>>;
