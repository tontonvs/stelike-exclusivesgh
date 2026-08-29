import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import logoSrc from "@/assets/stelike-logo.png";

type Slide = {
  kicker: string;
  title: string;
  body: string;
  image?: string;
};

const slides: Slide[] = [
  {
    kicker: "Welcome",
    title: "Stelike Exclusives",
    body: "A members' demo of the Stelike Exclusives store — browse, preview and test-order our custom furniture.",
    image: logoSrc,
  },
  {
    kicker: "Heads up",
    title: "This is a demo",
    body: "Some corners are still rough and a few flows may act up. Nothing here charges you for real.",
  },
  {
    kicker: "What works",
    title: "Browse, cart, checkout",
    body: "Shop the catalogue, preview items, add to cart, pick delivery or pickup, share your location and place a test order — it lands in Orders with a WhatsApp handoff.",
  },
  {
    kicker: "Coming next",
    title: "Staff dashboard & analytics",
    body: "A staff area to view and control orders, stock and dispatch, plus sales analytics on top sellers, areas and revenue trends.",
  },
  {
    kicker: "That's it",
    title: "Enjoy the look around",
    body: "Tap through, break things, and tell us what you'd like changed.",
  },
];

export function LaunchNotice() {
  const [shown, setShown] = useState(false);
  const [i, setI] = useState(0);

  useEffect(() => {
    if (sessionStorage.getItem("stelike.notice")) return;
    const t = setTimeout(() => setShown(true), 5200);
    return () => clearTimeout(t);
  }, []);

  const dismiss = () => {
    sessionStorage.setItem("stelike.notice", "1");
    setShown(false);
  };

  if (!shown) return null;
  const slide = slides[i]!;

  return (
    <div className="fixed inset-0 z-[95] flex flex-col items-center justify-center bg-foreground/40 px-5 backdrop-blur-sm animate-soft">
      <div className="w-full max-w-[320px] rounded-sm bg-card p-5 shadow-float animate-rise-sm">
        <div key={i} className="animate-soft">
          {slide.image && (
            <img
              src={slide.image}
              alt=""
              className="mx-auto mb-3 h-20 w-auto object-contain"
            />
          )}
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-info">
            {slide.kicker}
          </p>
          <h2 className="mt-1 font-display text-lg font-bold leading-tight">{slide.title}</h2>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{slide.body}</p>
        </div>

        <div className="mt-4 flex items-center justify-between">
          <button
            onClick={() => setI((n) => Math.max(0, n - 1))}
            disabled={i === 0}
            aria-label="Previous"
            className="grid size-9 place-items-center rounded-full bg-muted transition-transform hover:scale-105 disabled:opacity-35"
          >
            <ChevronLeft className="size-4" />
          </button>

          <div className="flex items-center gap-1.5">
            {slides.map((_, n) => (
              <span
                key={n}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  n === i ? "w-5 bg-info" : "w-1.5 bg-border"
                }`}
              />
            ))}
          </div>

          <button
            onClick={() => setI((n) => Math.min(slides.length - 1, n + 1))}
            disabled={i === slides.length - 1}
            aria-label="Next"
            className="grid size-9 place-items-center rounded-full bg-info text-info-foreground transition-transform hover:scale-105 disabled:opacity-35"
          >
            <ChevronRight className="size-4" />
          </button>
        </div>
      </div>

      <button
        onClick={dismiss}
        className="glass-x mt-4 flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-semibold text-background"
      >
        <X className="size-4" /> Close
      </button>
    </div>
  );
}
