import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ArrowRight } from "lucide-react";
import { categories, type Product } from "@/lib/data";
import { img } from "@/lib/images";
import { useStore } from "@/lib/store";
import { ProductCard } from "@/components/ProductCard";
import { ProductModal } from "@/components/ProductModal";
import { HomeSkeleton, usePageLoading } from "@/components/Skeletons";
import { Footer } from "@/components/Footer";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Stelike Exclusives — Custom Furniture in Accra" },
      {
        name: "description",
        content:
          "Custom TV consoles, center tables, LED mirrors, bed frames and dressers, built and delivered across Accra and Ghana.",
      },
      { property: "og:title", content: "Stelike Exclusives — Custom Furniture in Accra" },
      {
        property: "og:description",
        content:
          "Custom TV consoles, center tables, LED mirrors, bed frames and dressers, delivered across Ghana.",
      },
    ],
  }),
  component: Home,
});

const slides = [
  {
    title: "Welcome",
    heading: "to Stelike Exclusives",
    body: "Curated center tables, TV stands & units, mirrors and bed frames — delivered across Accra, Achimota & East Legon.",
    cta: { label: "Shop", to: "/shop" as const },
  },
  {
    title: "Built to your wall",
    heading: "Custom media units",
    body: "Floating consoles, LED backlit partitions and acoustic entertainment walls, fabricated to your exact room specs.",
    cta: null,
  },
  {
    title: "Pay on delivery",
    heading: "Across Greater Accra",
    body: "On-site assembly and mounting included. Kumasi, Takoradi and other urban centres served nationwide.",
    cta: { label: "About", to: "/contact" as const },
  },
];

function Home() {
  const loading = usePageLoading();
  const { products } = useStore();
  const [selected, setSelected] = useState<Product | null>(null);
  const [i, setI] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setI((n) => (n + 1) % slides.length), 5000);
    return () => clearInterval(t);
  }, []);

  if (loading) return <HomeSkeleton />;

  const slide = slides[i]!;
  const featured = products.slice(0, 6);

  return (
    <div className="animate-soft">
      <section className="relative h-[6cm] w-full overflow-hidden">
        <img
          src={img.hero}
          alt="LED backlit media wall by Stelike Exclusives"
          className="size-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-foreground/80 via-foreground/45 to-transparent" />
        <div key={i} className="absolute inset-0 flex flex-col justify-center gap-1 px-5 animate-rise">
          <h1 className="font-display text-2xl font-bold text-background sm:text-3xl">
            <span className="text-accent">{slide.title}</span>
            <br />
            {slide.heading}
          </h1>
          <p className="max-w-md text-sm leading-snug text-background/85">{slide.body}</p>
          {slide.cta && (
            <Link
              to={slide.cta.to}
              className="mt-2 w-fit rounded-sm bg-background px-5 py-2 text-sm font-semibold text-foreground transition-transform hover:scale-[1.03]"
            >
              {slide.cta.label}
            </Link>
          )}
        </div>
      </section>

      <section className="px-5 pt-7">
        <h2 className="text-lg font-bold">Shop by Category</h2>
        <div className="mt-4 flex gap-5 overflow-x-auto pb-2 [scrollbar-width:none]">
          {categories.map((c) => (
            <Link
              key={c.id}
              to="/shop"
              search={{ category: c.id }}
              className="group flex w-[92px] shrink-0 flex-col items-center gap-2"
            >
              <span className="size-[86px] overflow-hidden rounded-full bg-card shadow-card transition-transform duration-300 group-hover:scale-105">
                <img
                  src={c.image}
                  alt={c.label}
                  loading="lazy"
                  className="size-full object-cover"
                />
              </span>
              <span className="text-center text-xs font-semibold text-muted-foreground">
                {c.label}
              </span>
            </Link>
          ))}
        </div>
      </section>

      <section className="px-5 pt-7">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold">Featured Pieces</h2>
          <Link
            to="/shop"
            className="flex items-center gap-2 rounded-sm bg-card px-4 py-2 text-sm font-semibold shadow-card transition-transform hover:scale-[1.03]"
          >
            Show all <ArrowRight className="size-4" />
          </Link>
        </div>
        <div className="mt-4 grid grid-cols-2 gap-4 lg:grid-cols-3">
          {featured.map((p) => (
            <ProductCard key={p.id} product={p} onSelect={setSelected} />
          ))}
        </div>
      </section>

      <Footer />
      <ProductModal
        product={selected}
        onClose={() => setSelected(null)}
        onSelect={setSelected}
      />
    </div>
  );
}
