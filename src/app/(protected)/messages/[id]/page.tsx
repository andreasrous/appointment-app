import { ChatBody } from "@/components/messages/chat-body";
import { ChatHeader } from "@/components/messages/chat-header";
import { ChatInput } from "@/components/messages/chat-input";
import { ConversationContainer } from "@/components/messages/conversation-container";
import {
  getConversationById,
  getMessagesByConversationId,
} from "@/data/conversations";

interface ConversationPageProps {
  params: Promise<{ id: string }>;
}

const ConversationPage = async ({ params }: ConversationPageProps) => {
  const { id } = await params;
  const conversation = await getConversationById(id);
  const messages = await getMessagesByConversationId(id);

  return (
    <>
      {!conversation ? (
        <p className="w-full h-full flex items-center justify-center">
          Conversation not found
        </p>
      ) : (
        <ConversationContainer>
          <ChatHeader
            image={conversation.otherMembers[0].image!}
            name={conversation.otherMembers[0].name!}
            conversationId={id}
          />
          <ChatBody
            conversationId={conversation.id}
            messages={messages}
            members={conversation.otherMembers.map((member) => ({
              ...member,
              lastSeenMessageId: member.lastSeenMessageId ?? undefined,
              name: member.name ?? undefined,
            }))}
          />
          <ChatInput />
        </ConversationContainer>
      )}
    </>
  );
};

export default ConversationPage;
