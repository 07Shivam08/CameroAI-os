"use client";

import { UserButton } from "@clerk/nextjs";
import { usePathname, useRouter } from "next/navigation";
import { Plus } from "lucide-react";
import { useNavbarStore } from "./layoutWrapper";
import { useIsMobile } from "@/hooks/use-mobile";
import { v4 as uuidv4 } from "uuid";

export const NavbarRoutes = () => {
  const pathname = usePathname();
  const router = useRouter();
  const { user, setRightSideBarOpen } = useNavbarStore();
  const isMobile = useIsMobile();
  const isSearchPage =
    pathname === "/search" || (pathname?.includes("/") && pathname == "/");
  const name = `${user?.firstName} ${user?.lastName}`;

  const handleNewChat = () => {
    const newChatId = uuidv4();
    router.push(`/chat/${newChatId}`);
  };

  return (
    <>
      <div className="flex gap-x-2 md:justify-between justify-end w-full items-center px-4">
        <div className="hidden md:block">Synthra Private Limited</div>
        {
          <div className="flex gap-3 items-center">
            {/* {isSearchPage && (
              <div className="hidden md:block">
                <SearchInput />
              </div>
            )} */}
            <button
              onClick={handleNewChat}
              className=" hover:bg-[#52108D] hover:text-white rounded p-1 px-2 transition-all duration-300 mr-1 flex gap-1 items-center justify-center"
            >
              <Plus size={20} />{" "}
              <span className="text-[1.1rem] font-semibold">Chat</span>
            </button>
            {/* {!isSuperAdmin(user!) && (
              <div className="flex gap-2  items-center">
                <Bell
                  // onClick={() => setRightSideBarOpen((pre) => !pre)}
                  className="bg-sky-300 cursor-pointer p-1 rounded-full shadow  text-white"
                  size={31}
                />
              </div>
            )} */}
            <div className="flex gap-2 items-center">
              <UserButton afterSignOutUrl="/" />
              {user && !isMobile && (
                <div className="font-semibold text-[1.2rem] ">
                  <span className=" relative -top-[2px] text-black">
                    {name ? name : `${user.userName}`}
                    {"  "}
                  </span>
                </div>
              )}
            </div>
          </div>
        }
      </div>
    </>
  );
};
