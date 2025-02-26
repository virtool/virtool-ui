import React, { useCallback } from "react";
import styled from "styled-components";
import { getFontSize, getFontWeight } from "../../../app/theme";
import { Icon, SelectBoxGroupSection } from "../../../base";
import { byteSize } from "@utils/utils";

const ReadIcon = styled.span`
    font-size: 24px;
    margin-right: 15px;
`;

const ReadTitle = styled.div`
    align-items: center;
    display: flex;

    strong {
        font-weight: ${getFontWeight("thick")};
    }
`;

const StyledReadOrientation = styled.div`
    background-color: ${(props) => props.theme.color.blueDark};
    border: 2px solid ${(props) => props.theme.color.white};
    border-radius: ${(props) => props.theme.borderRadius.md};
    color: ${(props) => props.theme.color.white};
    font-size: ${getFontSize("sm")};
    font-weight: ${getFontWeight("bold")};
    text-align: center;
    width: 48px;
`;

const StyledReadSelectorItem = styled(SelectBoxGroupSection)`
    align-items: center;
    display: flex;
    justify-content: space-between;
    user-select: none;
`;

type ReadSelectorItemProps = {
    /** The unique identifier */
    id: number;
    /** The name of the file */
    name: string;
    /** The index number of the file */
    index: number;
    /** The size of the file in bytes */
    size: number;
    /** The selected files */
    selected?: boolean;
    /** A callback function to handle file selection */
    onSelect: (id: number) => void;
};

/**
 * A condensed file for use in a list of read files
 */
export default function ReadSelectorItem({
    id,
    index,
    name,
    selected = false,
    size,
    onSelect,
}: ReadSelectorItemProps) {
    const select = useCallback(() => {
        onSelect(id);
    }, []);

    return (
        <StyledReadSelectorItem onClick={select} active={selected}>
            <ReadTitle>
                <ReadIcon>
                    <Icon name="file" />
                </ReadIcon>
                <div>
                    <strong>{name}</strong>
                    <div>{byteSize(size)}</div>
                </div>
            </ReadTitle>
            {selected ? (
                <StyledReadOrientation>
                    {index === 0 ? "LEFT" : "RIGHT"}
                </StyledReadOrientation>
            ) : null}
        </StyledReadSelectorItem>
    );
}
