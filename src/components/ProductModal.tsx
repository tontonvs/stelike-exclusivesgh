import { X } from "lucide-react";
import { cedis, type Product } from "@/lib/data";
import { useStore } from "@/lib/store";
import { toast } from "sonner";

export function ProductModal({
  product,
  onClose,
  onSelect,
}: {
  product: Product | null;
  onClose: () => void;
  onSelect: (p: Product) => void;
}) {
  const { products, addToCart } = useStore();
  if (!product) return null;

  const related = products
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, 3);

  return (
    <div className="fixed inset-0 z-[70] flex justify-center bg-foreground/40 px-3 backdrop-blur-sm animate-soft md:px-0">
      <div className="relative mt-16 mb-24 flex w-full max-w-xl flex-col overflow-hidden rounded-sm bg-background animate-rise md:mb-20">
        <button
          onClick={onClose}
          aria-label="Close"
          className="glass-x absolute right-4 top-4 z-10 size-10 hover:scale-105"
        >
          <X className="size-5" />
        </button>

        <div className="flex-1 overflow-y-auto px-5 pb-28 pt-16">
          <img
            src={product.image}
            alt={product.name}
            className="aspect-[4/3] w-full rounded-sm object-cover"
          />
          <h1 className="mt-4 text-xl font-bold">{product.name}</h1>
          <p className="mt-2 text-lg font-bold">{cedis(product.price)}</p>
          <p className="text-sm text-muted-foreground">{product.stock} in stock</p>
          <p className="mt-3 text-sm leading-relaxed">{product.description}</p>

          <h2 className="mt-6 text-base font-bold">Specifications</h2>
          <div className="mt-2 overflow-hidden rounded-sm border bg-card">
            {product.specs.map((s) => (
              <div
                key={s.label}
                className="flex items-center justify-between border-b px-4 py-3 text-sm last:border-b-0"
              >
                <span className="text-muted-foreground">{s.label}</span>
                <span className="font-semibold">{s.value}</span>
              </div>
            ))}
          </div>

          {related.length > 0 && (
            <>
              <h2 className="mt-6 text-base font-bold">You may also like</h2>
              <div className="mt-2 grid grid-cols-3 gap-3">
                {related.map((r) => (
                  <button
                    key={r.id}
                    onClick={() => onSelect(r)}
                    className="overflow-hidden rounded-sm border bg-card text-left transition-transform hover:-translate-y-0.5"
                  >
                    <img
                      src={r.image}
                      alt={r.name}
                      loading="lazy"
                      className="aspect-square w-full object-cover"
                    />
                    <div className="p-2">
                      <p className="line-clamp-2 text-xs font-semibold">{r.name}</p>
                      <p className="text-xs font-bold">{cedis(r.price)}</p>
                    </div>
                  </button>
                ))}
              </div>
            </>
          )}
        </div>

        <div className="absolute inset-x-0 bottom-0 flex items-center gap-4 border-t bg-card px-5 py-3">
          <div>
            <p className="text-xs text-muted-foreground">Price</p>
            <p className="text-lg font-bold">{cedis(product.price)}</p>
          </div>
          <button
            onClick={() => {
              addToCart(product);
              toast.success("Added to cart", { description: product.name });
              onClose();
            }}
            className="flex-1 rounded-sm bg-info py-3.5 text-base font-semibold text-info-foreground transition-opacity hover:opacity-90"
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
}
