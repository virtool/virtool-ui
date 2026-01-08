import BoxGroupSection from "@base/BoxGroupSection";
import Label from "@base/Label";
import Link from "@base/Link";
import { HMMMinimal } from "../types";

type HmmItemProps = {
    /** Minimal hmm data */
    hmm: HMMMinimal;
};

/**
 * A condensed hmm item for use in a list of hmms
 */
export default function HmmItem({ hmm }: HmmItemProps) {
    const filteredFamilies = Object.keys(hmm.families).filter(
        (family) => family !== "None",
    );

    const labelComponents = filteredFamilies
        .slice(0, 3)
        .map((family, i) => <Label key={i}>{family}</Label>);

    return (
        <BoxGroupSection className="flex text-lg">
            <strong className="shrink-0 grow-0 basis-12 font-bold">
                {hmm.cluster}
            </strong>
            <Link className="flex-1 shrink-0" to={`/hmm/${hmm.id}`}>
                {hmm.names[0]}
            </Link>
            <div className="flex items-center text-base ml-auto gap-1.5">
                {labelComponents} {filteredFamilies.length > 3 ? "..." : null}
            </div>
        </BoxGroupSection>
    );
}
