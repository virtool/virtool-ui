import { useGetActiveHit } from "@analyses/hooks";
import type { FormattedNuvsHit, NuvsOrf as NuvsOrfType } from "@analyses/types";
import { calculateAnnotatedOrfCount } from "@analyses/utils";
import { useUrlSearchParam } from "@app/hooks";
import Badge from "@base/Badge";
import { sortBy } from "es-toolkit";
import NuvsBlast from "./NuvsBlast";
import NuvsOrf from "./NuvsOrf";
import NuvsSequence from "./NuvsSequence";
import NuvsValues from "./NuvsValues";

function NuvsFamilies({ families }) {
	return (
		<div className="flex border border-gray-300 rounded my-2.5 mb-1 overflow-hidden [&_div]:py-1 [&_div]:px-2.5 [&_div:first-child]:bg-gray-100 [&_div:first-child]:border-r [&_div:first-child]:border-gray-300">
			<div>Families</div>
			<div>{families.length ? families.join(", ") : "None"}</div>
		</div>
	);
}

function NuvsDetailContainer({ children }) {
	return (
		<div className="flex flex-col flex-grow items-stretch">{children}</div>
	);
}

type NuVsDetailProps = {
	analysisId: string;
	/** A list of sorted and filtered Nuvs hits */

	matches: FormattedNuvsHit[];
	maxSequenceLength: number;
};

/**
 * The detailed view of a Nuvs sequence
 */
export default function NuvsDetail({
	analysisId,
	matches,
	maxSequenceLength,
}: NuVsDetailProps) {
	const { value: filterORFs } = useUrlSearchParam<boolean>("filterOrfs");
	const hit = useGetActiveHit(matches);

	if (!hit) {
		return <NuvsDetailContainer>No Hits</NuvsDetailContainer>;
	}

	const { e, families, orfs, sequence, index } = hit;

	let filtered: NuvsOrfType[] = orfs;

	if (filterORFs) {
		filtered = orfs.filter((orf) => orf.hits.length);
	}

	filtered = sortBy(filtered, [(orf) => orf.hits.length]).reverse();

	const orfComponents = filtered.map((orf, index) => (
		<NuvsOrf
			key={index}
			index={index}
			{...orf}
			maxSequenceLength={maxSequenceLength}
		/>
	));

	return (
		<NuvsDetailContainer>
			<div className="mb-2.5 [&_h3]:flex [&_h3]:items-center [&_h3]:justify-between [&_h3]:text-base [&_h3]:font-bold [&_h3]:m-0 [&_span]:text-sm [&_span]:font-bold">
				<h3>
					Sequence {index}
					<Badge className="text-base py-2 px-3">{sequence.length} bp</Badge>
				</h3>
				<NuvsValues e={e} orfCount={calculateAnnotatedOrfCount(orfs)} />
				<NuvsFamilies families={families} />
			</div>
			<div className="border border-gray-300 mb-4 [&>div:nth-child(even)]:bg-gray-100">
				<NuvsSequence
					key="sequence"
					maxSequenceLength={maxSequenceLength}
					sequence={sequence}
				/>
				{orfComponents}
			</div>
			<NuvsBlast hit={hit} analysisId={analysisId} />
		</NuvsDetailContainer>
	);
}
