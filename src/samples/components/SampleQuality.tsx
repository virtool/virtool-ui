import { usePathParams } from "@app/hooks";
import LoadingPlaceholder from "@base/LoadingPlaceholder";
import { Quality } from "@quality/components/Quality";
import { useFetchSample } from "../queries";
import LegacyAlert from "./SampleFilesMessage";

/**
 * Samples quality view showing charts for bases, composition, and sequences
 */
export default function SampleQuality() {
	const { sampleId } = usePathParams<{ sampleId: string }>();
	const { data, isPending } = useFetchSample(sampleId);

	if (isPending) {
		return <LoadingPlaceholder />;
	}

	return (
		<div className="flex flex-col">
			<LegacyAlert className="mb-5" showLegacy={data.is_legacy} />
			<Quality
				bases={data.quality.bases}
				composition={data.quality.composition}
				sequences={data.quality.sequences}
			/>
		</div>
	);
}
