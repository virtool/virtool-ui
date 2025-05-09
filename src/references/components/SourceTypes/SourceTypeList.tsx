import React from "react";
import { SourceTypeItem } from "./SourceTypeItem";

interface SourceTypeListProps {
    sourceTypes: string[];
    onRemove: (sourceType: string) => void;
}

export default function SourceTypeList({
    sourceTypes,
    onRemove,
}: SourceTypeListProps) {
    return (
        <>
            {sourceTypes.map((sourceType) => (
                <SourceTypeItem
                    key={sourceType}
                    onRemove={onRemove}
                    sourceType={sourceType}
                />
            ))}
        </>
    );
}
