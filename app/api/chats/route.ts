import { NextRequest, NextResponse } from "next/server";
import { getAuth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";

export async function GET(req: NextRequest) {
  try {
    const user = getAuth(req);
    const userId = user.userId;

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const chats = await db.chat.findMany({
      where: { userId },
      orderBy: { updatedAt: "desc" },
      include: {
        messages: {
          take: 1,
          orderBy: { createdAt: "desc" },
        },
      },
    });

    return NextResponse.json(chats);
  } catch (error) {
    console.error("Error fetching chats:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = getAuth(req);
    const userId = user.userId;

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // Check if user already has 5 chats
    const existingChatsCount = await db.chat.count({
      where: { userId },
    });

    if (existingChatsCount >= 5) {
      return new NextResponse("Maximum chat limit reached (5 chats)", {
        status: 400,
      });
    }

    const { title } = await req.json();

    const chat = await db.chat.create({
      data: {
        userId,
        title: title || "New Chat",
      },
    });

    return NextResponse.json(chat);
  } catch (error) {
    console.error("Error creating chat:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
