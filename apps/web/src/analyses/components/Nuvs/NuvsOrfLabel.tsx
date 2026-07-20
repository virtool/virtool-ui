import type { NuvsOrfHit } from "@analyses/types";
import { Link } from "@tanstack/react-router";

type NuvsOrfLabelProps = {
	hmm?: NuvsOrfHit;
};

export default function NuvsOrfLabel({ hmm }: NuvsOrfLabelProps) {
	if (hmm) {
		return (
			<Link
				className="capitalize"
				to="/hmms/$hmmId"
				params={{ hmmId: String(hmm.hit) }}
			>
				{hmm.names[0]}
			</Link>
		);
	}

	return <span>Unannotated</span>;
}
