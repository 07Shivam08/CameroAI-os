import { useMutation, useQuery } from "@tanstack/react-query";

import { client } from "@/lib/hono";
import { InferRequestType } from "hono";

type UpdateKnowledgebaseRequest = {
    query: InferRequestType<typeof client.api.organization.knowledgebase["$post"]>["query"];
    json: InferRequestType<typeof client.api.organization.knowledgebase["$post"]>["json"];
  };
  
export const useGetKnowledgebase = (organizationId :string) => {
  const query = useQuery({
    queryKey: ["knowledgebase"],
    queryFn: async () => {
      const response = await client.api.organization.knowledgebase.$get({
          query :{
            organizationId:organizationId
          }
      });

      if (!response.ok) {
        throw new Error("Failed to fetch templates");
      }

      const  {data}  = await response.json();
      return data;
    },
  });

  return query;
};



export const useUpdateKnowledgebase = ( organizationId: string) => {
  const mutation = useMutation({
    mutationFn: async (jsonPayload: UpdateKnowledgebaseRequest["json"]) => {
      const response = await client.api.organization.knowledgebase.$post({
        query: {
          organizationId: organizationId,
        },
        json: jsonPayload,
      });
  
      if (!response.ok) {
        throw new Error("Something went wrong");
      }
  
      return await response.json();
    },
    
  });
  
  return mutation;
};