"use server";

import { z } from "zod";
import { db } from "@/lib/db";
import { ConversationSchema, MessageSchema } from "@/schemas";
import { getCurrentUser } from "@/lib/user";
import { revalidatePath } from "next/cache";

export const createConversation = async (
  values: z.infer<typeof ConversationSchema>
) => {
  const validatedFields = ConversationSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: "Invalid fields!" };
  }

  const user = await getCurrentUser();

  if (!user?.id) {
    return { error: "Unauthorized" };
  }

  const { businessId } = validatedFields.data;

  try {
    const business = await db.business.findUnique({
      where: { id: businessId },
      select: {
        ownerId: true,
        name: true,
      },
    });

    const conversation = await db.conversation.create({
      data: {},
    });

    await db.conversationMember.createMany({
      data: [
        {
          conversationId: conversation.id,
          memberId: user.id,
        },
        {
          conversationId: conversation.id,
          memberId: business?.ownerId as string,
        },
      ],
    });

    revalidatePath("/messages");
    return { success: "Conversation created!" };
  } catch {
    return { error: "Failed to create conversation." };
  }
};

export const deleteConversation = async (conversationId: string) => {
  const user = await getCurrentUser();

  if (!user?.id) {
    return { error: "Unauthorized" };
  }

  try {
    const isMember = await db.conversationMember.findFirst({
      where: {
        conversationId,
        memberId: user.id,
      },
    });

    if (!isMember) {
      return { error: "You are not a member of this conversation." };
    }

    await db.conversation.delete({
      where: { id: conversationId },
    });

    return { success: "Conversation deleted." };
  } catch {
    return { error: "Failed to delete conversation." };
  }
};

export const createMessage = async (values: z.infer<typeof MessageSchema>) => {
  const validatedFields = MessageSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: "Invalid fields!" };
  }

  const user = await getCurrentUser();

  if (!user?.id) {
    return { error: "Unauthorized" };
  }

  const { conversationId, type, content } = validatedFields.data;

  try {
    const member = await db.conversationMember.findFirst({
      where: {
        conversationId,
        memberId: user.id,
      },
      select: {
        id: true,
      },
    });

    if (!member) {
      return { error: "User not part of this conversation." };
    }

    const message = await db.message.create({
      data: {
        conversationId,
        senderId: member.id,
        type,
        content,
      },
    });

    await db.conversation.update({
      where: { id: conversationId },
      data: {
        lastMessageId: message.id,
      },
    });

    return { success: "Message sent!", message };
  } catch {
    return { error: "Failed to send message." };
  }
};

export const markRead = async (conversationId: string, messageId: string) => {
  const user = await getCurrentUser();

  if (!user?.id) {
    return { error: "Unauthorized" };
  }

  try {
    const member = await db.conversationMember.findFirst({
      where: {
        conversationId,
        memberId: user.id,
      },
      select: {
        id: true,
      },
    });

    if (!member) {
      return { error: "User not part of this conversation." };
    }

    await db.conversationMember.update({
      where: {
        id: member.id,
      },
      data: {
        lastSeenMessageId: messageId,
      },
    });

    return { success: "Message marked as read." };
  } catch {
    return { error: "Failed to update read status." };
  }
};
