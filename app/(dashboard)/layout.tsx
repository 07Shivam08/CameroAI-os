
 'use client'
 
import LayoutWrapper from "./_components/layoutWrapper";
import {useRouter}  from 'next/navigation'
 
import { useUser } from "@clerk/nextjs";
import { useGetUserContext } from "@/features/user/api/user";

const DashboardLayout =   ({ children }: { children: React.ReactNode }) => {
  
  const {user : u} = useUser()
  const {data } = useGetUserContext(u?.id)
  const router = useRouter()
  
  if(!data) return
   const {organization , verified , user , activeSubscription} = data
 console.log(organization)
  //  if(!activeSubscription){
  //   router.push(`/biling/${organization?.id}`)
  //  }

  return (
    <div className="h-screen flex justify-between">
     
      <LayoutWrapper organization={organization} activeSubscription={activeSubscription} verified={verified}  user={user} >
        {children}
      </LayoutWrapper>
    </div>
  );
};

export default DashboardLayout;
