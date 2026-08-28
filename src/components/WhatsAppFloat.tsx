import { MessageCircle } from "lucide-react";
import { BUSINESS } from "@/lib/data";

export function WhatsAppFloat() {
  return (
    <a
      href={`https://wa.me/${BUSINESS.whatsapp}`}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with us on WhatsApp"
      className="fixed right-4 top-[62%] z-[55] grid size-13 place-items-center rounded-full border border-white/40 text-white shadow-float backdrop-blur-md transition-transform hover:scale-105 md:right-8"
      style={{
        background:
          "linear-gradient(135deg, rgba(37,211,102,0.85), rgba(18,140,80,0.85))",
        width: 52,
        height: 52,
      }}
    >
      <MessageCircle className="size-6" fill="currentColor" strokeWidth={1.5} />
    </a>
  );
}
