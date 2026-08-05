import Attribution from "@base/Attribution";
import BoxGroup from "@base/BoxGroup";
import BoxGroupSection from "@base/BoxGroupSection";
import Link from "@base/Link";
import LoadingPlaceholder from "@base/LoadingPlaceholder";
import QueryError from "@base/QueryError";
import WorkflowTags from "@samples/components/Tag/WorkflowTags";
import { useListSamples } from "@samples/queries";
import { FlaskConical } from "lucide-react";
import { DASHBOARD_ITEM_COUNT } from "../constants";
import DashboardCard, { DashboardCardEmpty } from "./DashboardCard";

type RecentSamplesProps = {
	/** The id of the signed-in user, whose samples are listed. */
	userId: number;
};

/** The signed-in user's most recently created samples. */
export default function RecentSamples({ userId }: RecentSamplesProps) {
	const { data, isPending, isError } = useListSamples(
		1,
		DASHBOARD_ITEM_COUNT,
		"",
		[],
		[],
		[userId],
	);

	const action = (
		<Link search={{ users: [userId] }} to="/samples">
			View all
		</Link>
	);

	if (isError && !data) {
		return (
			<DashboardCard action={action} title="My samples">
				<QueryError noun="samples" />
			</DashboardCard>
		);
	}

	if (isPending) {
		return (
			<DashboardCard action={action} title="My samples">
				<LoadingPlaceholder />
			</DashboardCard>
		);
	}

	return (
		<DashboardCard action={action} title="My samples">
			{data.items.length === 0 ? (
				<DashboardCardEmpty
					description="Samples you create will appear here."
					icon={FlaskConical}
					title="No samples yet"
				/>
			) : (
				<BoxGroup as="ul" className="mb-0">
					{data.items.map((sample) => (
						<BoxGroupSection
							as="li"
							className="flex flex-wrap gap-x-4 gap-y-1 items-center"
							key={sample.id}
						>
							<Link
								className="font-medium"
								params={{ sampleId: String(sample.id) }}
								to="/samples/$sampleId"
							>
								{sample.name}
							</Link>
							<Attribution
								className="text-sm"
								time={sample.createdAt}
								user={sample.user.handle}
							/>
							<div className="ml-auto">
								<WorkflowTags id={sample.id} workflows={sample.workflows} />
							</div>
						</BoxGroupSection>
					))}
				</BoxGroup>
			)}
		</DashboardCard>
	);
}
