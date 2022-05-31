import React from "react";
import { MultiSelector } from "../../../base/MultiSelector";
import { Input, Icon, BoxGroupSection } from "../../../base";
import { AllSelectedBox } from "./WorkflowSelector";
import { NoneFoundBox } from "../../../base/NoneFound";
import { Link } from "react-router-dom";
import styled from "styled-components";

const SearchbarContainer = styled.div`
    position: relative;
    display: flex;
    padding: 10px;
    border-bottom: 1px solid;
    border-color: ${props => props.theme.color.greyLight};
    height: 60px;
`;

const IconContainer = styled.div`
    position: absolute;
    margin-top: 10px;
    right 20px;
`;

const ItemComponentsContainer = styled.div`
    overflow-y: auto;
    max-height: 160px;
    height: 160px;
    background-color: ${props => props.theme.color.greyHover};
`;

const NoneFoundItem = styled.div`
    background-color: white;
`;

const NoneFoundContainer = styled(BoxGroupSection)`
    border-radius: ${props => props.theme.borderRadius.sm};
    height: 220px;
    border: 1px solid;
    border-color: ${props => props.theme.color.greyLight};
    background-color: ${props => props.theme.color.greyHover};
`;

const CreateNoneFoundBox = ({ type, link }) => (
    <NoneFoundContainer>
        <NoneFoundItem>
            <NoneFoundBox noun={type}>
                <Link to={link}> Create one</Link>.
            </NoneFoundBox>
        </NoneFoundItem>
    </NoneFoundContainer>
);

export const AnalysesObjectSelector = ({
    onChange,
    analysesType,
    link,
    analysesTypeOptions,
    selectedAnalysesTypeObjects,
    selectedAnalysesTypeIds,
    selectedAnalysesComponents,
    term,
    setTerm,
    error
}) => {
    let analysesTypeSelector;

    if (!analysesTypeOptions.length) {
        analysesTypeSelector = <CreateNoneFoundBox type={analysesType} link={link} />;
    } else if (analysesTypeOptions.length === selectedAnalysesTypeObjects.length) {
        analysesTypeSelector = <AllSelectedBox type={`${analysesType}`} />;
    } else {
        analysesTypeSelector = (
            <MultiSelector
                noun={`${analysesType}`}
                noOverflow
                selected={selectedAnalysesTypeIds}
                onChange={onChange}
                error={error && "Reference(s) must be selected"}
            >
                <SearchbarContainer>
                    <Input
                        value={term}
                        placeholder={`Filter ${analysesType}`}
                        aria-label={`Filter ${analysesType}`}
                        onChange={e => setTerm(e.target.value)}
                        autoFocus
                    />
                    <IconContainer>
                        <Icon name="times fa-fw" onClick={() => setTerm("")} aria-label="clear" />
                    </IconContainer>
                </SearchbarContainer>
                <ItemComponentsContainer>{selectedAnalysesComponents}</ItemComponentsContainer>
            </MultiSelector>
        );
    }

    return analysesTypeSelector;
};
