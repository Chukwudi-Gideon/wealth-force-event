export const SUPPORT_EMAIL = "support@rockbanq.com";
export const SUPPORT_PHONE = "+234 9049989801";
export const SUPPORT_PHONE_TEL = "+2349049989801";
export const WHATSAPP_URL = "https://wa.me/2349049989801";
export const CEO_EMAIL = "sarah@rockbanq.com";

export const VENUE = {
  name: "ROCKBANQ",
  lines: [
    "PH Tower, 21 Kaduna Street",
    "37 Aba Road, by Leventis Junction",
    "Port Harcourt, Rivers State, Nigeria",
  ],
  mapsUrl:
    "https://www.google.com/maps/search/?api=1&query=PH+Tower+21+Kaduna+Street+37+Aba+Road+by+Leventis+Junction+Port+Harcourt",
};

export const BANK = {
  bankName: "Providus Bank",
  accountNumber: "4209816767",
  accountName: "ROCKBANQ LTD",
};

/** 15 November 2026, 23:59:59 West Africa Time (UTC+1). */
export const EARLY_CUTOFF = new Date("2026-11-15T22:59:59.000Z");
export const DAY_ONE = new Date("2026-11-27T08:00:00.000Z");
export const DAY_TWO = new Date("2026-11-28T08:00:00.000Z");

export const TIERS = [
  { id: "executive", name: "The Asset Holder", classLabel: "Executive Class", amount: 50_000 },
  { id: "syndicate", name: "The Syndicate Circle", classLabel: "Group of 5 Class", amount: 150_000 },
  { id: "vip", name: "The Sovereign Reserve", classLabel: "VIP Class", amount: 250_000 },
] as const;

export type TierId = (typeof TIERS)[number]["id"];

export function tierById(id: string) {
  return TIERS.find((tier) => tier.id === id) ?? TIERS[0];
}

export function feeNaira(): number {
  return TIERS[0].amount;
}

export function naira(amount: number): string {
  return "₦" + amount.toLocaleString("en-US");
}

export const PILLARS = [
  {
    num: "01",
    title: "Cash flow that holds",
    body: "Find the gaps in how money moves through your business, and close them with a clear plan.",
  },
  {
    num: "02",
    title: "Savings with a system",
    body: "A personalised savings blueprint and payroll reserve plan you can follow every month.",
  },
  {
    num: "03",
    title: "Capital that grows",
    body: "Structured capital accumulation, tax efficiency and continuity planning for the long run.",
  },
] as const;

export const INCLUDED = [
  "A practical business financial strategy masterclass",
  "A personalised business savings blueprint",
  "A business financial health assessment",
  "A 90 day financial growth plan",
  "A private business advisory session",
] as const;

export const SPEAKERS = [
  {
    title: "A decade of tech leadership in the South South",
    body: "Expect ten years as a tech convener who brings people together with ideas and purpose.",
  },
  {
    title: "A voice in entertainment",
    body: "Expect a global star whose story travels far beyond the stage.",
  },
  {
    title: "A fintech voice",
    body: "Expect someone shaping how everyday people save, pay and invest.",
  },
  {
    title: "A builder of bold ideas",
    body: "Expect someone who turns big ideas into real impact.",
  },
  {
    title: "One more guest",
    body: "Expect a name revealed closer to the day.",
  },
] as const;
export const SUCCESS_COPY =
  "Payment received. We will get back to you shortly with your ticket via email or WhatsApp. If there’s any delay, please contact us on WhatsApp or call +234 9049989801.";