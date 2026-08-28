import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Search, ChevronLeft, ChevronRight } from "lucide-react";
import { categories, type CategoryId, type Product } from "@/lib/data";
import { useStore } from "@/lib/store";
import { ProductCard } from "@/components/ProductCard";
import { ProductModal } from "@/components/ProductModal";
import { CardGridSkeleton, Sk, usePageLoading } from "@/components/Skeletons";

type ShopSearch = { category?: CategoryId };

export const Route = createFileRoute("/shop")({
  validateSearch: (search: Record<string, unknown>): ShopSearch => ({
    category: (search["category"] as CategoryId) || undefined,
  }),
  head: () => ({
    meta: [
      { title: "Shop Furniture — Stelike Exclusives" },
      {
        name: "description",
        content:
          "Browse center tables, TV stands, mirrors, bed frames and dressers available for delivery in Ghana.",
      },
      { property: "og:title", content: "Shop Furniture — Stelike Exclusives" },
      {
        property: "og:description",
        content: "Browse the full Stelike Exclusives furniture catalogue.",
      },
    ],
  }),
  component: Shop,
});

const PER_PAGE = 8;

function Shop() {
  const loading = usePageLoading();
  const { category } = Route.useSearch();
  const navigate = Route.useNavigate();
  const { products } = useStore();
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState<Product | null>(null);

  const filtered = products.filter(
    (p) =>
      (!category || p.category === category) &&
      p.name.toLowerCase().includes(query.trim().toLowerCase()),
  );
  const pages = Math.max(1, Math.ceil(filtered.length / PER_PAGE));
  const current = Math.min(page, pages);
  const visible = filtered.slice((current - 1) * PER_PAGE, current * PER_PAGE);

  const setCategory = (id?: CategoryId) => {
    setPage(1);
    navigate({ search: id ? { category: id } : {} });
  };

  if (loading)
    return (
      <div className="space-y-5 px-5 pt-5">
        <Sk className="h-12 w-full" />
        <div className="flex gap-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <Sk key={i} className="h-9 w-28 rounded-full" />
          ))}
        </div>
        <CardGridSkeleton count={8} />
      </div>
    );

  return (
    <div className="px-5 pb-32 pt-5 animate-soft">
      <div className="flex overflow-hidden rounded-sm bg-card shadow-card">
        <div className="flex flex-1 items-center gap-2 px-4">
          <input
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setPage(1);
            }}
            placeholder="Search for what you need"
            className="w-full bg-transparent py-3.5 text-sm outline-none"
          />
        </div>
        <button className="grid w-16 place-items-center bg-primary text-primary-foreground">
          <Search className="size-5" />
        </button>
      </div>

      <div className="mt-4 flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none]">
        <button
          onClick={() => setCategory(undefined)}
          className={`shrink-0 rounded-full px-5 py-2 text-sm font-semibold transition-colors ${
            !category ? "bg-primary text-primary-foreground" : "bg-card shadow-card"
          }`}
        >
          All
        </button>
        {categories.map((c) => (
          <button
            key={c.id}
            onClick={() => setCategory(c.id)}
            className={`shrink-0 rounded-full px-5 py-2 text-sm font-semibold transition-colors ${
              category === c.id
                ? "bg-primary text-primary-foreground"
                : "bg-card shadow-card"
            }`}
          >
            {c.label}
          </button>
        ))}
      </div>

      <div className="mt-6 flex items-end justify-between">
        <h1 className="text-lg font-bold">
          {category ? categories.find((c) => c.id === category)?.label : "All Products"}
        </h1>
        <span className="text-sm text-muted-foreground">{filtered.length} items</span>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-4 lg:grid-cols-4">
        {visible.map((p) => (
          <ProductCard key={p.id} product={p} onSelect={setSelected} showBadge={false} />
        ))}
      </div>

      {filtered.length === 0 && (
        <p className="py-16 text-center text-sm text-muted-foreground">
          No pieces match that search.
        </p>
      )}

      {pages > 1 && (
        <div className="mt-8 flex items-center justify-center gap-2">
          <button
            aria-label="Previous page"
            onClick={() => setPage(Math.max(1, current - 1))}
            className="grid size-9 place-items-center rounded-sm bg-card shadow-card disabled:opacity-40"
            disabled={current === 1}
          >
            <ChevronLeft className="size-4" />
          </button>
          {Array.from({ length: pages }).map((_, idx) => (
            <button
              key={idx}
              onClick={() => setPage(idx + 1)}
              className={`size-9 rounded-sm text-sm font-semibold transition-colors ${
                current === idx + 1
                  ? "bg-primary text-primary-foreground"
                  : "bg-card shadow-card"
              }`}
            >
              {idx + 1}
            </button>
          ))}
          <button
            aria-label="Next page"
            onClick={() => setPage(Math.min(pages, current + 1))}
            className="grid size-9 place-items-center rounded-sm bg-card shadow-card disabled:opacity-40"
            disabled={current === pages}
          >
            <ChevronRight className="size-4" />
          </button>
        </div>
      )}

      <ProductModal
        product={selected}
        onClose={() => setSelected(null)}
        onSelect={setSelected}
      />
    </div>
  );
}
