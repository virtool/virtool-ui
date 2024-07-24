import { differenceWith, intersectionWith, sortBy, xor } from "lodash-es";
import React, { useMemo } from "react";
import { useFuse } from "../../../base/hooks";
import { CreateAnalysisField } from "./CreateAnalysisField";
import { CreateAnalysisFieldTitle } from "./CreateAnalysisFieldTitle";
import { CreateAnalysisSelected } from "./CreateAnalysisSelected";
import { CreateAnalysisSelector } from "./CreateAnalysisSelector";
import { CreateAnalysisSelectorList } from "./CreateAnalysisSelectorList";
import { CreateAnalysisSelectorSearch } from "./CreateAnalysisSelectorSearch";
import { IndexSelectorItem } from "./IndexSelectorItem";

interface IndexSelectorProps {
    indexes: object[];
    selected: string[];
    onChange: (selected: string[]) => void;
}

export function IndexSelector({ indexes, selected, onChange }: IndexSelectorProps) {
    const sortedIndexes = useMemo(() => sortBy(indexes, "reference.name"), [indexes]);
    const [results, term, setTerm] = useFuse(sortedIndexes, ["reference.name"], [1]);

    const unselectedIndexes = differenceWith(
        results.map(result => result.item || result),
        selected,
        (index, id) => index.id === id
    );

    const selectedIndexes = intersectionWith(sortedIndexes, selected, (index, id) => index.id === id);

    const toggle = id => onChange(xor(selected, [id]));

    return (
        <CreateAnalysisField>
            <CreateAnalysisFieldTitle>References</CreateAnalysisFieldTitle>
            <CreateAnalysisSelector>
                <CreateAnalysisSelectorSearch label="Filter references" term={term} onChange={setTerm} />
                <CreateAnalysisSelectorList
                    items={unselectedIndexes}
                    render={({ reference, version, id }) => (
                        <IndexSelectorItem key={id} id={id} name={reference.name} version={version} onClick={toggle} />
                    )}
                />
            </CreateAnalysisSelector>
            <CreateAnalysisSelected
                items={selectedIndexes}
                render={({ id, reference, version }) => (
                    <IndexSelectorItem key={id} id={id} name={reference.name} version={version} onClick={toggle} />
                )}
            />
        </CreateAnalysisField>
    );
}
