import Box from "@base/Box";
import Icon from "@base/Icon";
import InputGroup from "@base/InputGroup";
import InputLabel from "@base/InputLabel";
import Link from "@base/Link";
import Select from "@base/Select";
import SelectButton from "@base/SelectButton";
import SelectContent from "@base/SelectContent";
import SelectItem from "@base/SelectItem";
import type { OtuSegment } from "@otus/types";
import { ChevronDown, CircleAlert } from "lucide-react";
import { Select as SelectPrimitive } from "radix-ui";
import { Controller, useFormContext } from "react-hook-form";

type SequenceSegmentFieldProps = {
	/** Whether a schema exists for the selected OTU */
	hasSchema: boolean;
	otuId: string;
	refId: string;
	/** A list of unreferenced segments */
	segments: OtuSegment[];
};

type SequenceSegmentProps = {
	/** The name of the segment */
	name: string;
	/** Whether the segment is required */
	required: boolean;
};

/**
 * A condensed sequence segment for use in a list of segments
 */
function SequenceSegment({ name, required }: SequenceSegmentProps) {
	return (
		<SelectPrimitive.Item
			className="relative mb-1 cursor-default py-1 pr-9 pl-6 text-sm font-medium capitalize select-none hover:border-0 hover:bg-gray-50"
			value={name}
			key={name}
		>
			<SelectPrimitive.ItemText>
				<div className="flex w-full items-center font-medium">
					<span>{name}</span>

					{required && (
						<span className="ml-auto flex items-center">
							<Icon icon={CircleAlert} />
							<span className="ml-1">Required</span>
						</span>
					)}
				</div>
			</SelectPrimitive.ItemText>
		</SelectPrimitive.Item>
	);
}

/**
 * Displays a dropdown list of available segments in adding/editing dialogs or provides option to create schema
 */
export default function SequenceSegmentField({
	hasSchema,
	otuId,
	refId,
	segments,
}: SequenceSegmentFieldProps) {
	const { control, setValue } = useFormContext<{ segment: string }>();

	if (hasSchema) {
		const segmentOptions = segments.map((segment) => (
			<SequenceSegment
				key={segment.name}
				name={segment.name}
				required={segment.required}
			/>
		));

		return (
			<InputGroup>
				<InputLabel htmlFor="segment">Segment</InputLabel>
				<div className="flex flex-col [&>button]:grow [&>button]:p-2.5">
					<Controller
						control={control}
						render={({ field: { onChange, value } }) => {
							const segmentExists = segments.some(
								(segment) => segment.name === value,
							);

							if (value && !segmentExists) {
								setValue("segment", null);
							}

							return (
								<Select
									value={value || "None"}
									onValueChange={(value) =>
										value !== "" && onChange(value === "None" ? null : value)
									}
								>
									<SelectButton icon={ChevronDown} />
									<SelectContent position="popper" align="start">
										<SelectItem key="None" value="None" description="">
											None
										</SelectItem>
										{segmentOptions}
									</SelectContent>
								</Select>
							);
						}}
						name="segment"
					/>
				</div>
			</InputGroup>
		);
	}

	return (
		<InputGroup>
			<InputLabel>Segment</InputLabel>
			<Box className="flex items-center justify-between [&_a]:font-medium [&_h5]:mb-1 [&_h5]:mt-0 [&_h5]:font-medium [&_p]:m-0">
				<div>
					<h5>No schema is defined for this OTU.</h5>
					<p>
						A schema defines the sequence segments that should be present in
						isolates of the OTU.{" "}
					</p>
				</div>
				<div>
					<Link to={`/refs/${refId}/otus/${otuId}/schema`}>Add a Schema</Link>
				</div>
			</Box>
		</InputGroup>
	);
}
