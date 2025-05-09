import BoxGroupSearch from "@base/BoxGroupSearch";
import React from "react";

interface CreateAnalysisSelectorSearchProps {
    label: string;
    term: string;
    onChange: (value: string) => void;
}

export const CreateAnalysisSelectorSearch = ({
    label,
    term,
    onChange,
}: CreateAnalysisSelectorSearchProps) => (
    <BoxGroupSearch
        value={term}
        placeholder={label}
        label={label}
        onChange={(value) => onChange(value)}
    />
);
