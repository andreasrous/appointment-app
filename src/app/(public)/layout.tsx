import { ThemeProvider } from "@/components/theme/theme-provider";
import { Header } from "./_components/header";

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
      <main className="container mx-auto">
        <Header />
        {children}
      </main>
    </ThemeProvider>
  );
};

export default PublicLayout;
