import BoxGroup from "@base/BoxGroup";
import LoadingPlaceholder from "@base/LoadingPlaceholder";
import NoneFoundBox from "@base/NoneFoundBox";
import { useFetchOTU, useUpdateOTU } from "@otus/queries";
import type { OtuSegment } from "@otus/types";
import {
	useCheckReferenceRight,
	useReferenceIsArchived,
} from "@references/hooks";
import { getRouteApi } from "@tanstack/react-router";
import { useState } from "react";
import Button from "@/base/Button";
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
	const { hasPermission: canModify, isPending: isPendingPermission } =
		useCheckReferenceRight(refId, "modify_otu");
	const archived = useReferenceIsArchived(refId);

	const { data, isPending } = useFetchOTU(otuId);
	const mutation = useUpdateOTU(otuId);
	const [openAddSegment, setOpenAddSegment] = useState(false);
	const [segmentToEdit, setSegmentToEdit] = useState<string | undefined>();
	const [segmentToRemove, setSegmentToRemove] = useState<string | undefined>();

	if (isPending || isPendingPermission || !data) {
		return <LoadingPlaceholder />;
	}

	const { abbreviation, name, schema } = data;

	function handleMoveUp(index: number) {
		const updatedSchema = schema.slice();
		[updatedSchema[index], updatedSchema[index - 1]] = [
			updatedSchema[index - 1],
			updatedSchema[index],
		];
		handleUpdate(updatedSchema);
	}

	function handleMoveDown(index: number) {
		const updatedSchema = schema.slice();
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
			{archived ? (
				<p className="mb-3 text-sm text-gray-500">Read only - archived</p>
			) : (
				canModify && (
					<div className="flex justify-end mb-3">
						<Button color="blue" onClick={() => setOpenAddSegment(true)}>
							Add Segment
						</Button>
					</div>
				)
			)}
			{schema.length ? (
				<BoxGroup>
					{schema.map((segment, index) => (
						<Segment
							key={segment.name}
							canModify={canModify && !archived}
							segment={segment}
							first={index === 0}
							last={index === schema.length - 1}
							onMoveUp={() => handleMoveUp(index)}
							onMoveDown={() => handleMoveDown(index)}
							onRemove={() => setSegmentToRemove(segment.name)}
							setEditSegmentName={setSegmentToEdit}
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
				open={openAddSegment && !archived}
				schema={schema}
				setOpen={setOpenAddSegment}
			/>
			<EditSegment
				abbreviation={abbreviation}
				editSegmentName={archived ? undefined : segmentToEdit}
				name={name}
				otuId={otuId}
				schema={schema}
				unsetEditSegmentName={() => setSegmentToEdit(undefined)}
			/>
			{schema.length ? (
				<RemoveSegment
					abbreviation={abbreviation}
					name={name}
					open={Boolean(segmentToRemove)}
					otuId={otuId}
					schema={schema}
					segmentName={segmentToRemove}
					setOpen={(open) => {
						if (!open) {
							setSegmentToRemove(undefined);
						}
					}}
				/>
			) : null}
		</div>
	);
}
