import { useFuse } from "@app/fuse";
import Button from "@base/Button";
import InputSearch from "@base/InputSearch";
import NoneFoundBox from "@base/NoneFoundBox";
import ScrollArea from "@base/ScrollArea";
import SubviewHeader from "@base/SubviewHeader";
import Toolbar from "@base/Toolbar";
import { useCurrentOtuContext } from "@otus/queries";
import type { OtuIsolate } from "@otus/types";
import {
	useCheckReferenceRight,
	useReferenceIsArchived,
} from "@references/hooks";
import { Outlet } from "@tanstack/react-router";
import { useState } from "react";
import AddIsolate from "./AddIsolate";
import IsolateItem from "./IsolateItem";

const ISOLATE_SEARCH_KEYS = [
	"source_name",
	"sequences.accession",
	"sequences.definition",
];

/**
 * Displays a component for managing the isolates
 */
export default function IsolateEditor() {
	const { otu, reference } = useCurrentOtuContext();
	const { isolates } = otu;
	const [openAdd, setOpenAdd] = useState(false);
	const { restrict_source_types, source_types } = reference;

	const { hasPermission: canModify } = useCheckReferenceRight(
		reference.id,
		"modify",
	);
	const archived = useReferenceIsArchived(reference.id);

	const [results, term, setTerm] = useFuse<OtuIsolate>(
		isolates,
		ISOLATE_SEARCH_KEYS,
	);

	const isolateComponents = results.map((isolate) => (
		<IsolateItem key={isolate.id} isolate={isolate} />
	));

	return (
		<>
			<SubviewHeader>
				<Toolbar>
					<InputSearch
						placeholder="Name, accession, or definition"
						value={term}
						onChange={(e) => setTerm(e.target.value)}
					/>
					{canModify && !archived && (
						<Button color="blue" onClick={() => setOpenAdd(true)}>
							Create
						</Button>
					)}
				</Toolbar>
			</SubviewHeader>
			{isolateComponents.length ? (
				<div className="flex">
					<ScrollArea>{isolateComponents}</ScrollArea>
					<Outlet />
				</div>
			) : (
				<NoneFoundBox noun="isolates" />
			)}
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
