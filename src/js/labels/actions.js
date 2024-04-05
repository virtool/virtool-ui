import { createAction } from "@reduxjs/toolkit";
import { LIST_LABELS } from "../app/actionTypes";

/**
 * Returns action that can trigger an API call to get sample labels.
 *
 * @func
 * @returns {object}
 */
export const listLabels = createAction(LIST_LABELS.REQUESTED);
