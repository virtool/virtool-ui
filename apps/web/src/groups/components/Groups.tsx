import Button from "@base/Button";
import InputHeader from "@base/InputHeader";
import LoadingPlaceholder from "@base/LoadingPlaceholder";
import RemoveBanner from "@base/RemoveBanner";
import { sortBy } from "es-toolkit/compat";
import { Tabs } from "radix-ui";
import { useState } from "react";
import {
	useFetchGroup,
	useListGroups,
	useRemoveGroup,
	useUpdateGroup,
} from "../queries";
import type { GroupMinimal } from "../types";
import Create from "./CreateGroup";
import { GroupMembers } from "./GroupMembers";
import { GroupPermissions } from "./GroupPermissions";

export default function Groups() {
	const updateGroupMutation = useUpdateGroup();
	const removeMutation = useRemoveGroup();

	const [openCreateGroup, setOpenCreateGroup] = useState(false);
	const [selectedGroupId, setSelectedGroupId] = useState<number | null>(null);
	const [prevGroups, setPrevGroups] = useState<
		GroupMinimal[] | undefined | null
	>(null);

	const { data: groups, isPending: isPendingGroups } = useListGroups();

	if (groups !== prevGroups) {
		setPrevGroups(groups);
		if (groups && !groups.find((g) => g.id === selectedGroupId)) {
			setSelectedGroupId(sortBy(groups, (g) => g.name)[0]?.id ?? null);
		}
	}

	const { data: selectedGroup } = useFetchGroup(selectedGroupId ?? 0);

	if (isPendingGroups || !groups || (groups.length && !selectedGroup)) {
		return <LoadingPlaceholder className="mt-32" />;
	}

	const sortedGroups = sortBy(groups, (g) => g.name);
	const activeValue = selectedGroup ? String(selectedGroup.id) : "";

	return (
		<>
			<header className="flex items-center justify-between mb-5">
				<h2>Groups</h2>
				<Button color="blue" onClick={() => setOpenCreateGroup(true)}>
					Create
				</Button>
			</header>

			{groups.length && selectedGroup ? (
				<Tabs.Root
					value={activeValue}
					onValueChange={(value) => setSelectedGroupId(Number(value))}
					orientation="vertical"
					className="gap-x-4 grid grid-cols-4"
				>
					<Tabs.List
						aria-label="Groups"
						className="col-span-1 flex flex-col self-start bg-white border border-gray-300 rounded-sm overflow-hidden"
					>
						{sortedGroups.map((group) => (
							<Tabs.Trigger
								key={group.id}
								value={String(group.id)}
								className="px-6 py-3 text-left text-gray-500 cursor-pointer transition-colors hover:bg-gray-50 hover:text-gray-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-blue-600/50 data-[state=active]:shadow-[inset_3px_0_0_var(--color-virtool)] data-[state=active]:text-gray-900 data-[state=active]:font-medium"
							>
								{group.name}
							</Tabs.Trigger>
						))}
					</Tabs.List>

					<Tabs.Content
						value={activeValue}
						className="col-span-3 focus:outline-none"
					>
						<InputHeader
							id="name"
							value={selectedGroup.name}
							onSubmit={(name) =>
								updateGroupMutation.mutate({
									id: selectedGroup.id,
									name,
								})
							}
						/>
						<GroupPermissions selectedGroup={selectedGroup} />
						<GroupMembers members={selectedGroup.users} />
						<RemoveBanner
							outerClassName="!mb-0"
							message="Permanently delete this group."
							buttonText="Delete"
							onClick={() => removeMutation.mutate({ id: selectedGroup.id })}
						/>
					</Tabs.Content>
				</Tabs.Root>
			) : (
				<div className="bg-gray-200 flex items-center h-48 justify-center rounded-md text-gray-600">
					No Groups Exist
				</div>
			)}

			<Create open={openCreateGroup} setOpen={setOpenCreateGroup} />
		</>
	);
}
