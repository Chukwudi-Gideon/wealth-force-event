import { useState } from "react";
import { Menu, X } from "lucide-react";

type NavLink = { href: string; label: string };

type Props = {
  homeHref: string;
  links: NavLink[];
  ctaHref: string;
  ctaLabel: string;
};

export function SiteHeader({ homeHref, links, ctaHref, ctaLabel }: Props) {
  const [menu, setMenu] = useState(false);

  return (
    <header className="fixed inset-x-0 top-0 z-40 border-b border-line bg-paper/95 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-5">
        <a href={homeHref} className="shrink-0" aria-label="ROCKBANQ home">
          <img src="/logo.png" alt="ROCKBANQ" className="h-8 w-auto max-w-[8rem] object-contain" />
        </a>
        <nav className="hidden items-center gap-6 text-xs font-medium tracking-widest text-navy uppercase lg:flex">
          {links.map((link) => (
            <a key={link.href} href={link.href} className="hover:text-blue">
              {link.label}
            </a>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <a href={ctaHref} className="inline-flex h-11 items-center rounded-full bg-blue px-4 text-sm font-medium text-paper">
            {ctaLabel}
          </a>
          <button
            type="button"
            className="grid size-11 place-items-center rounded-full text-navy lg:hidden"
            aria-label={menu ? "Close menu" : "Open menu"}
            onClick={() => setMenu((open) => !open)}
          >
            {menu ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
      </div>
      {menu && (
        <nav className="grid gap-1 border-t border-line px-5 py-3 text-sm font-medium text-navy lg:hidden">
          {links.map((link) => (
            <a key={link.href} href={link.href} className="py-2" onClick={() => setMenu(false)}>
              {link.label}
            </a>
          ))}
        </nav>
      )}
    </header>
  );
}
