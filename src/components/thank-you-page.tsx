import { useEffect, type ReactNode } from "react";
import { metaPixelNoscriptSrc, trackMetaPixel, type MetaPixelEvent } from "@/lib/meta-pixel";

export const DAY_ONE_PIXEL_ID = "892785827219461";
export const TICKET_PIXEL_ID = "1864181694595716";
export const DAY_ONE_WHATSAPP_URL = "https://chat.whatsapp.com/IHUuX8RGc1nEPvwEUzdv75";

export function greetingName(name?: string) {
  const trimmed = name?.trim().replace(/\s+/g, " ");
  if (!trimmed) return "";
  const parts = trimmed.split(" ").filter(Boolean);
  const honorifics = new Set(["mr", "mrs", "ms", "dr", "prof", "chief", "mr.", "mrs.", "ms.", "dr.", "prof."]);
  if (parts.length > 1 && honorifics.has(parts[0].toLowerCase())) {
    return parts[1] ?? trimmed;
  }
  return parts[0] ?? trimmed;
}

export function shortRegId(input?: string) {
  const value = (input ?? "").trim().toLowerCase();
  if (!value) return undefined;
  let hash = 0;
  for (let i = 0; i < value.length; i++) {
    hash = (hash * 31 + value.charCodeAt(i)) >>> 0;
  }
  return `BAV-${hash.toString(36).toUpperCase().slice(0, 6).padStart(6, "0")}`;
}

export function ThankYouShell({
  pixelId,
  events,
  children,
}: {
  pixelId: string;
  events: MetaPixelEvent[];
  children: ReactNode;
}) {
  useEffect(() => {
    trackMetaPixel(pixelId, events);
  }, [pixelId, events]);

  return (
    <main className="min-h-screen bg-ink-deep px-5 py-10 text-paper sm:py-16">
      <noscript>
        <img
          height="1"
          width="1"
          style={{ display: "none" }}
          src={metaPixelNoscriptSrc(pixelId)}
          alt=""
        />
      </noscript>
      <div className="mx-auto max-w-2xl">
        <div className="thank-you-enter">{children}</div>
      </div>
    </main>
  );
}

export function BrandMark() {
  return (
    <p className="text-xs font-medium tracking-[0.28em] text-violet uppercase">
      Build a Vault
    </p>
  );
}
