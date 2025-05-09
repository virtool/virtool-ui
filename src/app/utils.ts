/**
 * General utility constants and functions.
 */
import clsx, { ClassValue } from "clsx";
import { formatDuration, intervalToDuration } from "date-fns";
import { get, sampleSize, startCase } from "lodash-es";
import numbro from "numbro";
import { twMerge } from "tailwind-merge";
import { capitalize } from "./common";

/**
 * A string containing all alphanumeric digits in both cases.
 */
const alphanumeric =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

/**
 * Convert an integer in bytes to a nicely formatted string (eg. 10.2 GB).
 */
export function byteSize(
    bytes: number,
    spaceSeparated: boolean = false,
): string {
    if (bytes) {
        return numbro(bytes).format({
            output: "byte",
            base: "decimal",
            mantissa: 1,
            spaceSeparated: spaceSeparated ? spaceSeparated : false,
        });
    }

    return "0.0B";
}

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
    const sourceType =
        get(isolate, "source_type") || get(isolate, "sourceType");
    const sourceName =
        get(isolate, "source_name") || get(isolate, "sourceName");

    return sourceType === "unknown"
        ? "Unnamed"
        : `${capitalize(sourceType)} ${sourceName}`;
}

/**
 * Return an English string describing a duration given a number of seconds.
 */
export function formatRoundedDuration(seconds: number) {
    const duration = intervalToDuration({ start: 0, end: seconds * 1000 });

    const units = [
        "years",
        "months",
        "weeks",
        "days",
        "hours",
        "minutes",
        "seconds",
    ];

    for (const unit of units) {
        if (duration[unit]) {
            return formatDuration({ [unit]: duration[unit] }, { zero: false });
        }
    }

    return "less than a second";
}

/**
 * Object that maps workflow IDs to human-readable names.
 */
export const workflowDisplayNames = {
    create_sample: "Create Sample",
    create_subtraction: "Create Subtraction",
    iimi: "Iimi",
    nuvs: "Nuvs",
    pathoscope: "Pathoscope",
    pathoscope_bowtie: "Pathoscope",
    pathoscope_snap: "Pathoscope",
    build_index: "Build Index",
};

/**
 * Transforms a plain workflow ID (eg. pathoscope_bowtie) to a human-readable name (eg. PathoscopeBowtie).
 *
 * @func
 * @param workflow plain workflow ID
 * @returns human-readable workflow name
 */
export function getWorkflowDisplayName(workflow: string): string {
    return get(workflowDisplayNames, workflow, startCase(workflow));
}

export function toThousand(num: number): string {
    return numbro(num).format({ thousandSeparated: true });
}

/**
 * Converts a ``number`` to a scientific notation string.
 */
export function toScientificNotation(num: number): string {
    if (num < 0.01 || num > 1000) {
        const [coefficient, exponent] = num.toExponential().split("e");
        return `${numbro(coefficient).format("0.00")}E${exponent.replace("+", "")}`;
    }

    return numbro(num).format("0.000");
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

/**
 * Stores the passed object in local storage at key given
 */
export function setSessionStorage(key: string, data: object) {
    try {
        window.sessionStorage.setItem(key, JSON.stringify(data));
    } catch (error) {
        console.warn(
            `Failed to save data to sessionStorage for key "${key}":`,
            error,
        );
    }
}

/**
 * Return the object stored in session storage at the given key
 */
export function getSessionStorage(key: string): object {
    const item = window.sessionStorage.getItem(key);

    if (item === null) {
        return null;
    }

    return JSON.parse(item);
}

/**
 * Return a string with the tailwind classnames merged
 *
 * @param args - the styles from the classnames being merged
 * @returns a combined class string
 */
export function cn(...args: ClassValue[]): string {
    return twMerge(clsx(args));
}
