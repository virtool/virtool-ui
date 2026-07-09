import Attribution from "@base/Attribution";
import Box from "@base/Box";
import Checkbox from "@base/Checkbox";
import Link from "@base/Link";
import { useFetchJob } from "@jobs/queries";
import type { SampleMinimal } from "@samples/types";
import SampleLabel from "../Label/SampleLabel";
import SampleLibraryTypeLabel from "../Label/SampleLibraryTypeLabel";
import WorkflowTags from "../Tag/WorkflowTags";
import EndIcon from "./EndIcon";

type SampleItemProps = {
	/** Minimal sample data */
	sample: SampleMinimal;

	/** Whether the sample is selected */
	checked: boolean;

	/** Callback to handle sample selection */
	handleSelect: () => void;

	/** Callback to open a quick analysis scoped to this sample */
	onQuickAnalyze: () => void;
};

/**
 * A condensed sample item for use in a list of samples
 */
export default function SampleItem({
	sample,
	checked,
	handleSelect,
	onQuickAnalyze,
}: SampleItemProps) {
	const { data: job } = useFetchJob(sample.job?.id ?? Number.NaN, sample.job);

	return (
		<Box className="flex items-stretch basis-0 gap-4">
			<div className="flex">
				<Checkbox
					ariaLabel={`Select ${sample.name}`}
					checked={checked}
					id={`SampleCheckbox${sample.id}`}
					onClick={handleSelect}
				/>
			</div>

			<div className="flex flex-1 flex-col min-w-0">
				<div className="grid grid-cols-3 items-center">
					<Link
						className="text-lg font-medium overflow-hidden text-ellipsis whitespace-nowrap"
						to="/samples/$sampleId"
						params={{ sampleId: sample.id }}
					>
						{sample.name}
					</Link>
					<Attribution time={sample.created_at} user={sample.user.handle} />
					<div className="flex justify-end items-center gap-2">
						{sample.ready && (
							<WorkflowTags id={sample.id} workflows={sample.workflows} />
						)}
						<EndIcon
							ariaLabel={`Quick analyze ${sample.name}`}
							progress={job?.progress ?? 0}
							state={job?.state}
							onClick={onQuickAnalyze}
							ready={sample.ready}
						/>
					</div>
				</div>
				<div className="flex mt-2.5 [&>*:not(:last-child)]:mr-1">
					<SampleLibraryTypeLabel libraryType={sample.library_type} />
					{sample.labels.map((label) => (
						<SampleLabel {...label} key={label.id} size="sm" />
					))}
				</div>
			</div>
		</Box>
	);
}
