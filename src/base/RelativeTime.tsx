import { useRelativeTime } from "./useRelativeTime";

type RelativeTimeProps = {
    time: string | Date;
};

/**
 * Shows the passed time prop relative to the current time (eg. 3 days ago). The relative time string is updated
 * automatically as time passes.
 */
export default function RelativeTime({ time }: RelativeTimeProps) {
    const timeString = useRelativeTime(time);
    return <span>{timeString}</span>;
}
