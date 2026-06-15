import { cn } from "@/lib/utils";

export function Logo({ className, ...props }: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 258 206"
      className={cn("h-8 w-8", className)}
      {...props}
    >
      <path
        fill="currentColor"
        d="M53.33.22L.54,58.04l53.8,42.59,85.25-6.72L53.33.22z M104.53,84.14L50.4,127.2l103.46,78.65,103.8-50.23L104.53,84.14z"
      />
    </svg>
  );
}
