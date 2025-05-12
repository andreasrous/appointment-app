import { Loader2 } from "lucide-react";

import { getCurrentUser } from "@/lib/user";
import { getAllOtherBusinesses } from "@/data/business";
import { getConversationsByMemberId } from "@/data/conversations";

import { ConversationsList } from "@/components/messages/conversations-list";
import { DmConversationItem } from "@/components/messages/dm-conversation-item";

interface MessagesLayoutProps {
  children: React.ReactNode;
}

const MessagesLayout = async ({ children }: MessagesLayoutProps) => {
  const user = await getCurrentUser();
  const businesses = await getAllOtherBusinesses();
  const conversations = await getConversationsByMemberId(user?.id as string);

  return (
    <div className="relative -m-4 p-4 h-[calc(100%+2rem)] w-[calc(100%+2rem)] flex gap-4 bg-background">
      <ConversationsList businesses={businesses}>
        {conversations ? (
          conversations.length === 0 ? (
            <p className="w-full h-full flex items-center justify-center">
              No conversations found
            </p>
          ) : (
            conversations.map((c) => (
              <DmConversationItem
                key={c.id}
                id={c.id}
                name={c.otherMembers[0].name!}
                image={c.otherMembers[0].image!}
                lastMessageSender={c.lastMessage?.senderName as string}
                lastMessageContent={c.lastMessage?.content}
                unseenCount={c.unseenCount}
              />
            ))
          )
        ) : (
          <Loader2 />
        )}
      </ConversationsList>
      {children}
    </div>
  );
};

export default MessagesLayout;
