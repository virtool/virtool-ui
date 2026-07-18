import Link from "@base/Link";
import LoadingPlaceholder from "@base/LoadingPlaceholder";
import QueryError from "@base/QueryError";
import SideBarSection from "@base/SideBarSection";
import SidebarHeader from "@base/SidebarHeader";
import { useFetchSubtractionsShortlist } from "@subtraction/queries";
import { xor } from "es-toolkit/array";
import SampleSidebarList from "./SampleSidebarList";
import SampleSidebarSelector from "./SampleSidebarSelector";

type SubtractionInnerProps = {
	name: string;
};

function SubtractionInner({ name }: SubtractionInnerProps) {
	return name;
}

type DefaultSubtractionsProps = {
	/** List of subtraction ids associated with the sample. */
	defaultSubtractions: string[];

	/** Callback to handle subtraction selection. */
	onUpdate: (subtractions: string[]) => void;
};

/**
 * Displays a sidebar to manage default subtractions
 */
export default function DefaultSubtractions({
	defaultSubtractions,
	onUpdate,
}: DefaultSubtractionsProps) {
	const {
		data: subtractionOptions,
		isPending,
		isError,
	} = useFetchSubtractionsShortlist();

	if (isError && !subtractionOptions) {
		return <QueryError noun="subtractions" />;
	}

	if (isPending) {
		return <LoadingPlaceholder />;
	}

	return (
		<SideBarSection>
			<SidebarHeader>
				<span>Default Subtractions</span>
				<SampleSidebarSelector
					render={({ name }) => <SubtractionInner name={name} />}
					items={subtractionOptions}
					selectedIds={defaultSubtractions}
					onUpdate={(subtractionId: string | number) => {
						onUpdate(xor(defaultSubtractions, [String(subtractionId)]));
					}}
					selectionType="default subtractions"
					manageLink={"/subtractions"}
				/>
			</SidebarHeader>
			<SampleSidebarList
				items={subtractionOptions.filter((subtraction) =>
					defaultSubtractions.includes(subtraction.id),
				)}
			/>
			{Boolean(subtractionOptions.length) || (
				<div className="flex text-gray-600 [&_a]:ml-1 [&_a]:text-sm [&_a]:font-medium">
					No subtractions found. <Link to="/subtractions">Create one</Link>.
				</div>
			)}
		</SideBarSection>
	);
}
