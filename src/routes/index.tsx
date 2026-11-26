import { createFileRoute } from "@tanstack/react-router";
import { PaidEventPage } from "@/components/paid-event-page";

const TITLE = "Wealth Force 2026 — In-person Event | ROCKBANQ";
const DESCRIPTION =
  "Join ROCKBANQ live in Port Harcourt on 28 November 2026. Four speakers, three ticket classes, and a day built to help your family and business build a vault.";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
      { name: "twitter:title", content: TITLE },
      { name: "twitter:description", content: DESCRIPTION },
    ],
  }),
  component: PaidEventPage,
});
