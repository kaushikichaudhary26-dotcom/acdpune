import { NavLink as RouterNavLink, NavLinkProps } from "react-router-dom";
import { forwardRef } from "react";
import { cn } from "@/lib/utils";

interface NavLinkCompatProps extends Omit<NavLinkProps, "className"> {
  className?: string;
  activeClassName?: string;
  pendingClassName?: string;
  variant?: "default" | "pill";
  size?: "sm" | "md";
}

const NavLink = forwardRef<HTMLAnchorElement, NavLinkCompatProps>(
  (
    {
      className,
      activeClassName,
      pendingClassName,
      to,
      variant = "default",
      size = "md",
      ...props
    },
    ref,
  ) => {
    const baseClassName = cn(
      "transition-colors",
      variant === "pill" && [
        "inline-flex items-center rounded-full uppercase tracking-[0.12em] font-semibold",
        size === "sm" ? "px-3 py-1 text-[10px]" : "px-4 py-1.5 text-[11px]",
      ],
    );

    return (
      <RouterNavLink
        ref={ref}
        to={to}
        className={({ isActive, isPending }) =>
          cn(
            baseClassName,
            className,
            variant === "pill" && !isActive && "text-muted-foreground hover:text-foreground",
            variant === "pill" && isActive && "bg-primary text-primary-foreground shadow-sm",
            isActive && activeClassName,
            isPending && pendingClassName,
          )
        }
        {...props}
      />
    );
  },
);

NavLink.displayName = "NavLink";

export { NavLink };
