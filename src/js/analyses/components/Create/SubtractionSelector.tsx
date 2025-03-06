import { useFuse } from "@/fuse";
import { Subtraction } from "@subtraction/types";
import { filter, intersectionWith, xor } from "lodash-es";
import React from "react";
import CreateAnalysisField from "./CreateAnalysisField";
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

export function SubtractionSelector({
    subtractions,
    selected,
    onChange,
}: SubtractionSelectorProps) {
    const [results, term, setTerm] = useFuse<object>(subtractions, ["name"]);

    const unselectedSubtractions = filter(
        results,
        (subtraction: Subtraction) => !selected.includes(subtraction.id),
    );

    const selectedSubtractions = intersectionWith(
        subtractions,
        selected,
        (subtraction: Subtraction, id: string) => subtraction.id === id,
    );

    function handleClick(id) {
        return onChange(xor(selected, [id]));
    }

    return (
        <CreateAnalysisField>
            <CreateAnalysisFieldTitle>Subtractions</CreateAnalysisFieldTitle>
            <CreateAnalysisSelector>
                <CreateAnalysisSelectorSearch
                    label="Filter subtractions"
                    term={term}
                    onChange={setTerm}
                />
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
                    <SubtractionSelectorItem
                        key={id}
                        id={id}
                        name={name}
                        onClick={handleClick}
                        isDefault={isDefault}
                    />
                )}
            />
        </CreateAnalysisField>
    );
}
