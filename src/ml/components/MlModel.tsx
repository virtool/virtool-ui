import Attribution from "@base/Attribution";
import Box from "@base/Box";
import type { MLModelRelease } from "../types";

type MlModelProps = {
	created_at: string;
	latest_release: MLModelRelease;
	name: string;
};

/**
 * A condensed MLModel for use in a list of MLModels
 *
 * @param created_at - The date the MLModel was created
 * @param latest_release - The latest release of the MLModel
 * @param name - The name of the MLModel
 * @returns A condensed MLModel
 */
export function MlModel({ created_at, latest_release, name }: MlModelProps) {
	const version = latest_release ? (
		<a href={latest_release.github_url}> {latest_release.name} </a>
	) : (
		"No releases"
	);

	return (
		<Box className="flex flex-col">
			<div className="flex justify-between text-base font-medium last:ml-auto">
				<span>{name}</span>
				{version}
			</div>
			<Attribution time={created_at} />
		</Box>
	);
}
