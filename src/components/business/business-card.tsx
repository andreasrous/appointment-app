"use client";

import Link from "next/link";
import Image from "next/image";

import { useState } from "react";
import { Business } from "@prisma/client";
import { Button } from "@/components/ui/button";
import { Building } from "lucide-react";
import { FaBookmark, FaRegBookmark } from "react-icons/fa";
import { addToFavorites, removeFromFavorites } from "@/actions/business";

interface BusinessCardProps {
  business: Business & { isFavorited: boolean };
  searchTerm?: string;
}

export const BusinessCard = ({
  business,
  searchTerm = "",
}: BusinessCardProps) => {
  const [isFavorited, setIsFavorited] = useState(business.isFavorited);

  const highlightMatch = (text: string, highlight: string) => {
    if (!highlight.trim()) return text;

    const regex = new RegExp(`(${highlight})`, "gi");

    return text.split(regex).map((part, i) =>
      regex.test(part) ? (
        <span key={i} className="bg-amber-200 text-slate-950 rounded">
          {part}
        </span>
      ) : (
        part
      )
    );
  };

  const handleFavoriteClick = () => {
    if (isFavorited) {
      removeFromFavorites(business.id);
      setIsFavorited(false);
    } else {
      addToFavorites(business.id);
      setIsFavorited(true);
    }
  };

  return (
    <div className="min-w-3xs flex flex-col gap-2 rounded-xl border bg-background p-4 shadow-sm">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3 h-12">
          {business.logo ? (
            <Image
              src={business.logo}
              alt={business.name || "Business Logo"}
              width={48}
              height={48}
              className="rounded-lg object-cover"
            />
          ) : (
            <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-primary">
              <Building className="text-white w-6 h-6" />
            </div>
          )}
          <header className="text-xl font-semibold truncate">
            {highlightMatch(business.name, searchTerm)}
          </header>
        </div>
        <Button variant="ghost" size="icon" onClick={handleFavoriteClick}>
          {isFavorited ? (
            <FaBookmark className="size-5 text-yellow-500 dark:text-yellow-400" />
          ) : (
            <FaRegBookmark className="size-5 text-muted-foreground" />
          )}
        </Button>
      </div>

      {business.description ? (
        <p className="line-clamp-3 text-sm min-h-[4.5em]">
          {business.description}
        </p>
      ) : (
        <p className="text-sm min-h-[4.5em]">No description.</p>
      )}

      <div className="mt-auto flex items-end justify-between gap-2">
        <div className="min-w-0 text-sm text-muted-foreground">
          {business.phone && <div className="truncate">{business.phone}</div>}
          {business.address && (
            <div className="truncate">{business.address}</div>
          )}
        </div>
        <Link href={`/booking/${business.id}`}>
          <Button size="sm">Book</Button>
        </Link>
      </div>
    </div>
  );
};
