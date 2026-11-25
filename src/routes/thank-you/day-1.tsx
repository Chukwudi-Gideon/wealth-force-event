import { createFileRoute } from "@tanstack/react-router";
import { CalendarDays, CheckCircle2, Mail, MessageCircle, Sparkles } from "lucide-react";
import {
  BrandMark,
  DAY_ONE_PIXEL_ID,
  DAY_ONE_WHATSAPP_URL,
  ThankYouShell,
  greetingName,
  shortRegId,
} from "@/components/thank-you-page";
import { WHATSAPP_URL } from "@/lib/event";

type Search = { name?: string; email?: string };

export const Route = createFileRoute("/thank-you/day-1")({
  validateSearch: (search: Record<string, unknown>): Search => ({
    name: typeof search.name === "string" ? search.name : undefined,
    email: typeof search.email === "string" ? search.email : undefined,
  }),
  component: DayOneThankYou,
});

function DayOneThankYou() {
  const { name, email } = Route.useSearch();
  const first = greetingName(name);
  const regId = shortRegId(email ?? name);
  return (
    <ThankYouShell
      pixelId={DAY_ONE_PIXEL_ID}
      events={[
        { name: "PageView" },
        { name: "CompleteRegistration", params: { content_name: "Day 1 Virtual" } },
      ]}
    >
      <header className="text-center">
        <BrandMark />
        <div className="thank-you-check mx-auto mt-6 inline-flex size-16 items-center justify-center rounded-full bg-orange/15 ring-1 ring-orange/35">
          <CheckCircle2 className="size-8 text-orange" aria-hidden="true" />
        </div>
        <h1 className="mt-6 text-4xl font-medium leading-tight tracking-tight sm:text-5xl">
          You’re officially <span className="text-orange">on the list{first ? `, ${first}` : ""}!</span>
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-sky sm:text-lg">
          Your seat is secured for Build a Vault. We’ll send your access details and updates by email.
        </p>
      </header>

      <section className="mt-10 overflow-hidden rounded-[1.75rem] border border-paper/12 bg-navy/85 shadow-2xl shadow-black/20">
        <div className="border-b border-paper/10 px-6 py-5 sm:px-8">
          <p className="text-xs font-medium tracking-[0.22em] text-violet uppercase">Virtual experience</p>
          <h2 className="mt-2 text-2xl font-medium text-paper">Day 1 Registration</h2>
        </div>
        <div className="grid gap-0 sm:grid-cols-2">
          <Detail label="Event" value="Build a Vault — Day 1" />
          <Detail label="Date" value="27 November 2026" />
          <Detail label="Status" value={<span className="text-orange">Registration confirmed</span>} />
          <Detail label="Reg ID" value={regId ?? "Sent to your email"} />
        </div>
      </section>

      <section className="mt-8 rounded-[1.75rem] border border-paper/12 bg-navy/55 p-6 sm:p-8">
        <p className="text-xs font-medium tracking-[0.22em] text-violet uppercase">What’s next</p>
        <div className="mt-5 space-y-5">
          <Step icon={<Mail className="size-4" />} title="Check your email" body={email ? `Look for your confirmation at ${email}, including spam/promotions.` : "Look for your confirmation email, including spam/promotions."} />
          <Step icon={<MessageCircle className="size-4" />} title="Join the WhatsApp community" body="Get reminders, updates, and access details in the Build a Vault community." />
          <Step icon={<Sparkles className="size-4" />} title="Get ready" body="Set a reminder for 27 November and come ready to build your vault." />
        </div>
      </section>

      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <a
          href={DAY_ONE_WHATSAPP_URL}
          target="_blank"
          rel="noreferrer"
          className="inline-flex h-12 flex-1 items-center justify-center rounded-full bg-orange px-6 text-base font-medium text-navy-deep transition hover:brightness-105"
        >
          Join the Community
        </a>
        <a
          href={WHATSAPP_URL}
          target="_blank"
          rel="noreferrer"
          className="inline-flex h-12 flex-1 items-center justify-center rounded-full border border-paper/25 px-6 text-base font-medium text-paper transition hover:bg-paper/5"
        >
          WhatsApp Support
        </a>
      </div>
      <p className="mt-6 text-center text-sm text-sky/75">
        <CalendarDays className="mr-1 inline size-4 align-[-2px]" aria-hidden="true" />
        Day 1 is free and virtual · 27 November 2026
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

function Step({ icon, title, body }: { icon: React.ReactNode; title: string; body: string }) {
  return (
    <div className="flex gap-4">
      <div className="mt-0.5 grid size-9 shrink-0 place-items-center rounded-full bg-orange/15 text-orange ring-1 ring-orange/25">
        {icon}
      </div>
      <div>
        <p className="font-medium text-paper">{title}</p>
        <p className="mt-1 text-sm leading-relaxed text-sky">{body}</p>
      </div>
    </div>
  );
}
