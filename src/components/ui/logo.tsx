import Image from "next/image";
import { cn } from "@/lib/utils";

export function Logo({ className, ...props }: Partial<React.ComponentProps<typeof Image>>) {
  return (
    <Image
      src="/logo.png"
      alt="Job Genie Logo"
      width={200}
      height={80}
      className={cn("object-contain", className)}
      priority
      {...props}
    />
  );
}
