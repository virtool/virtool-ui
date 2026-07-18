import { addSeconds, formatDistanceStrict } from "@app/date";
import { useNow } from "@app/hooks";
import Box from "@base/Box";
import ExternalLink from "@base/ExternalLink";
import Icon from "@base/Icon";
import Loader from "@base/Loader";
import RelativeTime from "@base/RelativeTime";
import { ExternalLink as ExternalLinkIcon } from "lucide-react";

const ridRoot =
	"https://blast.ncbi.nlm.nih.gov/Blast.cgi?\
    CMD=Web&PAGE_TYPE=BlastFormatting&OLD_BLAST=false&GET_RID_INFO=on&RID=";

function RidLink({ rid }: { rid: string }) {
	if (rid) {
		return (
			<span>
				<span> with RID </span>
				<ExternalLink href={ridRoot + rid}>
					{rid}{" "}
					<sup>
						<Icon icon={ExternalLinkIcon} />
					</sup>
				</ExternalLink>
			</span>
		);
	}

	return null;
}

type RidTimingProps = {
	interval: number;
	lastCheckedAt: string;
};

function RidTiming({ interval, lastCheckedAt }: RidTimingProps) {
	const now = useNow();

	if (lastCheckedAt) {
		const nextCheckAt = addSeconds(new Date(lastCheckedAt), interval);
		const relativeNext = formatDistanceStrict(new Date(nextCheckAt), now);

		return (
			<div className="ml-auto text-gray-700">
				Last checked <RelativeTime time={lastCheckedAt} />. Checking again in{" "}
				{relativeNext}
			</div>
		);
	}

	return null;
}

type NuvsBlastPendingProps = {
	interval: number;
	lastCheckedAt: string;
	rid: string;
};

export default function NuvsBlastPending({
	interval,
	lastCheckedAt,
	rid,
}: NuvsBlastPendingProps) {
	return (
		<Box className="flex items-start [&>div:first-of-type]:mr-1">
			<Loader className="size-5" color="blue" />
			<div>
				<div>
					<span className="font-medium">BLAST in progress</span>
					<RidLink rid={rid} />
				</div>
				<RidTiming interval={interval} lastCheckedAt={lastCheckedAt} />
			</div>
		</Box>
	);
}
