import BoxGroup from "@base/BoxGroup";
import ContainerNarrow from "@base/ContainerNarrow";
import LoadingPlaceholder from "@base/LoadingPlaceholder";
import NoneFoundSection from "@base/NoneFoundSection";
import ViewHeader from "@base/ViewHeader";
import ViewHeaderSubtitle from "@base/ViewHeaderSubtitle";
import ViewHeaderTitle from "@base/ViewHeaderTitle";
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
	const { data, isPending } = useFetchLabels();
	const createMutation = useCreateLabel();
	const updateMutation = useUpdateLabel();
	const removeMutation = useRemoveLabel();

	if (isPending || !data) {
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
					<NoneFoundSection noun="labels" />
				)}
			</BoxGroup>
		</ContainerNarrow>
	);
}
