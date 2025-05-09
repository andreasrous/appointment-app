"use server";

import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/user";
import { getUserSubscriptionPlan, stripe } from "@/lib/stripe";
import { PLANS } from "@/config/stripe";
import { redirect } from "next/navigation";

export const createStripeSession = async () => {
  const user = await getCurrentUser();

  if (!user || !user.id) {
    throw new Error("Unauthorized");
  }

  const domain = process.env.NEXT_PUBLIC_APP_URL;
  const billingUrl = `${domain}/dashboard/billing`;

  const dbUser = await db.user.findFirst({
    where: { id: user.id },
  });

  if (!dbUser) {
    throw new Error("Unauthorized");
  }

  const subscriptionPlan = await getUserSubscriptionPlan(dbUser.id);

  if (subscriptionPlan.isSubscribed && dbUser.stripeCustomerId) {
    const stripeSession = await stripe.billingPortal.sessions.create({
      customer: dbUser.stripeCustomerId,
      return_url: billingUrl,
    });

    redirect(stripeSession.url);
  }

  const stripeSession = await stripe.checkout.sessions.create({
    success_url: billingUrl,
    cancel_url: billingUrl,
    payment_method_types: ["card"],
    mode: "subscription",
    billing_address_collection: "auto",
    line_items: [
      {
        price: PLANS.find((plan) => plan.name === "Pro")?.price.priceIds.test,
        quantity: 1,
      },
    ],
    metadata: {
      userId: user.id,
    },
  });

  if (!stripeSession.url) {
    throw new Error("Stripe checkout session URL is missing.");
  }

  redirect(stripeSession.url);
};
