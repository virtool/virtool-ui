import { filter, intersectionWith, xor } from "lodash-es";
import React from "react";
import { useFuse } from "../../../base/hooks";
import { CreateAnalysisField } from "./CreateAnalysisField";
import { CreateAnalysisFieldTitle } from "./CreateAnalysisFieldTitle";
import { CreateAnalysisSelected } from "./CreateAnalysisSelected";
import { CreateAnalysisSelector } from "./CreateAnalysisSelector";
import { CreateAnalysisSelectorList } from "./CreateAnalysisSelectorList";
import { CreateAnalysisSelectorSearch } from "./CreateAnalysisSelectorSearch";
import { SubtractionSelectorItem } from "./SubtractionSelectorItem";

interface SubtractionSelectorProps {
    selected: string[];
    subtractions: object[];
    onChange: (selected: string[]) => void;
}
export function SubtractionSelector({ subtractions, selected, onChange }: SubtractionSelectorProps) {
    const [results, term, setTerm] = useFuse(subtractions, ["name"], [1]);

    const unselectedSubtractions = filter(
        results.map(result => result.item || result),
        subtraction => !selected.includes(subtraction.id),
    );
    const selectedSubtractions = intersectionWith(subtractions, selected, (subtraction, id) => subtraction.id === id);

    const handleClick = id => onChange(xor(selected, [id]));

    return (
        <CreateAnalysisField>
            <CreateAnalysisFieldTitle>Subtractions</CreateAnalysisFieldTitle>
            <CreateAnalysisSelector>
                <CreateAnalysisSelectorSearch label="Filter subtractions" term={term} onChange={setTerm} />
                <CreateAnalysisSelectorList
                    items={unselectedSubtractions}
                    render={({ id, name, isDefault }) => (
                        <SubtractionSelectorItem
                            key={id}
                            id={id}
                            name={name}
                            onClick={handleClick}
                            isDefault={isDefault}
                        />
                    )}
                />
            </CreateAnalysisSelector>
            <CreateAnalysisSelected
                items={selectedSubtractions}
                render={({ id, name, isDefault }) => (
                    <SubtractionSelectorItem key={id} id={id} name={name} onClick={handleClick} isDefault={isDefault} />
                )}
            />
        </CreateAnalysisField>
    );
}
