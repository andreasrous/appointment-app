"use client";

import Link from "next/link";

export const Hero = () => {
  return (
    <section className="text-center mt-16 sm:mt-24 px-4">
      <h1 className="text-4xl sm:text-5xl font-bold mb-6 leading-tight">
        Scheduling <span className="text-primary">made effortless</span>
        <br />
        for everyone
      </h1>
      <p className="sm:text-lg text-gray-600">
        Users can book appointments in seconds. Businesses get a simple,
        powerful way to
        <br />
        manage their schedule and stay in touch with clients — all in one place.
      </p>
      <Link
        href={"/auth/signup"}
        className="w-fit flex bg-black text-white mx-auto mt-6 py-2 px-4 rounded-full"
      >
        Get started for free
      </Link>
    </section>
  );
};
