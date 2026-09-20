import { google } from "googleapis";

import { auth } from "@clerk/nextjs";
import { getUserPrivateData } from "@/actions/get-user-privatedata";

// OAuth2 credentials from your environment variables
const CLIENT_ID = process.env.GOOGLE_CLIENT_ID!;
const CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET!;
const REDIRECT_URI = process.env.GOOGLE_REDIRECT_URI || "http://localhost:3000/api/callback";

// Initialize the OAuth2 client
const oauth2Client = new google.auth.OAuth2(
  CLIENT_ID,
  CLIENT_SECRET,
  REDIRECT_URI
);

export const CreateCalendarEvent = async ({
  summary,
  location,
  description,
  start,
  end,
}: {
  summary: string;
  location?: string;
  description?: string;
  start: string; // ISO 8601 format, e.g. "2025-03-01T10:00:00-07:00"
  end: string;   // ISO 8601 format, e.g. "2025-03-01T11:00:00-07:00"
}) => {
  // Get the authenticated Clerk user
  const { userId } = auth();
  if (!userId) return null;

  // Retrieve the stored tokens from Clerk metadata
   const {google_refresh_token , hasCalender,hasEmail} = await getUserPrivateData(userId)
 
  if (!google_refresh_token) return "User is not authorized for creating events";

  // Set the refresh token (this allows automatic refresh if needed)
  oauth2Client.setCredentials({ refresh_token: google_refresh_token });

  try {
    // Initialize the Calendar API client
    const calendar = google.calendar({ version: 'v3', auth: oauth2Client });
    
    // Define the event details
    const event = {
      summary,
      location,
      description,
      start: {
        dateTime: start,
        timeZone: 'Asia/Kolkata', // Adjust this if needed
      },
      end: {
        dateTime: end,
        timeZone: 'Asia/Kolkata',
      },
    };

    // Insert the event into the user's primary calendar
    const response = await calendar.events.insert({
      calendarId: 'primary',
      requestBody: event,
    });
    console.log("Event Created:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error creating calendar event:", error);
    return { error };
  }
};


// Add after CreateCalendarEvent function

export const GetCalendarEvents = async ({timeMin, timeMax}: { timeMin: Date; timeMax: Date }) => {
  // Get the authenticated Clerk user
  const { userId } = auth();
  if (!userId) return null;

  const {google_refresh_token , hasCalender,hasEmail} = await getUserPrivateData(userId)

  if(!hasCalender) return "User has not provided the rights of calendar"
  if (!google_refresh_token) return "User is not authorized for creating events";

  // Set the refresh token
  oauth2Client.setCredentials({ refresh_token: google_refresh_token });

  try {
    // Initialize the Calendar API client
    const calendar = google.calendar({ version: 'v3', auth: oauth2Client });
    

    const response = await calendar.events.list({
      calendarId: 'primary',
      timeMin: timeMin.toISOString(),
      timeMax: timeMax.toISOString(),
      singleEvents: true,
      orderBy: 'startTime',
    });

    const events = response.data.items;
    if (!events || events.length === 0) {
      return { message: "No upcoming events found." };
    }

    // Format and return the events
    return events.map(event => ({
      id: event.id,
      summary: event.summary,
      description: event.description,
      location: event.location,
      start: event.start?.dateTime || event.start?.date,
      end: event.end?.dateTime || event.end?.date,
      status: event.status,
      htmlLink: event.htmlLink
    }));

  } catch (error) {
    console.error("Error fetching calendar events:", error);
    return { error };
  }
};