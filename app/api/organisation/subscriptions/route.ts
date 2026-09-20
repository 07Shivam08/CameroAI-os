import { db } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";

export async function GET(req: NextRequest) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // Check if user is Super Admin
    const user = await db.user.findUnique({
      where: { userId: userId },
      select: { role: true },
    });

    if (!user || user.role !== "SA") {
      return new NextResponse("Forbidden - Super Admin access required", {
        status: 403,
      });
    }

    // Get all organizations with their subscription status
    const organizations = await db.organization.findMany({
      include: {
        activeSubscription: {
          select: {
            id: true,
            plan: true,
            status: true,
            startDate: true,
            endDate: true,
            razorpaySubscriptionId: true,
          },
        },
        subscription: {
          select: {
            id: true,
            plan: true,
            status: true,
            startDate: true,
            endDate: true,
          },
          orderBy: {
            createdAt: "desc",
          },
          take: 1,
        },
        users: {
          where: {
            role: "ADMIN",
          },
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
          take: 1,
        },
      },
      orderBy: {
        name: "asc",
      },
    });

    // Format the response to include subscription information
    const formattedOrganizations = organizations.map((org) => ({
      id: org.id,
      name: org.name,
      contactsNumber: org.contactsNumber,
      orgEmail: org.orgEmail,
      organizationSize: org.organizationSize,
      isPending: org.isPending,
      admin: org.users[0] || null,
      hasActiveSubscription:
        !!org.activeSubscription && org.activeSubscription.status === "ACTIVE",
      activeSubscription: org.activeSubscription
        ? {
            plan: org.activeSubscription.plan,
            status: org.activeSubscription.status,
            startDate: org.activeSubscription.startDate,
            endDate: org.activeSubscription.endDate,
            isActive:
              org.activeSubscription.status === "ACTIVE" &&
              (!org.activeSubscription.endDate ||
                new Date() < new Date(org.activeSubscription.endDate)),
          }
        : null,
      latestSubscription: org.subscription[0] || null,
    }));

    return NextResponse.json({
      success: true,
      organizations: formattedOrganizations,
    });
  } catch (error) {
    console.error("Error fetching organizations with subscriptions:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
