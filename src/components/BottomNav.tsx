import { Link, useRouterState } from "@tanstack/react-router";
import { Home, Store, ClipboardList, Phone } from "lucide-react";

const items = [
  { to: "/", label: "Home", Icon: Home },
  { to: "/shop", label: "Shop", Icon: Store },
  { to: "/orders", label: "Orders", Icon: ClipboardList },
  { to: "/contact", label: "Contact", Icon: Phone },
] as const;

export function BottomNav() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  return (
    <nav className="fixed inset-x-0 bottom-0 z-50 flex justify-center px-4 pb-3">
      <div className="glass-bar flex w-full max-w-sm items-center gap-1 rounded-full border border-foreground/5 p-1 shadow-float">
        {items.map(({ to, label, Icon }) => {
          const active = to === "/" ? pathname === "/" : pathname.startsWith(to);
          return (
            <Link
              key={to}
              to={to}
              className="relative flex min-w-0 flex-1 flex-col items-center gap-0 rounded-full px-1.5 py-1.5 transition-colors duration-300"
            >
              {active && (
                <span className="absolute inset-0 rounded-full bg-card shadow-card transition-all duration-300" />
              )}
              <Icon
                className={`relative size-[15px] transition-colors ${active ? "text-foreground" : "text-foreground/55"}`}
                fill={active ? "currentColor" : "none"}
                strokeWidth={active ? 1.5 : 2}
              />
              <span
                className={`relative truncate text-[9px] font-semibold ${active ? "text-foreground" : "text-foreground/55"}`}
              >
                {label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
