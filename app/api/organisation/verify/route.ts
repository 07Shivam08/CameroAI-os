import { db } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
import { sendEmail } from "../../_utils/email-sender";
import { freePlanEndDate } from "../../_constant";

export async function POST(req: NextRequest) {
  const org: { userId: string; organizationId: string } = await req.json();
  try {
    const user = await db.user.findFirst({
      where: {
        userId: org.userId,
      },
    });

    if (!user) return new NextResponse("User not found", { status: 404 });

    // Check if the organization has an active subscription before verification
    const organization = await db.organization.findFirst({
      where: {
        id: org.organizationId,
      },
      include: {
        activeSubscription: true,
      },
    });

    if (!organization) {
      return new NextResponse("Organization not found", { status: 404 });
    }

    // Verify that the organization has an active subscription
    if (
      !organization.activeSubscription ||
      organization.activeSubscription.status !== "ACTIVE"
    ) {
      return new NextResponse(
        "Organization must have an active subscription to be verified",
        { status: 400 }
      );
    }

    // Check if subscription is not expired
    if (
      organization.activeSubscription.endDate &&
      new Date() > organization.activeSubscription.endDate
    ) {
      return new NextResponse("Organization subscription has expired", {
        status: 400,
      });
    }

    // Proceed with verification if subscription is active and valid
    await db.organization.update({
      where: {
        id: org.organizationId,
      },
      data: {
        isPending: false,
      },
    });

    await sendEmail(user);

    return new NextResponse("Organization verified successfully", {
      status: 200,
    });
  } catch (error) {
    console.log(error);
    return new NextResponse("Internal server error", { status: 500 });
  }
}
