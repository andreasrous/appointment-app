"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { BusinessCard } from "@/components/business/business-card";
import { Business } from "@prisma/client";

interface SearchBusinessesClientProps {
  businesses: (Business & { isFavorited: boolean })[] | null;
}

export const BusinessesView = ({ businesses }: SearchBusinessesClientProps) => {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredBusinesses = (businesses ?? []).filter((business) =>
    business.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      <section className="min-w-3xs flex flex-col mb-8 w-full items-center">
        <h1 className="text-3xl text-center bg-gradient-to-r from-pink-700 to-purple-700 bg-clip-text text-transparent font-bold mb-4">
          Book an appointment now!
        </h1>
        <Input
          placeholder="Search businesses..."
          className="w-full h-12 max-w-2xl bg-background rounded-full"
          aria-label="Search businesses"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </section>

      {filteredBusinesses.length > 0 ? (
        <div className="grid md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-5">
          {filteredBusinesses.map((business) => (
            <BusinessCard
              key={business.id}
              business={business}
              searchTerm={searchTerm}
            />
          ))}
        </div>
      ) : (
        <div className="text-center">
          <p className="text-muted-foreground">No businesses found</p>
        </div>
      )}
    </>
  );
};
