"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { markRead } from "@/actions/conversations";
import { Message } from "@/components/messages/message";
import type { getMessagesByConversationId } from "@/data/conversations";

type ChatMessage = Awaited<ReturnType<typeof getMessagesByConversationId>>;

interface ChatBodyProps {
  conversationId: string;
  messages: ChatMessage;
  members: {
    lastSeenMessageId?: string;
    name?: string;
    [key: string]: unknown;
  }[];
}

export const ChatBody = ({
  conversationId,
  messages,
  members,
}: ChatBodyProps) => {
  const router = useRouter();

  useEffect(() => {
    if (messages && messages.length > 0) {
      markRead(conversationId, messages[0].id);
      router.refresh();
    }
  }, [conversationId, messages, router]);

  const formatSeenBy = (names: string[]) => {
    switch (names.length) {
      case 1:
        return (
          <p className="text-muted-foreground text-sm text-right">
            {`Seen by ${names[0]}`}
          </p>
        );
      case 2:
        return (
          <p className="text-muted-foreground text-sm text-right">
            {`Seen by ${names[0]} and ${names[1]}`}
          </p>
        );
    }
  };

  const getSeenMessage = (messageId: string) => {
    const seenUsers = members
      .filter((member) => member.lastSeenMessageId === messageId)
      .map((user) => user.name!.split(" ")[0]);

    if (seenUsers.length === 0) return undefined;

    return formatSeenBy(seenUsers);
  };

  return (
    <div className="flex-1 w-full flex overflow-y-scroll flex-col-reverse gap-2 p-3 no-scrollbar">
      {messages?.map(
        (
          {
            id,
            senderName,
            senderImage,
            isCurrentUser,
            type,
            content,
            createdAt,
          },
          index
        ) => {
          const lastByUser =
            messages[index - 1]?.senderId === messages[index].senderId;

          const seenMessage = isCurrentUser ? getSeenMessage(id) : undefined;

          return (
            <Message
              key={id}
              senderName={senderName!}
              senderImage={senderImage ?? null}
              fromCurrentUser={isCurrentUser}
              type={type}
              content={content}
              createdAt={createdAt}
              lastByUser={lastByUser}
              seen={seenMessage}
            />
          );
        }
      )}
    </div>
  );
};
