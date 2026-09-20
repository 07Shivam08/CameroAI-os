"use client";

import { usePathname } from "next/navigation";
import React, { memo } from "react";

function ChatFrame() {
  const pathname = usePathname();
  return (
    <>
      {!pathname?.includes("/c/bot") && (
        <div className="fixed bottom-0 right-0 z-[99999] m-4 h-[400px] w-[400px]  ">
          <iframe
            src="http://localhost:3000/chat"
            width="100%"
            height="100%"
            style={{ border: "none" }}
          />
        </div>
      )}
    </>
  );
}

export default memo(ChatFrame);
