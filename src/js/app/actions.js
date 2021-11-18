import { PUSH_STATE, SET_INITIAL_STATE } from "./actionTypes";

export const pushState = state => ({
    type: PUSH_STATE,
    state
});

export const setInitialState = ({ dev, first_user }) => ({
    type: SET_INITIAL_STATE,
    dev,
    first: first_user
});
