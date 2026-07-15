/**
 * Name of the error the server auth middleware throws when a request has no
 * valid session. Shared so the server that throws it, the client serialization
 * adapter that carries it across the boundary, and the query retry guard that
 * reads it all agree on one string.
 */
export const UNAUTHORIZED_ERROR_NAME = "UnauthorizedError";

/**
 * Name of the error the server auth middleware throws when the session user
 * lacks the required administrator role.
 */
export const FORBIDDEN_ERROR_NAME = "ForbiddenError";
