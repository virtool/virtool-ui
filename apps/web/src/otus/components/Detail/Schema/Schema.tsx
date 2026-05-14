import BoxGroup from "@base/BoxGroup";
import LoadingPlaceholder from "@base/LoadingPlaceholder";
import NoneFoundBox from "@base/NoneFoundBox";
import { useFetchOTU, useUpdateOTU } from "@otus/queries";
import type { OtuSegment } from "@otus/types";
import { useCheckReferenceRight } from "@references/hooks";
import { getRouteApi } from "@tanstack/react-router";
import Button from "@/base/Button";
import { useOtuDetailSearch } from "../OtuDetailSearchContext";
import AddSegment from "./AddSegment";
import EditSegment from "./EditSegment";
import RemoveSegment from "./RemoveSegment";
import Segment from "./Segment";

const routeApi = getRouteApi("/_authenticated/refs/$refId/otus/$otuId");

/**
 * Displays a component allowing users to manage the otu schema
 */
export default function Schema() {
	const { refId, otuId } = routeApi.useParams();
	const { search, setSearch } = useOtuDetailSearch();
	const { hasPermission: canModify, isPending: isPendingPermission } =
		useCheckReferenceRight(refId, "modify_otu");

	const { data, isPending } = useFetchOTU(otuId);
	const mutation = useUpdateOTU(otuId);

	if (isPending || isPendingPermission) {
		return <LoadingPlaceholder />;
	}

	const { abbreviation, name, schema } = data;

	function handleMoveUp(index: number) {
		const updatedSchema = data.schema.slice();
		[updatedSchema[index], updatedSchema[index - 1]] = [
			updatedSchema[index - 1],
			updatedSchema[index],
		];
		handleUpdate(updatedSchema);
	}

	function handleMoveDown(index: number) {
		const updatedSchema = data.schema.slice();
		[updatedSchema[index], updatedSchema[index + 1]] = [
			updatedSchema[index + 1],
			updatedSchema[index],
		];
		handleUpdate(updatedSchema);
	}

	function handleUpdate(updatedSchema: OtuSegment[]) {
		mutation.mutate({ otuId, schema: updatedSchema });
	}

	return (
		<div>
			<div className="flex justify-end mb-3">
				{canModify && (
					<Button
						color="blue"
						onClick={() => setSearch({ openAddSegment: true })}
					>
						Add Segment
					</Button>
				)}
			</div>
			{schema.length ? (
				<BoxGroup>
					{schema.map((segment, index) => (
						<Segment
							key={segment.name}
							canModify={canModify}
							segment={segment}
							first={index === 0}
							last={index === schema.length - 1}
							onMoveUp={() => handleMoveUp(index)}
							onMoveDown={() => handleMoveDown(index)}
							setEditSegmentName={(editSegmentName) =>
								setSearch({ editSegmentName })
							}
							setRemoveSegmentName={(removeSegmentName) =>
								setSearch({ removeSegmentName })
							}
						/>
					))}
				</BoxGroup>
			) : (
				<NoneFoundBox noun="segments" />
			)}

			<AddSegment
				abbreviation={abbreviation}
				name={name}
				otuId={otuId}
				open={Boolean(search.openAddSegment)}
				schema={schema}
				setOpen={(openAddSegment) => setSearch({ openAddSegment })}
			/>
			<EditSegment
				abbreviation={abbreviation}
				editSegmentName={search.editSegmentName}
				name={name}
				otuId={otuId}
				schema={schema}
				unsetEditSegmentName={() => setSearch({ editSegmentName: undefined })}
			/>
			{schema.length ? (
				<RemoveSegment
					abbreviation={abbreviation}
					name={name}
					otuId={otuId}
					removeSegmentName={search.removeSegmentName}
					schema={schema}
					unsetRemoveSegmentName={() =>
						setSearch({ removeSegmentName: undefined })
					}
				/>
			) : null}
		</div>
	);
}
