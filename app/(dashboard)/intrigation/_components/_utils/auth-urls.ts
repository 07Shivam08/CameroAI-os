"use server";

export const getGoogleAuthURL = async () => {
  const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
  const GOOGLE_REDIRECT_URI = process.env.GOOGLE_REDIRECT_URI!;
  const CALENDAR_SCOPE = "https://www.googleapis.com/auth/calendar.events";
  const GMAIL_SCOPE = "https://mail.google.com/";
  const SCOPES = `${CALENDAR_SCOPE} ${GMAIL_SCOPE} openid email`; // space-separated list
  const url = new URL("https://accounts.google.com/o/oauth2/v2/auth");
  url.searchParams.append("client_id", GOOGLE_CLIENT_ID as string);
  url.searchParams.append("redirect_uri", GOOGLE_REDIRECT_URI);
  url.searchParams.append("response_type", "code");
  url.searchParams.append("scope", SCOPES);
  url.searchParams.append("access_type", "offline");
  url.searchParams.append("prompt", "consent"); // Forces account selection
  return url.toString();
};

//----------------------------------------------------------------------------------------------------------------------------
export const getJiraAuthURL = async () => {
  const clientId = process.env.JIRA_CLIENT_ID;
  const redirectUri = process.env.JIRA_REDIRECT_URI;
  const scopes =
    process.env.JIRA_SCOPES || "read:jira-work write:jira-work offline_access"; // Default scopes
  const stateValue = "some-random-string-or-uuid"; // Or generate dynamically
  const audience = "api.atlassian.com";
  const prompt = "consent";

  // Construct the full URL
  return `https://auth.atlassian.com/authorize?audience=${audience}&client_id=${clientId}&scope=${encodeURIComponent(
    scopes
  )}&redirect_uri=${encodeURIComponent(
    redirectUri!
  )}&state=${stateValue}&response_type=code&prompt=${prompt}`;
};

//----------------------------------------------------------------------------------------------------------------------------

export const getHubspotAuthURL = async () => {
  const clientId = process.env.HUBSPOT_CLIENT_ID;
  const redirectUri = process.env.HUBSPOT_REDIRECT_URI;
  const scopes = process.env.HUBSPOT_SCOPES || "oauth"; // Default scopes; adjust as needed
  const stateValue = "some-random-string-or-uuid"; // Consider generating a dynamic state for security

  // Construct the full HubSpot OAuth URL
  return `https://app.hubspot.com/oauth/authorize?client_id=${clientId}&redirect_uri=${encodeURIComponent(
    redirectUri!
  )}&scope=${encodeURIComponent(
    scopes
  )}&state=${stateValue}&response_type=code`;
};
