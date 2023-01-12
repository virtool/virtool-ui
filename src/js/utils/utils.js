/**
 * General utility constants and functions.
 *
 */
import Fuse from "fuse.js";
import { capitalize, forEach, get, replace, sampleSize, split, startCase, upperFirst } from "lodash-es";
import numbro from "numbro";
import { getAccountAdministrator } from "../account/selectors";
import { getLocation, push } from "connected-react-router";

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
export const byteSize = (bytes, spaceSeparated) => {
    if (bytes) {
        return numbro(bytes).format({
            output: "byte",
            base: "decimal",
            mantissa: 1,
            spaceSeparated: spaceSeparated ? spaceSeparated : false
        });
    }

    return "0.0B";
};

/**
 * Create a URL object given a find term or a page number. Both parameters are optional.
 *
 * @func
 * @param term {string} a search string to place in the URL
 * @returns {URL}
 */
export const createFindURL = term => {
    const url = new window.URL(window.location);

    if (term !== undefined) {
        if (term) {
            url.searchParams.set("find", term);
        } else {
            url.searchParams.delete("find");
        }
    }

    return url;
};

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
        tokenize: true
    });
}

/**
 * Create a random string of {@link length} from [alphanumeric]{@link module:utils.alphanumeric}.
 *
 * @func
 * @param length {number} the length of string to return
 */
export const createRandomString = (length = 8) => sampleSize(alphanumeric, length).join("");

/**
 * Download the file at the given {@link path}.
 *
 * @func
 * @param path {string}
 */
export const followDownload = path => {
    const a = document.createElement("A");
    a.href = path;
    a.download = path.substr(path.lastIndexOf("/") + 1);
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
};

/**
 * Download a file with the given ``filename`` with the given ``text`` content. This allows downloads of
 * dynamically generated files.
 *
 * @func
 * @param filename
 * @param text
 */
export const followDynamicDownload = (filename, text) => {
    const a = document.createElement("a");
    a.href = `data:text/plain;charset=utf-8,${encodeURIComponent(text)}`;
    a.download = filename;

    a.style.display = "none";
    document.body.appendChild(a);

    a.click();

    document.body.removeChild(a);
};

/**
 * Return a formatted isolate name given an ``isolate`` object.
 *
 * @func
 * @param isolate {object}
 * @returns {string}
 */
export const formatIsolateName = isolate => {
    const sourceType = get(isolate, "source_type") || get(isolate, "sourceType");
    const sourceName = get(isolate, "source_name") || get(isolate, "sourceName");

    return sourceType === "unknown" ? "Unnamed" : `${capitalize(sourceType)} ${sourceName}`;
};

/**
 * Transforms a plain workflow ID (eg. pathoscope_bowtie) to a human-readable name (eg. PathoscopeBowtie).
 *
 * @func
 * @param workflow {string} plain workflow ID
 * @returns {string} human-readable workflow name
 */
export const getWorkflowDisplayName = workflow => get(workflowDisplayNames, workflow, startCase(workflow));

export const reportAPIError = action => window.captureException(action.payload.error);

export const routerLocationHasState = (state, key, value) =>
    Boolean(state.router.location.state) &&
    (value ? state.router.location.state[key] === value : Boolean(state.router.location.state[key]));

export const getTargetChange = target => ({
    name: target.name,
    value: target.value,
    error: `error${upperFirst(target.name)}`
});

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
    build_index: "Build Index"
};

export const toThousand = number => numbro(number).format({ thousandSeparated: true });

/**
 * Converts a ``number`` to a scientific notation string.
 *
 * @func
 * @param {number} number
 * @returns {string}
 */
export const toScientificNotation = number => {
    if (number < 0.01 || number > 1000) {
        const [coefficient, exponent] = split(number.toExponential(), "e");
        return `${numbro(coefficient).format("0.00")}E${replace(exponent, "+", "")}`;
    }

    return numbro(number).format("0.000");
};

export const checkAdminOrPermission = (state, permission) =>
    getAccountAdministrator(state) || state.account.permissions[permission];

/**
 * Stores the passed object in local storage at key given
 *
 * @func
 * @param {string} key
 * @param {data} object
 * @returns {undefined}
 */
export const setSessionStorage = (key, data) => {
    try {
        window.sessionStorage.setItem(key, JSON.stringify(data));
    } catch (e) {
        //continue running regardless of error
    }
};

/**
 * Return the object stored in session storage at the given key
 *
 * @func
 * @param {string} key
 * @returns {object}
 */
export const getSessionStorage = key => {
    try {
        return JSON.parse(window.sessionStorage.getItem(key));
    } catch (e) {
        return null;
    }
};

/**
 * Return a search string with specified passed parameters updated
 *
 * @func
 * @param {string} search URL ready search string to be updated
 * @param {object} params
 * @returns {string}
 */
export const updateSearchString = (search, params) => {
    const searchParams = new URLSearchParams(search);

    forEach(params, (value, key) => {
        searchParams.set(key, value);
    });

    return searchParams.toString();
};
