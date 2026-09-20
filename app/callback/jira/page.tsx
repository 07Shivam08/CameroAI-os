"use client";
import React, { useEffect, useState } from "react";
import axios, { isAxiosError } from "axios";
import { redirect, useRouter, useSearchParams } from "next/navigation";
import { Loader } from "lucide-react";

export default function Page() {
  const searchParams = useSearchParams();
  const code = searchParams?.get("code");
  const router = useRouter()
  const [error, setError] = useState<string>();
  const [loading, setLoading] = useState<boolean>();

  useEffect(() => {
    const sendRequest = async () => {
      if (code) {
        // Make a GET request to /api/callback with the code as a query parameter
        try {
            setLoading(true)
          const response = await axios.get(`/api/callback/jira?code=${code}`);
          router.push('/intrigation')
        } catch (error) {
            setLoading(false)
               if(isAxiosError(error)) setError(error.response?.data.error)
         
        }
       
      }
    };

    sendRequest()
  }, []);

  return (
    <div>
       {loading && <div className="h-full w-full flex justify-center items-center">
            <span>please wait...</span> <Loader className="animate-spin"/>
       </div>}
       {error?.length !== 0 && <>
        

        <div className="text-center text-xl font-semibold">{error}</div>
       
       </>}
    </div>
  );
}
