import SectionHeader from "@base/SectionHeader";
import { useSuspenseReference } from "@references/queries";
/**
 * The reference settings view allowing users to manage the reference
 */
import { getRouteApi } from "@tanstack/react-router";
import { sortBy } from "es-toolkit";
import { useState } from "react";
import { ArchivedSourceTypes } from "../SourceTypes/ArchivedSourceTypes";
import { LocalSourceTypes } from "../SourceTypes/LocalSourceTypes";
import ReferenceMembers from "./ReferenceMembers";

const routeApi = getRouteApi("/_authenticated/refs/$refId");

export default function ReferenceSettings() {
	const { refId } = routeApi.useParams();
	const { data } = useSuspenseReference(refId);

	const [editUserId, setEditUserId] = useState<string>();
	const [editGroupId, setEditGroupId] = useState<string>();
	const [openAddUser, setOpenAddUser] = useState(false);
	const [openAddGroup, setOpenAddGroup] = useState(false);

	return (
		<>
			{Boolean(data.remotes_from) ||
				(data.archived ? <ArchivedSourceTypes /> : <LocalSourceTypes />)}
			<SectionHeader>
				<h2>Access</h2>
				<p>Manage who can access this reference.</p>
			</SectionHeader>
			<ReferenceMembers
				editId={editUserId}
				noun="user"
				members={sortBy(data.users, ["id"])}
				openAdd={openAddUser}
				refId={refId}
				setEditId={setEditUserId}
				setOpenAdd={setOpenAddUser}
			/>
			<ReferenceMembers
				editId={editGroupId}
				noun="group"
				members={sortBy(data.groups, ["id"])}
				openAdd={openAddGroup}
				refId={refId}
				setEditId={setEditGroupId}
				setOpenAdd={setOpenAddGroup}
			/>
		</>
	);
}
