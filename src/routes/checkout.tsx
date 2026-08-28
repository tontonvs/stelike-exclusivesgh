import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { MessageCircle, ShieldCheck } from "lucide-react";
import { BUSINESS, cedis } from "@/lib/data";
import { useStore, type Order } from "@/lib/store";
import { Sk, usePageLoading } from "@/components/Skeletons";

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

/**
 * PAYSTACK INTEGRATION POINT
 * ---------------------------------------------------------------
 * 1. Public key  -> paste your `pk_live_...` / `pk_test_...` below.
 * 2. Secret key  -> store as a backend secret (never in this file).
 * 3. Init charge -> call your server endpoint that hits
 *    POST https://api.paystack.co/transaction/initialize
 *    with { email, amount: total * 100, currency: "GHS" }.
 * 4. Webhook     -> create POST /api/public/paystack-webhook,
 *    verify the `x-paystack-signature` HMAC-SHA512 with your secret key,
 *    then mark the matching order as paid.
 */
const PAYSTACK_PUBLIC_KEY = "pk_test_REPLACE_ME";
const PAYSTACK_INIT_ENDPOINT = "/api/public/paystack-initialize";

function Checkout() {
  const loading = usePageLoading();
  const { cart, cartTotal, placeOrder, clearCart } = useStore();
  const [form, setForm] = useState({ name: "", phone: "", address: "" });
  const [placed, setPlaced] = useState<Order | null>(null);

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

  const disabled = cart.length === 0 || !form.name || !form.phone || !form.address;

  const pay = async () => {
    // Replace this block with a Paystack init call once keys are configured:
    // const res = await fetch(PAYSTACK_INIT_ENDPOINT, { method: "POST", body: JSON.stringify({ ...form, amount: cartTotal * 100 }) })
    // window.location.href = (await res.json()).authorization_url
    void PAYSTACK_PUBLIC_KEY;
    void PAYSTACK_INIT_ENDPOINT;
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
            ["address", "Delivery address"],
          ] as const
        ).map(([key, label]) => (
          <label key={key} className="block">
            <span className="text-xs font-semibold text-muted-foreground">{label}</span>
            <input
              value={form[key]}
              onChange={(e) => setForm({ ...form, [key]: e.target.value })}
              className="mt-1 w-full rounded-sm bg-card px-4 py-3 text-sm shadow-card outline-none"
            />
          </label>
        ))}
      </div>

      <button
        onClick={pay}
        disabled={disabled}
        className="mt-5 w-full rounded-sm bg-primary py-4 text-base font-semibold text-primary-foreground disabled:opacity-40"
      >
        Pay with Paystack
      </button>
      <p className="mt-2 text-center text-xs text-muted-foreground">
        Demo mode — connect your Paystack keys and webhook to take live payments.
      </p>
    </div>
  );
}
