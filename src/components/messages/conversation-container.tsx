import { Card } from "@/components/ui/card";

interface ConversationContainerProps {
  children: React.ReactNode;
}
export const ConversationContainer = ({
  children,
}: ConversationContainerProps) => {
  return (
    <Card className="w-full h-[calc(100svh-96px)] lg:h-full p-2 flex flex-col gap-2 shadow-none">
      {children}
    </Card>
  );
};
