import Select from "@base/Select";
import SelectButton from "@base/SelectButton";
import SelectContent from "@base/SelectContent";
import SelectItem from "@base/SelectItem";
import type { MLModelMinimal } from "@ml/types";
import { ChevronDown } from "lucide-react";
import CreateAnalysisFieldTitle from "./CreateAnalysisFieldTitle";

export type MLModelSelectorProps = {
	models: MLModelMinimal[];
	onChange: (value: string) => void;
	selected: string;
};

export default function MlModelSelector({
	models,
	onChange,
	selected,
}: MLModelSelectorProps) {
	const mlModelItems = models.map(({ latest_release, name, description }) => (
		<SelectItem
			value={latest_release.id.toString()}
			key={latest_release.id}
			description={description}
		>
			{name}
		</SelectItem>
	));

	return (
		<div className="mb-8">
			<CreateAnalysisFieldTitle>MLModel</CreateAnalysisFieldTitle>
			<Select value={selected} onValueChange={onChange}>
				<SelectButton
					className="flex w-full [&_button]:grow"
					placeholder="Select a model"
					icon={ChevronDown}
				/>
				<SelectContent position="popper" align="start">
					{mlModelItems}
				</SelectContent>
			</Select>
		</div>
	);
}
