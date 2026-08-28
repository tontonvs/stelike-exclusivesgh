import { useEffect, useState } from "react";

const WORD = "Stelike Exclusives";

export function LaunchOverlay() {
  const [shown, setShown] = useState(true);
  const [typed, setTyped] = useState("");
  const [fading, setFading] = useState(false);

  useEffect(() => {
    if (sessionStorage.getItem("stelike.launched")) {
      setShown(false);
      return;
    }
    const step = 4000 / WORD.length;
    let i = 0;
    const int = setInterval(() => {
      i += 1;
      setTyped(WORD.slice(0, i));
      if (i >= WORD.length) clearInterval(int);
    }, step);
    const fade = setTimeout(() => setFading(true), 4000);
    const done = setTimeout(() => {
      sessionStorage.setItem("stelike.launched", "1");
      setShown(false);
    }, 4900);
    return () => {
      clearInterval(int);
      clearTimeout(fade);
      clearTimeout(done);
    };
  }, []);

  if (!shown) return null;

  return (
    <div
      aria-hidden
      className="fixed inset-0 z-[100] flex items-center justify-center transition-all duration-[900ms] ease-out"
      style={{
        backdropFilter: fading ? "blur(0px)" : "blur(28px) saturate(130%)",
        background: fading
          ? "oklch(0.978 0.002 60 / 0)"
          : "oklch(0.978 0.002 60 / 0.86)",
        opacity: fading ? 0 : 1,
      }}
    >
      <p className="px-6 text-center font-display text-2xl font-semibold tracking-tight text-foreground sm:text-4xl">
        {typed}
        <span
          className="ml-0.5 inline-block"
          style={{ animation: "caret-blink 1s steps(1) infinite" }}
        >
          _
        </span>
      </p>
    </div>
  );
}
