import { auth } from "@/lib/auth";
import { SessionProvider } from "next-auth/react";
import { NewVerificationForm } from "@/components/auth/new-verification-form";

const NewVerificationPage = async () => {
  const session = await auth();

  return (
    <SessionProvider session={session}>
      <NewVerificationForm />
    </SessionProvider>
  );
};

export default NewVerificationPage;
