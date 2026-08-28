import { cedis, type Product } from "@/lib/data";

export function ProductCard({
  product,
  onSelect,
  showBadge = true,
}: {
  product: Product;
  onSelect: (p: Product) => void;
  showBadge?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={() => onSelect(product)}
      className="group relative flex flex-col overflow-hidden rounded-sm bg-card text-left shadow-card transition-all duration-300 hover:-translate-y-1 hover:shadow-float"
    >
      {showBadge && product.badge ? (
        <span className="glass-bar absolute left-2 top-2 z-10 rounded-sm border border-info bg-info/85 px-1.5 py-0.5 text-[9px] font-medium tracking-wide text-info-foreground shadow-card">
          {product.badge}
        </span>
      ) : null}
      <div className="aspect-square w-full overflow-hidden bg-muted">
        <img
          src={product.image}
          alt={product.name}
          loading="lazy"
          className="size-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
      </div>
      <div className="space-y-0.5 px-3 py-2.5">
        <p className="line-clamp-2 text-sm font-semibold leading-snug">{product.name}</p>
        <p className="text-sm font-bold">{cedis(product.price)}</p>
        <p className="text-xs text-muted-foreground">{product.stock} in stock</p>
      </div>
    </button>
  );
}
