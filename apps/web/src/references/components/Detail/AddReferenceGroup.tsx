import BoxGroup from "@base/BoxGroup";
import BoxGroupSection from "@base/BoxGroupSection";
import CompactScrollList from "@base/CompactScrollList";
import { Dialog, DialogContent, DialogTitle } from "@base/Dialog";
import { Empty, EmptyDescription, EmptyMedia, EmptyTitle } from "@base/Empty";
import InitialIcon from "@base/InitialIcon";
import InputSearch from "@base/InputSearch";
import QueryError from "@base/QueryError";
import SelectBoxGroupSection from "@base/SelectBoxGroupSection";
import Toolbar from "@base/Toolbar";
import { useInfiniteFindGroups } from "@groups/queries";
import { useAddReferenceMember } from "@references/queries";
import type { ReferenceGroup } from "@references/types";
import { Users } from "lucide-react";
import { useState } from "react";

type AddReferenceGroupProps = {
	groups: ReferenceGroup[];
	/** A callback to hide the dialog */
	onHide: () => void;
	refId: string;
	/** Indicates whether the dialog for adding a reference group is visible */
	show: boolean;
};

/**
 * Displays a dialog for adding a reference member
 */
export default function AddReferenceGroup({
	groups,
	onHide,
	refId,
	show,
}: AddReferenceGroupProps) {
	const mutation = useAddReferenceMember(refId, "group");
	const [term, setTerm] = useState("");
	const { data, isPending, isError, isFetchingNextPage, fetchNextPage } =
		useInfiniteFindGroups(25, term);

	function onOpenChange() {
		onHide();
		setTerm("");
	}

	if (isError && !data) {
		return (
			<Dialog open={show} onOpenChange={onOpenChange}>
				<DialogContent>
					<DialogTitle>Add Group</DialogTitle>
					<QueryError noun="groups" />
				</DialogContent>
			</Dialog>
		);
	}

	if (isPending) {
		return null;
	}

	const groupIds = groups.map((g) => g.id);
	const items = data.pages.flatMap((page) => page.items);
	const filteredItems = items.filter((item) => !groupIds.includes(item.id));

	function renderRow(item) {
		return (
			<SelectBoxGroupSection
				key={item.id}
				className="flex items-center [&_.InitialIcon]:mr-1"
				onClick={() => mutation.mutate({ id: item.id })}
			>
				<InitialIcon size="md" handle={item.name} />
				{item.name}
			</SelectBoxGroupSection>
		);
	}

	return (
		<Dialog open={show} onOpenChange={onOpenChange}>
			<DialogContent>
				<DialogTitle>Add Group</DialogTitle>
				<Toolbar>
					<InputSearch
						name="search"
						aria-label="Search groups"
						value={term}
						onChange={(e) => setTerm(e.target.value)}
					/>
				</Toolbar>
				{filteredItems.length ? (
					<CompactScrollList
						className="border border-gray-300 rounded overflow-y-auto h-80"
						fetchNextPage={fetchNextPage}
						isFetchingNextPage={isFetchingNextPage}
						isPending={isPending}
						items={filteredItems}
						renderRow={renderRow}
					/>
				) : (
					<BoxGroup>
						<BoxGroupSection>
							<Empty className="py-12">
								<EmptyMedia className="text-gray-400">
									<Users size={40} strokeWidth={1.5} />
								</EmptyMedia>
								<EmptyTitle>No other groups found</EmptyTitle>
								<EmptyDescription>
									There are no other groups to add.
								</EmptyDescription>
							</Empty>
						</BoxGroupSection>
					</BoxGroup>
				)}
			</DialogContent>
		</Dialog>
	);
}
