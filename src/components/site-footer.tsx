import { SUPPORT_EMAIL, SUPPORT_PHONE, SUPPORT_PHONE_TEL } from "@/lib/event";

type Props = {
  otherHref: string;
  otherLabel: string;
};

export function SiteFooter({ otherHref, otherLabel }: Props) {
  return (
    <footer className="border-t border-line bg-paper py-8">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 px-5 text-sm text-muted sm:flex-row sm:items-center sm:justify-between">
        <img src="/logo.png" alt="" className="h-8 w-auto max-w-[7rem] shrink-0 self-start object-contain sm:self-auto" />
        <div className="flex flex-col gap-1">
          <p>
            <a href={otherHref} className="font-medium text-blue hover:underline">
              {otherLabel}
            </a>
          </p>
          <p>
            <a href={`mailto:${SUPPORT_EMAIL}`} className="hover:text-blue">
              {SUPPORT_EMAIL}
            </a>
            {" · "}
            <a href={`tel:${SUPPORT_PHONE_TEL}`} className="hover:text-blue">
              {SUPPORT_PHONE}
            </a>
          </p>
        </div>
        <p>© 2026 ROCKBANQ. All rights reserved.</p>
      </div>
    </footer>
  );
}
