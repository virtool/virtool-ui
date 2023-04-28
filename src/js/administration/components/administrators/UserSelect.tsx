import React from "react";
import styled from "styled-components";
import { getFontSize, getFontWeight } from "../../../app/theme";
import { ComboBox, InitialIcon } from "../../../base";

import { User } from "../../../users/types";

const UserItem = styled.div`
    font-size: ${getFontSize("md")};
    font-weight: ${getFontWeight("thick")};
    display: flex;
    align-items: center;
    position: relative;
    user-select: none;

    text-transform: capitalize;

    span {
        margin-left: 5px;
    }
`;

const specialText = user => {
    return (
        <UserItem>
            <InitialIcon handle={user.handle} size="md" />
            <span>{user.handle}</span>
        </UserItem>
    );
};

const toString = (user: User) => user?.handle;

type UserSelectProps = {
    term: string;
    users: Array<User>;
    value: User;
    onChange: (value: string) => void;
    onTermChange: (value: string) => void;
};
export const UserSelect = ({ term, users, value, onChange, onTermChange }: UserSelectProps) => {
    return (
        <ComboBox
            items={users}
            term={term}
            selectedItem={value || null}
            renderRow={specialText}
            itemToString={toString}
            onFilter={onTermChange}
            onChange={onChange}
        />
    );
};
