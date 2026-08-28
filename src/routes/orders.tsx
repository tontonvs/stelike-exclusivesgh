import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Search, SlidersHorizontal } from "lucide-react";
import { cedis } from "@/lib/data";
import { useStore } from "@/lib/store";
import { ListSkeleton, Sk, usePageLoading } from "@/components/Skeletons";

export const Route = createFileRoute("/orders")({
  head: () => ({
    meta: [
      { title: "My Orders — Stelike Exclusives" },
      {
        name: "description",
        content:
          "Track Stelike Exclusives furniture orders and deliveries by phone number or order ID.",
      },
      { property: "og:title", content: "My Orders — Stelike Exclusives" },
      {
        property: "og:description",
        content: "Track your Stelike Exclusives orders and deliveries in one place.",
      },
    ],
  }),
  component: Orders,
});

type Sort = "newest" | "oldest" | "total";

function Orders() {
  const loading = usePageLoading();
  const { orders } = useStore();
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState<Sort>("newest");
  const [showSort, setShowSort] = useState(false);

  const q = query.trim().toLowerCase();
  const filtered = orders
    .filter((o) => !q || o.id.toLowerCase().includes(q) || o.phone.includes(q))
    .sort((a, b) => {
      if (sort === "total") return b.total - a.total;
      const d = +new Date(a.createdAt) - +new Date(b.createdAt);
      return sort === "oldest" ? d : -d;
    });

  if (loading)
    return (
      <div className="space-y-4 px-5 pt-6">
        <Sk className="h-8 w-40" />
        <Sk className="h-11 w-full" />
        <ListSkeleton />
      </div>
    );

  return (
    <div className="px-5 pb-32 pt-6 animate-soft">
      <h1 className="text-2xl font-bold">My Orders</h1>
      <p className="mt-1 text-sm text-muted-foreground">Track all your orders in one place</p>

      <div className="mt-5 flex gap-2">
        <div className="flex flex-1 items-center gap-2 rounded-sm bg-card px-3 shadow-card">
          <Search className="size-4 text-muted-foreground" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by order ID, phone..."
            className="w-full bg-transparent py-3 text-sm outline-none"
          />
        </div>
        <button className="rounded-sm bg-primary px-5 text-sm font-semibold text-primary-foreground">
          Search
        </button>
        <button
          aria-label="Sort"
          onClick={() => setShowSort((s) => !s)}
          className="grid w-12 place-items-center rounded-sm bg-card shadow-card"
        >
          <SlidersHorizontal className="size-4" />
        </button>
      </div>

      {showSort && (
        <div className="mt-2 flex gap-2 animate-rise">
          {(
            [
              ["newest", "Newest"],
              ["oldest", "Oldest"],
              ["total", "Highest total"],
            ] as const
          ).map(([id, label]) => (
            <button
              key={id}
              onClick={() => setSort(id)}
              className={`rounded-full px-4 py-1.5 text-xs font-semibold ${
                sort === id ? "bg-primary text-primary-foreground" : "bg-card shadow-card"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      )}

      {filtered.length === 0 ? (
        <div className="py-24 text-center animate-rise">
          <p className="text-lg font-bold">No orders yet</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Your orders and deliveries will appear here.
          </p>
          <Link
            to="/shop"
            className="mt-6 inline-block rounded-sm bg-primary px-7 py-3.5 text-base font-semibold text-primary-foreground"
          >
            Start Shopping
          </Link>
        </div>
      ) : (
        <ul className="mt-5 space-y-3">
          {filtered.map((o) => (
            <li key={o.id} className="rounded-sm bg-card p-4 shadow-card animate-rise">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-bold">{o.id}</p>
                  <p className="text-xs text-muted-foreground">
                    {o.name} · {o.phone}
                  </p>
                </div>
                <span className="rounded-sm border-[1.5px] border-primary px-2 py-0.5 text-[11px] font-semibold">
                  {o.status}
                </span>
              </div>
              <ul className="mt-3 space-y-1 text-sm">
                {o.items.map((it) => (
                  <li key={it.name} className="flex justify-between">
                    <span className="text-muted-foreground">
                      {it.qty} × {it.name}
                    </span>
                    <span>{cedis(it.price * it.qty)}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-3 flex items-center justify-between border-t pt-3 text-sm">
                <span className="text-muted-foreground">
                  {new Date(o.createdAt).toLocaleDateString()} · {o.address}
                </span>
                <span className="font-bold">{cedis(o.total)}</span>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
