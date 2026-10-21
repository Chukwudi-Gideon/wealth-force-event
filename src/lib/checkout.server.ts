import { BANK, CEO_EMAIL, feeNaira, naira } from "./event";

export type GuestKind = "paid" | "waitlist";

export type GuestInput = {
  name: string;
  email: string;
  phone: string;
  kind: GuestKind;
  origin: string;
};

export type CheckoutResult =
  | {
      ok: true;
      mode: "paystack";
      authorizationUrl: string;
      reference: string;
      amount: number;
    }
  | {
      ok: true;
      mode: "transfer";
      reference: string;
      amount: number;
      bank: typeof BANK;
      reason: string;
    }
  | { ok: false; error: string };

export type NotifyResult = {
  ok: true;
  reference: string;
  amount: number;
  emailed: boolean;
  emailError?: string;
};

export type VerifyResult =
  | {
      ok: true;
      paid: true;
      reference: string;
      amount: number;
      emailed: boolean;
    }
  | { ok: false; error: string };

const NAME_MAX = 80;
const EMAIL_MAX = 120;

export function parseGuest(input: GuestInput): { ok: true; guest: GuestInput } | { ok: false; error: string } {
  const name = input.name.trim().replace(/\s+/g, " ");
  const email = input.email.trim().toLowerCase();
  const phone = input.phone.trim();
  const digits = phone.replace(/\D/g, "");
  if (name.length < 2 || name.length > NAME_MAX) {
    return { ok: false, error: "Please add your full name." };
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > EMAIL_MAX) {
    return { ok: false, error: "Please add a valid email address." };
  }
  if (input.kind === "paid" && digits.length < 11) {
    return { ok: false, error: "Please add a phone number we can reach you on." };
  }
  if (input.kind === "waitlist" && phone && digits.length < 11) {
    return { ok: false, error: "That phone number looks incomplete." };
  }
  let origin = "";
  try {
    const url = new URL(input.origin);
    if (url.protocol !== "https:" && url.protocol !== "http:") {
      return { ok: false, error: "Could not start checkout from this page." };
    }
    origin = url.origin;
  } catch {
    return { ok: false, error: "Could not start checkout from this page." };
  }
  return {
    ok: true,
    guest: { name, email, phone, kind: input.kind, origin },
  };
}

function referenceFor(kind: GuestKind): string {
  const prefix = kind === "paid" ? "WF" : "WL";
  const rand = Math.random().toString(36).slice(2, 8).toUpperCase();
  return `${prefix}${Date.now().toString(36).toUpperCase()}${rand}`;
}

function paystackKey(): string | undefined {
  const key = process.env.PAYSTACK_SECRET_KEY?.trim();
  return key || undefined;
}

function resendKey(): string | undefined {
  const key = process.env.RESEND_API_KEY?.trim();
  return key || undefined;
}

async function sendTeamEmail(args: {
  guest: GuestInput;
  reference: string;
  amount: number;
  status: "payment_verified" | "transfer_claimed" | "waitlist";
}): Promise<{ emailed: boolean; emailError?: string }> {
  const key = resendKey();
  const to = process.env.CEO_EMAIL?.trim() || CEO_EMAIL;
  const from = process.env.RESEND_FROM?.trim() || "Wealth Force Event <onboarding@resend.dev>";
  const statusLine =
    args.status === "payment_verified"
      ? "Paystack payment verified. Add this person to the WhatsApp group manually and send their ticket. Do not email a group link please."
      : args.status === "transfer_claimed"
        ? "Bank transfer claimed by the guest. This is NOT verified yet. Confirm the credit, then add them to the WhatsApp group and send the ticket. Do not email a group link please."
        : "Day 1 waitlist. Send the virtual-day details to this email. Do not email a WhatsApp group link please.";

  const text = [
    "Wealth Force 2026",
    "",
    statusLine,
    "",
    `Name: ${args.guest.name}`,
    `Email: ${args.guest.email}`,
    `Phone: ${args.guest.phone || "—"}`,
    `Reference: ${args.reference}`,
    args.guest.kind === "paid" ? `Amount: ${naira(args.amount)}` : "Amount: free",
    args.guest.kind === "paid"
      ? "Event: Day 2 · 28 November 2026 · Business Masterclass · Port Harcourt"
      : "Event: Day 1 · 27 November 2026 · Free virtual day",
    "",
    `Invoice: ${args.reference}`,
    args.status === "payment_verified" ? "Payment channel: Paystack (card or Pay with Transfer)" : "",
    args.status === "transfer_claimed"
      ? `Claimed transfer to ${BANK.bankName} ${BANK.accountNumber} (${BANK.accountName})`
      : "",
  ]
    .filter(Boolean)
    .join("\n");

  if (!key) {
    console.info("[wealth-force] team email skipped, RESEND_API_KEY is not set", {
      reference: args.reference,
      status: args.status,
    });
    return {
      emailed: false,
      emailError: "Team email is not connected yet. Call or WhatsApp us so we have your number.",
    };
  }

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from,
      to: [to],
      reply_to: args.guest.email,
      subject: `Wealth Force 2026 · ${args.reference} · ${args.guest.name}`,
      text,
    }),
  });

  if (!res.ok) {
    const detail = await res.text();
    console.error("[wealth-force] resend failed", res.status, detail.slice(0, 400));
    return { emailed: false, emailError: "We could not email the team automatically. Please call or WhatsApp us." };
  }
  return { emailed: true };
}

export async function startPaidCheckout(raw: GuestInput): Promise<CheckoutResult> {
  const parsed = parseGuest({ ...raw, kind: "paid" });
  if (!parsed.ok) return parsed;
  const guest = parsed.guest;
  const amount = feeNaira();
  const reference = referenceFor("paid");
  const key = paystackKey();

  if (!key) {
    return {
      ok: true,
      mode: "transfer",
      reference,
      amount,
      bank: BANK,
      reason: "Paystack is not connected on this deployment yet.",
    };
  }

  const res = await fetch("https://api.paystack.co/transaction/initialize", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email: guest.email,
      amount: amount * 100,
      currency: "NGN",
      reference,
      callback_url: `${guest.origin}/booking/return`,
      channels: ["card", "bank_transfer"],
      metadata: {
        event: "wealth-force-2026",
        name: guest.name,
        phone: guest.phone,
        custom_fields: [
          { display_name: "Full name", variable_name: "full_name", value: guest.name },
          { display_name: "Phone", variable_name: "phone", value: guest.phone },
        ],
      },
    }),
  });

  const body = (await res.json().catch(() => null)) as {
    status?: boolean;
    message?: string;
    data?: { authorization_url?: string; reference?: string };
  } | null;

  if (!res.ok || !body?.status || !body.data?.authorization_url) {
    return {
      ok: false,
      error: body?.message || "Paystack could not start this payment. Try again in a moment.",
    };
  }

  return {
    ok: true,
    mode: "paystack",
    authorizationUrl: body.data.authorization_url,
    reference: body.data.reference || reference,
    amount,
  };
}

export async function claimTransfer(raw: GuestInput & { reference?: string }): Promise<NotifyResult | { ok: false; error: string }> {
  const parsed = parseGuest({ ...raw, kind: "paid" });
  if (!parsed.ok) return parsed;
  const amount = feeNaira();
  const reference = raw.reference?.trim() || referenceFor("paid");
  const mail = await sendTeamEmail({
    guest: parsed.guest,
    reference,
    amount,
    status: "transfer_claimed",
  });
  return { ok: true, reference, amount, ...mail };
}

export async function joinWaitlist(raw: GuestInput): Promise<NotifyResult | { ok: false; error: string }> {
  const parsed = parseGuest({ ...raw, kind: "waitlist", phone: raw.phone || "" });
  if (!parsed.ok) return parsed;
  const reference = referenceFor("waitlist");
  const mail = await sendTeamEmail({
    guest: parsed.guest,
    reference,
    amount: 0,
    status: "waitlist",
  });
  return { ok: true, reference, amount: 0, ...mail };
}

type PaystackVerify = {
  status?: boolean;
  message?: string;
  data?: {
    status?: string;
    reference?: string;
    amount?: number;
    customer?: { email?: string };
    metadata?: { name?: string; phone?: string };
  };
};

export async function verifyPaidReference(reference: string): Promise<VerifyResult> {
  const ref = reference.trim();
  if (!/^WF[A-Z0-9]{6,40}$/.test(ref)) {
    return { ok: false, error: "That payment reference is not valid." };
  }
  const key = paystackKey();
  if (!key) return { ok: false, error: "Paystack is not connected on this deployment yet." };

  const res = await fetch(`https://api.paystack.co/transaction/verify/${encodeURIComponent(ref)}`, {
    headers: { Authorization: `Bearer ${key}` },
  });
  const body = (await res.json().catch(() => null)) as PaystackVerify | null;
  if (!res.ok || !body?.status || body.data?.status !== "success") {
    return { ok: false, error: body?.message || "Payment is not confirmed yet." };
  }

  const amount = Math.round((body.data.amount ?? 0) / 100);
  const guest: GuestInput = {
    name: body.data.metadata?.name || "Guest",
    email: body.data.customer?.email || "",
    phone: body.data.metadata?.phone || "",
    kind: "paid",
    origin: "https://rockbanq.com",
  };
  const mail = await sendTeamEmail({
    guest,
    reference: body.data.reference || ref,
    amount,
    status: "payment_verified",
  });
  return { ok: true, paid: true, reference: body.data.reference || ref, amount, emailed: mail.emailed };
}

function safeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let out = 0;
  for (let i = 0; i < a.length; i++) out |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return out === 0;
}

async function hmacSha512Hex(secret: string, message: string): Promise<string> {
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-512" },
    false,
    ["sign"],
  );
  const sig = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(message));
  return [...new Uint8Array(sig)].map((b) => b.toString(16).padStart(2, "0")).join("");
}

export async function handlePaystackWebhook(request: Request): Promise<Response> {
  const key = paystackKey();
  if (!key) return new Response("paystack not configured", { status: 503 });
  const raw = await request.text();
  const signature = request.headers.get("x-paystack-signature") ?? "";
  const expected = await hmacSha512Hex(key, raw);
  if (!signature || !safeEqual(signature, expected)) {
    return new Response("invalid signature", { status: 401 });
  }
  let event: {
    event?: string;
    data?: PaystackVerify["data"];
  };
  try {
    event = JSON.parse(raw) as typeof event;
  } catch {
    return new Response("invalid json", { status: 400 });
  }
  if (event.event === "charge.success" && event.data?.status === "success" && event.data.reference) {
    const amount = Math.round((event.data.amount ?? 0) / 100);
    await sendTeamEmail({
      guest: {
        name: event.data.metadata?.name || "Guest",
        email: event.data.customer?.email || "",
        phone: event.data.metadata?.phone || "",
        kind: "paid",
        origin: "https://rockbanq.com",
      },
      reference: event.data.reference,
      amount,
      status: "payment_verified",
    });
  }
  return new Response("ok", { status: 200 });
}
