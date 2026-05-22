import BoxGroup from "@base/BoxGroup";
import ContainerNarrow from "@base/ContainerNarrow";
import LoadingPlaceholder from "@base/LoadingPlaceholder";
import NoneFoundSection from "@base/NoneFoundSection";
import ViewHeader from "@base/ViewHeader";
import ViewHeaderSubtitle from "@base/ViewHeaderSubtitle";
import ViewHeaderTitle from "@base/ViewHeaderTitle";
import { useFetchLabels } from "../queries";
import { CreateLabel } from "./CreateLabel";
import { LabelItem } from "./LabelItem";

/**
 * Display and manage a list of labels
 */
export function Labels() {
	const { data, isPending } = useFetchLabels();

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

				<CreateLabel />
			</ViewHeader>

			<BoxGroup>
				{data.length ? (
					data.map((label) => (
						<LabelItem
							key={label.id}
							name={label.name}
							color={label.color}
							description={label.description}
							id={label.id}
						/>
					))
				) : (
					<NoneFoundSection noun="labels" />
				)}
			</BoxGroup>
		</ContainerNarrow>
	);
}
