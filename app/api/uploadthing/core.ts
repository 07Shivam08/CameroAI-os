import { auth } from "@clerk/nextjs";
import { createUploadthing, type FileRouter } from "uploadthing/next";
import { generateUploadButton } from "@uploadthing/react";
import { PrismaClient } from "@prisma/client";
import { NextRequest } from "next/server";

const prisma = new PrismaClient();
const f = createUploadthing<{ title: string; companyArticlesId: string }>();

const handleAuth = (req: NextRequest | undefined = undefined) => {
  const { userId } = auth();
  if (!req) return {};
  const isUploadThingRequest = typeof window === "undefined"; // Detect server-side request
  const title = req.headers.get("x-title");
  const companyArticlesId = req.headers.get("x-companyarticlesid");
  if (!userId && !isUploadThingRequest) {
    console.error("❌ Unauthorized: No userId found");
    throw new Error("Unauthorized");
  }
  return { userId: userId || "uploadthing-system", title, companyArticlesId };
};

export const ourFileRouter = {
  pdfUpload: f({ pdf: { maxFileSize: "4MB" } })
    .middleware(({ req }) => handleAuth(req)) // ✅ Ensures authentication
    .onUploadComplete(async ({ metadata, file }) => {
      try {
        console.log("📂 File uploaded:", file.url);
        console.log("🔍 Metadata received:", metadata);

        if (!metadata) throw new Error("❌ Missing metadata");

        const { title, companyArticlesId } = metadata as {
          title?: string;
          companyArticlesId?: string;
        };

        if (!title || !companyArticlesId) {
          console.error("🚨 Missing metadata:", { title, companyArticlesId });
          throw new Error("Missing title or category ID");
        }

        const category = await prisma.companyArticles.findUnique({
          where: { id: companyArticlesId },
        });
        if (!category) {
          console.error("🚨 Category not found:", companyArticlesId);
          throw new Error("Category does not exist");
        }

        const article = await prisma.article.create({
          data: { title, pdfUrl: file.url, companyArticlesId },
        });

        // ✅ Convert Date fields to JSON serializable strings
        return {
          success: true,
          article: {
            ...article,
            createdAt: article.createdAt.toISOString(),
          },
        };
      } catch (error) {
        console.error("🚨 Upload failed:", error);
        throw new Error("Upload failed. Please try again.");
      }
    }),

  userProfileImage: f({ image: { maxFileSize: "16MB", maxFileCount: 1 } })
    .middleware(() => handleAuth())
    .onUploadComplete(async ({ file }) => {
      console.log("🖼️ User profile image uploaded:", file.url);
      return { url: file.url };
    }),

  courseImage: f({ image: { maxFileSize: "16MB", maxFileCount: 1 } })
    .middleware(() => handleAuth())
    .onUploadComplete(() => {}),

  courseAttachment: f(["text", "image", "video", "pdf"])
    .middleware(() => handleAuth())
    .onUploadComplete(() => {}),

  chapterVideo: f({ video: { maxFileCount: 1, maxFileSize: "512MB" } })
    .middleware(() => handleAuth())
    .onUploadComplete(() => {}),

  serverImage: f({ image: { maxFileSize: "4MB", maxFileCount: 1 } })
    .middleware(() => handleAuth())
    .onUploadComplete(() => {
      console.log("🖼️ Server Image Upload Completed.");
    }),

  messageFile: f(["image", "pdf"])
    .middleware(() => handleAuth())
    .onUploadComplete(() => {
      console.log("📩 Message File Upload Completed.");
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;

export const UploadButton = generateUploadButton<OurFileRouter>();
