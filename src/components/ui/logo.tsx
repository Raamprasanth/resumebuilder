import { cn } from "@/lib/utils";

export function Logo({ className, ...props }: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 160 160"
      className={cn("h-8 w-8", className)}
      {...props}
    >
      <path
        fill="currentColor"
        d="M100,20 L150,20 L150,50 L100,50 Z M50,70 L100,70 L100,100 L50,100 Z M0,120 L50,120 L50,150 L0,150 Z"
        transform="skewY(-30) translate(20, -10)"
      />
    </svg>
  );
}
