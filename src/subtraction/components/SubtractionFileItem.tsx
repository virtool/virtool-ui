import Attribution from "@base/Attribution";
import SelectBoxGroupSection from "@base/SelectBoxGroupSection";
import type { UserNested } from "@users/types";

type SubtractionFileItemProps = {
	/** Whether the file is selected */
	active: boolean;
	/** Error message to be displayed */
	error: string;
	/** The unique identifier */
	id: number;
	/** The name of the file */
	name: string;
	/** A callback function to handle file selection */
	onClick: (selected: number[]) => void;
	/** The iso formatted date of upload */
	uploaded_at: string;
	/** The user who created the file */
	user: UserNested;
};

/**
 * A condensed file for use in a list of subtraction uploads
 */
export function SubtractionFileItem({
	active,
	error,
	id,
	name,
	onClick,
	uploaded_at,
	user,
}: SubtractionFileItemProps) {
	return (
		<SelectBoxGroupSection
			active={active}
			className="flex justify-between"
			onClick={() => onClick([id])}
		>
			<strong>{name}</strong>
			<Attribution user={user.handle} time={uploaded_at} />
		</SelectBoxGroupSection>
	);
}
