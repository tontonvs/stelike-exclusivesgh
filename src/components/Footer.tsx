import { Link } from "@tanstack/react-router";
import { Instagram, Facebook, Phone, MapPin } from "lucide-react";
import { BUSINESS } from "@/lib/data";

export function Footer() {
  return (
    <footer className="mt-14 bg-footer px-6 pb-28 pt-12 text-footer-foreground">
      <div className="mx-auto max-w-5xl space-y-10">
        <div>
          <p className="font-display text-2xl font-bold tracking-[0.2em]">STELIKE</p>
          <p className="mt-3 max-w-md text-sm leading-relaxed text-footer-foreground/70">
            Modern furniture design and custom fabrication in Ghana — contemporary
            interiors, space optimisation and luxury woodwork.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-8">
          <div>
            <p className="text-base font-bold">About us</p>
            <ul className="mt-4 space-y-3 text-sm text-footer-foreground/70">
              <li>Custom fabrication</li>
              <li>3D design & consultation</li>
              <li>Delivery & assembly</li>
              <li>{BUSINESS.areas}</li>
            </ul>
          </div>
          <div>
            <p className="text-base font-bold">Reach us</p>
            <ul className="mt-4 space-y-3 text-sm text-footer-foreground/70">
              <li className="flex min-w-0 items-center gap-2">
                <Phone className="size-4 shrink-0" />
                <span className="truncate">{BUSINESS.phone}</span>
              </li>
              <li className="flex min-w-0 items-center gap-2">
                <MapPin className="size-4 shrink-0" />
                <span className="truncate">{BUSINESS.city}</span>
              </li>
              <li className="flex min-w-0 items-center gap-2">
                <Instagram className="size-4 shrink-0" />
                <span className="truncate">{BUSINESS.instagram.join(" · ")}</span>
              </li>
              <li className="flex min-w-0 items-center gap-2">
                <Facebook className="size-4 shrink-0" />
                <span className="truncate">{BUSINESS.facebook}</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 border-t border-footer-foreground/15 pt-8 text-xs text-footer-foreground/70">
          <span className="rounded-sm border border-footer-foreground/25 px-2 py-1 font-semibold">
            Paystack
          </span>
          <span className="rounded-sm border border-footer-foreground/25 px-2 py-1 font-semibold">
            MoMo
          </span>
          <span className="rounded-sm border border-footer-foreground/25 px-2 py-1 font-semibold">
            Visa
          </span>
          <span className="rounded-sm border border-footer-foreground/25 px-2 py-1 font-semibold">
            Mastercard
          </span>
          <span className="rounded-sm border border-footer-foreground/25 px-2 py-1 font-semibold">
            Payment on Delivery
          </span>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-footer-foreground/60">
          <p>© {new Date().getFullYear()} Stelike Exclusives. All rights reserved.</p>
          <Link to="/contact" className="font-semibold text-footer-foreground">
            Contact us
          </Link>
        </div>
      </div>
    </footer>
  );
}
