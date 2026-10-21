import { useState } from "react";
import { Check, MapPin, Menu, X } from "lucide-react";
import { Countdown } from "@/components/countdown";
import { BookingFlow } from "@/components/booking-flow";
import {
  INCLUDED,
  PILLARS,
  SPEAKERS,
  SUPPORT_EMAIL,
  SUPPORT_PHONE,
  SUPPORT_PHONE_TEL,
  VENUE,
} from "@/lib/event";

type Flow = "paid" | "waitlist" | null;

export function EventPage() {
  const [flow, setFlow] = useState<Flow>(null);
  const [menu, setMenu] = useState(false);

  return (
    <div className="min-h-screen bg-paper text-ink">
      <header className="fixed inset-x-0 top-0 z-40 border-b border-line bg-paper/95 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-5">
          <a href="#top" className="shrink-0" aria-label="ROCKBANQ home">
            <img src="/logo.png" alt="ROCKBANQ" className="h-8 w-auto max-w-[8rem] object-contain" />
          </a>
          <nav className="hidden items-center gap-6 text-xs font-medium tracking-widest text-navy uppercase lg:flex">
            <a href="#vault" className="hover:text-blue">
              Build a Vault
            </a>
            <a href="#speakers" className="hover:text-blue">
              Speakers
            </a>
            <a href="#venue" className="hover:text-blue">
              Venue
            </a>
            <a href="#register" className="hover:text-blue">
              Register
            </a>
          </nav>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setFlow("paid")}
              className="inline-flex h-11 items-center rounded-full bg-blue px-4 text-sm font-medium text-paper"
            >
              Join the event
            </button>
            <button
              type="button"
              className="grid size-11 place-items-center rounded-full text-navy lg:hidden"
              aria-label={menu ? "Close menu" : "Open menu"}
              onClick={() => setMenu((open) => !open)}
            >
              {menu ? <X className="size-5" /> : <Menu className="size-5" />}
            </button>
          </div>
        </div>
        {menu && (
          <nav className="grid gap-1 border-t border-line px-5 py-3 text-sm font-medium text-navy lg:hidden">
            {[
              ["#vault", "Build a Vault"],
              ["#speakers", "Speakers"],
              ["#venue", "Venue"],
              ["#register", "Register"],
            ].map(([href, label]) => (
              <a key={href} href={href} className="py-2" onClick={() => setMenu(false)}>
                {label}
              </a>
            ))}
          </nav>
        )}
      </header>

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
            Two days that change how your family and your business sees money. Start free online, then step into
            the room.
          </p>
          <Countdown />
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <button
              type="button"
              onClick={() => setFlow("paid")}
              className="inline-flex h-12 items-center justify-center rounded-full bg-orange px-6 text-base font-medium text-navy-deep"
            >
              Reserve my place
            </button>
            <a
              href="#included"
              className="inline-flex h-12 items-center justify-center rounded-full border border-paper/40 px-6 text-base font-medium text-paper"
            >
              See what is included
            </a>
          </div>
          <p className="mt-6 text-sm text-sky">
            Day 1 · 27 November · free, online. Day 2 · 28 November · Port Harcourt.
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
            Five voices. <span className="text-orange">One stage.</span>
          </h2>
          <p className="mt-3 max-w-2xl text-sky">
            Expect them in the room on the day, not as a quiz on this page. Names will be confirmed closer to the
            event.
          </p>
          <div className="mt-8 grid grid-cols-1 gap-4 lg:grid-cols-5">
            {SPEAKERS.map((speaker) => (
              <article
                key={speaker.title}
                className="rounded-3xl border border-paper/10 bg-navy-deep px-4 py-5 text-left"
              >
                <p className="text-xs font-medium tracking-widest text-orange uppercase">At the event</p>
                <h3 className="mt-3 text-lg font-medium">{speaker.title}</h3>
                <p className="mt-2 text-sm text-sky">{speaker.body}</p>
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
              Our home for <span className="text-purple">two days.</span>
            </h2>
            <p className="mt-4 text-lg text-muted">
              Day 1 is online. Day 2 is in person at ROCKBANQ in Port Harcourt, a room made for conversations that
              matter.
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
            Two ways to <span className="text-orange">join us.</span>
          </h2>
          <div className="mt-8 grid grid-cols-1 gap-4 lg:grid-cols-2">
            <article className="flex flex-col rounded-3xl border border-paper/15 bg-paper/5 p-7">
              <p className="text-xs font-medium tracking-widest text-violet uppercase">Free · virtual</p>
              <h3 className="mt-3 text-3xl font-medium">Day 1 · 27 November 2026</h3>
              <p className="mt-2 text-sky">Online</p>
              <p className="mt-4 text-sky">
                Join live from anywhere. No fee, just a seat at the table and a first taste of the masterclass.
              </p>
              <button
                type="button"
                onClick={() => setFlow("waitlist")}
                className="mt-8 inline-flex h-12 items-center justify-center self-start rounded-full bg-paper px-5 text-base font-medium text-navy"
              >
                Join the list
              </button>
            </article>
            <article className="flex flex-col rounded-3xl border border-orange/40 bg-paper/5 p-7">
              <p className="text-xs font-medium tracking-widest text-orange uppercase">Paid · 100 seats</p>
              <h3 className="mt-3 text-3xl font-medium">Day 2 · 28 November 2026</h3>
              <p className="mt-2 text-sky">Port Harcourt</p>
              <p className="mt-4 text-sky">A focused, in-person session with only 100 seats.</p>
              <button
                type="button"
                onClick={() => setFlow("paid")}
                className="mt-8 inline-flex h-12 items-center justify-center self-start rounded-full bg-orange px-5 text-base font-medium text-navy-deep"
              >
                Reserve
              </button>
            </article>
          </div>
        </div>
      </section>

      <footer className="border-t border-line bg-paper py-8">
        <div className="mx-auto flex max-w-6xl flex-col gap-4 px-5 text-sm text-muted sm:flex-row sm:items-center sm:justify-between">
          <img src="/logo.png" alt="" className="h-8 w-auto max-w-[7rem] shrink-0 self-start object-contain sm:self-auto" />
          <p>
            <a href={`mailto:${SUPPORT_EMAIL}`} className="hover:text-blue">
              {SUPPORT_EMAIL}
            </a>
            {" · "}
            <a href={`tel:${SUPPORT_PHONE_TEL}`} className="hover:text-blue">
              {SUPPORT_PHONE}
            </a>
          </p>
          <p>© 2026 ROCKBANQ. All rights reserved.</p>
        </div>
      </footer>

      {flow && <BookingFlow mode={flow} onClose={() => setFlow(null)} />}
    </div>
  );
}
