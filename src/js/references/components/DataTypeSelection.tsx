import React from "react";
import styled from "styled-components";
import { SelectBox } from "../../base";
import { ReferenceDataType } from "../types";

const SelectBoxContainer = styled.div`
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-gap: ${props => props.theme.gap.column};
`;

type DataTypeSelectionProps = {
    /** A callback function to handle data type selection */
    onSelect: (dataType: ReferenceDataType) => void;
    /** The selected data type */
    dataType: ReferenceDataType;
};

/**
 * Form input field for data type selection
 */
export function DataTypeSelection({ onSelect, dataType }: DataTypeSelectionProps) {
    return (
        <div>
            <label>Data Type</label>
            <SelectBoxContainer>
                <SelectBox onClick={() => onSelect("genome")} active={dataType === "genome"}>
                    <div>Genome</div>
                    <span>Whole genomes for mapping-based detection</span>
                </SelectBox>
                <SelectBox onClick={() => onSelect("barcode")} active={dataType === "barcode"}>
                    <div>Barcode</div>
                    <span>Target sequences for barcode analysis</span>
                </SelectBox>
            </SelectBoxContainer>
        </div>
    );
}
