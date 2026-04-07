"use client";

import { useEffect, useState } from "react";

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

function compute(eventDate: Date): TimeLeft {
  const diff = Math.max(0, eventDate.getTime() - Date.now());
  return {
    days:    Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours:   Math.floor((diff / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((diff / (1000 * 60)) % 60),
    seconds: Math.floor((diff / 1000) % 60),
  };
}

export default function Countdown({ eventDate }: { eventDate: Date }) {
  const [time, setTime] = useState<TimeLeft | null>(null);

  useEffect(() => {
    setTime(compute(eventDate));
    const id = setInterval(() => setTime(compute(eventDate)), 1000);
    return () => clearInterval(id);
  }, [eventDate]);

  // Avoid hydration mismatch — render nothing until client kicks in
  if (!time) return null;

  const units = [
    { value: time.days,    label: "Tage" },
    { value: time.hours,   label: "Std" },
    { value: time.minutes, label: "Min" },
    { value: time.seconds, label: "Sek" },
  ];

  return (
    <div className="flex items-end gap-1 sm:gap-2">
      {units.map(({ value, label }, i) => (
        <div key={label} className="flex items-end gap-1 sm:gap-2">
          <div className="text-center">
            <div className="font-display text-[clamp(40px,8vw,80px)] leading-none text-accent tabular-nums">
              {String(value).padStart(2, "0")}
            </div>
            <div className="text-muted text-[10px] tracking-widest uppercase mt-1">{label}</div>
          </div>
          {i < units.length - 1 && (
            <div className="font-display text-[clamp(28px,5vw,56px)] leading-none text-accent mb-4 opacity-50">
              :
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
