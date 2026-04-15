import BoxGroupSection from "@base/BoxGroupSection";
import Button from "@base/Button";
import InitialIcon from "@base/InitialIcon";

function MemberItemIcon({ handle }) {
	return (
		<div className="flex items-center pr-2">
			<InitialIcon handle={handle} size="lg" />
		</div>
	);
}

export type MemberItemProps = {
	/** Whether the current user can modify members in the list */
	canModify: boolean;

	/** The unique identifier for the member */
	id: number | string;

	/** The handle (user) or name of the member user or group */
	handleOrName: string;

	/** Callback to initiate editing the member */
	onEdit: (id: number | string) => void;

	/** Callback to initiate removing the member */
	onRemove: (id: number | string) => void;
};

/**
 * A condensed user or group item for display in the reference members list
 */
export default function MemberItem({
	canModify,
	handleOrName,
	id,
	onEdit,
	onRemove,
}: MemberItemProps) {
	return (
		<BoxGroupSection className="flex items-center">
			<MemberItemIcon handle={handleOrName} />
			{handleOrName}
			{canModify && (
				<span className="flex items-center gap-1 ml-auto">
					<Button onClick={() => onEdit(id)} size="small">
						Edit
					</Button>
					<Button onClick={() => onRemove(id)} size="small" color="red">
						Remove
					</Button>
				</span>
			)}
		</BoxGroupSection>
	);
}
