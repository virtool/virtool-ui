import React from "react";
import styled from "styled-components";
import { Attribution, SelectBoxGroupSection } from "../../base";
import { UserNested } from "../../users/types";

type StyledSubtractionFileItemProps = {
    error: string;
};

const StyledSubtractionFileItem = styled(SelectBoxGroupSection)<StyledSubtractionFileItemProps>`
    display: flex;

    ${Attribution} {
        margin-left: auto;
    }
`;

type SubtractionFileItemProps = {
    /** Whether the file is selected */
    active: boolean;
    /** Error message to be displayed */
    error: string;
    /** The unique identifier */
    id: string;
    /** The name of the file */
    name: string;
    /** A callback function to handle file selection */
    onClick: (selected: string[]) => void;
    /** The iso formatted date of upload */
    uploaded_at: string;
    /** The user who created the file */
    user: UserNested;
};

/**
 * A condensed file for use in a list of subtraction files
 */
export function SubtractionFileItem({ active, error, id, name, onClick, uploaded_at, user }: SubtractionFileItemProps) {
    return (
        <StyledSubtractionFileItem active={active} onClick={() => onClick([id])} error={error}>
            <strong>{name}</strong>
            <Attribution user={user.handle} time={uploaded_at} />
        </StyledSubtractionFileItem>
    );
}
