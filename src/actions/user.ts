"use server";

import { getUserById } from "@/data/user";
import { getCurrentUser } from "@/lib/user";

export const checkGrantId = async () => {
  const user = await getCurrentUser();
  const dbUser = await getUserById(user?.id as string);
  return !!dbUser?.grantId;
};
