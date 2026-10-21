import { createFileRoute } from "@tanstack/react-router";
import { EventPage } from "@/components/event-page";

export const Route = createFileRoute("/")({ component: EventPage });
