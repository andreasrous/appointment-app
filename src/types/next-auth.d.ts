/* eslint-disable @typescript-eslint/no-unused-vars */
import { JWT } from "next-auth/jwt";
import { type DefaultSession } from "next-auth";

import { UserRole } from "@prisma/client";

export type ExtendedUser = DefaultSession["user"] & {
  role: UserRole;
  isTwoFactorEnabled: boolean;
  isOAuth: boolean;
  image: string | null;
};

declare module "next-auth" {
  interface Session {
    user: ExtendedUser;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role?: UserRole;
    isTwoFactorEnabled: boolean;
    isOAuth: boolean;
    image: string | null;
  }
}
