import { Link } from "wouter";

function MenuItem({
  className,
  href,
  active,
  children,
}: React.ComponentProps<"div"> & {
  asChild?: boolean;
  href: string;
  active?: boolean;
}) {
  return (
    <Link href={href} className={active ? "pointer-events-none" : ""}>
      <div
        className={`focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive inline-flex h-9 w-full shrink-0 items-center justify-start gap-2 rounded-md px-4 py-2 text-sm font-medium whitespace-nowrap transition-all outline-none focus-visible:ring-[3px] disabled:pointer-events-none disabled:opacity-50 has-[>svg]:px-3 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 ${
          active
            ? "bg-secondary"
            : "hover:bg-secondary/25 hover:text-accent-foreground"
        } ${className} `}
      >
        {children}
      </div>
    </Link>
  );
}

export { MenuItem };
