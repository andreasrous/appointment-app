import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/user";

export const getConversationById = async (id: string) => {
  try {
    const user = await getCurrentUser();

    const conversation = await db.conversation.findUnique({
      where: { id },
      include: {
        members: {
          include: {
            member: true,
          },
        },
      },
    });

    if (!conversation) {
      return null;
    }

    const otherMembers = conversation.members
      .filter((m) => m.memberId !== user?.id)
      .map((m) => ({
        ...m,
        ...m.member,
      }));

    return {
      ...conversation,
      otherMembers,
    };
  } catch {
    return null;
  }
};

export const getConversationsByMemberId = async (memberId: string) => {
  try {
    const conversations = await db.conversation.findMany({
      where: {
        members: {
          some: {
            memberId,
          },
        },
      },
      orderBy: { createdAt: "asc" },
      include: {
        members: {
          include: {
            member: true,
            lastSeenMessage: true,
          },
        },
      },
    });

    const result = await Promise.all(
      conversations.map(async (conversation) => {
        const lastMessage = await getLastMessageDetails(
          conversation.lastMessageId as string
        );

        const currentMember = conversation.members.find(
          (m) => m.memberId === memberId
        );
        const lastSeenMessageTime =
          currentMember?.lastSeenMessage?.createdAt ?? new Date(0);

        const unseenMessages = await db.message.findMany({
          where: {
            conversationId: conversation.id,
            createdAt: {
              gt: lastSeenMessageTime,
            },
            sender: {
              member: {
                id: {
                  not: memberId,
                },
              },
            },
          },
        });

        return {
          ...conversation,
          otherMembers: conversation.members
            .filter((m) => m.memberId !== memberId)
            .map((m) => m.member),
          lastMessage,
          unseenCount: unseenMessages.length,
        };
      })
    );

    return result;
  } catch {
    return null;
  }
};

export const getMessagesByConversationId = async (conversationId: string) => {
  try {
    const user = await getCurrentUser();

    const messages = await db.message.findMany({
      where: {
        conversationId,
      },
      orderBy: {
        createdAt: "desc",
      },
      include: {
        sender: {
          include: {
            member: true,
          },
        },
      },
    });

    const formattedMessages = messages.map((message) => ({
      ...message,
      senderName: message.sender?.member.name,
      senderImage: message.sender?.member.image,
      isCurrentUser: message.sender?.memberId === user?.id,
    }));

    return formattedMessages;
  } catch {
    return null;
  }
};

export const getLastMessageDetails = async (messageId: string) => {
  try {
    const message = await db.message.findUnique({
      where: {
        id: messageId,
      },
      include: {
        sender: {
          include: {
            member: true,
          },
        },
      },
    });

    if (!message) {
      return null;
    }

    const content = getMessageContent(
      message.type,
      message.content as unknown as string
    );
    const senderName = message.sender?.member.name;

    return {
      content,
      senderName,
    };
  } catch {
    return null;
  }
};

const getMessageContent = (type: string, content: string) => {
  switch (type) {
    case "text":
      return content;
    default:
      return "[Non-text]";
  }
};
