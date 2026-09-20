import { z } from "zod";
import { Hono } from "hono";

import db from "@/prisma/db";
import {zValidator} from '@hono/zod-validator'
import { auth } from "@clerk/nextjs";
const UserupdateSchema = z.object({
  organizationId : z.string()
});
const knowledgeBase = z.object({
  knowledgeBase : z.string()
});
const querySchema = z.object({
  categoryId: z.string(),
  orgId: z.string(),
});
const getQuerySchema = z.object({
  orgId: z.string(),
});

// Define a schema for POST JSON body
const postBodySchema = z.object({
  name: z.string(),
  orgId: z.string(),
});

const app = new Hono()
.get(
  "/knowledgebase",
  
  zValidator("query", UserupdateSchema),
  async (c) => {
    const {organizationId} =  c.req.valid('query')
  // const {userId } = auth()
     if(!organizationId ) {
      return c.json({error: "Unauthorize"} , {status : 401})
     }


     
     try {
      
         const org = await db.organization.findFirst({
             where:{
                 id:organizationId,
             },
              select :{
                knowledgeBase :true
              }
         })


         if(!org) return c.json({error: "Unauthorize"} , {status : 401})
       
         return c.json( {data:org.knowledgeBase} , {status : 200})


        
     } catch (error) {
         return c.json({error: " KNOWLEDGE BASE : Internal server error"} , {status : 500})
     }
    
   
  }
).post(
  "/knowledgebase",
  
  zValidator("query", UserupdateSchema),
  zValidator("json", knowledgeBase),
  async (c) => {
    const {organizationId} =  c.req.valid('query')
    const {knowledgeBase} =  c.req.valid('json')


  // const {userId } = await auth()
     if(!organizationId ) {
      return c.json({error: "Unauthorize"} , {status : 401})
     }


     
     try {
      
      const response = await db.organization.update({
        where: { id: organizationId },
        data: {
          knowledgeBase: knowledgeBase
        },
      });

    
      return c.json({message:'succesfull'})
        
     } catch (error) {
         return c.json({error: " KNOWLEDGE BASE : Internal server error"} , {status : 500})
     }
    
   
  }
).get(
  "/articles",
  zValidator("query", querySchema),
  async (c) => {
    const { categoryId, orgId } = c.req.valid("query");
 
    try {
      const articles = await db.companyArticles.findUnique({
        where: { organizationId: orgId ,
          id:categoryId
        },
        select : {
          articles :true
        },
         
      });
      
      if(!articles) return c.json(null);


      return c.json(articles.articles);
    } catch (error) {
      return c.json({ error: "Internal Server Error" }, 500);
    }
  }
).get(
  "/companyarticles",
  zValidator("query", getQuerySchema),
  async (c) => {
    const { orgId } = c.req.valid("query");

    try {
      const categories = await db.companyArticles.findMany({
        where: { organizationId: orgId },
        include: { articles: true },
      });
      return c.json(categories);
    } catch (error) {
      return c.json({ error: "Internal server error" }, 500);
    }
  }
)

// POST /categories: Creates a new category if it doesn't already exist
.post(
  "/companyarticles",
  zValidator("json", postBodySchema),
  async (c) => {
    const { name, orgId } = c.req.valid("json");

    if (!name.trim()) {
      return c.json({ error: "Category name is required" }, 400);
    }

    try {
      const existing = await db.companyArticles.findUnique({
        where: { name },
      });

      if (existing) {
        return c.json({ error: "Category already exists" }, 400);
      }

      const newCategory = await db.companyArticles.create({
        data: { organizationId: orgId, name },
      });

      return c.json(newCategory);
    } catch (error) {
      return c.json({ error: "Internal server error" }, 500);
    }
  }
);

export default app;
