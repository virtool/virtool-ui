import { useDialogParam } from "@app/hooks";
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
};

/**
 * A condensed sample item for use in a list of samples
 */
export default function SampleItem({
	sample,
	checked,
	handleSelect,
	selectOnQuickAnalyze,
}: SampleItemProps) {
	const { setOpen } = useDialogParam("openQuickAnalyze");

	function onQuickAnalyze() {
		selectOnQuickAnalyze();
		setOpen(true);
	}

	const job = sample.job && JobNested.parse(sample.job);

	return (
		<Box className="flex items-stretch basis-0">
			<div
				className="col-start-1 cursor-pointer flex pr-4 max-w-8"
				onClick={handleSelect}
			>
				<Checkbox checked={checked} id={`SampleCheckbox${sample.id}`} />
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
