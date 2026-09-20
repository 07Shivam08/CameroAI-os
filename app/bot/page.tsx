"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function ChatPage() {
  const router = useRouter();

  // Redirect to chat system
  useEffect(() => {
    router.replace("/chat");
  }, [router]);

  return (
    <div className="flex items-center justify-center h-full">
      <div className="text-center">
        <p>Redirecting to chat...</p>
      </div>
    </div>
  );
}
