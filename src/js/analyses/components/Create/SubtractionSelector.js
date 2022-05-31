import PropTypes from "prop-types";
import React from "react";
import { useFuse } from "../../../base/hooks";
import { SelectedAnalysesObject } from "./Selected";
import { intersectionWith } from "lodash-es";
import styled from "styled-components";
import { CreateHeader, GridContainer, SelectorItem } from "./WorkflowSelector";
import { AnalysesObjectSelector } from "./Selector";

export const NameOverflowItem = styled.div`
    max-width: 50%;
    width: 50%;
    margin-right: 20px;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    font-weight: ${props => (props.type === "references" ? "bold" : "normal")};
`;

const compare = (option1, option2) => {
    return option1.id === option2;
};

export const SubtractionSelector = ({ subtractions, value, onChange }) => {
    const clearSelected = object => {
        onChange(value.filter(subtraction => subtraction !== object.id));
    };

    const selectedSubtractionObjects = intersectionWith(subtractions, value, compare);

    const [results, term, setTerm] = useFuse(subtractions, ["name"], [1]);
    const formattedResults = results.map(result => (result.name ? result : result.item));
    const unselectedSubtractions = formattedResults.filter(result => !value.includes(result.id));

    const subtractionComponents = unselectedSubtractions.map(subtraction => (
        <SelectorItem
            key={subtraction.id}
            name={subtraction.name}
            value={subtraction.id}
            id={subtraction.id}
            requireCheckbox={false}
        >
            <NameOverflowItem>{subtraction.name}</NameOverflowItem>
        </SelectorItem>
    ));

    return (
        <>
            <CreateHeader analysesType="Subtractions" />
            <GridContainer>
                <AnalysesObjectSelector
                    onChange={onChange}
                    analysesType="subtractions"
                    link="/subtractions"
                    analysesTypeOptions={subtractions}
                    selectedAnalysesTypeObjects={selectedSubtractionObjects}
                    selectedAnalysesComponents={subtractionComponents}
                    selectedAnalysesTypeIds={value}
                    term={term}
                    setTerm={setTerm}
                />
                <SelectedAnalysesObject
                    selected={selectedSubtractionObjects}
                    setSelected={onChange}
                    resourceType="subtractions"
                    clearSelected={clearSelected}
                    formattedLine={item => <NameOverflowItem>{item.name}</NameOverflowItem>}
                />
            </GridContainer>
        </>
    );
};

SubtractionSelector.propTypes = {
    subtractions: PropTypes.arrayOf(PropTypes.object),
    value: PropTypes.arrayOf(PropTypes.string),
    onChange: PropTypes.func
};
