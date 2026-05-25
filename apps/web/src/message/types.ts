import type { UserNested } from "@users/types";

/** Allowed colors for an instance message banner. Kept in lockstep with the
 *  `messagecolor` Postgres enum in `server/db/schema/messages.ts`. */
export const messageColors = [
	"red",
	"yellow",
	"blue",
	"purple",
	"orange",
	"grey",
] as const;

/** One of the allowed instance-message colors. */
export type MessageColor = (typeof messageColors)[number];

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
