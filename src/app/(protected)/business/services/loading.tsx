import { AddService } from "@/components/business/add-service";
import { Skeleton } from "@/components/ui/skeleton";

const Loading = () => {
  return (
    <div className="px-4 pt-2 space-y-6">
      <div className="flex items-center justify-between">
        <div className="hidden sm:grid gap-y-1">
          <h1 className="text-3xl font-semibold">Services</h1>
          <p className="text-muted-foreground">
            Create and manage your services right here.
          </p>
        </div>
        <AddService employees={null} />
      </div>
      <div className="grid md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-5">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="min-w-3xs relative overflow-hidden rounded-lg border bg-card text-card-foreground shadow-sm"
          >
            <div className="absolute top-4 right-4">
              <Skeleton className="h-6 w-6 rounded-full" />
            </div>
            <div className="flex items-center gap-4 px-5 py-6">
              <Skeleton className="size-6 rounded" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-6 w-1/4" />
                <Skeleton className="h-4 w-1/3" />
              </div>
            </div>
            <div className="flex items-center justify-between bg-muted dark:bg-black/40 dark:border-t px-5 py-3">
              <Skeleton className="h-5 w-8 rounded-full bg-background dark:bg-accent" />
              <Skeleton className="h-9 w-28 bg-background dark:bg-accent" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Loading;
