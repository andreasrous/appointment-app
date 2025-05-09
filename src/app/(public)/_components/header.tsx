"use client";

import Link from "next/link";
import Image from "next/image";
import { RightNav } from "./right-nav";
import { HeaderMobile } from "./header-mobile";

export const Header = () => {
  return (
    <header className="flex gap-4 justify-between py-6 px-4 sm:px-0 text-gray-600">
      <div className="flex items-center gap-10">
        <Link
          href={"/"}
          className="text-primary font-bold text-2xl flex gap-1 items-center"
        >
          <Image src="/logo.svg" alt="Logo" width={32} height={32} priority />
          Schedio
        </Link>
        <nav className="hidden sm:flex gap-4">
          <Link href={"/pricing"}>Pricing</Link>
        </nav>
      </div>
      <HeaderMobile />
      <div className="hidden sm:flex">
        <RightNav />
      </div>
    </header>
  );
};
