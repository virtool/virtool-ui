import NoneFoundBox from "@base/NoneFoundBox";
import ScrollArea from "@base/ScrollArea";
import SubviewHeader from "@base/SubviewHeader";
import SubviewHeaderTitle from "@base/SubviewHeaderTitle";
import ViewHeaderTitleBadge from "@base/ViewHeaderTitleBadge";
import { useCurrentOtuContext } from "@otus/queries";
import {
	useCheckReferenceRight,
	useReferenceIsArchived,
} from "@references/hooks";
import { getRouteApi } from "@tanstack/react-router";
import { useState } from "react";
import AddIsolate from "./AddIsolate";
import IsolateDetail from "./IsolateDetail";
import IsolateItem from "./IsolateItem";

const routeApi = getRouteApi("/_authenticated/refs/$refId/otus/$otuId/otu");

/**
 * Displays a component for managing the isolates
 */
export default function IsolateEditor() {
	const { otu, reference } = useCurrentOtuContext();
	const { isolates } = otu;
	const { activeIsolate: activeIsolateId } = routeApi.useSearch();
	const [openAdd, setOpenAdd] = useState(false);
	const { restrict_source_types, source_types } = reference;

	const { hasPermission: canModify } = useCheckReferenceRight(
		reference.id,
		"modify",
	);
	const archived = useReferenceIsArchived(reference.id);

	const activeIsolate = isolates.length
		? isolates.find((i) => i.id === (activeIsolateId || isolates[0]?.id))
		: null;

	const isolateComponents = isolates.map((isolate) => (
		<IsolateItem
			key={isolate.id}
			isolate={isolate}
			active={isolate.id === activeIsolate.id}
		/>
	));

	const addIsolateLink =
		canModify && !archived ? (
			<button
				className="ml-auto cursor-pointer self-end text-sm font-medium bg-transparent border-0 p-0"
				onClick={() => setOpenAdd(true)}
				type="button"
			>
				Add Isolate
			</button>
		) : null;

	const body = isolateComponents.length ? (
		<div className="flex">
			<ScrollArea>{isolateComponents}</ScrollArea>
			<IsolateDetail
				canModify={canModify}
				otuId={otu.id}
				activeIsolate={activeIsolate}
				allowedSourceTypes={source_types}
				restrictSourceTypes={restrict_source_types}
			/>
		</div>
	) : (
		<NoneFoundBox noun="isolates" />
	);

	return (
		<>
			<SubviewHeader>
				<SubviewHeaderTitle className="flex items-center">
					Isolates{" "}
					<ViewHeaderTitleBadge>
						{isolateComponents.length}
					</ViewHeaderTitleBadge>
					{addIsolateLink}
				</SubviewHeaderTitle>
			</SubviewHeader>
			{body}
			<AddIsolate
				allowedSourceTypes={source_types}
				otuId={otu.id}
				restrictSourceTypes={restrict_source_types}
				show={openAdd}
				onHide={() => setOpenAdd(false)}
			/>
		</>
	);
}
