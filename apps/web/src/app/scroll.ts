/** The id of the single scrolling content container in the authenticated shell. */
export const CONTENT_SCROLL_ID = "content-scroll";

/** Returns the authenticated shell's scrolling content container, if mounted. */
export function getContentScrollElement(): HTMLElement | null {
	if (typeof document === "undefined") {
		return null;
	}
	return document.getElementById(CONTENT_SCROLL_ID);
}

/**
 * The `scrollTo` behavior to use for programmatic scrolling, honoring the
 * user's `prefers-reduced-motion` setting. CSS media queries cannot flatten
 * scripted smooth scrolls, so callers must consult this instead of hardcoding
 * `"smooth"`.
 */
export function getScrollBehavior(): ScrollBehavior {
	if (
		typeof window !== "undefined" &&
		window.matchMedia?.("(prefers-reduced-motion: reduce)").matches
	) {
		return "auto";
	}
	return "smooth";
}
