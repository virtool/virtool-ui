import { useUrlSearchParam } from "@/hooks";
import { cn } from "@/utils";
import NuvsValues from "@analyses/components/NuVs/NuvsValues";
import { FormattedNuvsHit } from "@analyses/types";
import Badge from "@base/Badge";
import Box from "@base/Box";
import numbro from "numbro";
import React from "react";
import "./NuvsItem.css";

type NuVsItemProps = {
    hit: FormattedNuvsHit;
};

/**
 * A condensed NuVs item for use in a list of NuVs
 */
export default function NuvsItem({ hit }: NuVsItemProps) {
    const { value: activeHit, setValue: setActiveHit } =
        useUrlSearchParam<string>("activeHit");

    const { annotatedOrfCount, e, id, index, sequence } = hit;

    return (
        <Box
            className={cn(
                { "bg-slate-100": activeHit.toString() === hit.id.toString() },
                "border-none",
                "nuvs-item",
                "rounded-none",
                "m-0",
            )}
            onClick={() => setActiveHit(String(id))}
        >
            <div className="flex items-center justify-between">
                <span className="font-medium">Sequence {index}</span>
                <Badge>{sequence.length}</Badge>
            </div>

            <NuvsValues e={numbro(e).format()} orfCount={annotatedOrfCount} />
        </Box>
    );
}
