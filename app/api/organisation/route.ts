import { db } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import crypto from "crypto";
import { clerkClient } from "@clerk/nextjs";

import { clerkClient as clerk } from "@clerk/clerk-sdk-node";
import {
  orgformSchema,
  userformSchema,
} from "@/app/form/create/_component/CreateorgStateProvider";
import { generatePassword } from "../_utils/generatePassword";

export async function POST(req: NextRequest) {
  const {
    userData,
    orgData: org,
  }: {
    userData: z.infer<typeof userformSchema>;
    orgData: z.infer<typeof orgformSchema>;
  } = await req.json();
  try {
    const checkUserByEmail = await clerk.users.getUserList({
      emailAddress: [userData.email],
    });
    const checkUserByUserName = await clerk.users.getUserList({
      username: [userData.userName],
    });
    if (checkUserByEmail.totalCount > 0) {
      return new NextResponse("Email already taken", { status: 401 });
    }

    if (checkUserByUserName.totalCount > 0) {
      return new NextResponse("Username is already taken", { status: 401 });
    }

    const password = generatePassword(8);
    const username = userData.email.replace(/[^a-zA-Z0-9]/g, "");

    const authneticate = await clerkClient.users.createUser({
      username,
      emailAddress: [userData.email],
      password: password,
    });

    const oraganization = await db.organization.create({
      data: {
        name: org.name,
        createdBy: authneticate.id,
        contactsNumber: org.contactNo,
        organizationSize: org.maxNoOfUser,
        orgEmail: org.orgEmail,
        isPending: true,
      },
    });

    const sub = await db.subscription.create({
      data: {
        plan: "FREE",
        status: "PENDING",
        organizationId: oraganization.id,
      },
    });

    await db.organization.update({
      where: {
        id: oraganization.id,
      },
      data: {
        activeSubscriptionId: sub.id,
      },
    });

    await db.user.create({
      data: {
        ...userData,
        userName: username,
        organizationId: oraganization.id,
        role: "ADMIN",
        userId: authneticate.id,
        password,
      },
    });

    return NextResponse.json({ id: oraganization.id });
  } catch (error) {
  
    return new NextResponse("some thing went wrong", { status: 401 });
  }
}
