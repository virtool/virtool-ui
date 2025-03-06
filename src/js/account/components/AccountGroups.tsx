import { BoxGroupHeader, NoneFound } from "@/base";
import { borderRadius } from "@app/theme";
import BoxGroup from "@base/BoxGroup";
import { getBadgeOrLabelColor } from "@base/utils";
import { GroupMinimal } from "@groups/types";
import { map } from "lodash-es";
import React from "react";
import styled from "styled-components";

const AccountProfileGroups = styled.div`
    padding: 10px 10px 5px;
    overflow-y: auto;
    max-height: 157px;
`;

const StyledGroupItem = styled.span`
    align-items: center;
    background-color: ${getBadgeOrLabelColor};
    color: ${(props) => props.theme.color.white};
    border-radius: ${borderRadius.md};
    display: inline-flex;
    padding: 4px 8px;
    font-weight: bold;
    margin-right: 5px;
    margin-bottom: 5px;
`;

type AccountGroupsProps = {
    /** A list of groups associated with the account */
    groups: GroupMinimal[];
};

/**
 * Displays the groups associated with the account
 */
export default function AccountGroups({ groups }: AccountGroupsProps) {
    return (
        <BoxGroup>
            <BoxGroupHeader>
                <h2>Groups</h2>
            </BoxGroupHeader>
            <AccountProfileGroups>
                {groups.length ? (
                    map(groups, ({ id, name }) => (
                        <StyledGroupItem key={id}>{name}</StyledGroupItem>
                    ))
                ) : (
                    <NoneFound noun="groups" />
                )}
            </AccountProfileGroups>
        </BoxGroup>
    );
}
