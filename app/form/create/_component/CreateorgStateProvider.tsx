"use client";
import axios, { AxiosResponse } from "axios";
import { useRouter } from "next/navigation";
import React, {
  Dispatch,
  SetStateAction,
  createContext,
  useContext,
  useState,
} from "react";
import toast from "react-hot-toast";
import { z } from "zod";

export const userformSchema = z.object({
  firstName: z.string().min(1, {
    message: "Description is required",
  }),
  lastName: z.string().min(1, {
    message: "Description is required",
  }),

  userName:z.string().min(1, {
    message: "Username is required",
  }).regex(/^[_.\-a-zA-Z0-9]+$/, {
    message: "Username can only contain letters, numbers, '_', '-', and '.'",
  })
 ,
  email: z.string().min(1, {
    message: "Description is required",
  }),
});
export const orgformSchema = z.object({
  name: z.string().min(1, {
    message: "Title is required",
  }),
  orgEmail: z.string().min(1, {
    message: "Title is required",
  }),
  contactNo: z.string().min(1, {
    message: "Title is required",
  }),
  maxNoOfUser: z.string().min(1, {
    message: "Title is required",
  }),
});

const orgContext = createContext<{
  userData: z.infer<typeof userformSchema>;
  orgData: z.infer<typeof orgformSchema>;
  setUserData: Dispatch<SetStateAction<z.infer<typeof userformSchema>>>;
  setOrgData: Dispatch<SetStateAction<z.infer<typeof orgformSchema>>>;
  setPosition: Dispatch<SetStateAction<number>>;
  position: number;
  onSubmit: () => void;
}>({
  userData: {
    email: "",
    firstName: "",
    lastName: "",
    userName: "",
  },
  orgData: {
    contactNo: "",
    maxNoOfUser: "",
    name: "",
    orgEmail: "",
  },
  position: 0,
  setOrgData: () => undefined,
  setUserData: () => undefined,
  setPosition: () => undefined,
  onSubmit: () => undefined,
});

export const useOrgCreateStore = () => {
  return useContext(orgContext);
};
const { Provider } = orgContext;

export default function CreateorgStateProvider({
  children,
}: {
  children: React.ReactNode;
}) {
 
   const router = useRouter()

  const [userData, setUserData] = useState<z.infer<typeof userformSchema>>({
    email: "",
    firstName: "",
    lastName: "",
    userName: "",
  });
  const [orgData, setOrgData] = useState<z.infer<typeof orgformSchema>>({
    contactNo: "",
    maxNoOfUser: "",
    name: "",
    orgEmail: "",
  });

  const onSubmit = async () => {
    try {
      const response : AxiosResponse<{id:string} ,any> = await axios.post("/api/organisation", {
        userData,
        orgData,
      });
      toast.success("Form Submitted.");
       
      // const expires = "Fri, 31 Dec 9999 23:59:59 GMT";
      // document.cookie = `detailOfSubmit=${JSON.stringify(response.data.id)}; path=/; expires=${expires}; Secure; SameSite=Strict`;
      router.refresh();
    } catch (error) {
  
       if(axios.isAxiosError(error)){
       return toast.error(error.response?.data)
       }
      return  toast.error("Something Went Wrong")
    }
  };

  const [position, setPosition] = useState(0);

  return (
    <Provider
      value={{
        userData,
        orgData,
        setUserData,
        setOrgData,
        setPosition,
        position,
        onSubmit,
      }}
    >
      {children}
    </Provider>
  );
}
