import React, { Suspense , JSX  } from "react"

const FallBack = ({children} : {children:JSX.Element}) =>{
   return <>
     <Suspense fallback={<div className="absolute h-full w-full  flex items-center justify-center bg-white"><span className="h-10 w-10 rounded-full border-4 border-blue-700 border-t-transparent animate-spin"></span></div>}>
       {children}
     </Suspense>
      
   </>
}

export default FallBack
