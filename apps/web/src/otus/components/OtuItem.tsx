import BoxGroupSection from "@base/BoxGroupSection";
import Link from "@base/Link";
import type { ElementType } from "react";

type OtuItemProps = {
	/** The element or component to render as the root (e.g. `"li"` in a list) */
	as?: ElementType;
	abbreviation: string;
	id: string;
	name: string;
	refId: string;
	verified: boolean;
};

/**
 * A condensed OTU item for use in a list of OTUs
 */
export default function OtuItem({
	as,
	abbreviation,
	id,
	name,
	refId,
	verified,
}: OtuItemProps) {
	return (
		<BoxGroupSection
			as={as}
			className="grid items-center"
			style={{ gridTemplateColumns: "5fr 2fr 1fr" }}
		>
			<Link
				className="text-base font-medium"
				to="/refs/$refId/otus/$otuId"
				params={{ refId, otuId: id }}
			>
				{name}
			</Link>
			<span className="flex justify-start">{abbreviation}</span>
			{verified || <span className="flex justify-end">Unverified</span>}
		</BoxGroupSection>
	);
}
