import { NextRequest, NextResponse } from "next/server";
import { getAuth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ chatId: string }> }
) {
  try {
    const user = getAuth(req);
    const userId = user.userId;

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { chatId } = await params;

    const chat = await db.chat.findFirst({
      where: {
        id: chatId,
        userId,
      },
      include: {
        messages: {
          orderBy: { createdAt: "asc" },
          take: 10, // Only get last 10 messages
        },
      },
    });

    if (!chat) {
      return new NextResponse("Chat not found", { status: 404 });
    }

    return NextResponse.json(chat);
  } catch (error) {
    console.error("Error fetching chat:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ chatId: string }> }
) {
  try {
    const user = getAuth(req);
    const userId = user.userId;

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { chatId } = await params;

    await db.chat.deleteMany({
      where: {
        id: chatId,
        userId,
      },
    });

    return new NextResponse("Chat deleted", { status: 200 });
  } catch (error) {
    console.error("Error deleting chat:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ chatId: string }> }
) {
  try {
    const user = getAuth(req);
    const userId = user.userId;

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { chatId } = await params;
    const { title } = await req.json();

    const updatedChat = await db.chat.update({
      where: {
        id: chatId,
        userId,
      },
      data: {
        title,
      },
    });

    return NextResponse.json(updatedChat);
  } catch (error) {
    console.error("Error updating chat:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
