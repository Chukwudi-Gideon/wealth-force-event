import { useState } from "react";
import { Check, MapPin } from "lucide-react";
import { Countdown } from "@/components/countdown";
import { BookingFlow } from "@/components/booking-flow";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import {
  INCLUDED,
  PILLARS,
  SPEAKERS,
  TIERS,
  VENUE,
  naira,
  type TierId,
} from "@/lib/event";

export function PaidEventPage() {
  const [flow, setFlow] = useState<TierId | null>(null);

  return (
    <div className="min-h-screen bg-paper text-ink">
      <SiteHeader
        homeHref="/"
        ctaHref="#register"
        ctaLabel="Get tickets"
        links={[
          { href: "#vault", label: "Build a Vault" },
          { href: "#included", label: "What's included" },
          { href: "#speakers", label: "Speakers" },
          { href: "#venue", label: "Venue" },
          { href: "#register", label: "Tickets" },
        ]}
      />

      <section id="top" className="relative overflow-hidden bg-ink-deep pt-28 pb-16 text-paper">
        <div className="hero-mesh pointer-events-none absolute inset-0" aria-hidden="true" />
        <div className="relative mx-auto max-w-6xl px-5">
          <p className="inline-flex items-center gap-2 rounded-full border border-paper/20 bg-paper/10 px-4 py-2 text-xs font-medium tracking-widest text-violet uppercase">
            <span className="size-2 rounded-full bg-orange" />
            ROCKBANQ presents
          </p>
          <h1 className="mt-6 max-w-4xl text-6xl leading-none font-medium tracking-tight sm:text-7xl lg:text-8xl">
            Wealth Force <span className="text-orange">2026</span>
          </h1>
          <p className="mt-6 max-w-xl text-lg text-sky">
            The room where your family and your business learn to see money differently. Join us live in Port
            Harcourt on 28 November.
          </p>
          <Countdown />
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <a
              href="#register"
              className="inline-flex h-12 items-center justify-center rounded-full bg-orange px-6 text-base font-medium text-navy-deep"
            >
              Get my ticket
            </a>
            <a
              href="#included"
              className="inline-flex h-12 items-center justify-center rounded-full border border-paper/40 px-6 text-base font-medium text-paper"
            >
              See what is included
            </a>
          </div>
          <p className="mt-6 text-sm text-sky">
            Day 2 · 28 November 2026 · Port Harcourt · 10AM
          </p>
        </div>
      </section>

      <section id="vault" className="bg-lilac py-16 sm:py-20">
        <div className="mx-auto max-w-6xl px-5">
          <p className="text-xs font-medium tracking-widest text-purple uppercase">Build a vault</p>
          <h2 className="mt-3 max-w-3xl text-4xl leading-tight font-medium tracking-tight text-navy sm:text-5xl">
            Build a business that can <span className="text-purple">endure.</span>
          </h2>
          <p className="mt-3 max-w-xl text-lg text-muted">
            A future your family can count on, and a cooperative that grows together.
          </p>
          <div className="mt-8 grid gap-3 lg:grid-cols-3">
            {PILLARS.map((pillar) => (
              <article key={pillar.num} className="rounded-3xl border-l-4 border-orange bg-paper p-5 shadow-sm">
                <p className="text-sm font-medium tracking-widest text-violet">{pillar.num}</p>
                <h3 className="mt-1 text-lg font-medium text-navy">{pillar.title}</h3>
                <p className="mt-1 text-sm text-muted">{pillar.body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="included" className="bg-paper py-16 sm:py-20">
        <div className="mx-auto max-w-6xl px-5">
          <p className="text-xs font-medium tracking-widest text-purple uppercase">What is included</p>
          <h2 className="mt-3 max-w-xl text-4xl leading-tight font-medium tracking-tight text-navy sm:text-5xl">
            Everything you need to <span className="text-purple">start strong.</span>
          </h2>
          <ul className="mt-8 grid grid-cols-1 gap-3 lg:grid-cols-5">
            {INCLUDED.map((item) => (
              <li key={item} className="flex items-start gap-3 rounded-2xl bg-lilac p-4 text-sm text-ink lg:flex-col">
                <span className="grid size-7 shrink-0 place-items-center rounded-full bg-purple text-paper">
                  <Check className="size-4" aria-hidden="true" />
                </span>
                {item}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section id="speakers" className="bg-ink-deep py-16 text-paper sm:py-20">
        <div className="mx-auto max-w-6xl px-5">
          <p className="text-xs font-medium tracking-widest text-violet uppercase">Speakers</p>
          <h2 className="mt-3 text-4xl leading-tight font-medium tracking-tight sm:text-5xl">
            Four voices. <span className="text-orange">One stage.</span>
          </h2>
          <p className="mt-3 max-w-2xl text-sky">In the room on 28 November.</p>
          <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {SPEAKERS.map((speaker) => (
              <article
                key={speaker.name}
                className="overflow-hidden rounded-3xl border border-paper/10 bg-navy-deep text-left"
              >
                <img
                  src={speaker.image}
                  alt={speaker.name}
                  className="aspect-[4/5] w-full object-cover"
                />
                <div className="px-5 py-5">
                  <p className="text-xs font-medium tracking-widest text-orange uppercase">{speaker.role}</p>
                  <h3 className="mt-2 text-xl font-medium">{speaker.name}</h3>
                  <p className="mt-2 text-sm text-sky">{speaker.body}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="venue" className="bg-lilac py-16 sm:py-20">
        <div className="mx-auto grid max-w-6xl gap-8 px-5 lg:grid-cols-2 lg:items-center">
          <div>
            <p className="text-xs font-medium tracking-widest text-purple uppercase">Venue</p>
            <h2 className="mt-3 text-4xl leading-tight font-medium tracking-tight text-navy sm:text-5xl">
              Our home for <span className="text-purple">the day.</span>
            </h2>
            <p className="mt-4 text-lg text-muted">
              Join us in person at ROCKBANQ in Port Harcourt, a room made for conversations that matter.
            </p>
          </div>
          <div className="rounded-3xl bg-paper p-7 shadow-sm">
            <MapPin className="size-6 text-orange" aria-hidden="true" />
            <p className="mt-4 text-xl font-medium text-navy">{VENUE.name}</p>
            {VENUE.lines.map((line) => (
              <p key={line} className="text-muted">
                {line}
              </p>
            ))}
            <a
              href={VENUE.mapsUrl}
              target="_blank"
              rel="noreferrer"
              className="mt-6 inline-flex h-12 items-center rounded-full bg-navy px-5 text-sm font-medium text-paper"
            >
              Open in Google Maps
            </a>
          </div>
        </div>
      </section>

      <section id="register" className="bg-ink-deep py-16 text-paper sm:py-20">
        <div className="mx-auto max-w-6xl px-5">
          <p className="text-xs font-medium tracking-widest text-violet uppercase">Register</p>
          <h2 className="mt-3 text-4xl leading-tight font-medium tracking-tight sm:text-5xl">
            Choose your <span className="text-orange">ticket.</span>
          </h2>
          <p className="mt-3 max-w-xl text-sky">28 November 2026 · Port Harcourt · 10AM. Three ways to join the room.</p>
          <div className="mt-8 grid grid-cols-1 gap-4 lg:grid-cols-3">
            {TIERS.map((tier) => (
              <article key={tier.id} className="flex flex-col rounded-3xl border border-orange/40 bg-paper/5 p-7">
                <p className="text-xs font-medium tracking-widest text-orange uppercase">{tier.classLabel}</p>
                <h3 className="mt-3 text-2xl font-medium">{tier.name}</h3>
                <p className="mt-2 text-sky">28 November 2026 · Port Harcourt · 10AM</p>
                <div className="mt-4 flex items-baseline gap-3">
                  <p className="text-3xl font-medium text-orange">{naira(tier.amount)}</p>
                  <p className="text-lg text-sky/70 line-through">{naira(tier.originalAmount)}</p>
                </div>
                <button
                  type="button"
                  onClick={() => setFlow(tier.id)}
                  className="mt-8 inline-flex h-12 items-center justify-center self-start rounded-full bg-orange px-5 text-base font-medium text-navy-deep"
                >
                  Reserve
                </button>
              </article>
            ))}
          </div>
        </div>
      </section>

      <SiteFooter otherHref="/virtual" otherLabel="Looking for the free virtual day? →" />

      {flow && <BookingFlow mode={flow} onClose={() => setFlow(null)} />}
    </div>
  );
}
