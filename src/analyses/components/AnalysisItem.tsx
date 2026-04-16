import { useCheckAdminRole } from "@administration/hooks";
import { AdministratorRoleName } from "@administration/types";
import { getWorkflowDisplayName } from "@app/utils";
import Attribution from "@base/Attribution";
import Box from "@base/Box";
import Icon from "@base/Icon";
import Link from "@base/Link";
import ProgressCircle, { sizes } from "@base/ProgressCircle";
import SlashList from "@base/SlashList";
import { Equal, EqualNot } from "lucide-react";
import { JobNested } from "@/jobs/types";
import { useRemoveAnalysis } from "../queries";
import type { AnalysisMinimal } from "../types";
import { checkSupportedWorkflow } from "../utils";
import { AnalysisItemRightIcon } from "./AnalysisItemRightIcon";

type AnalysisItemProps = {
	analysis: AnalysisMinimal;
};

/**
 * Condensed analysis item for use in a list of analyses
 */
export default function AnalysisItem({ analysis }: AnalysisItemProps) {
	const {
		id,
		workflow,
		ready,
		user,
		reference,
		index,
		subtractions,
		created_at,
	} = analysis;
	const { hasPermission: canModify } = useCheckAdminRole(
		AdministratorRoleName.USERS,
	);
	const onRemove = useRemoveAnalysis(id);

	const title = checkSupportedWorkflow(workflow) ? (
		<Link to={`/samples/${analysis.sample.id}/analyses/${id}`}>
			{getWorkflowDisplayName(workflow)}
		</Link>
	) : (
		<div className="text-black [&_svg]:ml-1">
			{getWorkflowDisplayName(workflow)}
			<span className="text-gray-500 text-sm ml-1 font-normal">
				Workflow unavailable
			</span>
		</div>
	);

	const job = analysis.job && JobNested.parse(analysis.job);

	return (
		<Box className="text-gray-600 mb-2.5">
			<div className="grid grid-cols-5 items-center text-base font-medium [&_a]:font-medium">
				<div className="col-span-2">{title}</div>
				<Attribution
					className="col-span-2 text-sm font-normal"
					user={user.handle}
					time={created_at}
				/>
				<div className="flex justify-end">
					{ready ? (
						<AnalysisItemRightIcon canModify={canModify} onRemove={onRemove} />
					) : (
						<ProgressCircle
							progress={job.progress || 0}
							state={job.state || "pending"}
							size={sizes.md}
						/>
					)}
				</div>
			</div>
			<div className="flex items-center mt-2.5">
				<span
					className="inline-flex items-center mr-4 [&_i]:mr-1"
					key="reference"
				>
					<Equal size={18} />
					<SlashList className="m-0">
						<li>
							<Link to={`/refs/${reference.id}`}>{reference.name}</Link>
						</li>
						<li>
							<Link to={`/refs/${reference.id}/indexes/${index.id}`}>
								Index {index.version}
							</Link>
						</li>
					</SlashList>
				</span>
				{subtractions.map((subtraction) => (
					<span
						className="inline-flex items-center mr-4 [&_i]:mr-1"
						key={subtraction.id}
					>
						<Icon icon={EqualNot} />
						<Link to={`/subtractions/${subtraction.id}`}>
							{subtraction.name}
						</Link>
					</span>
				))}
			</div>
		</Box>
	);
}
