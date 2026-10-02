"use client";

import { useEffect, useState } from "react";

type CountdownProps = {
  targetDate: string;
};

type TimeLeft = {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  isPast: boolean;
};

const emptyTime: TimeLeft = { days: 0, hours: 0, minutes: 0, seconds: 0, isPast: false };

export function Countdown({ targetDate }: CountdownProps) {
  const [timeLeft, setTimeLeft] = useState(emptyTime);

  useEffect(() => {
    const target = new Date(targetDate).getTime();
    const update = () => {
      const remaining = target - Date.now();
      if (remaining <= 0) {
        setTimeLeft({ ...emptyTime, isPast: true });
        return;
      }

      const totalSeconds = Math.floor(remaining / 1000);
      setTimeLeft({
        days: Math.floor(totalSeconds / 86_400),
        hours: Math.floor((totalSeconds % 86_400) / 3_600),
        minutes: Math.floor((totalSeconds % 3_600) / 60),
        seconds: totalSeconds % 60,
        isPast: false,
      });
    };

    update();
    const timer = window.setInterval(update, 1000);
    return () => window.clearInterval(timer);
  }, [targetDate]);

  if (timeLeft.isPast) {
    return <p className="countdown-past">Hari yang dinanti telah tiba. Alhamdulillah.</p>;
  }

  const units = [
    { label: "Hari", value: timeLeft.days },
    { label: "Jam", value: timeLeft.hours },
    { label: "Minit", value: timeLeft.minutes },
    { label: "Saat", value: timeLeft.seconds },
  ];

  return (
    <div className="countdown-grid" aria-label="Kiraan detik menuju majlis">
      {units.map((unit) => (
        <div className="countdown-cell" key={unit.label}>
          <span className="countdown-value">{String(unit.value).padStart(2, "0")}</span>
          <span className="countdown-label">{unit.label}</span>
        </div>
      ))}
    </div>
  );
}
