import { createFileRoute } from "@tanstack/react-router";
import { PaidEventPage } from "@/components/paid-event-page";
import { DAY_TWO_LABEL } from "@/lib/event";

const TITLE = "Wealth Force 2026 — In-person Event | ROCKBANQ";
const DESCRIPTION =
  `Join ROCKBANQ live in Port Harcourt on ${DAY_TWO_LABEL}. Four speakers, three ticket classes, and a day built to help your family and business build a vault.`;

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
