/**
 * General utility constants and functions.
 *
 */
import clsx from "clsx";
import Fuse from "fuse.js";
import { capitalize, forEach, get, replace, sampleSize, split, startCase, upperFirst } from "lodash-es";
import numbro from "numbro";
import { twMerge } from "tailwind-merge";

/**
 * A string containing all alphanumeric digits in both cases.
 *
 * @type {string}
 */
export const alphanumeric = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

/**
 * Converts an integer in bytes to a nicely formatted string (eg. 10.2 GB).
 *
 * @func
 * @param bytes {number}
 * @returns {string}
 */
export function byteSize(bytes, spaceSeparated = false) {
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
 * Create a URL object given a find term or a page number. Both parameters are optional.
 *
 * @func
 * @param term {string} a search string to place in the URL
 * @returns {URL}
 */
export function createFindURL(term) {
    const url = new window.URL(window.location);

    if (term !== undefined) {
        if (term) {
            url.searchParams.set("find", term);
        } else {
            url.searchParams.delete("find");
        }
    }

    return url;
}

/**
 * Create a Fuse object.
 *
 */
export function createFuse(collection, keys, id) {
    return new Fuse(collection, {
        keys,
        id,
        minMatchCharLength: 1,
        threshold: 0.3,
        tokenize: true,
    });
}

/**
 * Create a random string of {@link length} from [alphanumeric]{@link module:utils.alphanumeric}.
 *
 * @func
 * @param length {number} the length of string to return
 */
export function createRandomString(length = 8) {
    return sampleSize(alphanumeric, length).join("");
}

/**
 * Download a file with the given ``filename`` with the given ``text`` content. This allows downloads of
 * dynamically generated files.
 *
 * @func
 * @param filename
 * @param text
 */
export function followDynamicDownload(filename, text) {
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
 *
 * @func
 * @param isolate {object}
 * @returns {string}
 */
export function formatIsolateName(isolate) {
    const sourceType = get(isolate, "source_type") || get(isolate, "sourceType");
    const sourceName = get(isolate, "source_name") || get(isolate, "sourceName");

    return sourceType === "unknown" ? "Unnamed" : `${capitalize(sourceType)} ${sourceName}`;
}

/**
 * Transforms a plain workflow ID (eg. pathoscope_bowtie) to a human-readable name (eg. PathoscopeBowtie).
 *
 * @func
 * @param workflow {string} plain workflow ID
 * @returns {string} human-readable workflow name
 */
export function getWorkflowDisplayName(workflow) {
    return get(workflowDisplayNames, workflow, startCase(workflow));
}

/**
 * Report a captured error to Sentry for logging.
 *
 * @param action - Redux action that contains the error
 */

export function reportAPIError(action) {
    window.captureException(action.payload.error);
}

export function routerLocationHasState(state, key, value) {
    return (
        Boolean(state.router.location.state) &&
        (value ? state.router.location.state[key] === value : Boolean(state.router.location.state[key]))
    );
}

export function getTargetChange(target) {
    return {
        name: target.name,
        value: target.value,
        error: `error${upperFirst(target.name)}`,
    };
}

/**
 * Object that maps workflow IDs to human-readable names.
 *
 * @type {object}
 */
export const workflowDisplayNames = {
    aodp: "AODP",
    create_sample: "Create Sample",
    create_subtraction: "Create Subtraction",
    nuvs: "NuVs",
    pathoscope_bowtie: "Pathoscope",
    pathoscope_snap: "Pathoscope",
    build_index: "Build Index",
};

export function toThousand(number) {
    return numbro(number).format({ thousandSeparated: true });
}

/**
 * Converts a ``number`` to a scientific notation string.
 *
 * @func
 * @param {number} number
 * @returns {string}
 */
export function toScientificNotation(number) {
    if (number < 0.01 || number > 1000) {
        const [coefficient, exponent] = split(number.toExponential(), "e");
        return `${numbro(coefficient).format("0.00")}E${replace(exponent, "+", "")}`;
    }

    return numbro(number).format("0.000");
}

/**
 *  Clears session storage and reloads the page.
 *
 *  This is used to clear the session storage when the user logs out or the token expires.
 *
 *  @func
 *  @returns {undefined}
 */
export function resetClient() {
    window.sessionStorage.clear();
    window.location.reload();
}

/**
 * Stores the passed object in local storage at key given
 *
 * @func
 * @param {string} key
 * @param {data} object
 * @returns {undefined}
 */
export function setSessionStorage(key, data) {
    try {
        window.sessionStorage.setItem(key, JSON.stringify(data));
    } catch (e) {
        //continue running regardless of error
    }
}

/**
 * Return the object stored in session storage at the given key
 *
 * @func
 * @param {string} key
 * @returns {object}
 */
export function getSessionStorage(key) {
    try {
        return JSON.parse(window.sessionStorage.getItem(key));
    } catch (e) {
        return null;
    }
}

/**
 * Return a search string with specified passed parameters updated
 *
 * @func
 * @param {string} search URL ready search string to be updated
 * @param {object} params
 * @returns {string}
 */
export function updateSearchString(search, params) {
    const searchParams = new URLSearchParams(search);

    forEach(params, (value, key) => {
        searchParams.set(key, value);
    });

    return searchParams.toString();
}

/**
 * Return a string with the tailwind classnames merged
 *
 * @param args - The styles from the classnames being merged
 * @returns {string}
 */
export function cn(...args) {
    return twMerge(clsx(args));
}
