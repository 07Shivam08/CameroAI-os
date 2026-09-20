import { z } from "zod";
import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { streamText, Message, tool, generateText } from "ai";
import { db } from "@/lib/db";
import { MailSend } from "@/lib/intregation/goggle/send-mail";
import { getAuth } from "@clerk/nextjs/server";
import { NextRequest } from "next/server";
import { MainPrompt2 } from "@/lib/prompts";
import {
  CreateCalendarEvent,
  GetCalendarEvents,
} from "@/lib/intregation/goggle/calender";
import { Pinecone } from "@pinecone-database/pinecone";
import { createJiraIssue } from "@/lib/intregation/jira/issue";
import { fetchJiraProjects } from "@/lib/intregation/jira/issue";

// Google Generative AI setup
const google = createGoogleGenerativeAI({
  apiKey: process.env.GOOGLE_GENERATIVE_AI_API_KEY as string,
});

export const runtime = "nodejs";

const model = google("gemini-2.0-flash");
// const model1 = google.textEmbeddingModel("text-embedding-004");

// Pinecone setup
const pinecone = new Pinecone({
  apiKey: process.env.PINECONE_API_KEY as string,
});

const genid = () => Math.random().toString(36).slice(2, 15);

export async function POST(req: NextRequest) {
  try {
    const user = getAuth(req);
    const userid = user.userId;
    const org = await db.user.findFirst({
      where: {
        userId: userid || "",
      },
      include: {
        organization: true,
      },
    });

    const body = await req.json();
    const { messages, chatId }: { messages: Array<Message>; chatId?: string } =
      body;

    // Handle chat creation or retrieval
    let currentChat;
    if (chatId) {
      currentChat = await db.chat.findFirst({
        where: { id: chatId, userId: userid || "" },
        include: {
          messages: {
            orderBy: { createdAt: "desc" },
            take: 10, // Only get last 10 messages for context
          },
        },
      });
    }

    // If no chat exists or chatId not provided, create a new one
    if (!currentChat) {
      // Check if user already has 5 chats
      const existingChatsCount = await db.chat.count({
        where: { userId: userid || "" },
      });

      if (existingChatsCount >= 5) {
        return new Response("Maximum chat limit reached (5 chats)", {
          status: 400,
        });
      }

      currentChat = await db.chat.create({
        data: {
          userId: userid || "",
          title: messages[0]?.content?.substring(0, 50) || "New Chat",
        },
        include: {
          messages: true,
        },
      });
    }

    // Save the current user message
    const lastMessage = messages[messages.length - 1];
    if (lastMessage && lastMessage.role === "user") {
      await db.message.create({
        data: {
          chatId: currentChat.id,
          role: lastMessage.role,
          content: lastMessage.content,
        },
      });
    }

    // Use only the last 10 messages for AI context (reverse to get chronological order)
    const contextMessages = currentChat.messages
      .slice(-10)
      .reverse()
      .map((msg: any) => ({
        id: msg.id,
        role: msg.role as "user" | "assistant",
        content: msg.content,
      }));

    // Add the current user message if it's not already saved
    if (lastMessage && lastMessage.role === "user") {
      contextMessages.push({
        id: lastMessage.id || genid(),
        role: lastMessage.role,
        content: lastMessage.content,
      });
    }

    const pineconeIndex = pinecone.Index(org?.organization?.id!); // Replace with your Pinecone index name

    const knowledge = org?.organization?.knowledgeBase
      ? `Organization Knowledge: ${org.organization.knowledgeBase}`
      : `User hasn't filled any data. Respond with: "First fill your data sir! PLEASE 🫡"`;

    // const newIssue = await createJiraIssue(
    //   {
    //     summary: "Bug in login flow",
    //     description: "Users are unable to log in with social authentication.",
    //     issueType: "Bug",
    //     projectKey: "KAN",
    //     issueId: "10005"
    //   }
    // );

    // console.log("Created Issue:", newIssue);

    // Get the latest user message
    // const lastUserMessage =
    //   messages.filter((msg) => msg.role === "user").pop()?.content || "";

    // // Create embedding for the user's query
    // const userEmbedding = await model1.doEmbed({ values: [lastUserMessage] });

    // const queryResults = await pineconeIndex.query({
    //   vector: userEmbedding.embeddings[0], // Use first embedding
    //   topK: 3, // Fetch top 3 most relevant
    //   includeMetadata: true,
    // });

    // console.log(queryResults)

    // // Extract relevant contexts
    // const relevantContexts = queryResults.matches
    // .filter((match) => match.score !== undefined && match.score >= 0.5)
    // .map(match => match.metadata?.text)
    // .filter(Boolean)
    // .join("\n");

    const mainPrompt: string = await MainPrompt2(req);

    const prompt = (messages: Message[]): Message[] => [
      {
        id: genid(),
        role: "system",
        content: mainPrompt,
      },
      {
        id: genid(),
        role: "system",
        content:
          knowledge ||
          `Whatever user says, just say, "First fill your data sir! PLEASE 🫡"`,
      },
      // {
      //   id: genid(),
      //   role: "system",
      //   content: `Relevant Policies:\n${relevantContexts}`,
      // },
      ...messages.map((message) => ({
        id: message.id || genid(),
        role: message.role,
        content: message.content,
      })),
    ];

    // console.log(relevantContexts)

    const result = await streamText({
      model,
      messages: prompt(contextMessages),
      tools: {
        sendEmail: tool({
          description:
            "Send the mail to required user whenever user asks about sending mail/inform someone/resend the mail or anything about mail or informing someone through email.",
          parameters: z.object({
            to: z
              .string()
              .describe("The email address where mail is to be sent."),
            subject: z.string().describe("The subject required for email."),
            text: z
              .string()
              .describe("The content that needs to be sent in email."),
          }),
          execute: async ({ to, subject, text }) => {
            await MailSend({ to, subject, text });
            return {
              to,
              subject,
              text,
            };
          },
        }),
        calendarEventScheduler: tool({
          description: "Send an event or a reminder for user",
          parameters: z.object({
            summary: z
              .string()
              .describe("The summary of event or reminder to be set"),
            location: z
              .string()
              .describe("The the location of event or reminder"),
            description: z
              .string()
              .describe("The description of the event or reminder to be set"),
            start: z
              .string()
              .describe(
                "The start date and time of event that needs to be in ISO 8601 format"
              ),
            end: z
              .string()
              .describe(
                "The end date and time of event that needs to be in ISO 8601 format"
              ),
          }),
          execute: async ({ summary, location, description, start, end }) => {
            await CreateCalendarEvent({
              summary,
              location,
              description,
              start,
              end,
            });
            return {
              summary,
              location,
              description,
              start,
              end,
            };
          },
        }),
        calendarFetchEvent: tool({
          description: "Fetch the events scheduled for user",
          parameters: z.object({
            minDate: z
              .string()
              .describe(
                "The starting date and time from which events are to be fetched, must be a javascript suitable date function, eg: 2025-02-20T10:00:00+05:30"
              ),
            maxDate: z
              .string()
              .describe(
                "The ending date and time till which events are to be fetched, must be a javascript suitable date function, eg: 2025-02-20T10:00:00+05:30"
              ),
          }),
          execute: async ({ minDate, maxDate }) => {
            const timeMin = new Date(minDate);
            const timeMax = new Date(maxDate);
            const c = await GetCalendarEvents({ timeMin, timeMax });
            return {
              c,
            };
          },
        }),
        // fetchProjects: tool({
        //   description: "Fetches all Jira projects accessible to the user.",
        //   parameters: z.object({}),
        //   execute: async () => {
        //     const project = await fetchJiraProjects();
        //     return project;
        //   },
        // }),
        createJiraIssue: tool({
          description:
            "Creates an issue in Jira after asking the user for details.",
          parameters: z.object({
            projectKey: z.string().describe("The Jira project key."),
            summary: z.string().describe("A short summary of the issue."),
            description: z
              .string()
              .describe("A detailed description of the issue."),
            issueType: z
              .string()
              .describe("Type of the issue, e.g., Bug, Task, Story."),
            issueId: z
              .string()
              .describe(
                `The ID of the issue. Never ask it from user, it has to be derived from issueType. If it is Task, it is "10001", Epic: "10002", Subtask: "10004", Bug it is "10005".`
              ),
          }),
          execute: async ({
            projectKey,
            summary,
            description,
            issueType,
            issueId,
          }) => {
            const issue = await createJiraIssue({
              projectKey,
              summary,
              description,
              issueType,
              issueId,
            });
            console.log("Issue Created", issue);
            return `Issue has been created successfully. Anything else Comrade?`;
          },
        }),
      },
      maxSteps: 5,
      temperature: 0.7,
      toolCallStreaming: true,
      onFinish({ usage, text }) {
        console.log("Token usage:", usage);
        // Save assistant message to database
        if (text && currentChat) {
          db.message
            .create({
              data: {
                chatId: currentChat.id,
                role: "assistant",
                content: text,
              },
            })
            .catch(console.error);
        }
      },
    });

    // Add chatId to the response headers
    const response = result.toDataStreamResponse();
    response.headers.set("X-Chat-Id", currentChat.id);
    return response;
  } catch (error) {
    console.error("Error during chat completion:", error);
    return new Response("Error occurred while generating a response.", {
      status: 500,
    });
  }
}
