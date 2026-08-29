import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { MessageCircle, ShieldCheck, AlertTriangle } from "lucide-react";
import { BUSINESS, cedis } from "@/lib/data";
import { useStore, type Order } from "@/lib/store";
import { Sk, usePageLoading } from "@/components/Skeletons";
import { generatePaystackReference, openPaystackPopup } from "@/lib/paystack-popup";
import { verifyPaystackTransaction } from "@/lib/paystack";

export const Route = createFileRoute("/checkout")({
  head: () => ({
    meta: [
      { title: "Checkout — Stelike Exclusives" },
      {
        name: "description",
        content: "Complete your Stelike Exclusives furniture order and pay securely.",
      },
      { property: "og:title", content: "Checkout — Stelike Exclusives" },
      {
        property: "og:description",
        content: "Complete your Stelike Exclusives furniture order.",
      },
    ],
  }),
  component: Checkout,
});

// Public key only — safe to ship to the browser. Set VITE_PAYSTACK_PUBLIC_KEY
// in your .env (see .env.example). Falls back to a placeholder so the button
// still renders (and clearly fails) if the key hasn't been configured yet.
const PAYSTACK_PUBLIC_KEY = import.meta.env["VITE_PAYSTACK_PUBLIC_KEY"] ?? "pk_test_REPLACE_ME";

function Checkout() {
  const loading = usePageLoading();
  const { cart, cartTotal, placeOrder, clearCart } = useStore();
  const [form, setForm] = useState({ name: "", phone: "", email: "", address: "" });
  const [placed, setPlaced] = useState<Order | null>(null);
  const [paying, setPaying] = useState(false);
  const [payError, setPayError] = useState<string | null>(null);

  if (loading)
    return (
      <div className="space-y-4 px-5 pt-6">
        <Sk className="h-8 w-40" />
        <Sk className="h-52 w-full" />
      </div>
    );

  if (placed) {
    const message = encodeURIComponent(
      `Hello Stelike Exclusives, I have just placed an order.\n\n` +
        `Order number: ${placed.id}\n` +
        `Name: ${placed.name}\n` +
        `Phone: ${placed.phone}\n` +
        `Delivery: ${placed.address}\n\n` +
        placed.items.map((i) => `• ${i.qty} × ${i.name} — ${cedis(i.price * i.qty)}`).join("\n") +
        `\n\nTotal: ${cedis(placed.total)}`,
    );
    return (
      <div className="px-5 pb-32 pt-10 animate-rise">
        <div className="mx-auto max-w-md rounded-sm bg-card p-6 text-center shadow-card">
          <ShieldCheck className="mx-auto size-10" />
          <h1 className="mt-3 text-xl font-bold">Order confirmed</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Keep this product number for tracking.
          </p>
          <p className="mt-4 rounded-sm border-[1.5px] border-primary px-4 py-3 font-display text-2xl font-bold">
            {placed.id}
          </p>
          <a
            href={`https://wa.me/${BUSINESS.whatsapp}?text=${message}`}
            target="_blank"
            rel="noreferrer"
            className="mt-5 flex items-center justify-center gap-2 rounded-sm bg-primary py-3.5 text-sm font-semibold text-primary-foreground"
          >
            <MessageCircle className="size-4" /> Send order on WhatsApp
          </a>
          <Link
            to="/orders"
            className="mt-3 block text-sm font-semibold text-muted-foreground"
          >
            View my orders
          </Link>
        </div>
      </div>
    );
  }

  const disabled =
    cart.length === 0 || !form.name || !form.phone || !form.email || !form.address || paying;

  const finalizeOrder = () => {
    const order = placeOrder({
      name: form.name,
      phone: form.phone,
      address: form.address,
      items: cart.map((l) => ({ name: l.product.name, qty: l.qty, price: l.product.price })),
      total: cartTotal,
    });
    clearCart();
    setPlaced(order);
  };

  const pay = async () => {
    setPayError(null);
    setPaying(true);
    try {
      await openPaystackPopup({
        key: PAYSTACK_PUBLIC_KEY,
        email: form.email,
        amount: Math.round(cartTotal * 100), // GHS -> pesewas
        currency: "GHS",
        ref: generatePaystackReference(),
        metadata: { name: form.name, phone: form.phone, address: form.address },
        onClose: () => setPaying(false),
        callback: (response) => {
          // Runs after Paystack reports success client-side. We still verify
          // server-side with the secret key before trusting it.
          void (async () => {
            try {
              const result = await verifyPaystackTransaction({
                data: { reference: response.reference },
              });
              if (result.verified) {
                finalizeOrder();
              } else {
                setPayError(
                  result.error ?? "We couldn't verify that payment. Please try again.",
                );
              }
            } catch {
              setPayError("We couldn't reach the server to verify payment. Please try again.");
            } finally {
              setPaying(false);
            }
          })();
        },
      });
    } catch {
      setPayError("Paystack could not be loaded. Check your connection and try again.");
      setPaying(false);
    }
  };

  return (
    <div className="px-5 pb-32 pt-6 animate-soft">
      <h1 className="text-2xl font-bold">Checkout</h1>

      <div className="mt-5 space-y-3 rounded-sm bg-card p-4 shadow-card">
        {cart.length === 0 ? (
          <p className="text-sm text-muted-foreground">Your cart is empty.</p>
        ) : (
          cart.map((l) => (
            <div key={l.product.id} className="flex justify-between text-sm">
              <span className="text-muted-foreground">
                {l.qty} × {l.product.name}
              </span>
              <span className="font-semibold">{cedis(l.qty * l.product.price)}</span>
            </div>
          ))
        )}
        <div className="flex justify-between border-t pt-3 text-base font-bold">
          <span>Total</span>
          <span>{cedis(cartTotal)}</span>
        </div>
      </div>

      <div className="mt-4 space-y-3">
        {(
          [
            ["name", "Full name"],
            ["phone", "Phone number"],
            ["email", "Email (for payment receipt)"],
            ["address", "Delivery address"],
          ] as const
        ).map(([key, label]) => (
          <label key={key} className="block">
            <span className="text-xs font-semibold text-muted-foreground">{label}</span>
            <input
              value={form[key]}
              onChange={(e) => setForm({ ...form, [key]: e.target.value })}
              type={key === "email" ? "email" : "text"}
              className="mt-1 w-full rounded-sm bg-card px-4 py-3 text-sm shadow-card outline-none"
            />
          </label>
        ))}
      </div>

      {payError && (
        <div className="mt-4 flex items-start gap-2 rounded-sm border border-destructive/40 bg-destructive/5 p-3 text-sm text-destructive">
          <AlertTriangle className="mt-0.5 size-4 shrink-0" />
          <span>{payError}</span>
        </div>
      )}

      <button
        onClick={pay}
        disabled={disabled}
        className="mt-5 w-full rounded-sm bg-primary py-4 text-base font-semibold text-primary-foreground disabled:opacity-40"
      >
        {paying ? "Processing…" : "Pay with Paystack"}
      </button>
      <p className="mt-2 text-center text-xs text-muted-foreground">
        Demo mode — test card payments only, verified against Paystack's test API.
      </p>
    </div>
  );
}
