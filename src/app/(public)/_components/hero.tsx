"use client";

import Link from "next/link";
import { Play } from "lucide-react";

export const Hero = () => {
  return (
    <section className="text-center mt-16 sm:mt-24 px-4">
      <h1 className="text-4xl sm:text-5xl font-bold mb-6 leading-tight">
        Scheduling <span className={"text-primary"}>made effortless</span>
        <br />
        for everyone
      </h1>
      <p className="sm:text-lg text-gray-600">
        Users can book appointments in seconds. Businesses get a simple,
        powerful way to
        <br />
        manage their schedule and stay in touch with clients — all in one place.
      </p>
      <div className="mt-4 flex gap-4 justify-center">
        <Link
          href={"/auth/signup"}
          className="bg-black text-white py-2 px-4 rounded-full"
        >
          Get started for free
        </Link>
        <Link
          href={"/"}
          className="border border-gray-300 rounded-full py-2 px-4 inline-flex gap-1 items-center text-gray-800"
        >
          <Play size={16} />
          Watch video
        </Link>
      </div>
    </section>
  );
};
