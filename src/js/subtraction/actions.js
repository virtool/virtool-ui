import { createAction } from "@reduxjs/toolkit";
import { SHORTLIST_SUBTRACTIONS } from "../app/actionTypes";

export const shortlistSubtractions = createAction(SHORTLIST_SUBTRACTIONS.REQUESTED);
