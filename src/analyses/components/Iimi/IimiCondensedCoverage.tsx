import { FormattedIimiIsolate } from "@analyses/types";
import { sortBy, unzip } from "es-toolkit";
import { useMemo } from "react";
import { SummaryChart } from "../Charts/SummaryChart";

/** A graph of maximum Iimi analysis sequence coverage */
export function IimiCondensedCoverage({
    isolates,
}: {
    isolates: FormattedIimiIsolate[];
}) {
    const sequences = useMemo(
        () =>
            sortBy(unzip(isolates.map((isolate) => isolate.sequences)), [
                (seqs) => seqs[0]?.length,
            ]),
        [isolates],
    );

    const charts = sequences.map((seqs) => {
        return <SummaryChart key={seqs[0].id} seqs={seqs} />;
    });

    return <div>{charts}</div>;
}
