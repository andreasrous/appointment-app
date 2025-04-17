import { ThemeProvider } from "@/components/theme/theme-provider";

interface PublicLayoutProps {
  children: React.ReactNode;
}

const PublicLayout = async ({ children }: PublicLayoutProps) => {
  return (
    <ThemeProvider
      attribute="class"
      forcedTheme="light"
      disableTransitionOnChange
    >
      {children}
    </ThemeProvider>
  );
};

export default PublicLayout;
