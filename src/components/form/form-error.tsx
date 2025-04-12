import { cn } from "@/lib/utils";
import { BsExclamationCircleFill } from "react-icons/bs";

interface FormErrorProps {
  message?: string;
  className?: string;
}

export const FormError = ({ message, className }: FormErrorProps) => {
  if (!message) return null;

  return (
    <div
      role="alert"
      style={
        {
          "--bg": "hsl(359,100%,97%)",
          "--border": "hsl(359,100%,94%)",
          "--text": "hsl(360,100%,45%)",
          "--bg-dark": "hsl(358,76%,10%)",
          "--border-dark": "hsl(357,89%,16%)",
          "--text-dark": "hsl(358,100%,81%)",
        } as React.CSSProperties
      }
      className={cn(
        "flex items-center gap-2 rounded-md border p-3 text-sm",
        "bg-[var(--bg)] border-[var(--border)] text-[var(--text)]",
        "dark:bg-[var(--bg-dark)] dark:border-[var(--border-dark)] dark:text-[var(--text-dark)]",
        className
      )}
    >
      <BsExclamationCircleFill className="h-4 w-4" />
      <span>{message}</span>
    </div>
  );
};
