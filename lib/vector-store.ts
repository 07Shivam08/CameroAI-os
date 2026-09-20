import { PineconeStore } from "@langchain/pinecone";
import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";
import { Pinecone as PineconeClient } from "@pinecone-database/pinecone";
import getOrganization from "@/actions/get-organization";

export async function embedAndStoreDocs(
  client: PineconeClient,
  // @ts-ignore docs type error
  docs: Document<Record<string, any>>[]
) {
  /* Create and store the embeddings in the vectorStore */
  try {
    const embeddings = new GoogleGenerativeAIEmbeddings({
      model: "text-embedding-004",
      apiKey: process.env.GOOGLE_GENERATIVE_AI_API_KEY,
    });
   //@ts-ignore
    const indexing = await getOrganization();
    const indexname = indexing?.id;

    const index = client.Index(indexname!);

    // Embed the PDF documents
    const vectorStore = await PineconeStore.fromDocuments(docs, embeddings, {
      //@ts-ignore
      pineconeIndex: index,
      textKey: "text",
    });

    return vectorStore;
  } catch (error) {
    console.log("error ", error);
    throw new Error("Failed to load your docs!");
  }
}

// Returns vector-store handle to be used as retrievers on LangChain
export async function getVectorStore(client: PineconeClient) {
  try {
    const embeddings = new GoogleGenerativeAIEmbeddings({
      model: "models/embedding-001",
      apiKey: process.env.GOOGLE_API_KEY,
    });

    const indexing = await getOrganization();
    const indexname = indexing?.id;

    const index = client.Index(indexname!);

    const vectorStore = await PineconeStore.fromExistingIndex(embeddings, {
      //@ts-ignore
      pineconeIndex: index,
      textKey: "text",
    });

    return vectorStore;
  } catch (error) {
    console.log("error ", error);
    throw new Error("Something went wrong while getting vector store!");
  }
}
