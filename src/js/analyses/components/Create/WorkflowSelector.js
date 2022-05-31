import { map } from "lodash-es";
import PropTypes from "prop-types";
import React from "react";
import { MultiSelector, MultiSelectorItem } from "../../../base/MultiSelector";
import { getWorkflowDisplayName } from "../../../utils/utils";
import styled from "styled-components";
import { SelectedAnalysesObject } from "./Selected";
import { getFontSize } from "../../../app/theme";
import { BoxGroupSection, BoxGroup } from "../../../base";

export const GridContainer = styled.div`
    display: grid;
    grid-template-columns: 49% 49%;
    column-gap: 2%;
    padding-bottom: 2px;
    alignitems: stretch;
`;

export const AllOrNoneSelectedBox = styled(BoxGroupSection)`
    display: flex;
    flex-direction: row;
    height: ${props => (props.type === "workflows" ? "40px" : "60px")};
    border-bottom: ${props => (props.requireBorder === true ? "1px solid" : "none")};
    border-color: ${props => props.theme.color.greyLight};
    align-items: center;
    background-color: white;
    margin-bottom: -1px;
`;

export const SelectorItem = styled(MultiSelectorItem)`
    background-color: white;
    outline: 1px solid;
    outline-color: ${props => props.theme.color.greyLight};
`;

const AllSelectedContainer = styled(BoxGroup)`
    max-height: ${props => (props.type === "workflows" ? "82px" : "222px")};
    height: ${props => (props.type === "workflows" ? "82px" : "222px")};
    background-color: ${props => props.theme.color.greyHover};
`;

const WorkflowItemsContainer = styled.div`
    background-color: ${props => props.theme.color.greyHover};
    max-height: 80px;
    height: 80px;
    overflow-y: hidden;
`;

const GridTitle = styled.div`
    display: inline-grid;
    row-gap: 2%;
`;

const LargeLabel = styled.label`
    font-size: ${getFontSize("lg")};
`;

export const AllSelectedBox = ({ type }) => (
    <AllSelectedContainer type={type}>
        <AllOrNoneSelectedBox requireBorder={true} type={"workflows"}>
            All {type} selected
        </AllOrNoneSelectedBox>
    </AllSelectedContainer>
);

export const CreateHeader = ({ analysesType }) => (
    <>
        <GridTitle>
            <LargeLabel>{analysesType}</LargeLabel>
        </GridTitle>
        <GridContainer>
            <label>Available</label>
            <label>Selected</label>
        </GridContainer>
    </>
);

export const getCompatibleWorkflows = (dataType, hasHmm) => {
    if (dataType === "barcode") {
        return ["aodp"];
    }

    if (hasHmm) {
        return ["pathoscope_bowtie", "nuvs"];
    }

    return ["pathoscope_bowtie"];
};

export const WorkflowSelector = ({ dataType, hasError, hasHmm, selectedWorkflows, onSelect }) => {
    const clearSelected = object => {
        onSelect(selectedWorkflows.filter(workflow => workflow !== object));
    };
    const compatibleWorkflows = getCompatibleWorkflows(dataType, hasHmm);

    const workflowItems = map(
        compatibleWorkflows,
        workflow =>
            !selectedWorkflows.includes(workflow) && (
                <SelectorItem key={workflow} name={workflow} value={workflow} requireCheckbox={false} id={workflow}>
                    {getWorkflowDisplayName(workflow)}
                </SelectorItem>
            )
    );

    let workflowSelector;

    if (compatibleWorkflows.length === selectedWorkflows.length) {
        workflowSelector = <AllSelectedBox type="workflows" />;
    } else {
        workflowSelector = (
            <MultiSelector
                error={hasError && "Workflow(s) must be selected"}
                id="workflow-selector"
                noun="workflows"
                selected={selectedWorkflows}
                onChange={onSelect}
                noOverflow
            >
                <WorkflowItemsContainer>{workflowItems}</WorkflowItemsContainer>
            </MultiSelector>
        );
    }

    return (
        <>
            <CreateHeader analysesType="Workflows" />
            <GridContainer>
                <div>{workflowSelector}</div>
                <SelectedAnalysesObject
                    selected={selectedWorkflows}
                    setSelected={onSelect}
                    resourceType="workflows"
                    clearSelected={clearSelected}
                    formattedLine={name => getWorkflowDisplayName(name)}
                />
            </GridContainer>
        </>
    );
};

WorkflowSelector.propTypes = {
    dataType: PropTypes.oneOf(["barcode", "genome"]),
    hasError: PropTypes.bool,
    hasHmm: PropTypes.bool,
    selectedWorkflows: PropTypes.arrayOf(PropTypes.string),
    onSelect: PropTypes.func.isRequired
};
