import BoxGroup from "@base/BoxGroup";
import BoxGroupSection from "@base/BoxGroupSection";
import ContainerNarrow from "@base/ContainerNarrow";
import { Empty, EmptyMedia, EmptyTitle } from "@base/Empty";
import LoadingPlaceholder from "@base/LoadingPlaceholder";
import QueryError from "@base/QueryError";
import ViewHeader from "@base/ViewHeader";
import ViewHeaderSubtitle from "@base/ViewHeaderSubtitle";
import ViewHeaderTitle from "@base/ViewHeaderTitle";
import { CircleAlert } from "lucide-react";
import {
	useCreateLabel,
	useFetchLabels,
	useRemoveLabel,
	useUpdateLabel,
} from "../queries";
import { CreateLabel } from "./CreateLabel";
import { LabelItem } from "./LabelItem";

/**
 * Display and manage a list of labels. Owns the label query and mutations
 * for the labels management page.
 */
export function Labels() {
	const { data, isPending, isError } = useFetchLabels();
	const createMutation = useCreateLabel();
	const updateMutation = useUpdateLabel();
	const removeMutation = useRemoveLabel();

	if (isError && !data) {
		return <QueryError noun="labels" />;
	}

	if (isPending) {
		return <LoadingPlaceholder />;
	}

	return (
		<ContainerNarrow>
			<ViewHeader className="flex items-center justify-between" title="Labels">
				<div>
					<ViewHeaderTitle>Labels</ViewHeaderTitle>
					<ViewHeaderSubtitle>
						Use labels to organize samples.
					</ViewHeaderSubtitle>
				</div>

				<CreateLabel
					onSubmit={(values) => createMutation.mutateAsync(values)}
				/>
			</ViewHeader>

			<BoxGroup>
				{data.length ? (
					data.map((label) => (
						<LabelItem
							key={label.id}
							color={label.color}
							description={label.description}
							id={label.id}
							name={label.name}
							onEdit={(labelId, values) =>
								updateMutation.mutateAsync({ labelId, ...values })
							}
							onRemove={(labelId) => removeMutation.mutateAsync({ labelId })}
						/>
					))
				) : (
					<BoxGroupSection>
						<Empty orientation="horizontal">
							<EmptyMedia>
								<CircleAlert size={18} />
							</EmptyMedia>
							<EmptyTitle>No labels found</EmptyTitle>
						</Empty>
					</BoxGroupSection>
				)}
			</BoxGroup>
		</ContainerNarrow>
	);
}
