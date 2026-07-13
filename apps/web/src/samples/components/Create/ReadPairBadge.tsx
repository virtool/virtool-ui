import { cn } from "@app/utils";

type ReadPairBadgeProps = {
	/** The number of read files the sample will be created from */
	count: number;
};

/**
 * A badge showing whether a sample's reads are paired. Two files are a paired
 * sample; one is unpaired. Renders nothing when no reads have been chosen yet.
 */
export default function ReadPairBadge({ count }: ReadPairBadgeProps) {
	if (count === 0) {
		return null;
	}

	const paired = count > 1;

	return (
		<span
			className={cn(
				"rounded-md text-xs font-bold px-2 py-0.5",
				paired ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500",
			)}
		>
			{paired ? "Paired" : "Unpaired"}
		</span>
	);
}
