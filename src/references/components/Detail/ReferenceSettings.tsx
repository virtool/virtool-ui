import LoadingPlaceholder from "@base/LoadingPlaceholder";
import SectionHeader from "@base/SectionHeader";
import { useFetchReference } from "@references/queries";
/**
 * The reference settings view allowing users to manage the reference
 */
import { getRouteApi } from "@tanstack/react-router";
import { sortBy } from "es-toolkit";
import { ArchivedSourceTypes } from "../SourceTypes/ArchivedSourceTypes";
import { LocalSourceTypes } from "../SourceTypes/LocalSourceTypes";
import ReferenceMembers from "./ReferenceMembers";

const routeApi = getRouteApi("/_authenticated/refs/$refId");

type ReferenceSettingsProps = {
	editGroupId?: string;
	editUserId?: string;
	openAddGroup?: boolean;
	openAddUser?: boolean;
	setSearch?: (next: {
		editGroupId?: string;
		editUserId?: string;
		openAddGroup?: boolean;
		openAddUser?: boolean;
	}) => void;
};

export default function ReferenceSettings({
	editGroupId,
	editUserId,
	openAddGroup = false,
	openAddUser = false,
	setSearch = () => {},
}: ReferenceSettingsProps) {
	const { refId } = routeApi.useParams();
	const { data, isPending } = useFetchReference(refId);

	if (isPending) {
		return <LoadingPlaceholder />;
	}

	return (
		<>
			{Boolean(data.remotes_from) ||
				(data.archived ? <ArchivedSourceTypes /> : <LocalSourceTypes />)}
			<SectionHeader>
				<h2 className="flex items-center gap-2">
					Access
					{data.archived && (
						<span className="text-xs font-normal text-gray-500">
							rights still editable
						</span>
					)}
				</h2>
				<p>Manage who can access this reference.</p>
			</SectionHeader>
			<ReferenceMembers
				editId={editUserId}
				noun="user"
				members={sortBy(data.users, ["id"])}
				openAdd={openAddUser}
				refId={refId}
				setEditId={(editUserId) => setSearch({ editUserId })}
				setOpenAdd={(openAddUser) => setSearch({ openAddUser })}
			/>
			<ReferenceMembers
				editId={editGroupId}
				noun="group"
				members={sortBy(data.groups, ["id"])}
				openAdd={openAddGroup}
				refId={refId}
				setEditId={(editGroupId) => setSearch({ editGroupId })}
				setOpenAdd={(openAddGroup) => setSearch({ openAddGroup })}
			/>
		</>
	);
}
