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
        d="M53.33.22L.54,58.04l53.8,42.59,85.25-6.72L53.33.22z M104.53,84.14L50.4,127.2l103.1,8.12,54.12-42.5-103.1-8.68z M153.51,147.28L99.2,190.22l158.26,15.53.3-64.1-104.25,3.63z"
      />
    </svg>
  );
}
