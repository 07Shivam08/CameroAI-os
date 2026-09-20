"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useChat } from "@ai-sdk/react";
import { useRef } from "react";
import { useNavbarStore } from "@/app/(dashboard)/_components/layoutWrapper";
import {
  Handshake,
  HeartPulse,
  NotepadText,
  Send,
  Sparkles,
  Users,
  Loader,
  Plus,
  Trash2,
  MessageCircle,
  Home,
  Menu,
  X,
  Square,
} from "lucide-react";
// Import components if they exist, otherwise use placeholders
// Remove the import that's causing errors
// import {
//   ConfirmComponent,
//   PendingComponent,
//   EventScheduledComponent,
// } from "../../bot/_components/Email_confirm";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { Poppins } from "next/font/google";
import toast from "react-hot-toast";
import GPTLogo from "@/public/GPTLogo";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "700"],
});

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
}

interface ChatData {
  id: string;
  title: string;
  messages: {
    id: string;
    role: string;
    content: string;
    createdAt: string;
  }[];
}

interface ChatListItem {
  id: string;
  title: string;
  updatedAt: string;
  messages: any[];
}

export default function ChatPage() {
  const params = useParams();
  const router = useRouter();
  const chatId = params.chatId as string;

  const [initialMessages, setInitialMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [chatData, setChatData] = useState<ChatData | null>(null);
  const [allChats, setAllChats] = useState<ChatListItem[]>([]);

  // State for the chat sidebar only (separate from the main app sidebar)
  const [chatSidebarOpen, setChatSidebarOpen] = useState(true);

  // Use the shared sidebar state from NavbarStore, but don't use it for the chat sidebar
  const { sidebarOpen, setSidebarOpen } = useNavbarStore();

  // Custom handler for toggling ONLY the chat sidebar
  const toggleChatSidebar = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();

    // Toggle only the local chat sidebar state
    setChatSidebarOpen(!chatSidebarOpen);
  };

  // Load existing chat data
  useEffect(() => {
    if (chatId) {
      fetchChatData();
    } else {
      setIsLoading(false);
    }
    fetchAllChats();
  }, [chatId]);

  const fetchAllChats = async () => {
    try {
      const response = await fetch("/api/chats");
      if (response.ok) {
        const data = await response.json();
        setAllChats(data);
      }
    } catch (error) {
      console.error("Error fetching chats:", error);
    }
  };

  const fetchChatData = async () => {
    try {
      const response = await fetch(`/api/chats/${chatId}`);
      if (response.ok) {
        const data = await response.json();
        setChatData(data);
        const messages = data.messages.map((msg: any) => ({
          id: msg.id,
          role: msg.role as "user" | "assistant",
          content: msg.content,
        }));
        setInitialMessages(messages);
      }
    } catch (error) {
      console.error("Error fetching chat:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const { messages, input, handleInputChange, handleSubmit, status, stop } =
    useChat({
      initialMessages,
      body: { chatId },
    });

  const [messageTimestamps] = useState(new Map<string, string>());
  const inputref = useRef<HTMLInputElement>(null);

  const suggestions = [
    {
      icon: <Handshake className="w-4 h-4 mr-2" />,
      text: "Hey Camero, What's up?",
    },
    {
      icon: <Sparkles className="w-4 h-4 mr-2" />,
      text: "What can you help me with today?",
    },
    {
      icon: <Users className="w-4 h-4 mr-2" />,
      text: "Tell me about your capabilities",
    },
    {
      icon: <HeartPulse className="w-4 h-4 mr-2" />,
      text: "How can I get assistance?",
    },
    {
      icon: <NotepadText className="w-4 h-4 mr-2" />,
      text: "Can you help me with documents?",
    },
  ];

  const getMessageTime = (messageId: string) => {
    if (!messageTimestamps.has(messageId)) {
      messageTimestamps.set(messageId, new Date().toLocaleTimeString());
    }
    return messageTimestamps.get(messageId);
  };

  const scrollRef = useRef<HTMLDivElement>(null);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Check if this is the first message and remember the input for updating title later
      const isFirstMessage = messages.length === 0;
      const userInput = input.trim();

      await handleSubmit(e);

      // If this is the first message, update the chat title with the first 4 words
      if (isFirstMessage && userInput) {
        updateChatTitle(userInput);
      }
    } catch (error) {
      console.error("Error during submission:", error);
    }
  };

  // Function to update the chat title based on the first message
  const updateChatTitle = async (message: string) => {
    try {
      // Extract the first 4 words or fewer if the message is shorter
      const words = message.split(" ");
      const firstFourWords = words.slice(0, 4).join(" ");
      const newTitle = firstFourWords + (words.length > 4 ? "..." : "");

      // Update the chat title in the database
      const response = await fetch(`/api/chats/${chatId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title: newTitle }),
      });

      if (response.ok) {
        // Update the local chat data with the new title
        setChatData((prevChat) =>
          prevChat ? { ...prevChat, title: newTitle } : null
        );
        // Update the chat in the sidebar list
        setAllChats((prevChats) =>
          prevChats.map((chat) =>
            chat.id === chatId ? { ...chat, title: newTitle } : chat
          )
        );
      }
    } catch (error) {
      console.error("Error updating chat title:", error);
    }
  };

  const handleSuggestionClick = (text: string) => {
    handleInputChange({
      target: { value: text },
    } as React.ChangeEvent<HTMLInputElement>);

    if (inputref.current) inputref.current.focus();
  };

  const createNewChat = async () => {
    try {
      const response = await fetch("/api/chats", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title: "New Chat" }),
      });

      if (response.ok) {
        const newChat = await response.json();
        router.push(`/chat/${newChat.id}`);
      } else {
        const error = await response.text();
        toast.error(error);
      }
    } catch (error) {
      toast.error("Failed to create new chat");
    }
  };

  const deleteChat = async (chatIdToDelete: string) => {
    try {
      const response = await fetch(`/api/chats/${chatIdToDelete}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setAllChats(allChats.filter((chat) => chat.id !== chatIdToDelete));
        toast.success("Chat deleted successfully");

        if (chatIdToDelete === chatId) {
          router.push("/chat");
        }
      } else {
        toast.error("Failed to delete chat");
      }
    } catch (error) {
      toast.error("Failed to delete chat");
    }
  };

  useEffect(() => {
    if (inputref.current) {
      inputref.current.focus();
    }
  }, [inputref]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader className="animate-spin" size={32} />
      </div>
    );
  }

  return (
    <div className={`${poppins.className} h-screen flex bg-gray-50`}>
      {/* Chat Sidebar - Using local state */}
      <div
        className={`${
          chatSidebarOpen ? "w-80" : "w-16"
        } transition-all duration-300 bg-white border-r border-gray-200 flex flex-col overflow-hidden`}
      >
        {/* Sidebar Header */}
        <div className="p-4 border-b border-gray-200">
          {chatSidebarOpen ? (
            <div>
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-800">
                  Your Chats
                </h2>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    createNewChat();
                  }}
                  className="text-emerald-600 border-emerald-200 hover:bg-emerald-50"
                >
                  <Plus size={16} />
                </Button>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                {allChats.length}/5 chats
              </p>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-2">
              <MessageCircle className="h-5 w-5 text-gray-500" />
              <Button
                variant="outline"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  createNewChat();
                }}
                className="rounded-full p-1 h-6 w-6 flex items-center justify-center"
              >
                <Plus size={14} />
              </Button>
            </div>
          )}
        </div>

        {/* Chats List */}
        <div className="flex-1 overflow-y-auto scrollbar-hide">
          {allChats.length === 0 ? (
            <div className="p-4 text-center text-gray-500">
              <MessageCircle className="mx-auto h-8 w-8 mb-2 opacity-50" />
              {chatSidebarOpen && <p className="text-sm">No chats yet</p>}
            </div>
          ) : (
            <div className="p-2">
              {allChats.map((chat) => (
                <div
                  key={chat.id}
                  className={`group flex items-center justify-between p-3 mb-1 rounded-lg cursor-pointer transition-colors ${
                    chat.id === chatId
                      ? "bg-emerald-50 border-l-4 border-emerald-500"
                      : "hover:bg-gray-50"
                  }`}
                  onClick={() => router.push(`/chat/${chat.id}`)}
                >
                  {chatSidebarOpen ? (
                    <>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-sm font-medium text-gray-900 truncate">
                          {chat.title || "New Chat"}
                        </h3>
                        <p className="text-xs text-gray-500">
                          {chat.messages.length} messages
                        </p>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteChat(chat.id);
                        }}
                        className="opacity-0 group-hover:opacity-100 text-red-500 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 size={14} />
                      </Button>
                    </>
                  ) : (
                    <div
                      className={`flex justify-center w-full ${
                        chat.id === chatId
                          ? "text-emerald-500"
                          : "text-gray-400"
                      }`}
                    >
                      <MessageCircle
                        size={16}
                        className={`${
                          chat.id === chatId
                            ? "bg-emerald-100 p-1 rounded-full"
                            : ""
                        }`}
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Top Navbar */}
        <div className="bg-white border-b border-gray-200 p-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleChatSidebar}
              className={`transition-colors duration-200 ${
                chatSidebarOpen
                  ? "text-gray-600 hover:text-gray-800"
                  : "bg-emerald-50 text-emerald-600 hover:bg-emerald-100"
              }`}
            >
              {chatSidebarOpen ? <X size={20} /> : <Menu size={20} />}
            </Button>

            <div className="flex items-center gap-3">
              <Image
                alt="Camero AI"
                src="/CameroLogo.jpg"
                width={36}
                height={36}
                className="rounded-lg"
              />
              <div>
                <h1 className="text-lg font-bold text-gray-800">
                  {chatData?.title || "New Conversation"}
                </h1>
                <p className="text-xs text-gray-500">Camero AI Assistant</p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => router.push("/chat")}
              className="text-gray-600 hover:text-gray-800"
            >
              <MessageCircle size={16} className="mr-1" />
              All Chats
            </Button>
          </div>
        </div>

        {/* Chat Content */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {messages.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center p-8">
              <div className="text-center max-w-md">
                <div className="mb-6">
                  <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <GPTLogo />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">
                    Start a conversation
                  </h3>
                  <p className="text-gray-600 text-sm">
                    Ask me anything about your organization, schedule events, or
                    get help with tasks.
                  </p>
                </div>

                <div className="flex flex-wrap gap-2 justify-center">
                  {suggestions.map((suggestion, index) => (
                    <button
                      key={index}
                      className="bg-white border border-gray-200 text-gray-700 text-sm px-4 py-2 rounded-full hover:bg-gray-50 hover:border-gray-300 transition-colors flex items-center gap-2"
                      onClick={() => handleSuggestionClick(suggestion.text)}
                    >
                      {suggestion.icon}
                      {suggestion.text}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="flex-1 overflow-y-auto scrollbar-hide p-4">
              <div className="max-w-4xl mx-auto space-y-6">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex gap-4 ${
                      message.role === "assistant"
                        ? "justify-start"
                        : "justify-end"
                    }`}
                  >
                    {message.role === "assistant" ? (
                      <>
                        <div className="flex-shrink-0">
                          <GPTLogo />
                        </div>
                        <div className="flex-1 max-w-[50%]">
                          <div className="bg-white border border-gray-200 rounded-lg p-4">
                            <ReactMarkdown
                              remarkPlugins={[remarkGfm]}
                              components={{
                                code({ node, className, children, ...props }) {
                                  return (
                                    <pre className="bg-gray-100 p-2 rounded text-sm overflow-x-auto">
                                      <code>{children}</code>
                                    </pre>
                                  );
                                },
                                ul: ({ children }) => (
                                  <ul className="list-disc ml-4 space-y-1">
                                    {children}
                                  </ul>
                                ),
                                ol: ({ children }) => (
                                  <ol className="list-decimal ml-4 space-y-1">
                                    {children}
                                  </ol>
                                ),
                                a: ({ node, ...props }) => (
                                  <a
                                    {...props}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-blue-600 hover:underline"
                                  >
                                    {props.children}
                                  </a>
                                ),
                              }}
                            >
                              {message.content}
                            </ReactMarkdown>
                          </div>
                          <p className="text-xs text-gray-500 mt-2">
                            {getMessageTime(message.id)}
                          </p>
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="flex-1 max-w-[50%] ml-auto">
                          <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4">
                            <ReactMarkdown
                              remarkPlugins={[remarkGfm]}
                              components={{
                                code({ node, className, children, ...props }) {
                                  return (
                                    <pre className="bg-emerald-100 p-2 rounded text-sm overflow-x-auto">
                                      <code>{children}</code>
                                    </pre>
                                  );
                                },
                                ul: ({ children }) => (
                                  <ul className="list-disc ml-4 space-y-1">
                                    {children}
                                  </ul>
                                ),
                                ol: ({ children }) => (
                                  <ol className="list-decimal ml-4 space-y-1">
                                    {children}
                                  </ol>
                                ),
                              }}
                            >
                              {message.content}
                            </ReactMarkdown>
                          </div>
                          <p className="text-xs text-gray-500 mt-2 text-right">
                            {getMessageTime(message.id)}
                          </p>
                        </div>
                        <div className="flex-shrink-0">
                          <Image
                            alt="user"
                            src="/kutt.jpg"
                            width={32}
                            height={32}
                            className="rounded-full"
                          />
                        </div>
                      </>
                    )}
                  </div>
                ))}
                <div ref={scrollRef}></div>
              </div>
            </div>
          )}

          {/* Input Area */}
          <div className="border-t border-gray-200 bg-white p-4">
            <div className="max-w-4xl mx-auto">
              {(status === "submitted" || status === "streaming") && (
                <div className="mb-4 flex justify-center">
                  <Button onClick={stop} variant="outline" size="sm">
                    <Square size={16} className="mr-2" />
                    Stop generating
                  </Button>
                </div>
              )}

              <form onSubmit={submit} className="flex gap-4">
                <div className="flex-1">
                  <input
                    ref={inputref}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent placeholder-gray"
                    placeholder="Type your message..."
                    value={input}
                    onChange={handleInputChange}
                    disabled={status === "submitted" || status === "streaming"}
                  />
                </div>
                <Button
                  type="submit"
                  disabled={
                    !input.trim() ||
                    status === "submitted" ||
                    status === "streaming"
                  }
                  className="bg-emerald-600 hover:bg-emerald-700 px-6"
                >
                  {status === "submitted" || status === "streaming" ? (
                    <Loader className="animate-spin" size={18} />
                  ) : (
                    <Send size={18} />
                  )}
                </Button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
