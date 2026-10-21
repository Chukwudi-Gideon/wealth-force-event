import { createServerFn } from "@tanstack/react-start";
import type { GuestKind } from "./checkout.server";

type GuestPayload = {
  name: string;
  email: string;
  phone: string;
  kind: GuestKind;
  origin: string;
  reference?: string;
};

function asGuest(input: GuestPayload): GuestPayload {
  return {
    name: String(input?.name ?? ""),
    email: String(input?.email ?? ""),
    phone: String(input?.phone ?? ""),
    kind: input?.kind === "waitlist" ? "waitlist" : "paid",
    origin: String(input?.origin ?? ""),
    reference: input?.reference ? String(input.reference) : undefined,
  };
}

export const startCheckout = createServerFn({ method: "POST" })
  .validator((input: GuestPayload) => asGuest(input))
  .handler(async ({ data }) => {
    const { startPaidCheckout } = await import("./checkout.server");
    return startPaidCheckout(data);
  });

export const claimBankTransfer = createServerFn({ method: "POST" })
  .validator((input: GuestPayload) => asGuest(input))
  .handler(async ({ data }) => {
    const { claimTransfer } = await import("./checkout.server");
    return claimTransfer(data);
  });

export const joinDayOne = createServerFn({ method: "POST" })
  .validator((input: GuestPayload) => asGuest(input))
  .handler(async ({ data }) => {
    const { joinWaitlist } = await import("./checkout.server");
    return joinWaitlist({ ...data, kind: "waitlist" });
  });

export const verifyCheckout = createServerFn({ method: "POST" })
  .validator((input: { reference: string }) => ({ reference: String(input?.reference ?? "") }))
  .handler(async ({ data }) => {
    const { verifyPaidReference } = await import("./checkout.server");
    return verifyPaidReference(data.reference);
  });
