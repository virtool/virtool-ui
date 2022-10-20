export const getGroups = state => state.groups.documents;
export const getActiveGroup = state => {
    if (state.groups.activeGroup) {
        return state.groups.activeGroup;
    } else if (state.groups.documents) {
        return [];
    }
    return null;
};
