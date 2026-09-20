import { getUserPrivateData } from "@/actions/get-user-privatedata";
import getOrganization from "@/actions/get-organization";
import { auth } from "@clerk/nextjs";
import axios from "axios";
import { updateUserPrivateData } from "@/actions/update-privatedata";

// const JIRA_API_BASE = "https://api.atlassian.com/ex/jira";

interface JiraIssuePayload {
  summary: string;
  description: string;
  issueType: string;
  projectKey: string;
  issueId: string
}


export const createJiraIssue = async ({
  summary,
  description,
  issueType,
  projectKey,
  issueId,
}: JiraIssuePayload) => {
  try {
    // Fetch user credentials from Clerk
    const { userId } = auth();
    if (!userId) return null;
    const userData = await getUserPrivateData(userId);

    const organization = await getOrganization();
    const organizationDomain = organization?.orgJiraDomain;

    if (!userData.jira_access_token || !userData.jira_refresh_token) {
      throw new Error("Jira access token is missing. Please connect Jira.");
    }

    if (!organizationDomain) {
      throw new Error("Jira domain is not configured in organization settings.");
    }

    const org = await getOrganization()
    const YOUR_CLOUD_ID = org?.orgJiraDomain;

    // Use cloud API endpoint
    // const jiraApiUrl = `https://${organizationDomain}/rest/api/2/issue`;
    const tryURL = `https://api.atlassian.com/ex/jira/${YOUR_CLOUD_ID}/rest/api/3/issue`

    // Prepare issue payload with required fields
    const issueData = {
      fields: {
        project: {
          key: projectKey,
        },
        summary: summary,
        description: {
          type: "doc",
          version: 1,
          content: [
            {
              type: "paragraph",
              content: [{ type: "text", text: description }],
            },
          ],
        },
        issuetype: {
          id: issueId,
          name: issueType,
        },
      },
    };

    const makeRequest = async (accessToken: string) => {
      return axios.post(tryURL, issueData, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      });
    };

    try {
      // Try creating the Jira issue with the current token
      const response = await makeRequest(userData.jira_access_token);
      return response.data;
    } catch (error: any) {
      // If unauthorized, refresh token and retry
      if (error.response?.status === 401) {
        console.log("Access token expired. Refreshing...");

        // Refresh token request
        const refreshResponse = await axios.post(
          "https://auth.atlassian.com/oauth/token",
          {
            grant_type: "refresh_token",
            client_id: process.env.JIRA_CLIENT_ID,
            client_secret: process.env.JIRA_CLIENT_SECRET,
            refresh_token: userData.jira_refresh_token,
          },
          {
            headers: { "Content-Type": "application/json" },
          }
        );

        // Update tokens in Clerk
        const newAccessToken = refreshResponse.data.access_token;
        const newRefreshToken = refreshResponse.data.refresh_token;

        await updateUserPrivateData(userId, {
          jira_access_token: newAccessToken,
          jira_refresh_token: newRefreshToken,
        });

        console.log("Token refreshed. Retrying request...");

        // Retry the request with the new token
        const retryResponse = await makeRequest(newAccessToken);
        return retryResponse.data;
      } else {
        throw error;
      }
    }
  } catch (error) {
    console.error("Error creating Jira issue:", error);
    throw error;
  }
};


export const fetchJiraProjects = async () => {
  const { userId } = auth();
  if (!userId) throw new Error("User not authenticated");

  const { jira_access_token } = await getUserPrivateData(userId);
  if (!jira_access_token)
    throw new Error("Jira is not connected. Authenticate first.");

  const jiraApiUrl = "https://yourcompany.atlassian.net/rest/api/3/project/search";

  try {
    const response = await axios.get(jiraApiUrl, {
      headers: {
        Authorization: `Bearer ${jira_access_token}`,
        Accept: "application/json",
      },
    });

    return response.data.values.map((project: any) => ({
      key: project.key,
      name: project.name,
    }));
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error("Error fetching Jira projects:", error.response?.data || error.message);
    } else {
      console.error("Error fetching Jira projects:", error);
    }
    throw new Error("Failed to fetch Jira projects.");
  }
};




    // fetch('https://your-domain.atlassian.net/rest/api/3/issue', {
    //   method: 'POST',
    //   headers: {
    //     'Authorization': `Basic ${Buffer.from(
    //       'email@example.com:<api_token>'
    //     ).toString('base64')}`,
    //     'Accept': 'application/json',
    //     'Content-Type': 'application/json'
    //   },
    //   body: bodyData
    // })
    // .then(response => {
    //   console.log(
    //     `Response: ${response.status} ${response.statusText}`
    //   );
    //   return response.text();
    // })
    // .then(text => console.log(text))
    // .catch(err => console.error(err));

    // Make request to Jira API with correct headers
    // c6055cfe-6187-426c-bfea-c35fc624fdd9