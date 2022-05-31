import React from "react";
import { MultiSelectorList } from "../../../base/MultiSelector";
import { BoxGroupSection, Icon } from "../../../base";
import styled from "styled-components";
import { AllOrNoneSelectedBox } from "./WorkflowSelector";

const SelectedContainer = styled(MultiSelectorList)`
    ${props => (props.error ? `border-color: ${props.theme.color.red};` : "")};
    max-height: ${props => (props.type === "workflows" ? "80px" : "220px")};
    height: ${props => (props.type === "workflows" ? "80px" : "220px")};
    overflow-y: ${props => (props.type === "workflows" ? "hidden" : "auto")};
    background-color: ${props => props.theme.color.greyHover};
`;

const SelectedItemsContainer = styled.div`
    background-color: white;
    outline: 1px solid;
    outline-color: ${props => props.theme.color.greyLight};
`;

const SelectedItem = styled(BoxGroupSection)`
    display: flex;
    flex-direction: row;
`;

const FormattedIcon = styled(Icon)`
    margin-left: auto;
`;

export const SelectedAnalysesObject = ({ selected, resourceType, clearSelected, formattedLine }) => {
    const formattedSelected = selected.map(item => {
        const key = item.id ? item.id : item;
        return (
            <SelectedItem key={key} value={key}>
                {formattedLine(item)}

                <FormattedIcon
                    aria-label={`remove selected ${resourceType}`}
                    name="times fa-fw"
                    onClick={() => clearSelected(item)}
                />
            </SelectedItem>
        );
    });
    let analysesTypeSelected;

    if (!selected.length) {
        analysesTypeSelected = (
            <AllOrNoneSelectedBox requireBorder={true} type={resourceType}>
                No {resourceType} selected
            </AllOrNoneSelectedBox>
        );
    } else {
        analysesTypeSelected = <SelectedItemsContainer>{formattedSelected}</SelectedItemsContainer>;
    }

    return <SelectedContainer type={resourceType}>{analysesTypeSelected}</SelectedContainer>;
};
