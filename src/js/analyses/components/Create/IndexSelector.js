import { differenceWith, groupBy, intersectionWith, xor } from "lodash-es";
import PropTypes from "prop-types";
import React from "react";
import { useFuse } from "../../../base/hooks";
import { CreateAnalysisField, CreateAnalysisFieldTitle } from "./Field";
import { IndexSelectorItem } from "./IndexSelectorItem";
import { CreateAnalysisSelected } from "./Selected";
import { CreateAnalysisSelector } from "./Selector";
import { CreateAnalysisSelectorSearch } from "./Search";
import { CreateAnalysisSelectorList } from "./CreateAnalysisSelectorList";

export const IndexSelector = ({ hasError, indexes, selected, onChange }) => {
    const [results, term, setTerm] = useFuse(indexes, ["reference.name"], [1]);

    const unselectedIndexes = differenceWith(
        results.map(result => result.item || result),
        selected,
        (index, id) => index.id === id
    );

    const selectedIndexes = intersectionWith(indexes, selected, (index, id) => index.id === id);

    const toggle = id => onChange(xor(selected, [id]));

    return (
        <CreateAnalysisField>
            <CreateAnalysisFieldTitle>References</CreateAnalysisFieldTitle>
            <CreateAnalysisSelector noun="indexes" error={hasError} items={indexes} link="/refs/add">
                <CreateAnalysisSelectorSearch label="Filter references" term={term} onChange={setTerm} />
                <CreateAnalysisSelectorList
                    items={unselectedIndexes}
                    onChange={onChange}
                    render={({ reference, version, id }) => (
                        <IndexSelectorItem key={id} id={id} name={reference.name} version={version} onClick={toggle} />
                    )}
                />
            </CreateAnalysisSelector>
            <CreateAnalysisSelected
                items={selectedIndexes}
                resourceType="references"
                render={({ id, reference, version }) => (
                    <IndexSelectorItem key={id} id={id} name={reference.name} version={version} onClick={toggle} />
                )}
            />
        </CreateAnalysisField>
    );
};

IndexSelector.propTypes = {
    hasError: PropTypes.bool,
    indexes: PropTypes.arrayOf(PropTypes.object).isRequired,
    selected: PropTypes.arrayOf(PropTypes.string).isRequired,
    onChange: PropTypes.func.isRequired
};
