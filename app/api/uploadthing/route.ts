import { createNextRouteHandler } from "uploadthing/next";
import { ourFileRouter } from "./core"; // Adjust the path

// ✅ Remove authentication for UploadThing API route
export const { GET, POST } = createNextRouteHandler({
  router: ourFileRouter,
});
