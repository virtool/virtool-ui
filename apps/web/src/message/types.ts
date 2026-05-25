import type { UserNested } from "@users/types";

/** Allowed colors for an instance message banner. */
export type MessageColor =
	| "red"
	| "yellow"
	| "blue"
	| "purple"
	| "orange"
	| "grey";

/** An administrative instance message displayed to all logged-in users. */
export type Message = {
	active: boolean;
	color: MessageColor;
	created_at: string;
	id: number;
	message: string;
	updated_at: string;
	user: UserNested;
};
