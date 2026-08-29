// Client-only. Lazy-loads Paystack's official Inline JS (https://js.paystack.co/v1/inline.js)
// the first time it's needed, and reuses it after that — no npm package required.

type PaystackHandler = {
  openIframe: () => void;
};

type PaystackSetupOptions = {
  key: string;
  email: string;
  amount: number; // smallest currency unit (pesewas for GHS)
  currency?: string;
  ref: string;
  metadata?: Record<string, unknown>;
  callback: (response: { reference: string }) => void;
  onClose: () => void;
};

declare global {
  interface Window {
    PaystackPop?: {
      setup: (options: PaystackSetupOptions) => PaystackHandler;
    };
  }
}

let scriptPromise: Promise<void> | null = null;

function loadPaystackScript(): Promise<void> {
  if (typeof window === "undefined") {
    return Promise.reject(new Error("Paystack popup can only run in the browser."));
  }
  if (window.PaystackPop) return Promise.resolve();
  if (scriptPromise) return scriptPromise;

  scriptPromise = new Promise((resolve, reject) => {
    const existing = document.querySelector<HTMLScriptElement>(
      'script[src="https://js.paystack.co/v1/inline.js"]',
    );
    if (existing) {
      existing.addEventListener("load", () => resolve());
      existing.addEventListener("error", () => reject(new Error("Failed to load Paystack.")));
      return;
    }
    const script = document.createElement("script");
    script.src = "https://js.paystack.co/v1/inline.js";
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("Failed to load Paystack."));
    document.head.appendChild(script);
  });

  return scriptPromise;
}

export function generatePaystackReference() {
  return `stelike-${Date.now()}-${Math.floor(Math.random() * 1e6)}`;
}

export async function openPaystackPopup(options: PaystackSetupOptions) {
  await loadPaystackScript();
  if (!window.PaystackPop) throw new Error("Paystack failed to initialise.");
  window.PaystackPop.setup(options).openIframe();
}
