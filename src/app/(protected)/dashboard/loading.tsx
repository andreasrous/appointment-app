import { Skeleton } from "@/components/ui/skeleton";

const Loading = () => {
  const skeletonData = [
    { label: "Total Revenue" },
    { label: "Confirmed Appointments" },
    { label: "Completed Appointments" },
    { label: "Canceled Appointments" },
  ];

  return (
    <div className="h-full flex flex-col gap-4">
      <div className="grid auto-rows-min gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {skeletonData.map(({ label }) => (
          <div
            key={label}
            className="relative p-6 bg-background border rounded-xl shadow-sm"
          >
            <div className="mb-2">
              <Skeleton className="h-6 w-1/2" />
            </div>
            <Skeleton className="h-8 w-3/4" />
          </div>
        ))}
      </div>
      <div className="p-6 bg-background border rounded-xl shadow-sm space-y-6">
        <div className="flex flex-col space-y-2">
          <Skeleton className="h-6 w-1/3" />
          <Skeleton className="h-4 w-2/3" />
        </div>
        <div className="max-h-[200px] overflow-hidden grid auto-rows-min gap-4 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
          {Array.from({ length: 4 }).map((_, idx) => (
            <div key={idx} className="flex h-[200px] w-full bg-background">
              <div className="min-w-3xs flex flex-col gap-2 rounded-xl border bg-background p-4 shadow-xs">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3 h-12">
                    <Skeleton className="h-12 w-12 rounded-lg" />
                    <Skeleton className="h-6 w-40 rounded" />
                  </div>
                  <Skeleton className="h-5 w-5 rounded" />
                </div>
                <Skeleton className="h-[4.5em] w-full rounded" />
                <div className="mt-auto flex items-end justify-between gap-2">
                  <div className="space-y-1">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-4 w-48" />
                  </div>
                  <Skeleton className="h-8 w-20 rounded-lg" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="h-full flex flex-col p-6 bg-background border rounded-xl shadow-sm gap-6">
        <div className="flex items-center justify-between">
          <Skeleton className="w-24 h-9 rounded-md" />
          <Skeleton className="w-50 h-8 rounded-md" />
        </div>
        <Skeleton className="w-full h-full rounded-lg" />
      </div>
    </div>
  );
};

export default Loading;
