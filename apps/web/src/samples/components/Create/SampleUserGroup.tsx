import InputGroup from "@base/InputGroup";
import InputLabel from "@base/InputLabel";
import InputSelect from "@base/InputSelect";
import type { GroupMinimal } from "@groups/types";

type SampleUserGroupProps = {
	selected: string;
	groups: GroupMinimal[];
	/** A callback function to handle the user group change */
	onChange: () => void;
};

/**
 * A dropdown showing the user groups and its options
 */
export default function SampleUserGroup({
	selected,
	groups,
	onChange,
}: SampleUserGroupProps) {
	const groupComponents = groups.map((group) => (
		<option className="capitalize" key={group.id} value={group.id}>
			{group.name}
		</option>
	));

	return (
		<InputGroup>
			<InputLabel htmlFor="userGroups">User Group</InputLabel>
			<InputSelect id="userGroups" value={selected} onChange={onChange}>
				<option key="none" value="none">
					None
				</option>
				{groupComponents}
			</InputSelect>
		</InputGroup>
	);
}
