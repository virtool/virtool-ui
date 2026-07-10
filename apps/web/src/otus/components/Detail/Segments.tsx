import BoxGroup from "@base/BoxGroup";
import { Empty, EmptyDescription, EmptyMedia, EmptyTitle } from "@base/Empty";
import LoadingPlaceholder from "@base/LoadingPlaceholder";
import QueryError from "@base/QueryError";
import {
	closestCenter,
	DndContext,
	type DragEndEvent,
	KeyboardSensor,
	PointerSensor,
	useSensor,
	useSensors,
} from "@dnd-kit/core";
import {
	arrayMove,
	SortableContext,
	sortableKeyboardCoordinates,
	verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { useFetchOTU, useUpdateOTU } from "@otus/queries";
import {
	useCheckReferenceRight,
	useReferenceIsArchived,
} from "@references/hooks";
import { getRouteApi } from "@tanstack/react-router";
import { Component } from "lucide-react";
import { useState } from "react";
import Box from "@/base/Box";
import Button from "@/base/Button";
import RemoveSegment from "./RemoveSegment";
import Segment from "./Segment";
import SegmentCreate from "./SegmentCreate";
import SegmentEdit from "./SegmentEdit";

const routeApi = getRouteApi("/_authenticated/refs/$refId/otus/$otuId");

/**
 * Displays a component allowing users to manage the otu segments
 */
export default function Segments() {
	const { refId, otuId } = routeApi.useParams();
	const { hasPermission: canModify, isPending: isPendingPermission } =
		useCheckReferenceRight(refId, "modify_otu");
	const archived = useReferenceIsArchived(refId);

	const { data, isPending, isError } = useFetchOTU(otuId);
	const mutation = useUpdateOTU(otuId);
	const [openAddSegment, setOpenAddSegment] = useState(false);
	const [segmentToEdit, setSegmentToEdit] = useState<string | undefined>();
	const [segmentToRemove, setSegmentToRemove] = useState<string | undefined>();

	const sensors = useSensors(
		useSensor(PointerSensor),
		useSensor(KeyboardSensor, {
			coordinateGetter: sortableKeyboardCoordinates,
		}),
	);

	if (isError && !data) {
		return <QueryError noun="schema" />;
	}

	if (isPending || isPendingPermission) {
		return <LoadingPlaceholder />;
	}

	const { abbreviation, name, schema } = data;

	function handleDragEnd({ active, over }: DragEndEvent) {
		if (!over || active.id === over.id) {
			return;
		}

		const oldIndex = schema.findIndex((s) => s.name === active.id);
		const newIndex = schema.findIndex((s) => s.name === over.id);
		mutation.mutate({ otuId, schema: arrayMove(schema, oldIndex, newIndex) });
	}

	return (
		<div>
			{archived ? (
				<p className="mb-3 text-sm text-gray-500">Read only - archived</p>
			) : (
				canModify && (
					<div className="flex justify-end mb-3">
						<Button color="blue" onClick={() => setOpenAddSegment(true)}>
							Create
						</Button>
					</div>
				)
			)}
			{schema.length ? (
				<DndContext
					sensors={sensors}
					collisionDetection={closestCenter}
					onDragEnd={handleDragEnd}
				>
					<SortableContext
						items={schema.map((segment) => segment.name)}
						strategy={verticalListSortingStrategy}
					>
						<BoxGroup>
							{schema.map((segment) => (
								<Segment
									key={segment.name}
									canModify={canModify && !archived}
									segment={segment}
									onRemove={() => setSegmentToRemove(segment.name)}
									setEditSegmentName={setSegmentToEdit}
								/>
							))}
						</BoxGroup>
					</SortableContext>
				</DndContext>
			) : (
				<Box>
					<Empty className="h-72">
						<EmptyMedia className="text-gray-400">
							<Component size={40} strokeWidth={1.5} />
						</EmptyMedia>
						<EmptyTitle>No segments found</EmptyTitle>
						<EmptyDescription>
							This schema has no segments yet.
						</EmptyDescription>
					</Empty>
				</Box>
			)}

			<SegmentCreate
				abbreviation={abbreviation}
				name={name}
				otuId={otuId}
				open={openAddSegment && !archived}
				schema={schema}
				setOpen={setOpenAddSegment}
			/>
			<SegmentEdit
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
