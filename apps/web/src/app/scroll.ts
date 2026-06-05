/** The id of the single scrolling content container in the authenticated shell. */
export const CONTENT_SCROLL_ID = "content-scroll";

/** Returns the authenticated shell's scrolling content container, if mounted. */
export function getContentScrollElement(): HTMLElement | null {
	if (typeof document === "undefined") {
		return null;
	}
	return document.getElementById(CONTENT_SCROLL_ID);
}
