import BoxGroup from "../../../base/BoxGroup";
import BoxGroupHeader from "../../../base/BoxGroupHeader";
import BoxGroupSection from "../../../base/BoxGroupSection";
import React from "react";

interface CloneProps {
    source: { id: string; name: string };
}

export function Clone({ source }: CloneProps) {
    return (
        <BoxGroup>
            <BoxGroupHeader>
                <h2>Clone Reference</h2>
            </BoxGroupHeader>

            <BoxGroupSection>
                <strong>Source Reference</strong>
                <span>
                    {" / "}
                    <a href={`/refs/${source.id}`}>{source.name}</a>
                </span>
            </BoxGroupSection>
        </BoxGroup>
    );
}
