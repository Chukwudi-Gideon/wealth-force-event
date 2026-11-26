export const SUPPORT_EMAIL = "support@rockbanq.com";
export const SUPPORT_PHONE = "+234 9049989801";
export const SUPPORT_PHONE_TEL = "+2349049989801";
export const WHATSAPP_URL = "https://wa.me/2349049989801";
export const DAY_ONE_WHATSAPP_URL = "https://chat.whatsapp.com/IHUuX8RGc1nEPvwEUzdv75";
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
  { id: "executive", name: "The Asset Holder", classLabel: "Executive Class", amount: 25_000, originalAmount: 50_000 },
  { id: "syndicate", name: "The Syndicate Circle", classLabel: "Group of 5 Class", amount: 75_000, originalAmount: 150_000 },
  { id: "vip", name: "The Sovereign Reserve", classLabel: "VIP Class", amount: 125_000, originalAmount: 250_000 },
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
    name: "Sarah Zion",
    role: "Founder & CEO, RockBanq",
    image: "/speakers/ceo.png",
    body: "Private banker and fintech CEO with 15+ years across banking, insurance, fintech, IT and financial planning. She builds the systems that turn scattered money into a lasting family and business legacy.",
  },
  {
    name: "Mr. Erekosima Inye Boma",
    role: "Lead Accountant",
    image: "/speakers/boma.png",
    body: "Tax and management accountant with over 20 years in reporting, compliance, payroll, budgeting and cost control. He brings the discipline that keeps a business sound and scalable.",
  },
  {
    name: "Mrs. Tobore Olumoye",
    role: "Personal Finance Coach",
    image: "/speakers/tobore.jpeg",
    body: "Coach, author and trainer with 22+ years in financial services, including as a Financial Planner at Ecobank. She teaches the decisions that turn income into wealth.",
  },
  {
  name: "Anwuli Isibor",
  role: "Host & Content Creator",
  image: "/speakers/anwuli.jpg",
  body: "Port Harcourt–based host and lifestyle creator focused on wellness and everyday living. Founder of Bouge Club and Top Shots Only, she builds community through conversation and shared experiences.",
},
] as const;
export const SUCCESS_COPY =
  "Payment received. We will get back to you shortly with your ticket via email or WhatsApp. If there’s any delay, please contact us on WhatsApp or call +234 9049989801.";
