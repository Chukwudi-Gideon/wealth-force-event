import { createFileRoute } from "@tanstack/react-router";
import { handlePaystackWebhook } from "@/lib/checkout.server";

export const Route = createFileRoute("/api/paystack/webhook")({
  server: {
    handlers: {
      POST: ({ request }) => handlePaystackWebhook(request),
    },
  },
});
