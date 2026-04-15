import ComboBox from "@base/ComboBox";
import InitialIcon from "@base/InitialIcon";
import type { User } from "@users/types";

function renderRow(user) {
	return (
		<div
			className="relative flex items-center text-sm font-medium capitalize select-none"
			role="presentation"
			aria-label={user.handle}
		>
			<InitialIcon handle={user.handle} size="md" />
			<span className="ml-1">{user.handle}</span>
		</div>
	);
}

function userToString(user: User) {
	return user?.handle;
}

type UserSelectProps = {
	term: string;
	users: Array<User>;
	value: User;
	onChange: (value: string) => void;
	onTermChange: (value: string) => void;
	id: string;
};

export default function AdministratorUserSelect({
	term,
	users,
	value,
	onChange,
	onTermChange,
	id,
}: UserSelectProps) {
	return (
		<ComboBox
			items={users}
			term={term}
			selectedItem={value || null}
			renderRow={renderRow}
			itemToString={userToString}
			onFilter={onTermChange}
			onChange={onChange}
			id={id}
		/>
	);
}
