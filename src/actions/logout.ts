"use server";

import { signOut } from "@/lib/auth";
import { DEFAULT_LOGOUT_REDIRECT } from "@/lib/routes";

export const logout = async () => {
  await signOut({ redirectTo: DEFAULT_LOGOUT_REDIRECT });
};
