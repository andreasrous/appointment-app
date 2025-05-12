import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";

const Loading = () => {
  return (
    <div className="h-full p-4 sm:p-16">
      <section className="min-w-3xs flex flex-col mb-8 w-full items-center">
        <h1 className="text-3xl text-center bg-gradient-to-r from-pink-700 to-purple-700 bg-clip-text text-transparent font-bold mb-4">
          Book an appointment now!
        </h1>
        <Input
          placeholder="Search businesses..."
          className="w-full h-12 max-w-2xl bg-background rounded-full"
          aria-label="Search businesses"
        />
      </section>
      <div className="grid md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-5">
        {Array.from({ length: 8 }).map((_, i) => (
          <div
            key={i}
            className="min-w-3xs flex flex-col gap-2 rounded-xl border bg-background p-4 shadow-sm"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3 h-12">
                <Skeleton className="w-12 h-12 rounded-lg" />
                <Skeleton className="h-6 w-40" />
              </div>
              <Skeleton className="w-6 h-6 rounded-full" />
            </div>
            <Skeleton className="h-[4.5em] w-full" />
            <div className="mt-auto flex items-end justify-between gap-2">
              <div className="flex flex-col gap-1 w-2/3">
                <Skeleton className="h-4 w-1/2" />
                <Skeleton className="h-4 w-3/4" />
              </div>
              <Skeleton className="h-8 w-14 rounded-md" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Loading;
