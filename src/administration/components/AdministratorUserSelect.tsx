import { getFontSize, getFontWeight } from "@app/theme";
import ComboBox from "@base/ComboBox";
import InitialIcon from "@base/InitialIcon";
import { User } from "@users/types";
import React from "react";
import styled from "styled-components";

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

function renderRow(user) {
    return (
        <UserItem aria-label={user.handle}>
            <InitialIcon handle={user.handle} size="md" />
            <span>{user.handle}</span>
        </UserItem>
    );
}

function toString(user: User) {
    return user?.handle;
}

type UserSelectProps = {
    term: string;
    users: Array<User>;
    value: User;
    onChange: (value: string) => void;
    onTermChange: (value: string) => void;
    id: string;
};

export default function AdministratorUserSelect({
    term,
    users,
    value,
    onChange,
    onTermChange,
    id,
}: UserSelectProps) {
    return (
        <ComboBox
            items={users}
            term={term}
            selectedItem={value || null}
            renderRow={renderRow}
            itemToString={toString}
            onFilter={onTermChange}
            onChange={onChange}
            id={id}
        />
    );
}
