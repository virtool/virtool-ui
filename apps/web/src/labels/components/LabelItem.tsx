import BoxGroupSection from "@base/BoxGroupSection";
import SampleLabel from "@samples/components/Label/SampleLabel";
import { EditLabel } from "./EditLabel";
import { RemoveLabel } from "./RemoveLabel";

type ItemProps = {
	name: string;
	color: string;
	description: string;
	id: number;
};

/**
 * A condensed label item for use in a list of labels
 */
export function LabelItem({ name, color, description, id }: ItemProps) {
	return (
		<BoxGroupSection className="flex items-center">
			<div className="min-w-3/10">
				<SampleLabel name={name} color={color} />
			</div>
			{description}
			<div className="absolute top-0 right-0 bottom-0 flex items-center gap-1 pr-4 text-lg">
				<EditLabel
					id={id}
					color={color}
					description={description}
					name={name}
				/>
				<RemoveLabel id={id} name={name} />
			</div>
		</BoxGroupSection>
	);
}
