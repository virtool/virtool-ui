import NuvsValues from "@analyses/components/Nuvs/NuvsValues";
import { FormattedNuvsHit } from "@analyses/types";
import { useUrlSearchParam } from "@app/hooks";
import { cn } from "@app/utils";
import Badge from "@base/Badge";
import Box from "@base/Box";
import numbro from "numbro";
import "./NuvsItem.css";

type NuVsItemProps = {
    hit: FormattedNuvsHit;
};

/**
 * A condensed Nuvs item for use in a list of Nuvs
 */
export default function NuvsItem({ hit }: NuVsItemProps) {
    const { value: activeHit, setValue: setActiveHit } =
        useUrlSearchParam<string>("activeHit");

    const { annotatedOrfCount, e, id, index, sequence } = hit;

    const isActive = activeHit !== null && Number(activeHit) === id;

    return (
        <Box
            className={cn(
                { "bg-slate-100": isActive },
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
