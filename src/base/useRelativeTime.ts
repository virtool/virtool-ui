import { formatDistanceStrict } from "@/app/date";
import { useEffect, useState } from "react";

type RelativeTimeOptions = {
    addSuffix?: boolean;
};

/**
 * Create a human-readable relative time.
 *
 * It is possible that the relative time could be in the future if the browser time lags behind the server time. If this
 * is the case the string will contain the substring 'in'. If this substring is present, return the alternative time
 * string 'just now'.
 *
 * @param time - the ISO formatted time
 * @param options.addSuffix - whether to add "ago" suffix (default: true)
 * @returns a human-readable relative time string
 */
function createTimeString(
    time: string | Date,
    { addSuffix = true }: RelativeTimeOptions = {},
) {
    const now = Date.now();
    const serverDate = new Date(time);
    const clientDate = new Date();

    const currentTime = serverDate > clientDate ? clientDate : serverDate;

    const timeString = formatDistanceStrict(currentTime, now, {
        addSuffix,
    });

    return timeString.startsWith("in ") ? "just now" : timeString;
}

export function useRelativeTime(
    time: string | Date,
    options: RelativeTimeOptions = {},
) {
    const [, setTick] = useState(0);

    useEffect(() => {
        const interval = window.setInterval(() => {
            setTick((t) => t + 1);
        }, 8000);

        return () => {
            window.clearInterval(interval);
        };
    }, [time]);

    return createTimeString(time, options);
}
