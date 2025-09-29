import { FormattedIimiAnalysis, FormattedIimiHit } from "@analyses/types";
import { useFuse } from "@app/fuse";
import { useUrlSearchParam } from "@app/hooks";
import Accordion from "@base/Accordion";
import Box from "@base/Box";
import Icon from "@base/Icon";
import { orderBy } from "lodash-es";
import { useState } from "react";
import { IimiOtu } from "./IimiOtu";
import IimiToolbar from "./IimiToolbar";

type sortKey = {
    key: string;
    order: "desc" | "asc";
};

const sortKeys: { [key: string]: sortKey } = {
    probability: { key: "probability", order: "desc" },
    coverage: { key: "coverage", order: "desc" },
    name: { key: "name", order: "asc" },
};

/**
 * Complete results of an iimi analysis run
 */
export function IimiViewer({ detail }: { detail: FormattedIimiAnalysis }) {
    const [items, term, setTerm] = useFuse<FormattedIimiHit>(
        detail.results.hits,
        ["name"],
    );

    const { value: sort } = useUrlSearchParam("sort", "probability");

    const [minimumProbability, setMinimumProbability] = useState(0.5);

    const hits = items.filter(
        (item) => item.probability && item.probability >= minimumProbability,
    );

    const sortedHits = orderBy(hits, sortKeys[sort].key, sortKeys[sort].order);

    return (
        <>
            <Box className="bg-amber-100 border-amber-300 text-amber-900">
                <header>
                    <h5 className="flex items-center gap-2 text-lg">
                        <Icon name="exclamation-circle" />
                        Iimi is an experimental workflow.
                    </h5>
                </header>
                <ul className="list-disc list-inside pl-4">
                    <li>We do not guarantee the accuracy of the results.</li>
                    <li>
                        This analysis could become inaccessible at any time as
                        the workflow changes.
                    </li>
                </ul>
            </Box>
            <IimiToolbar
                minimumProbability={minimumProbability}
                term={term}
                setMinimumProbability={setMinimumProbability}
                setTerm={setTerm}
            />
            <Accordion type="single" collapsible>
                {sortedHits.map((hit) => (
                    <IimiOtu
                        hit={hit}
                        key={hit.id}
                        probability={hit.probability}
                    />
                ))}
            </Accordion>
        </>
    );
}
