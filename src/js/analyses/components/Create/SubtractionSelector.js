import { filter, intersectionWith, xor, includes } from "lodash-es";
import PropTypes from "prop-types";
import React from "react";
import { useFuse } from "../../../base/hooks";
import { CreateAnalysisField, CreateAnalysisFieldTitle } from "./Field";
import { CreateAnalysisSelected } from "./Selected";
import { CreateAnalysisSelector } from "./Selector";
import { CreateAnalysisSelectorSearch } from "./Search";
import { SubtractionSelectorItem } from "./SubtractionSelectorItem";
import { CreateAnalysisSelectorList } from "./CreateAnalysisSelectorList";

export const SubtractionSelector = ({ subtractions, selected, defaultSubtractions, onChange }) => {
    const [results, term, setTerm] = useFuse(subtractions, ["name"], [1]);

    const unselectedSubtractions = filter(
        results.map(result => result.item || result),
        subtraction => !selected.includes(subtraction.id)
    );
    const selectedSubtractions = intersectionWith(subtractions, selected, (subtraction, id) => subtraction.id === id);

    const handleClick = id => onChange(xor(selected, [id]));

    return (
        <CreateAnalysisField>
            <CreateAnalysisFieldTitle>Subtractions</CreateAnalysisFieldTitle>
            <CreateAnalysisSelector items={subtractions} link="/subtractions/create" noun="subtractions">
                <CreateAnalysisSelectorSearch label="Filter subtractions" term={term} onChange={setTerm} />
                <CreateAnalysisSelectorList
                    items={unselectedSubtractions}
                    render={({ id, name }) => (
                        <SubtractionSelectorItem
                            key={id}
                            id={id}
                            name={name}
                            onClick={handleClick}
                            isDefault={includes(defaultSubtractions, id) ? true : false}
                        />
                    )}
                />
            </CreateAnalysisSelector>
            <CreateAnalysisSelected
                items={selectedSubtractions}
                render={({ id, name }) => (
                    <SubtractionSelectorItem
                        key={id}
                        id={id}
                        name={name}
                        onClick={handleClick}
                        isDefault={includes(defaultSubtractions, id) ? true : false}
                    />
                )}
            />
        </CreateAnalysisField>
    );
};

SubtractionSelector.propTypes = {
    selected: PropTypes.arrayOf(PropTypes.string).isRequired,
    subtractions: PropTypes.arrayOf(PropTypes.object).isRequired,
    defaultSubtractions: PropTypes.arrayOf(PropTypes.string).isRequired,
    onChange: PropTypes.func.isRequired
};
