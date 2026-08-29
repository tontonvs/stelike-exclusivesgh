import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import {
  MessageCircle,
  ShieldCheck,
  AlertTriangle,
  Truck,
  Store,
  MapPin,
  ChevronLeft,
} from "lucide-react";
import { BUSINESS, cedis } from "@/lib/data";
import { useStore, type Order } from "@/lib/store";
import { Sk, usePageLoading } from "@/components/Skeletons";
import { generatePaystackReference, openPaystackPopup } from "@/lib/paystack-popup";
import { verifyPaystackTransaction } from "@/lib/paystack";
import { getCurrentLocation, mapsLinkFor } from "@/lib/geolocation";
import { CheckoutStepper, type CheckoutStep } from "@/components/CheckoutStepper";

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
// in your .env (see .env.example).
const PAYSTACK_PUBLIC_KEY = import.meta.env["VITE_PAYSTACK_PUBLIC_KEY"] ?? "pk_test_REPLACE_ME";

type Fulfillment = "delivery" | "pickup";
type Stage = "method" | CheckoutStep;

const pickupMapsLink = mapsLinkFor(BUSINESS.coords.lat, BUSINESS.coords.lng);

function BackButton({ onClick, label }: { onClick: () => void; label: string }) {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-1 text-sm font-semibold text-muted-foreground transition-colors hover:text-foreground"
    >
      <ChevronLeft className="size-4" /> {label}
    </button>
  );
}

// Success popup shown over a blurred/dimmed backdrop once payment is verified.
function ConfirmationPopup({ order, onClose }: { order: Order; onClose: () => void }) {
  const message = encodeURIComponent(
    `Hello Stelike Exclusives, I have just placed an order.\n\n` +
      `Order number: ${order.id}\n` +
      `Name: ${order.name}\n` +
      `Phone: ${order.phone}\n` +
      `${order.fulfillment === "pickup" ? "Pickup" : "Delivery"}: ${order.address}\n\n` +
      order.items.map((i) => `• ${i.qty} × ${i.name} — ${cedis(i.price * i.qty)}`).join("\n") +
      `\n\nTotal: ${cedis(order.total)}`,
  );
  const followUp =
    order.fulfillment === "pickup"
      ? "We'll WhatsApp you once it's ready for pickup."
      : "We'll WhatsApp you shortly to confirm delivery timing.";

  return (
    <div
      className="fixed inset-0 z-[80] flex items-center justify-center bg-foreground/40 p-5 backdrop-blur-sm animate-soft"
      onClick={onClose}
    >
      <div
        className="w-full max-w-sm rounded-sm bg-card p-6 text-center shadow-float animate-rise-sm"
        onClick={(e) => e.stopPropagation()}
      >
        <ShieldCheck className="mx-auto size-10 text-info" />
        <h1 className="mt-3 text-xl font-bold">Order confirmed</h1>
        <p className="mt-1 text-sm text-muted-foreground">{followUp}</p>
        <p className="mt-4 rounded-sm bg-muted px-4 py-3 font-display text-2xl font-bold shadow-card">
          {order.id}
        </p>
        <a
          href={`https://wa.me/${BUSINESS.whatsapp}?text=${message}`}
          target="_blank"
          rel="noreferrer"
          className="mt-5 inline-flex items-center gap-1.5 rounded-full border-[2.5px] border-black bg-[#25D366] px-5 py-2 text-sm font-semibold text-black transition-opacity hover:opacity-90"
        >
          <MessageCircle className="size-4" /> WhatsApp
        </a>
        <Link
          to="/orders"
          onClick={onClose}
          className="mt-4 block text-sm font-semibold text-muted-foreground"
        >
          View my orders
        </Link>
      </div>
    </div>
  );
}

function Checkout() {
  const loading = usePageLoading();
  const { cart, cartTotal, placeOrder, clearCart } = useStore();

  const [stage, setStage] = useState<Stage>("method");
  const [fulfillment, setFulfillment] = useState<Fulfillment | null>(null);
  const [form, setForm] = useState({ name: "", phone: "", email: "", address: "", note: "" });
  const [sharedLocation, setSharedLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [locating, setLocating] = useState(false);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [manualAddress, setManualAddress] = useState(false);
  const [justLocated, setJustLocated] = useState(false);


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

  const shareLocation = async () => {
    setLocationError(null);
    setLocating(true);
    try {
      const loc = await getCurrentLocation();
      setSharedLocation({ lat: loc.lat, lng: loc.lng });
      setManualAddress(false);
      setForm((f) => ({ ...f, address: "" }));
      setJustLocated(true);
      window.setTimeout(() => setJustLocated(false), 2200);
    } catch (err) {
      setLocationError(err instanceof Error ? err.message : "Couldn't get your location.");
    } finally {
      setLocating(false);
    }
  };


  const hasDeliveryAddress = fulfillment === "pickup" || !!sharedLocation || !!form.address.trim();
  const detailsValid = form.name.trim() && form.phone.trim() && hasDeliveryAddress;


  const resolvedAddress =
    fulfillment === "pickup"
      ? BUSINESS.pickupAddress
      : sharedLocation
        ? "Shared location"
        : form.address.trim();
  const resolvedMapsLink =
    fulfillment === "pickup"
      ? pickupMapsLink
      : sharedLocation
        ? mapsLinkFor(sharedLocation.lat, sharedLocation.lng)
        : undefined;

  const finalizeOrder = () => {
    const order = placeOrder({
      name: form.name,
      phone: form.phone,
      ...(form.email ? { email: form.email } : {}),
      address: resolvedAddress,
      ...(form.note ? { note: form.note } : {}),
      fulfillment: fulfillment ?? "delivery",
      ...(resolvedMapsLink ? { mapsLink: resolvedMapsLink } : {}),
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
        metadata: { name: form.name, phone: form.phone, fulfillment, address: resolvedAddress },
        onClose: () => setPaying(false),
        callback: (response) => {
          void (async () => {
            try {
              const result = await verifyPaystackTransaction({
                data: { reference: response.reference },
              });
              if (result.verified) {
                finalizeOrder();
              } else {
                setPayError(result.error ?? "We couldn't verify that payment. Please try again.");
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

  // ---------- Stage: choose delivery vs pickup, upfront ----------
  if (stage === "method") {
    const options = [
      { id: "delivery" as const, label: "Delivery", Icon: Truck, hint: "We bring it to you" },
      { id: "pickup" as const, label: "Pickup", Icon: Store, hint: "Collect at our shop" },
    ];
    return (
      <div className="px-5 pb-32 pt-6 animate-soft">
        <h1 className="text-2xl font-bold">How would you like your order?</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Pick one to continue — you can't switch later without restarting checkout.
        </p>

        <div className="mt-5 grid max-w-md grid-cols-2 gap-4 md:max-w-sm md:gap-3">
          {options.map(({ id, label, Icon, hint }) => {
            const active = fulfillment === id;
            return (
              <button
                key={id}
                onClick={() => setFulfillment(id)}
                className={`relative flex aspect-square flex-col items-center justify-center gap-2 rounded-sm border-[3px] bg-card p-3 transition-all duration-300 hover:scale-[1.02] md:aspect-[4/3] md:gap-1 md:p-2 ${
                  active ? "border-info shadow-float" : "border-black/80"
                }`}
              >
                <span
                  className={`absolute right-2 top-2 size-3 rounded-full transition-all duration-300 md:size-2.5 ${
                    active ? "scale-100 bg-info" : "scale-0 bg-transparent"
                  }`}
                />
                <Icon className="size-8 md:size-6" />
                <span className="text-sm font-bold md:text-xs">{label}</span>
                <span className="text-[11px] text-muted-foreground md:text-[10px]">{hint}</span>
              </button>
            );
          })}
        </div>

        <button
          onClick={() => fulfillment && setStage("Details")}
          disabled={!fulfillment}
          className="mt-6 w-full max-w-md rounded-sm bg-info py-4 text-base font-semibold text-info-foreground transition-opacity disabled:cursor-not-allowed disabled:bg-muted disabled:text-muted-foreground disabled:opacity-60 md:max-w-sm md:py-3 md:text-sm"
        >
          Continue
        </button>
      </div>
    );
  }


  // ---------- Stages: Details / Summary / Payment ----------
  return (
    <div className="px-5 pb-32 pt-6 animate-soft">
      <h1 className="text-2xl font-bold">Checkout</h1>
      <div className="mt-4">
        <CheckoutStepper current={stage} />
      </div>

      {stage === "Details" && (
        <div className="mt-6 animate-rise-sm">
          <BackButton onClick={() => setStage("method")} label="Change delivery method" />

          <div className="mt-4 space-y-3 rounded-sm bg-card p-5 shadow-card">
            {(
              [
                ["name", "Full name", "text"],
                ["phone", "Phone number", "text"],
                ["email", "Email (for payment receipt)", "email"],
              ] as const
            ).map(([key, label, type]) => (
              <label key={key} className="block">
                <span className="text-xs font-semibold text-muted-foreground">{label}</span>
                <input
                  value={form[key]}
                  onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                  type={type}
                  className="mt-1 w-full rounded-sm bg-background px-4 py-3 text-sm outline-none"
                />
              </label>
            ))}

            {fulfillment === "delivery" ? (
              <div className="space-y-2">
                <span className="text-xs font-semibold text-muted-foreground">
                  Delivery address
                </span>

                {sharedLocation ? (
                  <div className="flex items-center justify-between rounded-sm bg-info/10 px-4 py-3">
                    <span className="flex items-center gap-2 text-sm font-semibold text-info">
                      <MapPin className="size-4" /> Location shared
                    </span>
                    <a
                      href={mapsLinkFor(sharedLocation.lat, sharedLocation.lng)}
                      target="_blank"
                      rel="noreferrer"
                      className="text-xs font-semibold text-info underline"
                    >
                      View on map
                    </a>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={shareLocation}
                    disabled={locating}
                    className="flex w-full items-center gap-2 rounded-sm bg-info/10 px-4 py-3 text-left text-sm font-semibold text-info disabled:opacity-60"
                  >
                    <MapPin className="size-4" />
                    {locating ? "Getting your location…" : "Share my location"}
                    <span className="ml-auto text-xs font-normal text-info/80">
                      Fastest — no typing needed
                    </span>
                  </button>
                )}

                {locationError && <p className="text-xs text-destructive">{locationError}</p>}

                {!sharedLocation && (
                  <button
                    type="button"
                    onClick={() => setManualAddress((v) => !v)}
                    className="text-xs font-semibold text-info underline"
                  >
                    Or type your address manually
                  </button>
                )}
                {sharedLocation && (
                  <button
                    type="button"
                    onClick={() => setSharedLocation(null)}
                    className="text-xs font-semibold text-muted-foreground underline"
                  >
                    Use a different address instead
                  </button>
                )}

                {manualAddress && !sharedLocation && (
                  <input
                    value={form.address}
                    onChange={(e) => setForm({ ...form, address: e.target.value })}
                    placeholder="House number, street, area"
                    className="mt-1 w-full rounded-sm bg-background px-4 py-3 text-sm outline-none"
                  />
                )}
              </div>
            ) : (
              <div className="rounded-sm bg-info/10 px-4 py-3">
                <span className="flex items-center gap-2 text-sm font-semibold text-info">
                  <Store className="size-4" /> Pickup at {BUSINESS.pickupAddress}
                </span>
                <a
                  href={pickupMapsLink}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-1 inline-block text-xs font-semibold text-info underline"
                >
                  View on Google Maps
                </a>
              </div>
            )}

            <label className="block">
              <span className="text-xs font-semibold text-muted-foreground">Note (optional)</span>
              <input
                value={form.note}
                onChange={(e) => setForm({ ...form, note: e.target.value })}
                placeholder="Gate code, landmark, delivery time…"
                className="mt-1 w-full rounded-sm bg-background px-4 py-3 text-sm outline-none"
              />
            </label>
          </div>

          <button
            onClick={() => setStage("Summary")}
            disabled={!detailsValid}
            className="mt-5 w-full rounded-sm bg-info py-4 text-base font-semibold text-info-foreground disabled:opacity-40"
          >
            Continue to Summary
          </button>
        </div>
      )}

      {stage === "Summary" && (
        <div className="mt-6 animate-rise-sm">
          <BackButton onClick={() => setStage("Details")} label="Back" />

          <div className="mt-4 space-y-3 rounded-sm bg-card p-5 shadow-card">
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
            <div className="flex justify-between border-t pt-3 text-sm">
              <span className="text-muted-foreground">Subtotal</span>
              <span className="font-semibold">{cedis(cartTotal)}</span>
            </div>
            {fulfillment === "delivery" && (
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Delivery</span>
                <span className="font-semibold">Confirmed via WhatsApp</span>
              </div>
            )}
            <div className="flex justify-between border-t pt-3 text-base font-bold">
              <span>Total</span>
              <span>{cedis(cartTotal)}</span>
            </div>
          </div>

          <button
            onClick={() => setStage("Payment")}
            disabled={cart.length === 0}
            className="mt-5 w-full rounded-sm bg-info py-4 text-base font-semibold text-info-foreground disabled:opacity-40"
          >
            Continue to Payment
          </button>
        </div>
      )}

      {stage === "Payment" && (
        <div className="mt-6 animate-rise-sm">
          <BackButton onClick={() => setStage("Summary")} label="Back" />

          <div className="mt-4 space-y-4 rounded-sm bg-card p-5 shadow-card">
            <div>
              <p className="text-sm font-bold">{form.name}</p>
              <p className="text-sm text-muted-foreground">{form.phone}</p>
              <p className="text-sm text-muted-foreground">
                {fulfillment === "pickup" ? "Pickup: " : "Delivery: "}
                {resolvedAddress}
                {resolvedMapsLink && (
                  <>
                    {" "}
                    <a
                      href={resolvedMapsLink}
                      target="_blank"
                      rel="noreferrer"
                      className="font-semibold text-info underline"
                    >
                      View on map
                    </a>
                  </>
                )}
              </p>
            </div>

            <div className="border-t pt-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Total to pay</span>
                <span className="text-lg font-bold">{cedis(cartTotal)}</span>
              </div>
              <p className="mt-1 text-xs text-muted-foreground">
                Pay securely by card or Mobile Money via Paystack. You'll get a confirmation once
                it's done.
              </p>
            </div>
          </div>

          {payError && (
            <div className="mt-4 flex items-start gap-2 rounded-sm border border-destructive/40 bg-destructive/5 p-3 text-sm text-destructive">
              <AlertTriangle className="mt-0.5 size-4 shrink-0" />
              <span>{payError}</span>
            </div>
          )}

          <button
            onClick={pay}
            disabled={cart.length === 0 || paying}
            className="mt-5 w-full rounded-sm bg-info py-4 text-base font-semibold text-info-foreground disabled:opacity-40"
          >
            {paying ? "Processing…" : `Pay ${cedis(cartTotal)}`}
          </button>
          <p className="mt-2 text-center text-xs text-muted-foreground">
            Demo mode — test card payments only, verified against Paystack's test API.
          </p>
        </div>
      )}

      {placed && (
        <ConfirmationPopup
          order={placed}
          onClose={() => {
            setPlaced(null);
            setStage("method");
            setFulfillment(null);
            setForm({ name: "", phone: "", email: "", address: "", note: "" });
            setSharedLocation(null);
            setManualAddress(false);
          }}
        />
      )}
    </div>
  );
}
