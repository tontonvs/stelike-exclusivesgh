import { useState } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import {
  Search,
  ShoppingCart,
  Bell,
  User,
  ChevronDown,
  X,
  Minus,
  Plus,
  Trash2,
} from "lucide-react";
import { cedis, type Product } from "@/lib/data";
import { useStore } from "@/lib/store";
import { ProductModal } from "./ProductModal";

type Panel = "search" | "cart" | "bell" | "profile" | null;

export function TopNav() {
  const [panel, setPanel] = useState<Panel>(null);
  const [selected, setSelected] = useState<Product | null>(null);
  const [query, setQuery] = useState("");
  const navigate = useNavigate();
  const {
    products,
    cart,
    cartCount,
    cartTotal,
    setQty,
    removeFromCart,
    notifications,
    searchHistory,
    pushSearch,
    removeSearch,
  } = useStore();

  const results = query.trim()
    ? products
        .filter((p) => p.name.toLowerCase().includes(query.trim().toLowerCase()))
        .slice(0, 6)
    : [];

  const close = () => setPanel(null);

  return (
    <>
      <header className="sticky top-0 z-[60] bg-nav text-nav-foreground">
        <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-5">
          <Link to="/" className="font-display text-xl font-bold tracking-[0.22em]">
            STELIKE
          </Link>
          <div className="flex items-center gap-5">
            <button aria-label="Search" onClick={() => setPanel("search")}>
              <Search className="size-[22px] transition-transform hover:scale-110" />
            </button>
            <button aria-label="Cart" className="relative" onClick={() => setPanel("cart")}>
              <ShoppingCart className="size-[22px] transition-transform hover:scale-110" />
              {cartCount > 0 && (
                <span className="absolute -right-2 -top-2 grid size-[18px] place-items-center rounded-full bg-background text-[10px] font-bold text-foreground">
                  {cartCount}
                </span>
              )}
            </button>
            <button aria-label="Notifications" className="relative" onClick={() => setPanel("bell")}>
              <Bell className="size-[22px] transition-transform hover:scale-110" />
              <span className="absolute -right-1 -top-1 size-2 rounded-full bg-background" />
            </button>
            <button
              aria-label="Account"
              className="flex items-center gap-0.5"
              onClick={() => setPanel("profile")}
            >
              <User className="size-[22px]" />
              <ChevronDown className="size-4" />
            </button>
          </div>
        </div>
      </header>

      {panel && (
        <div
          className="fixed inset-0 z-[65] bg-foreground/30 backdrop-blur-[2px] animate-soft"
          onClick={close}
        >
          <div
            className="mx-auto mt-16 max-w-5xl px-4"
            onClick={(e) => e.stopPropagation()}
          >
            {panel === "search" && (
              <div className="rounded-sm bg-card p-4 shadow-float animate-rise">
                <div className="flex items-center gap-2 rounded-sm border px-3 py-2.5">
                  <Search className="size-4 text-muted-foreground" />
                  <input
                    autoFocus
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search for what you need"
                    className="w-full bg-transparent text-sm outline-none"
                  />
                  <button onClick={close} aria-label="Close search">
                    <X className="size-4" />
                  </button>
                </div>

                {results.length > 0 ? (
                  <ul className="mt-3 space-y-1">
                    {results.map((p) => (
                      <li key={p.id}>
                        <button
                          onClick={() => {
                            pushSearch(p.name);
                            setSelected(p);
                            close();
                          }}
                          className="flex w-full items-center gap-3 rounded-sm p-2 text-left transition-colors hover:bg-muted"
                        >
                          <img
                            src={p.image}
                            alt={p.name}
                            className="size-11 rounded-sm object-cover"
                          />
                          <span className="flex-1 text-sm font-semibold">{p.name}</span>
                          <span className="text-sm">{cedis(p.price)}</span>
                        </button>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div className="mt-4">
                    <p className="text-xs font-semibold text-muted-foreground">
                      {query.trim() ? "No matches" : "Recent searches"}
                    </p>
                    <ul className="mt-2 space-y-1">
                      {searchHistory.map((h) => (
                        <li
                          key={h}
                          className="flex items-center justify-between rounded-sm px-2 py-2 hover:bg-muted"
                        >
                          <button className="text-sm" onClick={() => setQuery(h)}>
                            {h}
                          </button>
                          <button aria-label={`Remove ${h}`} onClick={() => removeSearch(h)}>
                            <X className="size-4 text-muted-foreground" />
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}

            {panel === "cart" && (
              <div className="rounded-sm bg-card p-4 shadow-float animate-rise">
                <div className="flex items-center justify-between">
                  <p className="font-display text-base font-bold">Your cart</p>
                  <button onClick={close} aria-label="Close cart">
                    <X className="size-4" />
                  </button>
                </div>
                {cart.length === 0 ? (
                  <p className="py-8 text-center text-sm text-muted-foreground">
                    Your cart is empty.
                  </p>
                ) : (
                  <>
                    <ul className="mt-3 max-h-[50vh] space-y-2 overflow-y-auto">
                      {cart.map((l) => (
                        <li key={l.product.id} className="flex items-center gap-3">
                          <img
                            src={l.product.image}
                            alt={l.product.name}
                            className="size-14 rounded-sm object-cover"
                          />
                          <div className="flex-1">
                            <p className="text-sm font-semibold">{l.product.name}</p>
                            <p className="text-sm">{cedis(l.product.price)}</p>
                          </div>
                          <div className="flex items-center gap-2">
                            <button
                              aria-label="Decrease"
                              onClick={() => setQty(l.product.id, l.qty - 1)}
                            >
                              <Minus className="size-4" />
                            </button>
                            <span className="w-4 text-center text-sm font-semibold">
                              {l.qty}
                            </span>
                            <button
                              aria-label="Increase"
                              onClick={() => setQty(l.product.id, l.qty + 1)}
                            >
                              <Plus className="size-4" />
                            </button>
                            <button
                              aria-label="Remove"
                              onClick={() => removeFromCart(l.product.id)}
                            >
                              <Trash2 className="size-4 text-muted-foreground" />
                            </button>
                          </div>
                        </li>
                      ))}
                    </ul>
                    <div className="mt-4 flex items-center justify-between border-t pt-3">
                      <span className="text-sm text-muted-foreground">Total</span>
                      <span className="text-base font-bold">{cedis(cartTotal)}</span>
                    </div>
                    <button
                      onClick={() => {
                        close();
                        navigate({ to: "/checkout" });
                      }}
                      className="mt-3 w-full rounded-sm bg-primary py-3 text-sm font-semibold text-primary-foreground"
                    >
                      Checkout
                    </button>
                  </>
                )}
              </div>
            )}

            {panel === "bell" && (
              <div className="rounded-sm bg-card p-4 shadow-float animate-rise">
                <div className="flex items-center justify-between">
                  <p className="font-display text-base font-bold">Notifications</p>
                  <button onClick={close} aria-label="Close notifications">
                    <X className="size-4" />
                  </button>
                </div>
                <ul className="mt-3 space-y-3">
                  {notifications.map((n) => (
                    <li key={n.id} className="rounded-sm border p-3">
                      <p className="text-sm font-semibold">{n.title}</p>
                      <p className="text-sm text-muted-foreground">{n.body}</p>
                      <p className="mt-1 text-xs text-muted-foreground">{n.time}</p>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {panel === "profile" && (
              <div className="ml-auto w-56 rounded-sm bg-card p-1.5 shadow-float animate-rise">
                <Link
                  to="/profile"
                  onClick={close}
                  className="block rounded-sm px-3 py-2.5 text-sm font-semibold hover:bg-muted"
                >
                  Profile
                </Link>
                <Link
                  to="/orders"
                  onClick={close}
                  className="block rounded-sm px-3 py-2.5 text-sm font-semibold hover:bg-muted"
                >
                  My orders
                </Link>
                <div className="my-1 h-px bg-border" />
                <button
                  onClick={close}
                  className="block w-full rounded-sm px-3 py-2.5 text-left text-sm font-semibold hover:bg-muted"
                >
                  Log out
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      <ProductModal
        product={selected}
        onClose={() => setSelected(null)}
        onSelect={setSelected}
      />
    </>
  );
}
