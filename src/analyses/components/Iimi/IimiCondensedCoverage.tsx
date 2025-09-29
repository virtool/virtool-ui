import { FormattedIimiIsolate } from "@analyses/types";
import { map, sortBy, unzip } from "lodash-es";
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
            sortBy(
                unzip(map(isolates, "sequences")),
                (seqs) => seqs[0]?.length,
            ),
        [isolates],
    );

    const charts = map(sequences, (seqs) => {
        return <SummaryChart key={seqs[0].id} seqs={seqs} />;
    });

    return <div>{charts}</div>;
}
