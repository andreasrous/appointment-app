import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Ban, PlusCircle } from "lucide-react";

interface EmptyStateProps {
  title: string;
  description: string;
  buttonText: string;
  href: string;
}

export const EmptyState = ({
  title,
  description,
  buttonText,
  href,
}: EmptyStateProps) => {
  return (
    <div className="flex h-full flex-1 flex-col items-center justify-center gap-4 rounded-md border border-dashed text-center">
      <div className="flex size-20 items-center justify-center rounded-full bg-primary/10">
        <Ban className="size-10 text-primary" />
      </div>

      <div className="space-y-2">
        <h2 className="text-xl font-semibold">{title}</h2>
        <p className="mx-auto max-w-xs text-sm text-muted-foreground">
          {description}
        </p>
      </div>

      <Link href={href}>
        <Button>
          <PlusCircle />
          {buttonText}
        </Button>
      </Link>
    </div>
  );
};
