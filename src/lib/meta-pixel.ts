export type MetaPixelEvent = {
  name: string;
  params?: Record<string, unknown>;
};

declare global {
  interface Window {
    fbq?: ((...args: unknown[]) => void) & {
      callMethod?: (...args: unknown[]) => void;
      queue?: unknown[];
      loaded?: boolean;
      version?: string;
      push?: (...args: unknown[]) => void;
    };
    _fbq?: unknown;
    __metaPixelInit?: Record<string, boolean>;
    __metaPixelEvents?: Record<string, boolean>;
  }
}

const SCRIPT_ID_PREFIX = "meta-pixel-";
const SCRIPT_SRC = "https://connect.facebook.net/en_US/fbevents.js";

function ensureFbq() {
  if (typeof window === "undefined") return;
  if (window.fbq) return;
  const fbq: NonNullable<Window["fbq"]> = function (...args: unknown[]) {
    if (fbq.callMethod) {
      fbq.callMethod(...args);
    } else {
      fbq.queue?.push(args);
    }
  } as NonNullable<Window["fbq"]>;
  fbq.queue = [];
  fbq.loaded = true;
  fbq.version = "2.0";
  fbq.push = fbq;
  window.fbq = fbq;
  if (!window._fbq) window._fbq = fbq;

  const existing = document.querySelector(`script[src="${SCRIPT_SRC}"]`);
  if (existing) return;
  const script = document.createElement("script");
  script.async = true;
  script.src = SCRIPT_SRC;
  script.id = `${SCRIPT_ID_PREFIX}script`;
  const first = document.getElementsByTagName("script")[0];
  if (first?.parentNode) {
    first.parentNode.insertBefore(script, first);
  } else {
    document.head.appendChild(script);
  }
}

export function trackMetaPixel(pixelId: string, events: MetaPixelEvent[]) {
  if (typeof window === "undefined") return;
  ensureFbq();
  const fbq = window.fbq;
  if (!fbq) return;

  window.__metaPixelInit ??= {};
  window.__metaPixelEvents ??= {};

  if (!window.__metaPixelInit[pixelId]) {
    fbq("init", pixelId);
    window.__metaPixelInit[pixelId] = true;
  }

  for (const event of events) {
    const key = `${pixelId}:${event.name}:${JSON.stringify(event.params ?? {})}`;
    if (window.__metaPixelEvents[key]) continue;
    if (event.params) {
      fbq("track", event.name, event.params);
    } else {
      fbq("track", event.name);
    }
    window.__metaPixelEvents[key] = true;
  }
}

export function metaPixelNoscriptSrc(pixelId: string) {
  return `https://www.facebook.com/tr?id=${encodeURIComponent(pixelId)}&ev=PageView&noscript=1`;
}
