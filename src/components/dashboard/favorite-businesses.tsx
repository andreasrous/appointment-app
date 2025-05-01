import Link from "next/link";

import { Business } from "@prisma/client";
import { Button } from "@/components/ui/button";
import { BusinessCard } from "@/components/business/business-card";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { BookmarkPlus } from "lucide-react";

interface FavoriteBusinessesProps {
  businesses: (Business & { isFavorited: boolean })[];
}

export const FavoriteBusinesses = ({ businesses }: FavoriteBusinessesProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Favorites</CardTitle>
        <CardDescription>A list of your favorite businesses.</CardDescription>
      </CardHeader>
      <CardContent>
        <>
          {businesses.length > 0 ? (
            <div className="overflow-x-auto">
              <div className="flex gap-4 min-w-max">
                {businesses.map((business) => (
                  <div key={business.id} className="min-w-[300px]">
                    <BusinessCard business={business} />
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="max-h-[200px] overflow-hidden grid auto-rows-min gap-4 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
              {Array.from({ length: 4 }).map((_, idx) => (
                <div
                  key={idx}
                  className="flex h-[200px] w-full items-center justify-center rounded-xl border border-dashed border-muted-foreground dark:border-border"
                >
                  <Link href="/search">
                    <Button size="icon" variant="ghost">
                      <BookmarkPlus className="size-7 text-gray-400 dark:text-muted-foreground" />
                    </Button>
                  </Link>
                </div>
              ))}
            </div>
          )}
        </>
      </CardContent>
    </Card>
  );
};
