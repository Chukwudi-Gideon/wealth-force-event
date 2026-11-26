import { useState } from "react";
import { Check, Mail, MessageCircle, Video } from "lucide-react";
import { Countdown } from "@/components/countdown";
import { BookingFlow } from "@/components/booking-flow";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { DAY_ONE, DAY_ONE_WHATSAPP_URL, INCLUDED, PILLARS } from "@/lib/event";

const STEPS = [
  {
    icon: Video,
    title: "Join from anywhere",
    body: "Reserve your free place and we'll send the online access details to your email.",
  },
  {
    icon: Mail,
    title: "Learn live on 27 November",
    body: "Spend the day building a vault for your family and your business, no travel needed.",
  },
  {
    icon: MessageCircle,
    title: "Keep the conversation going",
    body: "Get reminders, updates and access details in the Build a Vault WhatsApp community.",
  },
] as const;

export function VirtualEventPage() {
  const [waitlist, setWaitlist] = useState(false);

  return (
    <div className="min-h-screen bg-paper text-ink">
      <SiteHeader
        homeHref="/virtual"
        ctaHref="#register"
        ctaLabel="Join for free"
        links={[
          { href: "#vault", label: "Build a Vault" },
          { href: "#included", label: "What you'll get" },
          { href: "#online", label: "How it works" },
          { href: "#register", label: "Register" },
        ]}
      />

      <section id="top" className="relative overflow-hidden bg-ink-deep pt-28 pb-16 text-paper">
        <div className="hero-mesh pointer-events-none absolute inset-0" aria-hidden="true" />
        <div className="relative mx-auto max-w-6xl px-5">
          <p className="inline-flex items-center gap-2 rounded-full border border-paper/20 bg-paper/10 px-4 py-2 text-xs font-medium tracking-widest text-violet uppercase">
            <span className="size-2 rounded-full bg-orange" />
            ROCKBANQ presents · Free virtual day
          </p>
          <h1 className="mt-6 max-w-4xl text-6xl leading-none font-medium tracking-tight sm:text-7xl lg:text-8xl">
            Build a Vault <span className="text-orange">from anywhere.</span>
          </h1>
          <p className="mt-6 max-w-xl text-lg text-sky">
            A free online day for your family and your business. Learn how cash flow, savings and capital fit
            together — no fee, no travel.
          </p>
          <Countdown target={DAY_ONE} label="Goes live 27 November" doneLabel="We're live today." />
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <a
              href="#register"
              className="inline-flex h-12 items-center justify-center rounded-full bg-orange px-6 text-base font-medium text-navy-deep"
            >
              Join the list
            </a>
            <a
              href="#included"
              className="inline-flex h-12 items-center justify-center rounded-full border border-paper/40 px-6 text-base font-medium text-paper"
            >
              See what you'll get
            </a>
          </div>
          <p className="mt-6 text-sm text-sky">Day 1 · 27 November 2026 · Online · No fee</p>
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
          <p className="text-xs font-medium tracking-widest text-purple uppercase">What you'll get</p>
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

      <section id="online" className="bg-lilac py-16 sm:py-20">
        <div className="mx-auto max-w-6xl px-5">
          <p className="text-xs font-medium tracking-widest text-purple uppercase">How it works</p>
          <h2 className="mt-3 max-w-2xl text-4xl leading-tight font-medium tracking-tight text-navy sm:text-5xl">
            Free, online and <span className="text-purple">easy to join.</span>
          </h2>
          <div className="mt-8 grid gap-3 lg:grid-cols-3">
            {STEPS.map(({ icon: Icon, title, body }, index) => (
              <article key={title} className="rounded-3xl bg-paper p-6 shadow-sm">
                <p className="text-sm font-medium tracking-widest text-violet">0{index + 1}</p>
                <Icon className="mt-4 size-6 text-orange" aria-hidden="true" />
                <h3 className="mt-3 text-lg font-medium text-navy">{title}</h3>
                <p className="mt-1 text-sm text-muted">{body}</p>
              </article>
            ))}
          </div>
          <a
            href={DAY_ONE_WHATSAPP_URL}
            target="_blank"
            rel="noreferrer"
            className="mt-6 inline-flex h-12 items-center rounded-full bg-navy px-5 text-sm font-medium text-paper"
          >
            Join the WhatsApp community
          </a>
        </div>
      </section>

      <section id="register" className="bg-ink-deep py-16 text-paper sm:py-20">
        <div className="mx-auto max-w-6xl px-5">
          <p className="text-xs font-medium tracking-widest text-violet uppercase">Register</p>
          <h2 className="mt-3 text-4xl leading-tight font-medium tracking-tight sm:text-5xl">
            Save your <span className="text-orange">free place.</span>
          </h2>
          <article className="mt-8 flex max-w-2xl flex-col rounded-3xl border border-paper/15 bg-paper/5 p-7 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-xs font-medium tracking-widest text-violet uppercase">Free · virtual</p>
              <h3 className="mt-2 text-2xl font-medium">Day 1 · 27 November 2026</h3>
              <p className="mt-2 text-sky">Online. No fee.</p>
            </div>
            <button
              type="button"
              onClick={() => setWaitlist(true)}
              className="mt-6 inline-flex h-12 items-center justify-center rounded-full bg-paper px-5 text-base font-medium text-navy sm:mt-0"
            >
              Join the list
            </button>
          </article>
        </div>
      </section>

      <SiteFooter otherHref="/" otherLabel="Want the in-person day? See tickets →" />

      {waitlist && <BookingFlow mode="waitlist" onClose={() => setWaitlist(false)} />}
    </div>
  );
}
