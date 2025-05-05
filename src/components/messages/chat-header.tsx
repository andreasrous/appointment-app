import Link from "next/link";

import { CircleArrowLeft } from "lucide-react";

import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DeleteConversation } from "@/components/messages/delete-conversation";

interface ChatHeaderProps {
  image?: string;
  name: string;
  conversationId: string;
}

export const ChatHeader = ({
  image,
  name,
  conversationId,
}: ChatHeaderProps) => {
  return (
    <Card className="w-full flex flex-row rounded-lg items-center p-2 justify-between">
      <div className="flex items-center gap-2">
        <Link href="/messages" className="block lg:hidden">
          <CircleArrowLeft />
        </Link>
        <Avatar className="h-8 w-8">
          <AvatarImage src={image} />
          <AvatarFallback>{name.substring(0, 1)}</AvatarFallback>
        </Avatar>
        <h2 className="font-semibold">{name}</h2>
      </div>
      <div className="flex gap-2">
        <DeleteConversation conversationId={conversationId} />
      </div>
    </Card>
  );
};
