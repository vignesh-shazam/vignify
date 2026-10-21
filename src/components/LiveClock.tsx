
"use client";

import { useEffect, useState } from "react";

type ClockData = {
    day: string;
    date: string;
    time: string;
};

function getClockData(): ClockData {
    const now = new Date();

    return {
        day: new Intl.DateTimeFormat(undefined, {
            weekday: "long",
        }).format(now),

        date: new Intl.DateTimeFormat(undefined, {
            day: "2-digit",
            month: "short",
            year: "numeric",
        }).format(now),

        time: new Intl.DateTimeFormat(undefined, {
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
            hour12: false,
        }).format(now),
    };
}

export default function LiveClock() {
    const [clock, setClock] = useState<ClockData | null>(null);

    useEffect(() => {
        const updateClock = () => setClock(getClockData());

        updateClock();

        const interval = window.setInterval(updateClock, 30_000);

        return () => window.clearInterval(interval);
    }, []);

    if (!clock) {
        return (
            <div className="h-5 w-48 animate-pulse rounded bg-white/5" />
        );
    }

    return (
        <div
            className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-white/50"
            aria-label={`Local date ${clock.day}, ${clock.date}, ${clock.time}`}
        >
            <span className="text-[#B9F56B]">{clock.day}</span>
            <span>{clock.date}</span>
            <span className="flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#55E6DC]" />
                {clock.time}
            </span>
        </div>
    );
}
