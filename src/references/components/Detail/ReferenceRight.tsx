import Checkbox from "@base/Checkbox";
import styled from "styled-components";

const descriptions = {
    build: "Can build new indexes for the reference.",
    modify: "Can modify reference properties and settings.",
    modify_otu: "Can modify OTU records in the reference.",
};

export const MemberRightCheckbox = styled(Checkbox)`
    margin-top: 1px;
`;

const MemberRightDescription = styled.div`
    display: flex;
    flex-direction: column;
    padding-left: 10px;

    small {
        padding-top: 3px;
    }
`;

const StyledMemberRight = styled.div`
    align-items: flex-start;
    display: flex;

    &:not(:last-child) {
        margin-bottom: 15px;
    }
`;

type MemberRightProps = {
    /** The name of the right */
    right: string;
    /** Indicates whether the right is currently enabled */
    enabled: boolean;
    /** A callback function to toggle the enabled state of the right */
    onToggle: (right: string, enabled: boolean) => void;
};

/**
 * Displays the rights for the group/user with options to modify the rights
 */
export function ReferenceRight({ right, enabled, onToggle }: MemberRightProps) {
    return (
        <StyledMemberRight>
            <MemberRightCheckbox
                checked={enabled}
                id={`ReferenceRightCheckbox-${right}`}
                key={right}
                onClick={() => onToggle(right, !enabled)}
            />
            <MemberRightDescription>
                <strong>{right}</strong>
                <small>{descriptions[right]}</small>
            </MemberRightDescription>
        </StyledMemberRight>
    );
}
