import { createFileRoute } from "@tanstack/react-router";
import { VirtualEventPage } from "@/components/virtual-event-page";

const TITLE = "Wealth Force 2026 — Free Virtual Day | ROCKBANQ";
const DESCRIPTION =
  "Join ROCKBANQ online on 27 November 2026 for a free virtual day on cash flow, savings and capital. Register free for Build a Vault.";

export const Route = createFileRoute("/virtual")({
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
  component: VirtualEventPage,
});
