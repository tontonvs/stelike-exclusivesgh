import { useEffect, useState } from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import { Home, ShoppingBag, ClipboardList, Send, Moon, Sun } from "lucide-react";

const navItems = [
  { to: "/", label: "Home", Icon: Home },
  { to: "/shop", label: "Shop", Icon: ShoppingBag },
  { to: "/orders", label: "Orders", Icon: ClipboardList },
] as const;

export function BottomNav() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const [dark, setDark] = useState(false);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
  }, [dark]);

  const isActive = (to: string) =>
    to === "/" ? pathname === "/" : pathname.startsWith(to);

  return (
    <>
      {/* Mobile: dark glass pill, icon-only, filled with slight transparency,
          ending in a raised white circular CTA — matches the reference look */}
      <nav className="fixed inset-x-0 bottom-0 z-50 flex items-center justify-center gap-2 px-4 pb-3 md:hidden">
        <div className="glass-nav-dark flex items-center gap-1 rounded-full p-1.5 shadow-float">
          {[...navItems, { to: "/contact", label: "Contact", Icon: Send }].map(
            ({ to, label, Icon }) => {
              const active = isActive(to);
              return (
                <Link
                  key={to}
                  to={to}
                  aria-label={label}
                  className={`grid size-11 shrink-0 place-items-center rounded-full transition-all duration-300 ${
                    active ? "bg-white shadow-card" : ""
                  }`}
                >
                  <Icon
                    className={`size-[18px] transition-colors ${active ? "text-neutral-900" : "text-white"}`}
                    fill="none"
                    strokeWidth={2}
                  />
                </Link>
              );
            },
          )}
        </div>
        <button
          aria-label={dark ? "Switch to light mode" : "Switch to dark mode"}
          onClick={() => setDark((d) => !d)}
          className="glass-nav-dark grid size-11 shrink-0 place-items-center rounded-full shadow-float transition-transform hover:scale-105"
        >
          {dark ? (
            <Sun className="size-[18px] text-white opacity-90" strokeWidth={1.5} />
          ) : (
            <Moon className="size-[18px] text-white opacity-90" fill="currentColor" strokeWidth={1.5} />
          )}
        </button>
      </nav>

      {/* Desktop: plain full-width bar attached to the bottom, generic style */}
      <nav className="fixed inset-x-0 bottom-0 z-50 hidden h-14 border-t bg-nav text-nav-foreground md:block">
        <div className="mx-auto flex h-full max-w-5xl items-center justify-center gap-16 px-5">
          {[...navItems, { to: "/contact", label: "Contact", Icon: Send }].map(
            ({ to, label, Icon }) => {
              const active = isActive(to);
              return (
                <Link
                  key={to}
                  to={to}
                  className={`flex items-center gap-2 px-1 py-1 text-sm font-semibold transition-colors ${
                    active
                      ? "text-nav-foreground"
                      : "text-nav-foreground/60 hover:text-nav-foreground"
                  }`}
                >
                  <Icon className="size-4" fill={active ? "currentColor" : "none"} strokeWidth={2} />
                  {label}
                </Link>
              );
            },
          )}
        </div>
      </nav>
    </>
  );
}
