import Link from "next/link";
import { User } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface DmConversationItemProps {
  id: string;
  image: string;
  name: string;
  lastMessageSender?: string;
  lastMessageContent?: string;
  unseenCount: number;
}

export const DmConversationItem = ({
  id,
  image,
  name,
  lastMessageSender,
  lastMessageContent,
  unseenCount,
}: DmConversationItemProps) => {
  return (
    <Link href={`/messages/${id}`} className="w-full">
      <Card className="p-2 flex flex-row justify-between items-center">
        <div className="flex flex-rwo items-center gap-4 truncate">
          <Avatar>
            <AvatarImage src={image} />
            <AvatarFallback>
              <User />
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col truncate">
            <h4 className="truncate">{name}</h4>
            {lastMessageSender && lastMessageContent ? (
              <span className="text-sm text-muted-foreground flex truncate overflow-ellipsis">
                <p className="font-semibold">{lastMessageSender}:&nbsp;</p>
                <p className="truncate overflow-ellipsis">
                  {lastMessageContent}
                </p>
              </span>
            ) : (
              <p className="text-sm text-muted-foreground truncate">
                Start the conversation!
              </p>
            )}
          </div>
        </div>
        {unseenCount ? <Badge>{unseenCount}</Badge> : null}
      </Card>
    </Link>
  );
};
