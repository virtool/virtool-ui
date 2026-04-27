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
		<Box className="flex items-stretch basis-0 gap-4">
			<div className="cursor-pointer flex" onClick={handleSelect}>
				<Checkbox checked={checked} id={`SampleCheckbox${sample.id}`} />
			</div>

			<div className="flex flex-1 flex-col min-w-0">
				<div className="grid grid-cols-3 items-center">
					<Link
						className="text-lg font-medium overflow-hidden text-ellipsis whitespace-nowrap"
						to={`/samples/${sample.id}`}
					>
						{sample.name}
					</Link>
					<Attribution time={sample.created_at} user={sample.user.handle} />
					<div className="flex justify-end items-center gap-2">
						{sample.ready && (
							<WorkflowTags id={sample.id} workflows={sample.workflows} />
						)}
						<EndIcon job={job} onClick={onQuickAnalyze} ready={sample.ready} />
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
