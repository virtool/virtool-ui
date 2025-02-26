/**
 * Check whether the passed object has a given property.
 *
 * @param obj the object to inspect
 * @param property the property name to look for
 */
export function objectHasProperty(obj: object, property: string): boolean {
    return Object.prototype.hasOwnProperty.call(obj, property);
}

/**
 * Capitalize and return the passed string.
 *
 * @param str the string to capitalize
 */
export function capitalize(str: string): string {
    return str ? str.charAt(0).toUpperCase() + str.slice(1).toLowerCase() : "";
}
