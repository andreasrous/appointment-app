import { db } from "@/lib/db";
import { UserRole } from "@prisma/client";
import { getUserSubscriptionPlan } from "@/lib/stripe";

export async function downgradeIfNotSubscribed(userId: string, role: UserRole) {
  const { isSubscribed } = await getUserSubscriptionPlan(userId);

  if (!isSubscribed && role === UserRole.BUSINESS_OWNER) {
    await db.user.update({
      where: { id: userId },
      data: { role: UserRole.USER },
    });
  }
}
