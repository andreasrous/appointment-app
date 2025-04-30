import { ThemeProvider } from "@/components/theme/theme-provider";

const OnboardingLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <ThemeProvider
      attribute="class"
      forcedTheme="light"
      disableTransitionOnChange
    >
      <div className="flex min-h-svh flex-col items-center justify-center bg-muted dark:bg-background p-6 md:p-10">
        <div className="flex w-full max-w-sm flex-col gap-6">{children}</div>
      </div>
    </ThemeProvider>
  );
};

export default OnboardingLayout;
