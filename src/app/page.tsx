import { LoginButton } from "@/components/auth/login-button";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <main className="flex min-h-svh flex-col items-center justify-center bg-muted p-6 md:p-10">
      <div className="w-full max-w-sm text-center">
        <LoginButton>
          <Button>Sign in</Button>
        </LoginButton>
      </div>
    </main>
  );
}
