// file: app/api/subscription/charge/route.ts
import db from "@/prisma/db";
import Razorpay from "razorpay";
import { NextRequest, NextResponse } from "next/server";


export async function POST(req: NextRequest) {
   const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID!,
    key_secret: process.env.RAZORPAY_KEY_SECRET!,
  });
  const organization = await db.organization.findUnique({
    where: { id: "67e8df4ca2762d13d08bd014" },
  });
  
  const { customerId, orgEmail } = organization!;

  if (!customerId) {
    const id = await razorpay.customers.create({
      email: orgEmail,
    });

    await db.organization.update({
      where: {
        id: "67e8df4ca2762d13d08bd014",
      },
      data: {
        customerId: id.id,
      },
    });
  }

  try {
    // Extract values from the request body.
    // Expected body: { amount, oldUsers, newUsers, subscriptionId? }
    const { amount, oldUsers, newUsers, subscriptionId } = {
      amount: 40,
      oldUsers: 10,
      newUsers: 10,
      subscriptionId: undefined,
    };

    // Initialize Razorpay instance

    const perUserCost = 40; // Cost per user in INR.
    const totalUsers = oldUsers + newUsers;

    // Scenario 1: First-time payment (no subscription exists)
    if (!subscriptionId) {
      console.log("first");
      // Create a plan (defines the billing frequency and per-unit amount)
      const order = await razorpay.orders.create({
        amount: 0,
        currency: "INR",
        customer_id: customerId!,
        method: "emandate",

        token: {
          frequency: "monthly",
          max_amount: 99999,
          expire_at: 1765046100,
        },
        payment_capture: true,
        receipt: "124",
      });

      return NextResponse.json(
        { ...order, customerId, rec: "1" },
        { status: 200 }
      );
    }
    // Scenario 2: Existing subscription; process new user payment and update subscription
    // else {
    //   // Step 1: Charge for new users immediately if any are added.
    //   if (newUsers > 0) {
    //     const oneTimeOrder = await razorpay.orders.create({
    //       amount: newUsers * perUserCost * 100, // Calculate amount for new users in paise
    //       currency: "INR",

    //       receipt: `new_users_${Date.now()}`,
    //       payment_capture: true, // Automatically capture the payment
    //     });
    //     // Optionally, you might want to return this order details to the client
    //     // so the user can complete the payment via Razorpay Checkout.
    //     console.log("One-time order for new users created:", oneTimeOrder);
    //   }

    //   // Step 2: Update the existing subscription to reflect the new total user count.
    //   const sub = await razorpay.subscriptions.update(subscriptionId, {
    //     quantity: totalUsers,
    //   });

    //   return NextResponse.json({sub}, { status: 200 });
    // }
  } catch (error) {
    console.error("Error in subscription API:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}
