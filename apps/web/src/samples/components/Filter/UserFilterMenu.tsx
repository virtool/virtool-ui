import { useFetchAccount } from "@account/queries";
import DropdownMenuContent from "@base/DropdownMenuContent";
import DropdownMenuItem from "@base/DropdownMenuItem";
import DropdownMenuRadioGroup from "@base/DropdownMenuRadioGroup";
import DropdownMenuRadioItem from "@base/DropdownMenuRadioItem";
import DropdownMenuSeparator from "@base/DropdownMenuSeparator";
import Input from "@base/Input";
import QueryError from "@base/QueryError";
import { useListUsers } from "@users/queries";
import { useState } from "react";

type UserFilterMenuProps = {
	/** Clears the selected user. */
	onClear: () => void;

	/** Selects the user that samples are filtered by. */
	onSelect: (userId: number) => void;

	/** The id of the selected user. */
	selected?: number;
};

/**
 * A dropdown menu for selecting the user whose samples are shown
 */
export default function UserFilterMenu({
	onClear,
	onSelect,
	selected,
}: UserFilterMenuProps) {
	const { data: users, isError, isPending } = useListUsers();
	const { data: account } = useFetchAccount();
	const [term, setTerm] = useState("");

	const matches = (users ?? []).filter((user) =>
		user.handle.toLowerCase().includes(term.toLowerCase()),
	);

	// Filtering to your own samples is the common case, so lift yourself out of
	// the alphabetical list.
	const self = matches.find((user) => user.id === account?.id);
	const others = matches.filter((user) => user.id !== account?.id);

	return (
		<DropdownMenuContent className="w-64">
			<div className="sticky top-0 bg-white p-1">
				<Input
					aria-label="Filter users"
					onChange={(e) => setTerm((e.target as HTMLInputElement).value)}
					// The menu's typeahead would otherwise swallow every keystroke
					// and move focus onto the matching user.
					onKeyDown={(e) => e.stopPropagation()}
					placeholder="Handle"
					value={term}
				/>
			</div>
			{isError && !users ? (
				<QueryError noun="users" />
			) : isPending ? (
				<p className="px-2 py-1.5 text-gray-500 text-sm">Loading users...</p>
			) : matches.length === 0 ? (
				<p className="px-2 py-1.5 text-gray-500 text-sm">No users found.</p>
			) : (
				<DropdownMenuRadioGroup
					onValueChange={(value) => onSelect(Number(value))}
					value={selected === undefined ? "" : String(selected)}
				>
					{self && (
						<>
							<DropdownMenuRadioItem value={String(self.id)}>
								<span className="flex-grow truncate">{self.handle}</span>
								<span className="shrink-0 pl-2 text-gray-500 text-sm">You</span>
							</DropdownMenuRadioItem>
							{others.length > 0 && <DropdownMenuSeparator />}
						</>
					)}
					{others.map((user) => (
						<DropdownMenuRadioItem key={user.id} value={String(user.id)}>
							<span className="flex-grow truncate">{user.handle}</span>
						</DropdownMenuRadioItem>
					))}
				</DropdownMenuRadioGroup>
			)}
			{selected !== undefined && (
				<>
					<DropdownMenuSeparator />
					<DropdownMenuItem color="blue" onSelect={onClear}>
						Clear
					</DropdownMenuItem>
				</>
			)}
		</DropdownMenuContent>
	);
}
