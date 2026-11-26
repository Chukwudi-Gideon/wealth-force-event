import { useEffect, useState } from "react";
import { DAY_TWO } from "@/lib/event";

function parts(target: number, now: number) {
  const diff = Math.max(0, target - now);
  const totalSeconds = Math.floor(diff / 1000);
  return {
    days: Math.floor(totalSeconds / 86400),
    hours: Math.floor((totalSeconds % 86400) / 3600),
    minutes: Math.floor((totalSeconds % 3600) / 60),
    seconds: totalSeconds % 60,
    done: diff <= 0,
  };
}

type Props = {
  target?: Date;
  label?: string;
  doneLabel?: string;
};

export function Countdown({
  target = DAY_TWO,
  label = "Early rate ends 15 November",
  doneLabel = "Early rate has closed.",
}: Props) {
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const id = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(id);
  }, []);
  const left = parts(target.getTime(), now);
  const cells = [
    ["Days", left.days],
    ["Hours", left.hours],
    ["Minutes", left.minutes],
    ["Seconds", left.seconds],
  ] as const;

  return (
    <div className="mt-8 max-w-xl">
      <p className="text-sm font-medium tracking-wide text-sky">
        {left.done ? doneLabel : label}
      </p>
      {!left.done && (
        <div className="mt-3 grid grid-cols-4 gap-2" aria-live="polite">
          {cells.map(([label, value]) => (
            <div key={label} className="rounded-2xl border border-paper/15 bg-paper/10 px-2 py-3 text-center">
              <div className="text-2xl font-medium text-paper tabular-nums sm:text-3xl" suppressHydrationWarning>
                {String(value).padStart(2, "0")}
              </div>
              <div className="mt-1 text-xs font-medium tracking-widest text-sky uppercase">{label}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
