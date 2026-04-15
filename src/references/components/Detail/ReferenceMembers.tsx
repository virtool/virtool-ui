import { objectHasProperty } from "@app/common";
import { useDialogParam, useUrlSearchParam } from "@app/hooks";
import BoxGroup from "@base/BoxGroup";
import BoxGroupHeader from "@base/BoxGroupHeader";
import BoxGroupSection from "@base/BoxGroupSection";
import Icon from "@base/Icon";
import { ReferenceRight, useCheckReferenceRight } from "@references/hooks";
import { useRemoveReferenceUser } from "@references/queries";
import type { ReferenceGroup, ReferenceUser } from "@references/types";
import { AlertCircle } from "lucide-react";
import AddReferenceGroup from "./AddReferenceGroup";
import AddReferenceUser from "./AddReferenceUser";
import EditReferenceMember from "./EditMember";
import MemberItem from "./MemberItem";

type ReferenceMembersProps = {
	/** The list of users or groups associated with the reference */
	members: ReferenceGroup[] | ReferenceUser[];

	/** Whether the member is a user or a group */
	noun: string;

	refId: string;
};

/**
 * Displays a component for managing who can access a reference by users or groups
 */
export default function ReferenceMembers({
	members,
	noun,
	refId,
}: ReferenceMembersProps) {
	const { open: openAdd, setOpen: setOpenAdd } = useDialogParam(
		`openAdd${noun}`,
	);
	const {
		value: editId,
		setValue: setEditId,
		unsetValue: unsetEditId,
	} = useUrlSearchParam<string>(`edit${noun}Id`);

	const mutation = useRemoveReferenceUser(refId, noun);
	const { hasPermission: canModify } = useCheckReferenceRight(
		refId,
		ReferenceRight.modify,
	);

	function handleHide() {
		setOpenAdd(false);
		unsetEditId();
	}

	const plural = `${noun}s`;

	return (
		<>
			<BoxGroup>
				<BoxGroupHeader className="pb-2.5 [&_h2]:capitalize">
					<h2>
						{plural}
						{canModify && (
							<a
								className="cursor-pointer ml-auto"
								onClick={() => setOpenAdd(true)}
							>
								Add {noun}
							</a>
						)}
					</h2>
					<p>Manage membership and rights for reference {plural}.</p>
				</BoxGroupHeader>
				{members.length ? (
					members.map((member: ReferenceGroup | ReferenceUser) => {
						const handleOrName = objectHasProperty(member, "handle")
							? (member as ReferenceUser).handle
							: (member as ReferenceGroup).name;

						return (
							<MemberItem
								key={member.id}
								canModify={canModify}
								handleOrName={handleOrName}
								id={member.id}
								onEdit={(id) => setEditId(String(id))}
								onRemove={(id) => mutation.mutate({ id })}
							/>
						);
					})
				) : (
					<BoxGroupSection className="flex items-center justify-center [&_i]:pr-0.5">
						<Icon icon={AlertCircle} /> None Found
					</BoxGroupSection>
				)}
			</BoxGroup>
			{noun === "user" ? (
				<AddReferenceUser
					users={members as ReferenceUser[]}
					onHide={handleHide}
					refId={refId}
					show={openAdd}
				/>
			) : (
				<AddReferenceGroup
					groups={members as ReferenceGroup[]}
					onHide={handleHide}
					refId={refId}
					show={openAdd}
				/>
			)}
			<EditReferenceMember
				member={members.find(
					(member: ReferenceGroup | ReferenceUser) => member.id === editId,
				)}
				noun={noun}
				refId={refId}
			/>
		</>
	);
}
