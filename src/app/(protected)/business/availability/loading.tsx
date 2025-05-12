import { Skeleton } from "@/components/ui/skeleton";

const Loading = () => {
  return (
    <div className="flex w-full h-full flex-1 items-center justify-center">
      <div className="w-lg border rounded-xl p-6 bg-background shadow-sm space-y-6">
        <div className="space-y-2">
          <Skeleton className="h-8 w-1/4" />
          <Skeleton className="h-5 w-3/4" />
        </div>
        {[...Array(7)].map((_, index) => (
          <div
            key={index}
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 items-start gap-4"
          >
            <div className="flex items-center gap-4">
              <Skeleton className="h-5 w-8 rounded-full" />
              <Skeleton className="h-6 w-22" />
            </div>
            <Skeleton className="h-9 w-full" />
            <Skeleton className="h-9 w-full" />
          </div>
        ))}
        <div className="flex justify-end">
          <Skeleton className="h-9 w-16 rounded-md" />
        </div>
      </div>
    </div>
  );
};

export default Loading;
