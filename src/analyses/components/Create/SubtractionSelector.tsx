import { useFuse } from "../../../app/fuse";
import { cn } from "../../../app/utils";
import BoxGroup from "../../../base/BoxGroup";
import PseudoLabel from "../../../base/PseudoLabel";
import { Subtraction } from "../../../subtraction/types";
import { filter, intersectionWith, xor } from "lodash-es";
import React from "react";
import CreateAnalysisField from "./CreateAnalysisField";
import CreateAnalysisFieldTitle from "./CreateAnalysisFieldTitle";
import { CreateAnalysisSelectorSearch } from "./CreateAnalysisSelectorSearch";
import SubtractionSelectorItem from "./SubtractionSelectorItem";

type SubtractionSelectorProps = {
    selected: string[];
    subtractions: object[];
    onChange: (selected: string[]) => void;
};

export default function SubtractionSelector({
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

    const selectedComponents = selectedSubtractions.map(
        ({ id, name, isDefault }) => (
            <SubtractionSelectorItem
                key={id}
                id={id}
                name={name}
                onClick={handleClick}
                isDefault={isDefault}
            />
        ),
    );

    return (
        <CreateAnalysisField>
            <CreateAnalysisFieldTitle>Subtractions</CreateAnalysisFieldTitle>
            <div>
                <PseudoLabel>Available</PseudoLabel>
                <BoxGroup className="h-72">
                    <CreateAnalysisSelectorSearch
                        label="Filter subtractions"
                        term={term}
                        onChange={setTerm}
                    />
                    <BoxGroup
                        className={cn(
                            "border-none",
                            "bg-slate-100",
                            "m-0",
                            "h-52",
                            "overflow-y-auto",
                        )}
                    >
                        {unselectedSubtractions.map(
                            ({ id, name, isDefault }) => (
                                <SubtractionSelectorItem
                                    key={id}
                                    id={id}
                                    name={name}
                                    onClick={handleClick}
                                    isDefault={isDefault}
                                />
                            ),
                        )}
                    </BoxGroup>
                </BoxGroup>
            </div>
            <div className={cn("flex", "flex-col")}>
                <PseudoLabel>Selected</PseudoLabel>
                <BoxGroup className="overflow-y-auto h-72">
                    {selectedSubtractions.length ? (
                        selectedComponents
                    ) : (
                        <div className="absolute inset-0 bg-slate-100">
                            <span>Nothing selected</span>
                        </div>
                    )}
                </BoxGroup>
            </div>
        </CreateAnalysisField>
    );
}
