import { cn } from "@/lib/utils";

export function Logo({ className, ...props }: React.ImgHTMLAttributes<HTMLImageElement>) {
  return (
    <img
      src="/logo.png"
      alt="Job Genie Logo"
      className={cn("object-contain", className)}
      {...props}
    />
  );
}
