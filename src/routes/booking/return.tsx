import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { verifyCheckout } from "@/lib/checkout.functions";
import { SUPPORT_PHONE, WHATSAPP_URL } from "@/lib/event";

type Search = { reference: string };

export const Route = createFileRoute("/booking/return")({
  validateSearch: (search: Record<string, unknown>): Search => ({
    reference: typeof search.reference === "string" ? search.reference : typeof search.trxref === "string" ? search.trxref : "",
  }),
  component: ReturnPage,
});

function ReturnPage() {
  const { reference } = Route.useSearch();
  const navigate = Route.useNavigate();
  const [state, setState] = useState<"checking" | "failed">("checking");
  const [error, setError] = useState("");
  const [slow, setSlow] = useState(false);
  const settledRef = useRef(false);

  useEffect(() => {
    if (!reference) {
      setState("failed");
      setError("No payment reference came back from Paystack.");
      return;
    }
    let cancelled = false;
    settledRef.current = false;
    setSlow(false);
    setState("checking");
    setError("");

    const timeout = window.setTimeout(() => {
      if (!cancelled && !settledRef.current) setSlow(true);
    }, 20000);

    verifyCheckout({ data: { reference } })
      .then((result) => {
        if (cancelled) return;
        settledRef.current = true;
        if (result.ok && result.paid) {
          void navigate({
            to: "/thank-you/ticket",
            replace: true,
            search: {
              reference: result.reference,
              name: result.name,
              amount: result.amount > 0 ? String(result.amount) : undefined,
            },
          });
        } else {
          setError(result.ok ? "Payment is not confirmed yet." : result.error);
          setState("failed");
        }
      })
      .catch((err) => {
        if (cancelled) return;
        settledRef.current = true;
        console.error("[booking/return] verify failed", err);
        setError("We could not confirm the payment just now.");
        setState("failed");
      });

    return () => {
      cancelled = true;
      window.clearTimeout(timeout);
    };
  }, [reference, navigate]);

  return (
    <main className="min-h-screen bg-ink-deep px-5 py-16 text-paper">
      <div className="mx-auto max-w-xl">
        <a href="/" className="text-sm text-sky">
          ← Build a Vault
        </a>
        <div className="mt-8">
          {state === "checking" && (
            <div className="rounded-3xl border border-paper/15 bg-navy p-6 sm:p-8">
              <p className="text-lg">Confirming your payment. Please wait…</p>
              <p className="mt-3 text-sm text-sky">Do not close this page while we confirm your reference.</p>
              {slow && (
                <div className="mt-5 rounded-2xl border border-orange/25 bg-orange/10 p-4 text-sm text-sky">
                  <p className="font-medium text-paper">This is taking longer than usual.</p>
                  <p className="mt-1">
                    If you already paid, WhatsApp us with reference <span className="text-paper">{reference || "—"}</span> and we’ll confirm it for you.
                  </p>
                  <a
                    href={WHATSAPP_URL}
                    className="mt-3 inline-flex h-11 items-center justify-center rounded-full bg-orange px-5 font-medium text-navy-deep"
                  >
                    WhatsApp support
                  </a>
                </div>
              )}
            </div>
          )}
          {state === "failed" && (
            <div className="rounded-3xl border border-paper/15 bg-navy p-6 sm:p-8">
              <h1 className="text-2xl font-medium">Payment not confirmed</h1>
              <p className="mt-3 text-sm text-sky">{error}</p>
              <p className="mt-3 text-sm text-sky">
                If you already paid, contact us on WhatsApp or call {SUPPORT_PHONE} with reference {reference || "—"}.
              </p>
              <div className="mt-5 flex flex-col gap-3 sm:flex-row">
                <a
                  href={WHATSAPP_URL}
                  className="inline-flex h-12 items-center justify-center rounded-full bg-orange px-5 font-medium text-navy-deep"
                >
                  WhatsApp us
                </a>
                <a
                  href="/#register"
                  className="inline-flex h-12 items-center justify-center rounded-full border border-paper/30 px-5 font-medium text-paper"
                >
                  Try again
                </a>
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
