import { Skeleton } from "@/components/ui/skeleton";

const Loading = () => {
  return (
    <div className="h-full w-full flex flex-col p-2.5 gap-4.5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-5">
          <Skeleton className="hidden sm:block h-10 w-16 rounded-lg" />
          <div className="hidden sm:flex gap-5">
            <Skeleton className="h-7 w-7 rounded-full" />
            <Skeleton className="h-7 w-7 rounded-full" />
          </div>
          <Skeleton className="h-10 w-12 sm:w-24 rounded-lg" />
        </div>
        <div className="flex gap-2.5">
          <Skeleton className="h-10 w-15 rounded-lg" />
          <Skeleton className="h-10 w-46 sm:w-53 rounded-lg" />
        </div>
      </div>
      <Skeleton className="h-full w-full rounded-lg" />
    </div>
  );
};

export default Loading;
