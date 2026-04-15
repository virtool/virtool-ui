import BoxGroup from "@base/BoxGroup";
import CompactScrollList from "@base/CompactScrollList";
import { Dialog, DialogContent, DialogTitle } from "@base/Dialog";
import InitialIcon from "@base/InitialIcon";
import InputSearch from "@base/InputSearch";
import NoneFoundSection from "@base/NoneFoundSection";
import SelectBoxGroupSection from "@base/SelectBoxGroupSection";
import Toolbar from "@base/Toolbar";
import { useInfiniteFindGroups } from "@groups/queries";
import { useAddReferenceMember } from "@references/queries";
import type { ReferenceGroup } from "@references/types";
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
	const { data, isPending, isFetchingNextPage, fetchNextPage } =
		useInfiniteFindGroups(25, term);

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

	function onOpenChange() {
		onHide();
		setTerm("");
	}

	return (
		<Dialog open={show} onOpenChange={onOpenChange}>
			<DialogContent>
				<DialogTitle>Add Group</DialogTitle>
				<Toolbar>
					<InputSearch
						name="search"
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
						<NoneFoundSection noun="other groups" />
					</BoxGroup>
				)}
			</DialogContent>
		</Dialog>
	);
}
