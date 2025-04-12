import { cn } from "@/lib/utils";
import { BsCheckCircleFill } from "react-icons/bs";

interface FormSuccessProps {
  message?: string;
  className?: string;
}

export const FormSuccess = ({ message, className }: FormSuccessProps) => {
  if (!message) return null;

  return (
    <div
      role="status"
      style={
        {
          "--bg": "hsl(143,85%,96%)",
          "--border": "hsl(145,92%,87%)",
          "--text": "hsl(140,100%,27%)",
          "--bg-dark": "hsl(150,100%,6%)",
          "--border-dark": "hsl(147,100%,12%)",
          "--text-dark": "hsl(150,86%,65%)",
        } as React.CSSProperties
      }
      className={cn(
        "flex items-center gap-2 rounded-md border p-3 text-sm",
        "bg-[var(--bg)] border-[var(--border)] text-[var(--text)]",
        "dark:bg-[var(--bg-dark)] dark:border-[var(--border-dark)] dark:text-[var(--text-dark)]",
        className
      )}
    >
      <BsCheckCircleFill className="h-4 w-4" />
      <span>{message}</span>
    </div>
  );
};
