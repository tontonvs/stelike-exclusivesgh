import { Check } from "lucide-react";

const STEPS = ["Details", "Summary", "Payment"] as const;
export type CheckoutStep = (typeof STEPS)[number];

export function CheckoutStepper({ current }: { current: CheckoutStep }) {
  const currentIndex = STEPS.indexOf(current);

  return (
    <div className="flex items-center">
      {STEPS.map((step, i) => {
        const done = i < currentIndex;
        const active = i === currentIndex;
        return (
          <div key={step} className="flex flex-1 items-center last:flex-none">
            <div className="flex items-center gap-2">
              <span
                className={`grid size-6 shrink-0 place-items-center rounded-full text-[11px] font-bold ${
                  done
                    ? "bg-info text-info-foreground"
                    : active
                      ? "bg-info text-info-foreground"
                      : "border border-border text-muted-foreground"
                }`}
              >
                {done ? <Check className="size-3.5" /> : i + 1}
              </span>
              <span
                className={`text-xs font-semibold ${
                  active || done ? "text-foreground" : "text-muted-foreground"
                }`}
              >
                {step}
              </span>
            </div>
            {i < STEPS.length - 1 && (
              <span className={`mx-2 h-px flex-1 ${done ? "bg-info" : "bg-border"}`} aria-hidden />
            )}
          </div>
        );
      })}
    </div>
  );
}
