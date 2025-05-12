import { Skeleton } from "@/components/ui/skeleton";

const Loading = () => {
  return (
    <div className="flex w-full h-full flex-1 items-center justify-center">
      <div className="w-full max-w-lg min-h-[672px] overflow-hidden rounded-xl border bg-card shadow-sm">
        <div className="p-6 space-y-2">
          <Skeleton className="h-8 w-1/3" />
          <Skeleton className="h-5 w-2/3" />
        </div>
        <div className="px-6 space-y-4">
          <div className="flex gap-2">
            <Skeleton className="h-9 w-full" />
            <Skeleton className="h-9 w-15" />
          </div>
          <div className="space-y-3 max-h-[488px] overflow-y-auto">
            {Array.from({ length: 5 }).map((_, i) => (
              <div
                key={i}
                className="flex justify-between items-center border rounded-lg px-4 py-4"
              >
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-6 w-6 rounded-full" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Loading;
