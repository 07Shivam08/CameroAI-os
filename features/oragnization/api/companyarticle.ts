import { useMutation, useQuery } from "@tanstack/react-query";
import { client } from "@/lib/hono";
import { InferRequestType } from "hono";

// Infer the expected query parameters for the GET endpoint.
type GetCompanyArticlesRequest = {
  query: InferRequestType<typeof client.api.organization.companyarticles.$get>["query"];
};

// Infer the expected JSON payload for the POST endpoint.
type CreateCompanyArticleRequest = {
  json: InferRequestType<typeof client.api.organization.companyarticles.$post>["json"];
};

/**
 * Hook to fetch company article categories for a given organization.
 *
 * @param orgId - The organization identifier.
 */
export const useGetCompanyArticles = (orgId: string) => {
  return useQuery({
    queryKey: ["companyarticles", orgId],
    queryFn: async () => {
      const response = await client.api.organization.companyarticles.$get({
        query: { orgId } as GetCompanyArticlesRequest["query"],
      });

      if (!response.ok) {
        throw new Error("Failed to fetch company articles");
      }

      // Return the JSON response (expecting the route to return categories data)
      return await response.json();
    },
  });
};

/**
 * Hook to create a new company article category.
 *
 * The POST endpoint expects a JSON payload with `name` and `orgId` fields.
 *
 * @example
 * // Usage:
 * const mutation = useCreateCompanyArticle();
 * mutation.mutate({ name: "New Category", orgId: "123" });
 */
export const useCreateCompanyArticle = () => {
  return useMutation({
    mutationFn: async (payload: CreateCompanyArticleRequest["json"]) => {
      const response = await client.api.organization.companyarticles.$post({
        json: payload,
      });

      if (!response.ok) {
        throw new Error("Failed to create company article category");
      }

      return await response.json();
    },
  });
};
 