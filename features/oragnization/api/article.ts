import { useMutation, useQuery } from "@tanstack/react-query";
import { client } from "@/lib/hono";
import { InferRequestType } from "hono";

// For GET, we infer the query type from your Hono endpoint definition
type GetArticlesRequest = {
  query: InferRequestType<typeof client.api.organization.articles.$get>["query"];
};


export const useGetArticles = (orgId: string, categoryId: string) => {
 
  return useQuery({
    enabled:!!categoryId,
    queryKey: ["articles", orgId, categoryId],
    queryFn: async () => {
      // The GET endpoint expects query parameters for organization and category IDs.
      const response = await client.api.organization.articles.$get({
        query: { orgId, categoryId } as GetArticlesRequest["query"],
      });
      
      if (!response.ok) {
        throw new Error("Failed to fetch articles");
      }
      
      // Expecting the response JSON to have a `data` property.
      const data  = await response.json();
      return data;
    },
  });
};

