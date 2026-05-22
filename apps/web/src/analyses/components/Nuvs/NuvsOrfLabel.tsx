import ExternalLink from "@base/ExternalLink";

export default function NuvsOrfLabel({ hmm }) {
	if (hmm) {
		return (
			<ExternalLink className="capitalize" href={`/hmms/${hmm.hit}`}>
				{hmm.names[0]}
			</ExternalLink>
		);
	}

	return <span>Unannotated</span>;
}
