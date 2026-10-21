import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { verifyCheckout } from "@/lib/checkout.functions";
import { VerifiedMessage } from "@/components/booking-flow";
import { SUPPORT_PHONE, WHATSAPP_URL, naira } from "@/lib/event";

type Search = { reference: string };

export const Route = createFileRoute("/booking/return")({
  validateSearch: (search: Record<string, unknown>): Search => ({
    reference: typeof search.reference === "string" ? search.reference : typeof search.trxref === "string" ? search.trxref : "",
  }),
  component: ReturnPage,
});

function ReturnPage() {
  const { reference } = Route.useSearch();
  const [state, setState] = useState<"checking" | "paid" | "failed">("checking");
  const [amount, setAmount] = useState(0);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!reference) {
      setState("failed");
      setError("No payment reference came back from Paystack.");
      return;
    }
    let cancelled = false;
    verifyCheckout({ data: { reference } })
      .then((result) => {
        if (cancelled) return;
        if (result.ok && result.paid) {
          setAmount(result.amount);
          setState("paid");
        } else {
          setError(result.ok ? "Payment is not confirmed yet." : result.error);
          setState("failed");
        }
      })
      .catch(() => {
        if (!cancelled) {
          setError("We could not confirm the payment just now.");
          setState("failed");
        }
      });
    return () => {
      cancelled = true;
    };
  }, [reference]);

  return (
    <main className="min-h-screen bg-ink-deep px-5 py-16 text-paper">
      <div className="mx-auto max-w-xl">
        <a href="/" className="text-sm text-sky">
          ← Wealth Force 2026
        </a>
        <div className="mt-8">
          {state === "checking" && <p className="text-lg">Confirming your payment. Please wait…</p>}
          {state === "paid" && (
            <div>
              <VerifiedMessage />
              {amount > 0 && <p className="mt-4 text-sm text-sky">Amount confirmed: {naira(amount)}.</p>}
            </div>
          )}
          {state === "failed" && (
            <div className="rounded-3xl border border-paper/15 bg-navy p-6">
              <h1 className="text-2xl font-medium">Payment not confirmed</h1>
              <p className="mt-3 text-sm text-sky">{error}</p>
              <p className="mt-3 text-sm text-sky">
                If you already paid, contact us on WhatsApp or call {SUPPORT_PHONE} with reference {reference || "—"}.
              </p>
              <a
                href={WHATSAPP_URL}
                className="mt-5 inline-flex h-12 items-center rounded-full bg-orange px-5 font-medium text-navy-deep"
              >
                WhatsApp us
              </a>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
