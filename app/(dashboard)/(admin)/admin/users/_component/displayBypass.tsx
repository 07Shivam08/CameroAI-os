import { BypassUser } from '@prisma/client'
import React from 'react'

export default function DisplayByPassUser({byPassUserData}:{byPassUserData:BypassUser[]}) {
  return (
   <>
    {
      byPassUserData.map((user , ind)=>{
        return <>
            <div className='flex max-w-[600px] bg-gray-200 flex-wrap gap-5 py-2 px-4 rounded shadow'>
              <h1>{user.firstName}</h1>
              <h1>{user.lastName}</h1>
              <h1>{user.email}</h1>
              <h1>{user.pass}</h1>
              <h1>{user.isJoined??'false'}</h1>
            </div>
        </>
      })
    }
   </>
  )
}
