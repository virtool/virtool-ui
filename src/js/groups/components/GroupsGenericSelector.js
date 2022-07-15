import React, { useState, useEffect } from "react";
import { GroupComponentsContainer } from "./SelectedGroup";
import { map } from "lodash";

export const GroupsGenericSelector = ({ items, render }) => {
    return (
        <div>
            <div>Members</div>
            <GroupComponentsContainer>{render(items)}</GroupComponentsContainer>
        </div>
    );
};
