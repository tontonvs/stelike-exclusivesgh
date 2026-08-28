import { Link } from "@tanstack/react-router";
import { Instagram, Facebook, Phone, MapPin } from "lucide-react";
import { BUSINESS } from "@/lib/data";

export function Footer() {
  return (
    <footer className="mt-14 border-t bg-card px-5 pb-32 pt-10">
      <div className="mx-auto max-w-5xl space-y-8">
        <div className="grid gap-8 sm:grid-cols-3">
          <div>
            <p className="font-display text-lg font-bold tracking-[0.18em]">STELIKE</p>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              Modern furniture design and custom fabrication in Ghana. Contemporary
              interiors, space optimisation and luxury woodwork.
            </p>
          </div>
          <div>
            <p className="text-sm font-bold">About us</p>
            <ul className="mt-2 space-y-1.5 text-sm text-muted-foreground">
              <li>Custom fabrication to your room specs</li>
              <li>3D design & interior consultation</li>
              <li>Delivery, mounting & on-site assembly</li>
              <li>Serving {BUSINESS.areas}</li>
            </ul>
          </div>
          <div>
            <p className="text-sm font-bold">Reach us</p>
            <ul className="mt-2 space-y-2 text-sm text-muted-foreground">
              <li className="flex items-center gap-2">
                <Phone className="size-4" /> {BUSINESS.phone}
              </li>
              <li className="flex items-center gap-2">
                <MapPin className="size-4" /> {BUSINESS.city}
              </li>
              <li className="flex items-center gap-2">
                <Instagram className="size-4" /> {BUSINESS.instagram.join(" · ")}
              </li>
              <li className="flex items-center gap-2">
                <Facebook className="size-4" /> {BUSINESS.facebook}
              </li>
            </ul>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 border-t pt-6 text-xs text-muted-foreground">
          <span className="rounded-sm border px-2 py-1 font-semibold">Paystack</span>
          <span className="rounded-sm border px-2 py-1 font-semibold">MoMo</span>
          <span className="rounded-sm border px-2 py-1 font-semibold">Visa</span>
          <span className="rounded-sm border px-2 py-1 font-semibold">Mastercard</span>
          <span className="rounded-sm border px-2 py-1 font-semibold">
            Payment on Delivery
          </span>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-muted-foreground">
          <p>© {new Date().getFullYear()} Stelike Exclusives. All rights reserved.</p>
          <Link to="/contact" className="font-semibold text-foreground">
            Contact us
          </Link>
        </div>
      </div>
    </footer>
  );
}
