import { useEffect, useId, useState, type FormEvent } from "react";
import { useServerFn } from "@tanstack/react-start";
import { X } from "lucide-react";
import { joinDayOne, startCheckout } from "@/lib/checkout.functions";
import { SUCCESS_COPY, SUPPORT_PHONE, WHATSAPP_URL, feeNaira, naira } from "@/lib/event";

type Mode = "paid" | "waitlist";

type Props = {
  mode: Mode;
  onClose: () => void;
};

type Step = "details" | "waitlist-done";

export function BookingFlow({ mode, onClose }: Props) {
  const titleId = useId();
  const start = useServerFn(startCheckout);
  const waitlist = useServerFn(joinDayOne);
  const [step, setStep] = useState<Step>("details");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [amount, setAmount] = useState(() => feeNaira());

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = previous;
    };
  }, [onClose]);

  async function onDetails(event: FormEvent) {
    event.preventDefault();
    setError("");
    setBusy(true);
    try {
      if (mode === "waitlist") {
        const result = await waitlist({
          data: { name, email, phone, kind: "waitlist", origin: window.location.origin },
        });
        if (!result.ok) {
          setError(result.error);
          return;
        }
        setStep("waitlist-done");
        return;
      }
      const result = await start({
        data: { name, email, phone, kind: "paid", origin: window.location.origin },
      });
      if (!result.ok) {
        setError(result.error);
        return;
      }
      setAmount(result.amount);
      if (result.mode === "paystack") {
        window.location.assign(result.authorizationUrl);
        return;
      }
      setError("Payment could not start. Please try again, or WhatsApp us.");
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 grid place-items-center bg-ink-deep/80 p-5 backdrop-blur-sm"
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="relative max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-3xl border border-paper/15 bg-navy p-6 text-paper shadow-2xl sm:p-8"
      >
        <button
          type="button"
          className="absolute top-3 right-3 grid size-11 place-items-center rounded-full text-paper"
          aria-label="Close"
          onClick={onClose}
        >
          <X className="size-5" />
        </button>

        {step === "details" && (
          <form onSubmit={onDetails} className="grid gap-3">
            <h2 id={titleId} className="pr-8 text-2xl font-medium">
              {mode === "paid" ? "Reserve my place" : "Join the Day 1 list"}
            </h2>
            <p className="text-sm text-sky">
              {mode === "paid"
                ? "Day 2 · 28 November 2026 · Business masterclass · 100 seats"
                : "Day 1 · 27 November 2026 · Free virtual day"}
            </p>
            {mode === "paid" && (
              <div className="rounded-2xl border border-orange/40 bg-orange/15 px-4 py-3">
                <div className="flex items-baseline justify-between">
                  <span className="text-sm text-sky">
                    {amount === 150000 ? "Early rate until 15 November" : amount === 250000 ? "Standard rate" : "Amount"}
                  </span>
                  <strong className="text-2xl font-medium text-orange">{naira(amount)}</strong>
                </div>
                <p className="mt-2 text-sm text-sky">The amount must be exact.</p>
              </div>
            )}
            <Field label="Full name" value={name} onChange={setName} autoComplete="name" />
            <Field label="Email address" value={email} onChange={setEmail} type="email" autoComplete="email" />
            <Field
              label={mode === "paid" ? "WhatsApp number" : "WhatsApp number (optional)"}
              value={phone}
              onChange={setPhone}
              type="tel"
              autoComplete="tel"
            />
            {error && <p className="text-sm text-orange">{error}</p>}
            <button
              type="submit"
              disabled={busy}
              className="mt-2 inline-flex h-12 items-center justify-center rounded-full bg-orange px-5 text-base font-medium text-navy-deep disabled:opacity-50"
            >
              {busy ? "Please wait…" : mode === "paid" ? "Continue to payment" : "Join the list"}
            </button>
          </form>
        )}

        {step === "waitlist-done" && (
          <div>
            <h2 id={titleId} className="pr-8 text-2xl font-medium">
              You’re on the Day 1 list
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-sky">
              We’ll send the virtual-day details to {email} before 27 November. If you don’t see it, WhatsApp us on{" "}
              {SUPPORT_PHONE}.
            </p>
            <a
              href={WHATSAPP_URL}
              className="mt-5 inline-flex h-12 items-center justify-center rounded-full bg-blue px-5 text-base font-medium text-paper"
            >
              WhatsApp us
            </a>
          </div>
        )}
      </div>
    </div>
  );
}

export function VerifiedMessage({ name }: { name?: string }) {
  return (
    <div className="rounded-3xl border border-paper/15 bg-navy p-6 text-paper sm:p-8">
      <h1 className="text-3xl font-medium">{name ? `Thank you, ${name}.` : "Payment received."}</h1>
      <p className="mt-4 max-w-xl text-base leading-relaxed text-sky">{SUCCESS_COPY}</p>
      <a
        href={WHATSAPP_URL}
        className="mt-6 inline-flex h-12 items-center justify-center rounded-full bg-orange px-5 text-base font-medium text-navy-deep"
      >
        WhatsApp us
      </a>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  type = "text",
  autoComplete,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
  autoComplete?: string;
}) {
  return (
    <label className="grid gap-1 text-sm text-sky">
      {label}
      <input
        required={label !== "WhatsApp number (optional)"}
        type={type}
        value={value}
        autoComplete={autoComplete}
        onChange={(event) => onChange(event.target.value)}
        className="h-12 rounded-xl border border-paper/20 bg-paper/10 px-3 text-base text-paper outline-none placeholder:text-sky/70"
      />
    </label>
  );
}