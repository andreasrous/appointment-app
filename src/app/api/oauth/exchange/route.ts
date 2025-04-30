import { db } from "@/lib/db";
import { nylas, nylasConfig } from "@/lib/nylas";
import { DEFAULT_LOGIN_REDIRECT } from "@/lib/routes";
import { getCurrentUser } from "@/lib/user";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const code = url.searchParams.get("code");
  const user = await getCurrentUser();

  if (!code) {
    return NextResponse.json("No authorization code returned from Nylas", {
      status: 400,
    });
  }

  try {
    const response = await nylas.auth.exchangeCodeForToken({
      clientSecret: nylasConfig.apiKey,
      clientId: nylasConfig.clientId,
      code,
      redirectUri: nylasConfig.redirectUri,
    });

    const { grantId, email } = response;

    await db.user.update({
      where: { id: user?.id },
      data: {
        grantId,
        grantEmail: email,
      },
    });

    const redirectUrl = new URL(DEFAULT_LOGIN_REDIRECT, req.url);
    redirectUrl.searchParams.set("bypass", "true");

    return NextResponse.redirect(redirectUrl);
  } catch (error) {
    console.error("Error exchanging code for token:", error);
    return NextResponse.json("Failed to exchange token", { status: 500 });
  }
}
