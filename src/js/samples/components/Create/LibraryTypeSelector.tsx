import PseudoLabel from "@base/PseudoLabel";
import SelectBox from "@base/SelectBox";
import React from "react";
import styled from "styled-components";

const LibraryTypeSelectBoxContainer = styled.div`
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    grid-gap: ${(props) => props.theme.gap.column};
`;

type LibraryTypeSelectorProps = {
    libraryType: string;
    /** A callback function to handle library type selection */
    onSelect: (libraryType: string) => void;
};

/**
 * Displays selections for library type in sample creation
 */
export default function LibraryTypeSelector({
    libraryType,
    onSelect,
}: LibraryTypeSelectorProps) {
    return (
        <>
            <PseudoLabel>Library Type</PseudoLabel>
            <LibraryTypeSelectBoxContainer>
                <SelectBox
                    onClick={() => onSelect("normal")}
                    active={libraryType === "normal"}
                >
                    <div>Normal</div>
                    <span>
                        Search against whole genome references using normal
                        reads.
                    </span>
                </SelectBox>
                <SelectBox
                    onClick={() => onSelect("srna")}
                    active={libraryType === "srna"}
                >
                    <div>sRNA</div>
                    <span>
                        Search against whole genome references using sRNA reads
                    </span>
                </SelectBox>
            </LibraryTypeSelectBoxContainer>
        </>
    );
}
