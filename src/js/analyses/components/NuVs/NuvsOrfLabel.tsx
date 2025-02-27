import { ExternalLink } from "@base";
import React from "react";

export default function NuvsOrfLabel({ hmm }) {
    if (hmm) {
        return (
            <ExternalLink className="capitalize" href={`/hmm/${hmm.hit}`}>
                {hmm.names[0]}
            </ExternalLink>
        );
    }

    return <span>Unannotated</span>;
}
