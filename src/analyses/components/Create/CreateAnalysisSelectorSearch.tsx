import BoxGroupSearch from "@base/BoxGroupSearch";
import React from "react";

interface CreateAnalysisSelectorSearchProps {
    label: string;
    term: string;
    onChange: (value: string) => void;
}

export function CreateAnalysisSelectorSearch({
    label,
    term,
    onChange,
}: CreateAnalysisSelectorSearchProps) {
    return (
        <BoxGroupSearch
            value={term}
            placeholder={label}
            label={label}
            onChange={(value) => onChange(value)}
        />
    );
}
