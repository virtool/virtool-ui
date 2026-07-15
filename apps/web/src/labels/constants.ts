/**
 * The colour a label falls back to when none is chosen — Tailwind `gray-300`.
 *
 * Shared by the client-side label form (its initial value) and the server-side
 * `normalizeColor` fallback (for rows with a null colour) so the two cannot
 * drift apart.
 */
export const DEFAULT_LABEL_COLOR = "#D1D5DB";
