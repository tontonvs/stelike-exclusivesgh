import { createFileRoute } from "@tanstack/react-router";
import { Phone, MapPin, Instagram, Facebook, MessageCircle, Clock } from "lucide-react";
import { BUSINESS } from "@/lib/data";
import { Sk, usePageLoading } from "@/components/Skeletons";
import { Footer } from "@/components/Footer";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact & Location — Stelike Exclusives" },
      {
        name: "description",
        content:
          "Reach Stelike Exclusives in Accra on +233 53 199 3984 or WhatsApp for custom furniture orders, dimensions and production slots.",
      },
      { property: "og:title", content: "Contact & Location — Stelike Exclusives" },
      {
        property: "og:description",
        content: "Call or WhatsApp Stelike Exclusives in Accra for custom furniture.",
      },
    ],
  }),
  component: Contact,
});

const { lat, lng } = BUSINESS.coords;
const mapEmbed = `https://www.openstreetmap.org/export/embed.html?bbox=${lng - 0.02}%2C${lat - 0.015}%2C${lng + 0.02}%2C${lat + 0.015}&layer=mapnik&marker=${lat}%2C${lng}`;
const mapsLink = `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`;

function Contact() {
  const loading = usePageLoading();

  if (loading)
    return (
      <div className="space-y-4 px-5 pt-6">
        <Sk className="h-8 w-40" />
        <Sk className="h-40 w-full" />
        <Sk className="h-24 w-full" />
      </div>
    );

  return (
    <div className="animate-soft">
      <div className="px-5 pt-6">
        <h1 className="text-2xl font-bold">Contact</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Custom dimensions, orders and production slots — talk to the workshop directly.
        </p>

        <div className="mt-5 overflow-hidden rounded-sm bg-card shadow-card">
          <iframe
            title="Stelike Exclusives location"
            src={mapEmbed}
            className="h-52 w-full border-0"
            loading="lazy"
          />
          <div className="flex items-start gap-3 p-4">
            <MapPin className="mt-0.5 size-5 shrink-0" />
            <div className="flex-1">
              <p className="text-sm font-semibold">Greater Accra Region, Ghana</p>
              <p className="text-xs text-muted-foreground">
                {lat.toFixed(4)}, {lng.toFixed(4)} · Workshop & showroom visits by appointment
              </p>
              <a
                href={mapsLink}
                target="_blank"
                rel="noreferrer"
                className="mt-2 inline-block rounded-sm bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground"
              >
                Open in Google Maps
              </a>
            </div>
          </div>
        </div>

        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <a
            href={`https://wa.me/${BUSINESS.whatsapp}`}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-3 rounded-sm bg-card p-4 shadow-card transition-transform hover:-translate-y-0.5"
          >
            <MessageCircle className="size-5" />
            <div>
              <p className="text-sm font-semibold">WhatsApp</p>
              <p className="text-xs text-muted-foreground">{BUSINESS.phone}</p>
            </div>
          </a>
          <a
            href={`tel:${BUSINESS.phone.replace(/\s/g, "")}`}
            className="flex items-center gap-3 rounded-sm bg-card p-4 shadow-card transition-transform hover:-translate-y-0.5"
          >
            <Phone className="size-5" />
            <div>
              <p className="text-sm font-semibold">Call the workshop</p>
              <p className="text-xs text-muted-foreground">{BUSINESS.phone}</p>
            </div>
          </a>
          <div className="flex items-center gap-3 rounded-sm bg-card p-4 shadow-card">
            <Instagram className="size-5" />
            <div>
              <p className="text-sm font-semibold">Instagram</p>
              <p className="text-xs text-muted-foreground">
                {BUSINESS.instagram.join(" · ")}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3 rounded-sm bg-card p-4 shadow-card">
            <Facebook className="size-5" />
            <div>
              <p className="text-sm font-semibold">Facebook</p>
              <p className="text-xs text-muted-foreground">{BUSINESS.facebook}</p>
            </div>
          </div>
        </div>

        <div className="mt-4 flex items-start gap-3 rounded-sm bg-card p-4 shadow-card">
          <Clock className="mt-0.5 size-5" />
          <div>
            <p className="text-sm font-semibold">Delivery & installation</p>
            <p className="text-sm text-muted-foreground">
              Direct-to-home delivery with payment on delivery across the Accra metropolis.
              Nationwide delivery to {BUSINESS.areas}.
            </p>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
