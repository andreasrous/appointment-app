import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardFooter, CardHeader } from "@/components/ui/card";

const Loading = () => {
  return (
    <div className="h-full flex flex-col gap-4">
      <Card className="w-full max-w-lg pb-0 space-y-4">
        <CardHeader className="space-y-1">
          <Skeleton className="h-7 w-1/4" />
          <Skeleton className="h-5 w-1/2" />
        </CardHeader>
        <CardFooter className="flex flex-col md:flex-row md:items-center md:justify-between bg-muted dark:bg-black/40 dark:border-t gap-4 py-4 rounded-b-xl">
          <Skeleton className="h-9 w-1/3 rounded-lg bg-background dark:bg-accent" />
          <Skeleton className="h-5 w-1/2 rounded-lg bg-background dark:bg-accent" />
        </CardFooter>
      </Card>
    </div>
  );
};

export default Loading;
