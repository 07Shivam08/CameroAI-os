import { Pinecone } from "@pinecone-database/pinecone";
import getOrganization from "@/actions/get-organization";
// Initialize index and ready to be accessed.
async function initPineconeClient() {
  try {
    const pineconeClient = new Pinecone({
      apiKey: process.env.PINECONE_API_KEY!,
    });
    const index = await getOrganization();
    const indexname = index?.id;
    await pineconeClient.createIndex({
      name: indexname!,
      dimension: 768,
      metric: "cosine",
      spec: {
        serverless: {
          cloud: "aws",
          region: "us-east-1",
        },
      },
      // This option tells the client not to throw if the index already exists.
      suppressConflicts: true,

      // This option tells the client not to resolve the promise until the
      // index is ready.
      waitUntilReady: true,
    });
    return pineconeClient;
  } catch (error) {
    console.error("error", error);
    throw new Error("Failed to initialize Pinecone Client");
  }
}

export async function getPineconeClient() {
  const pineconeClientInstance = await initPineconeClient();
  return pineconeClientInstance;
}