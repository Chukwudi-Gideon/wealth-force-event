import { useEffect, useId, useState, type FormEvent } from "react";
import { useServerFn } from "@tanstack/react-start";
import { X } from "lucide-react";
import { claimBankTransfer, joinDayOne, startCheckout } from "@/lib/checkout.functions";
import { BANK, SUCCESS_COPY, SUPPORT_PHONE, WHATSAPP_URL, feeNaira, naira } from "@/lib/event";

type Mode = "paid" | "waitlist";

type Props = {
  mode: Mode;
  onClose: () => void;
};

type Step = "details" | "pay" | "claimed" | "waitlist-done";

export function BookingFlow({ mode, onClose }: Props) {
  const titleId = useId();
  const start = useServerFn(startCheckout);
  const claim = useServerFn(claimBankTransfer);
  const waitlist = useServerFn(joinDayOne);
  const [step, setStep] = useState<Step>("details");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [reference, setReference] = useState("");
  const [amount, setAmount] = useState(() => feeNaira());
  const [emailed, setEmailed] = useState(false);

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
        setReference(result.reference);
        setEmailed(result.emailed);
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
      setReference(result.reference);
      if (result.mode === "paystack") {
        window.location.assign(result.authorizationUrl);
        return;
      }
      setStep("pay");
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setBusy(false);
    }
  }

  async function onClaimed() {
    setError("");
    setBusy(true);
    try {
      const result = await claim({
        data: { name, email, phone, kind: "paid", origin: window.location.origin, reference },
      });
      if (!result.ok) {
        setError(result.error);
        return;
      }
      setEmailed(result.emailed);
      setStep("claimed");
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
              <div className="flex items-baseline justify-between rounded-2xl border border-orange/40 bg-orange/15 px-4 py-3">
                <span className="text-sm text-sky">
                  {amount === 150000 ? "Early rate until 15 November" : "Standard rate"}
                </span>
                <strong className="text-2xl font-medium text-orange">{naira(amount)}</strong>
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

        {step === "pay" && (
          <div>
            <h2 id={titleId} className="pr-8 text-2xl font-medium">
              Pay by transfer
            </h2>
            <p className="mt-2 text-sm text-sky">
              Paystack is not connected on this preview yet, so use the company account. This is not a confirmed
              payment until the transfer is seen.
            </p>
            <div className="mt-4 flex items-baseline justify-between rounded-2xl border border-orange/40 bg-orange/15 px-4 py-3">
              <span className="text-sm text-sky">Amount</span>
              <strong className="text-2xl font-medium text-orange">{naira(amount)}</strong>
            </div>
            <dl className="mt-3 rounded-2xl border border-paper/12 bg-paper/5 px-4">
              <Row label="Bank" value={BANK.bankName} />
              <Row label="Account number" value={BANK.accountNumber} />
              <Row label="Account name" value={BANK.accountName} />
              <Row label="Reference" value={reference} />
            </dl>
            <p className="mt-3 text-sm text-sky">Use the reference as your transfer narration.</p>
            {error && <p className="mt-3 text-sm text-orange">{error}</p>}
            <button
              type="button"
              disabled={busy}
              onClick={onClaimed}
              className="mt-4 inline-flex h-12 w-full items-center justify-center rounded-full bg-orange px-5 text-base font-medium text-navy-deep disabled:opacity-50"
            >
              {busy ? "Sending…" : "I have made the transfer"}
            </button>
          </div>
        )}

        {step === "claimed" && (
          <div>
            <h2 id={titleId} className="pr-8 text-2xl font-medium">
              Transfer noted, {name.split(" ")[0]}
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-sky">
              This is not a payment confirmation. Your ticket will be sent after the transfer is confirmed on the
              account. If you do not hear from us, contact us on WhatsApp or call {SUPPORT_PHONE}.
            </p>
            {!emailed && (
              <p className="mt-3 text-sm text-orange">
                The automatic note to the team did not send. Please WhatsApp or call us with reference {reference}{" "}
                so your number is not lost.
              </p>
            )}
            <a
              href={WHATSAPP_URL}
              className="mt-5 inline-flex h-12 items-center justify-center rounded-full bg-blue px-5 text-base font-medium text-paper"
            >
              WhatsApp us
            </a>
          </div>
        )}

        {step === "waitlist-done" && (
          <div>
            <h2 id={titleId} className="pr-8 text-2xl font-medium">
              You are on the Day 1 list
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-sky">
              We will send the virtual-day details to {email}. Reference {reference}.
            </p>
            {!emailed && (
              <p className="mt-3 text-sm text-orange">
                The automatic note to the team did not send. Email {email} and your name to the team on WhatsApp or{" "}
                {SUPPORT_PHONE} so your place is recorded.
              </p>
            )}
            <button
              type="button"
              onClick={onClose}
              className="mt-5 inline-flex h-12 items-center justify-center rounded-full bg-blue px-5 text-base font-medium text-paper"
            >
              Close
            </button>
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

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-4 border-b border-paper/10 py-3 text-sm last:border-b-0">
      <dt className="text-sky">{label}</dt>
      <dd className="text-right font-medium">{value}</dd>
    </div>
  );
}
