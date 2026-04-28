import Attribution from "@base/Attribution";
import Box from "@base/Box";
import Checkbox from "@base/Checkbox";
import Link from "@base/Link";
import type { SampleMinimal } from "@samples/types";
import { JobNested } from "@/jobs/types";
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

	/** Callback to handle sample selection on end icon quick analysis */
	selectOnQuickAnalyze: () => void;
	setOpenQuickAnalyze: (open: boolean) => void;
};

/**
 * A condensed sample item for use in a list of samples
 */
export default function SampleItem({
	sample,
	checked,
	handleSelect,
	selectOnQuickAnalyze,
	setOpenQuickAnalyze,
}: SampleItemProps) {
	function onQuickAnalyze() {
		selectOnQuickAnalyze();
		setOpenQuickAnalyze(true);
	}

	const job = sample.job && JobNested.parse(sample.job);

	return (
		<Box className="flex items-stretch basis-0">
			<div className="col-start-1 flex max-w-8 pr-4">
				<Checkbox
					ariaLabel={`select ${sample.name}`}
					checked={checked}
					id={`SampleCheckbox${sample.id}`}
					onClick={handleSelect}
				/>
			</div>

			<div className="col-start-2 flex flex-3 flex-col min-w-64">
				<div className="flex items-center relative">
					<div className="flex flex-col flex-3 overflow-hidden [&_a]:text-base [&_a]:font-medium [&_a]:m-0 [&_a]:overflow-hidden [&_a]:text-ellipsis">
						<Link to={`/samples/${sample.id}`}>{sample.name}</Link>
						<Attribution time={sample.created_at} user={sample.user.handle} />
					</div>
				</div>
				<div className="flex mt-2.5 [&>*:not(:last-child)]:mr-1">
					<SampleLibraryTypeLabel libraryType={sample.library_type} />
					{sample.labels.map((label) => (
						<SampleLabel {...label} key={label.id} size="sm" />
					))}
				</div>
			</div>
			<div className="col-start-3 flex flex-2 whitespace-nowrap">
				{sample.ready && (
					<WorkflowTags id={sample.id} workflows={sample.workflows} />
				)}
			</div>
			<div className="flex min-w-20">
				<EndIcon job={job} onClick={onQuickAnalyze} ready={sample.ready} />
			</div>
		</Box>
	);
}
