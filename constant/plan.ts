// plan.ts

import { SubscriptionType } from "@prisma/client";

// Define the Plan interface with common fields, including limits.
export type PlanKey<T extends any> = Exclude<SubscriptionType, T>
export type Plan = {
    name: string;
    key:SubscriptionType
    price: number; // Price in USD or your preferred currency
    isExpired:boolean,
    features: {
      chatIntegration: boolean;
      pdfUpload: boolean;
      textTraining: boolean;
    };
    limits: {
      chatLimit: number;         // Maximum number of chats allowed per period
      pdfLimit: number;          // Maximum number of PDF uploads allowed per period
      textTrainingLimit: number; // Maximum number of text training sessions allowed per period
      usersLimit:number
    };
    // You could also add an optional endDate if you want to store the plan's expiration within the plan itself.
  }  
 

  
  
  // Pre-defined plans accessible by key
  export const plans: Record<PlanKey<'CUSTOM'>, Plan> = {
    FREE: {
      name: "Free Plan",
      key:'FREE',
      price: 0,
      isExpired:false,
      features: {
        chatIntegration: true,
        pdfUpload: false,
        textTraining: false,
      },
      limits: {
        chatLimit: 50,         // Free plan may allow 50 chats
        pdfLimit: 0,           // No PDF uploads allowed
        textTrainingLimit: 0,
        usersLimit:5  // No text training sessions allowed
      },
    },
    BASIC: {
      name: "Basic Plan",
      key:'BASIC',
      isExpired:false,
      price: 20,
      features: {
        chatIntegration: true,
        pdfUpload: true,
        textTraining: true,
      },
      limits: {
        
        chatLimit: 200,        // Basic plan allows up to 200 chats
        pdfLimit: 3,           // Basic plan allows up to 3 PDF uploads
        textTrainingLimit: 100,
        usersLimit:50// Example: allows up to 100 text training sessions
      },
    },
    INTERMIDIATE: {
        key:'INTERMIDIATE',
      name: "Intermediate Plan",
      isExpired:false,
      price: 50,
      features: {
        chatIntegration: true,
        pdfUpload: true,
        textTraining: true,
      },
      limits: {
        chatLimit: 500,        // Intermediate plan allows up to 500 chats
        pdfLimit: 10,          // Intermediate plan allows up to 10 PDF uploads
        textTrainingLimit: 300,
        usersLimit:100                           // Example: allows up to 300 text training sessions
      },
    },
  };
  
  // Function to retrieve a plan by its key
  export function getPlan(key: PlanKey<'CUSTOM'>): Plan {
    return plans[key];
  }
  
  /**
   * Returns a plan by key, taking into account the plan's expiration.
   * 
   * @param key - The key of the plan to retrieve.
   * @param endTime - The expiration date/time for the plan.
   * @returns The original plan if not expired; otherwise, a disabled plan.
   */
  export function getPlanWithExpiry(key: PlanKey<''> | undefined , endTime: string , customPlan :Plan | undefined = undefined): Plan | undefined {
    if(!key){
        return undefined
    }
    if(key == 'CUSTOM') return customPlan;

    const plan = getPlan(key);

    // if (!plan) return undefined;
  
    // If the current date is past the endTime, return a disabled plan version.
    if (new Date() > new Date(endTime)) {
      return {
        ...plan,
        isExpired:true,
        features: {
          chatIntegration: false,
          pdfUpload: false,
          textTraining: false,
        },
        limits: {
          chatLimit: 0,
          pdfLimit: 0,
          textTrainingLimit: 0,
          usersLimit:0
        },
      };
    }
  
    return plan;
  }
  
  /*
    To create a custom plan:
    Since all plans share the same structure, you can add a new plan object to the 'plans' record.
    For example:
  
    plans["custom"] = {
      name: "Custom Plan",
      price: 100,
      features: {
        chatIntegration: true,
        pdfUpload: true,
        textTraining: true,
      },
      limits: {
        chatLimit: 1000,
        pdfLimit: 20,
        textTrainingLimit: 500,
      },
    };
  
    If your custom plan requires additional properties or a different structure,
    consider extending the Plan interface or creating a new interface that inherits from Plan.
  */
  