import { Card } from "@/components/ui/card";

export const ConversationFallback = () => {
  return (
    <Card className="hidden lg:flex h-full w-full p-2 items-center justify-center bg-secondary text-secondary-foreground shadow-none">
      Select/start a conversation to get started!
    </Card>
  );
};
