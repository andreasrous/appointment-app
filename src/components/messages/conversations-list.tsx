"use client";

import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import { AddConversation } from "@/components/messages/add-conversation";
import { useConversation } from "@/hooks/use-conversation";
import { Business } from "@prisma/client";

interface ConversationsListProps {
  children: React.ReactNode;
  businesses: Business[];
}

export const ConversationsList = ({
  children,
  businesses,
}: ConversationsListProps) => {
  const { isActive } = useConversation();

  return (
    <Card
      className={cn(
        "hidden h-full w-full lg:flex-none lg:w-80 p-2 shadow-none",
        {
          block: !isActive,
          "lg:block": isActive,
        }
      )}
    >
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-2xl font-semibold tracking-tight">Conversations</h1>
        <AddConversation businesses={businesses} />
      </div>
      <div className="flex-1 w-full flex flex-col items-center justify-start gap-2">
        {children}
      </div>
    </Card>
  );
};
