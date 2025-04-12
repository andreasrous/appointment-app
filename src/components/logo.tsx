import Image from "next/image";
import Link from "next/link";

export const Logo = () => {
  return (
    <Link href="/">
      <div className="flex items-center gap-2">
        <Image src="/public/logo.svg" alt="Logo" className="size-9" />
        <h1 className="text-xl font-semibold">Schedio</h1>
      </div>
    </Link>
  );
};
