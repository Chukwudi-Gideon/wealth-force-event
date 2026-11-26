import { createFileRoute } from "@tanstack/react-router";
import { CalendarPlus, CheckCircle2, MapPin, Ticket } from "lucide-react";
import { BrandMark, ThankYouShell, TICKET_PIXEL_ID, greetingName } from "@/components/thank-you-page";
import { DAY_TWO, DAY_TWO_LABEL, VENUE, WHATSAPP_URL, naira } from "@/lib/event";

const VENUE_LABEL = [VENUE.name, ...VENUE.lines].join(", ");

type Search = { reference?: string; name?: string; amount?: string };

export const Route = createFileRoute("/thank-you/ticket")({
  validateSearch: (search: Record<string, unknown>): Search => ({
    reference: typeof search.reference === "string" ? search.reference : undefined,
    name: typeof search.name === "string" ? search.name : undefined,
    amount: typeof search.amount === "string" ? search.amount : undefined,
  }),
  component: TicketThankYou,
});

function parseAmount(amount?: string) {
  if (!amount) return undefined;
  const n = Number(amount);
  if (!Number.isFinite(n) || n <= 0) return undefined;
  return Math.round(n);
}

function calendarHref(name?: string, reference?: string) {
  const dayTwoStamp = DAY_TWO.toISOString().slice(0, 10).replace(/-/g, "");
  const details = [
    "Build a Vault ticket confirmed.",
    name ? `Attendee: ${name}` : null,
    reference ? `Reference: ${reference}` : null,
    `Venue: ${VENUE_LABEL}`,
  ]
    .filter(Boolean)
    .join("\\n");
  const ics = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Build a Vault//EN",
    "CALSCALE:GREGORIAN",
    "BEGIN:VEVENT",
    `UID:build-a-vault-${dayTwoStamp}@rockbanq.com`,
    "DTSTAMP:20261101T000000Z",
    `DTSTART:${dayTwoStamp}T090000Z`,
    `DTEND:${dayTwoStamp}T140000Z`,
    "SUMMARY:Build a Vault - Day 2",
    `LOCATION:${VENUE_LABEL.replace(/,/g, "\\,")}`,
    `DESCRIPTION:${details}`,
    "END:VEVENT",
    "END:VCALENDAR",
  ].join("\r\n");
  return `data:text/calendar;charset=utf-8,${encodeURIComponent(ics)}`;
}

function TicketThankYou() {
  const { reference, name, amount } = Route.useSearch();
  const first = greetingName(name);
  const amountNaira = parseAmount(amount);
  const purchaseParams: Record<string, unknown> = {
    currency: "NGN",
    content_name: "Build a Vault Ticket",
  };
  if (amountNaira !== undefined) purchaseParams.value = amountNaira;

  return (
    <ThankYouShell
      pixelId={TICKET_PIXEL_ID}
      events={[{ name: "PageView" }, { name: "Purchase", params: purchaseParams }]}
    >
      <header className="text-center">
        <BrandMark />
        <div className="thank-you-check mx-auto mt-6 inline-flex size-16 items-center justify-center rounded-full bg-orange/15 ring-1 ring-orange/35">
          <CheckCircle2 className="size-8 text-orange" aria-hidden="true" />
        </div>
        <h1 className="mt-6 text-4xl font-medium leading-tight tracking-tight sm:text-5xl">
          Your seat is reserved{name?.trim() ? `, ${name.trim()}` : ""}.
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-sky sm:text-lg">
          Your place at Build a Vault is secured. Your ticket will arrive by email or WhatsApp shortly.
        </p>
      </header>

      <section className="mt-10 overflow-hidden rounded-[1.75rem] border border-orange/20 bg-navy/85 shadow-2xl shadow-black/20">
        <div className="flex items-center justify-between border-b border-paper/10 px-6 py-5 sm:px-8">
          <div>
            <p className="text-xs font-medium tracking-[0.22em] text-violet uppercase">Ticket</p>
            <h2 className="mt-2 text-2xl font-medium text-paper">Build a Vault — Day 2</h2>
          </div>
          <div className="rounded-full bg-orange/15 px-3 py-1 text-xs font-medium text-orange ring-1 ring-orange/25">
            Payment successful
          </div>
        </div>

        <div className="grid gap-0 sm:grid-cols-2">
          <Detail label="Attendee" value={name?.trim() || "Confirmed guest"} />
          <Detail label="Date" value={DAY_TWO_LABEL} />
          <Detail label="Time" value="10:00 AM WAT" />
          <Detail label="Location" value={VENUE_LABEL} />
          <Detail label="Reference" value={reference || "Pending confirmation"} />
          <Detail label="Amount paid" value={amountNaira !== undefined ? naira(amountNaira) : "Confirmed"} />
        </div>

        <div className="border-t border-dashed border-paper/15 px-6 py-5 sm:px-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-start gap-3 text-sm text-sky">
              <MapPin className="mt-0.5 size-4 shrink-0 text-orange" aria-hidden="true" />
              <p>Build a Vault · {VENUE_LABEL}. Bring this confirmation and your reference if needed.</p>
            </div>
            <div className="inline-flex items-center gap-2 self-start rounded-full border border-paper/15 px-3 py-2 text-xs text-sky">
              <Ticket className="size-4 text-orange" aria-hidden="true" />
              Ticket confirmed
            </div>
          </div>
        </div>
      </section>

      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <a
          href={WHATSAPP_URL}
          target="_blank"
          rel="noreferrer"
          className="inline-flex h-12 flex-1 items-center justify-center rounded-full bg-orange px-6 text-base font-medium text-navy-deep transition hover:brightness-105"
        >
          WhatsApp Support
        </a>
        <a
          href={calendarHref(name, reference)}
          download="build-a-vault-day-2.ics"
          className="inline-flex h-12 flex-1 items-center justify-center gap-2 rounded-full border border-paper/25 px-6 text-base font-medium text-paper transition hover:bg-paper/5"
        >
          <CalendarPlus className="size-4" aria-hidden="true" />
          Add to Calendar
        </a>
      </div>
      <p className="mt-4 text-center">
        <a href="/" className="text-sm text-sky underline decoration-paper/20 underline-offset-4 hover:text-paper">
          Back home
        </a>
      </p>
    </ThankYouShell>
  );
}

function Detail({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="border-t border-paper/10 px-6 py-4 sm:px-8">
      <p className="text-xs tracking-[0.16em] text-sky/70 uppercase">{label}</p>
      <p className="mt-1 text-base font-medium text-paper">{value}</p>
    </div>
  );
}
