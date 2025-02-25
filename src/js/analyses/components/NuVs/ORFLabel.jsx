import React from "react";
import { ExternalLink } from "@base";

export function NuVsORFLabel({ hmm }) {
    if (hmm) {
        return (
            <ExternalLink className="capitalize" href={`/hmm/${hmm.hit}`}>
                {hmm.names[0]}
            </ExternalLink>
        );
    }

    return <span>Unannotated</span>;
}
