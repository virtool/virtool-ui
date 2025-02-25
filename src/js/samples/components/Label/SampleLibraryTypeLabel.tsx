import { LibraryType } from "@samples/types";
import React from "react";
import styled from "styled-components";
import { getFontSize, getFontWeight } from "../../../app/theme";
import { Icon } from "../../../base";
import { getLibraryTypeDisplayName } from "../../utils";
import { BaseSampleLabel } from "./BaseSampleLabel";

const StyledSampleLibraryTypeLabel = styled(BaseSampleLabel)`
    background-color: #e5e7eb;
    font-size: ${getFontSize("sm")};
    font-weight: ${getFontWeight("thick")};
    padding: 2px 7px 2px 5px;

    i.fas {
        margin-right: 3px;
    }
`;

type SampleLibraryTypeLabelProps = {
    /** The samples library type */
    libraryType: LibraryType;
};

/**
 * Displays the library type associated with the sample
 */
export function SampleLibraryTypeLabel({
    libraryType,
}: SampleLibraryTypeLabelProps) {
    return (
        <StyledSampleLibraryTypeLabel>
            <Icon name={libraryType === "amplicon" ? "barcode" : "dna"} />
            <span>{getLibraryTypeDisplayName(libraryType)}</span>
        </StyledSampleLibraryTypeLabel>
    );
}
