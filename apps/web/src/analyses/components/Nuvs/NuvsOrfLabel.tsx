import { Link } from "@tanstack/react-router";

export default function NuvsOrfLabel({ hmm }) {
	if (hmm) {
		return (
			<Link
				className="capitalize"
				to="/hmms/$hmmId"
				params={{ hmmId: hmm.hit }}
			>
				{hmm.names[0]}
			</Link>
		);
	}

	return <span>Unannotated</span>;
}
