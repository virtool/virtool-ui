/**
 * General utility constants and functions.
 */
import { get, sampleSize, startCase } from "es-toolkit/compat";
import { capitalize } from "./common";

export { formatRoundedDuration } from "./date";

/**
 * A string containing all alphanumeric digits in both cases.
 */
const alphanumeric =
	"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

/**
 * Create a random string with the given length.
 *
 * @param length the length of string to return
 */
export function createRandomString(length = 8) {
	return sampleSize(alphanumeric, length).join("");
}

/**
 * Download a file with the given ``filename`` with the given ``text`` content. This allows downloads of
 * dynamically generated uploads.
 */
export function followDynamicDownload(filename: string, text: string) {
	const a = document.createElement("a");
	a.href = `data:text/plain;charset=utf-8,${encodeURIComponent(text)}`;
	a.download = filename;

	a.style.display = "none";
	document.body.appendChild(a);

	a.click();

	document.body.removeChild(a);
}

/**
 * Return a formatted isolate name given an ``isolate`` object.
 */
export function formatIsolateName(isolate: object): string {
	const sourceType = get(isolate, "source_type") || get(isolate, "sourceType");
	const sourceName = get(isolate, "source_name") || get(isolate, "sourceName");

	return sourceType === "unknown"
		? "Unnamed"
		: `${capitalize(sourceType || "")} ${sourceName || ""}`;
}

/**
 * Object that maps workflow IDs to human-readable names.
 */
export const workflowDisplayNames = {
	create_sample: "Create Sample",
	create_subtraction: "Create Subtraction",
	nuvs: "Nuvs",
	pathoscope: "Pathoscope",
	build_index: "Build Index",
};

/**
 * Transforms a plain workflow ID (eg. pathoscope) to a human-readable name (eg. Pathoscope).
 *
 * @func
 * @param workflow plain workflow ID
 * @returns human-readable workflow name
 */
export function getWorkflowDisplayName(workflow: string): string {
	return get(workflowDisplayNames, workflow, startCase(workflow));
}

/**
 *  Clears session storage and reloads the page.
 *
 *  This is used to clear the session storage when the user logs out or the token expires.
 */
export function resetClient() {
	window.sessionStorage.clear();
	window.location.reload();
}
