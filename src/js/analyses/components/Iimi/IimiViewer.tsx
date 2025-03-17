import { useFuse } from "@/fuse";
import IimiToolbar from "@analyses/components/Iimi/IimiToolbar";
import { IimiAnalysis, IimiHit } from "@analyses/types";
import Accordion from "@base/Accordion";
import Box from "@base/Box";
import Icon from "@base/Icon";
import React from "react";
import { IimiOtu } from "./IimiOtu";

export function IimiViewer({ detail }: { detail: IimiAnalysis }) {
    const [items, term, setTerm] = useFuse<IimiHit>(detail.results.hits, [
        "name",
    ]);

    const [minimumProbability, setMinimumProbability] = React.useState(0.98);

    const itemsWithProbabilities = React.useMemo(() => {
        return items.map((item) => {
            const maxProbability = Math.max(
                ...item.isolates.flatMap((isolate) =>
                    isolate.sequences.map(
                        (sequence) => sequence.probability || 0,
                    ),
                ),
            );

            return {
                ...item,
                probability: maxProbability > 0 ? maxProbability : null,
            };
        });
    }, [items]);

    const hits = itemsWithProbabilities.filter(
        (item) => item.probability && item.probability >= minimumProbability,
    );

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
                        This analysis could become inaccessbile at any time as
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
                {hits.map((hit) => (
                    <IimiOtu hit={hit} key={hit.id} />
                ))}
            </Accordion>
        </>
    );
}
