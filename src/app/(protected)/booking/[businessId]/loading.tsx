import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const Loading = () => {
  return (
    <div className="flex w-full h-full flex-1 items-center justify-center">
      <Card className="w-md">
        <CardHeader>
          <CardTitle>
            <Skeleton className="h-8 w-3/4" />
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div>
              <Skeleton className="h-10 w-full" />
            </div>
            <div>
              <Skeleton className="h-10 w-full" />
            </div>
            <div className="flex gap-4 flex-col sm:flex-row items-start">
              <div className="flex-1">
                <Skeleton className="h-10 w-full" />
              </div>
              <div className="flex-1">
                <Skeleton className="h-10 w-full" />
              </div>
            </div>
            <div>
              <Skeleton className="h-20 w-full" />
            </div>
            <div className="flex gap-2 justify-end">
              <Skeleton className="h-9 w-1/4" />
              <Skeleton className="h-9 w-1/4" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Loading;
