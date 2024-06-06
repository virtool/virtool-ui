import { includes } from "lodash-es";

export function excludePaths(paths = []) {
    return function (match, location) {
        if (includes(paths, location.pathname)) {
            return false;
        }

        return Boolean(match);
    };
}
