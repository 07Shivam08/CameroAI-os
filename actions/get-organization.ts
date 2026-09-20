import { db } from "@/lib/db"
import { auth } from "@clerk/nextjs"


const getOrganization = async () =>{
   const {userId} = auth()
    try {
         if(!userId) return null
         
        const user = await db.user.findFirst({
            where:{
                userId:userId,
              
            },
            select:{
                organization:{
                    include:{
                        branches:{
                            include:{
                                departments:true
                            }
                        }
                    }
                }
            }
        })

        
        // const organization = await db.organization.findFirst({
        //     where :{
        //         id:user?.organizationId
        //     },
        //     include:{
        //         branches:true
        //     }
        // })
        return user?.organization
    } catch (error) {
        return null
    }
    

}
export default getOrganization


export const getOrganizationknow = async () =>{
  const {userId } = auth()
     try {
          if(!userId) return null
          
         const user = await db.user.findFirst({
             where:{
                 userId:userId,
             },

             include:{
                 organization: true
             }
         })
         return user?.organization?.knowledgeBase
     } catch (error) {
         return null
     }
 }
