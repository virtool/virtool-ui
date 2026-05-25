import type { UserNested } from "@users/types";

/** Allowed colors for an instance banner. Kept in lockstep with the
 *  `messagecolor` Postgres enum in `server/db/schema/messages.ts`. */
export const bannerColors = [
	"red",
	"yellow",
	"blue",
	"purple",
	"orange",
	"grey",
] as const;

/** One of the allowed banner colors. */
export type BannerColor = (typeof bannerColors)[number];

/** An administrative banner displayed to all logged-in users. */
export type Banner = {
	active: boolean;
	color: BannerColor;
	created_at: string;
	id: number;
	message: string;
	updated_at: string;
	user: UserNested;
};
