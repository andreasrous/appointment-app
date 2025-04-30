"use client";

import { useEffect } from "react";
import { getSession } from "next-auth/react";
import { checkGrantId } from "@/actions/user";

export const SessionRefresher = () => {
  useEffect(() => {
    async function refresh() {
      const grantIdExists = await checkGrantId();

      if (grantIdExists) {
        await getSession();
      }
    }

    refresh();
  }, []);

  return null;
};
