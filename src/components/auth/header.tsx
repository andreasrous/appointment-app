import Image from "next/image";
import Logo from "/public/logo.svg";

interface HeaderProps {
  label: string;
}

export const Header = ({ label }: HeaderProps) => {
  return (
    <div className="w-full flex flex-col gap-y-4 items-center justify-center">
      <div className="flex items-center gap-2">
        <Image src={Logo} alt="Logo" className="size-9"></Image>
        <h1 className="text-xl font-semibold">Schedio</h1>
      </div>
      <p className="text-muted-foreground text-sm">{label}</p>
    </div>
  );
};
