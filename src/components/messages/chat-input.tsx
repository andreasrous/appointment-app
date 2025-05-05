"use client";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { useConversation } from "@/hooks/use-conversation";
import TextareaAutosize from "react-textarea-autosize";

import { MessageSchema } from "@/schemas";
import { createMessage } from "@/actions/conversations";

import { Loader2, SendHorizonal } from "lucide-react";

import { Card } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export const ChatInput = () => {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const { conversationId } = useConversation();

  const form = useForm<z.infer<typeof MessageSchema>>({
    resolver: zodResolver(MessageSchema),
    defaultValues: {
      conversationId: conversationId as string,
      type: "text",
      content: [""],
    },
  });

  const onSubmit = (values: z.infer<typeof MessageSchema>) => {
    const trimmedMessage = values.content[0].trim();

    if (!trimmedMessage) {
      form.reset({
        conversationId: conversationId as string,
        type: "text",
        content: [""],
      });
      return;
    }

    const trimmedValues = {
      ...values,
      content: [trimmedMessage],
    };

    startTransition(() => {
      createMessage(trimmedValues)
        .then((data) => {
          if (data.error) {
            toast.error(data.error);
          }

          if (data.success) {
            form.reset({
              conversationId: conversationId as string,
              type: "text",
              content: [""],
            });
            router.refresh();
          }
        })
        .catch(() => toast.error("Something went wrong!"));
    });
  };

  return (
    <Card className="w-full p-2 rounded-lg relative">
      <div className="flex gap-2 items-end">
        <Form {...form}>
          <form
            className="flex gap-2 items-end w-full"
            onSubmit={form.handleSubmit(onSubmit)}
          >
            <FormField
              control={form.control}
              name="content"
              render={({ field }) => {
                return (
                  <FormItem className="h-full w-full">
                    <FormControl>
                      <TextareaAutosize
                        {...field}
                        value={field.value[0]}
                        onChange={(e) => field.onChange([e.target.value])}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" && !e.shiftKey) {
                            e.preventDefault();
                            form.handleSubmit(onSubmit)();
                          }
                        }}
                        rows={1}
                        maxRows={3}
                        placeholder="Type a message..."
                        className="min-h-full w-full resize-none border-0 outline-0 bg-card text-card-foreground placeholder:text-muted-foreground p-1.5"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                );
              }}
            />
            <Button size="icon" type="submit" disabled={isPending}>
              {isPending ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                <SendHorizonal />
              )}
            </Button>
          </form>
        </Form>
      </div>
    </Card>
  );
};
