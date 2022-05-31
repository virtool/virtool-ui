import PropTypes from "prop-types";
import React from "react";
import styled from "styled-components";
import { Label } from "../../../base";
import { MultiSelectorItem } from "../../../base/MultiSelector";
import { useFuse } from "../../../base/hooks";
import { SelectedAnalysesObject } from "./Selected";
import { GridContainer, CreateHeader } from "./WorkflowSelector";
import { NameOverflowItem } from "./SubtractionSelector";
import { intersectionWith, difference } from "lodash-es";
import { AnalysesObjectSelector } from "./Selector";

const StyledReferenceSelectorItem = styled(MultiSelectorItem)`
    span:last-child {
        margin-left: auto;
    }
    background-color: white;
    outline: 1px solid;
    outline-color: ${props => props.theme.color.greyLight};
`;

const compare = (option1, option2) => {
    return option1.reference.id === option2;
};

const formattedLine = item => (
    <>
        <NameOverflowItem type="references">{item.reference.name}</NameOverflowItem>
        <span>
            Index Version <Label>{item.version}</Label>
        </span>
    </>
);

export const ReferenceSelectorItem = ({ id, name, version }) => (
    <StyledReferenceSelectorItem value={id} displayCheckbox={false}>
        <NameOverflowItem type="references">{name}</NameOverflowItem>
        <span>
            Index Version <Label>{version}</Label>
        </span>
    </StyledReferenceSelectorItem>
);

export const ReferenceSelector = ({ hasError, indexes, selected, onChange }) => {
    const clearSelected = selectedReference => {
        onChange(selected.filter(reference => reference !== selectedReference.reference.id));
    };

    const selectedReferences = intersectionWith(indexes, selected, compare);
    const [results, term, setTerm] = useFuse(indexes, ["reference.name"], [1]);

    const formattedResults = results.map(result => (result.id ? result : result.item));
    const unselectedReferences = difference(formattedResults, selectedReferences);

    const referenceComponents = unselectedReferences.map(reference => (
        <ReferenceSelectorItem
            key={reference.reference.id}
            id={reference.reference.id}
            name={reference.reference.name}
            version={reference.version}
        />
    ));

    return (
        <>
            <CreateHeader analysesType="References" />
            <GridContainer>
                <div>
                    <AnalysesObjectSelector
                        onChange={onChange}
                        analysesType="references"
                        link="/refs"
                        analysesTypeOptions={indexes}
                        selectedAnalysesTypeObjects={selectedReferences}
                        selectedAnalysesComponents={referenceComponents}
                        selectedAnalysesTypeIds={selected}
                        term={term}
                        setTerm={setTerm}
                        error={hasError}
                    />
                </div>
                <div>
                    <SelectedAnalysesObject
                        selected={selectedReferences}
                        setSelected={onChange}
                        resourceType="references"
                        clearSelected={clearSelected}
                        formattedLine={item => formattedLine(item)}
                    />
                </div>
            </GridContainer>
        </>
    );
};

ReferenceSelector.propTypes = {
    hasError: PropTypes.bool,
    indexes: PropTypes.arrayOf(PropTypes.object).isRequired,
    selected: PropTypes.arrayOf(PropTypes.string).isRequired,
    onChange: PropTypes.func.isRequired
};
