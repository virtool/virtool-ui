import { cn } from "@app/utils";
import { useCombobox } from "downshift";
import { ChevronDown } from "lucide-react";
import WrapRow from "./ComboBoxItem";
import Icon from "./Icon";
import InputSearch from "./InputSearch";

function ComboboxTriggerButton({
	TriggerButtonProps,
	selectedItem,
	renderRow,
	id,
}) {
	return (
		<button
			className="flex justify-between items-center px-2.5 py-1.5 bg-white border border-gray-300 rounded font-medium capitalize w-full [&_svg]:ml-1"
			{...TriggerButtonProps}
			id={id}
			type="button"
		>
			{selectedItem ? renderRow(selectedItem) : "Select user"}
			<Icon icon={ChevronDown} />
		</button>
	);
}

function ComboBoxSearch({ getInputProps }) {
	return (
		<div className="mx-1 my-2.5">
			<InputSearch {...getInputProps()} />
		</div>
	);
}

type ComboBoxProps = {
	items: unknown[];
	selectedItem?: unknown;
	term: string;
	renderRow: (item: unknown) => JSX.Element;
	onFilter: (term: string) => void;
	onChange: (item: unknown) => void;
	itemToString?: (item: unknown) => string;
	id?: string;
};

function defaultToString(item: string) {
	return item;
}

export default function ComboBox({
	items,
	selectedItem,
	term,
	renderRow,
	onFilter,
	onChange,
	itemToString,
	id,
}: ComboBoxProps) {
	itemToString = itemToString || defaultToString;

	const {
		getToggleButtonProps,
		getMenuProps,
		getItemProps,
		getInputProps,
		isOpen,
	} = useCombobox({
		items,
		selectedItem,
		inputValue: term,
		onInputValueChange: ({ inputValue }) => {
			onFilter(inputValue);
		},
		onSelectedItemChange: ({ selectedItem }) => {
			onChange(selectedItem);
		},
		itemToString,
	});

	const rows = items.map(WrapRow(renderRow, getItemProps));

	return (
		<div className="flex relative flex-col w-full">
			<ComboboxTriggerButton
				TriggerButtonProps={getToggleButtonProps()}
				selectedItem={selectedItem}
				renderRow={renderRow}
				id={id}
			/>
			<ul
				className={cn(
					"origin-top animate-comboBoxContentOpen top-full p-0 mt-0 absolute bg-white w-full max-h-80 overflow-y-auto overflow-x-hidden outline-0 transition-opacity duration-100 ease-in shadow-md border border-gray-300 rounded-md z-50",
					isOpen ? "block" : "hidden",
				)}
				{...getMenuProps()}
			>
				<ComboBoxSearch getInputProps={getInputProps} />
				{isOpen && rows}
			</ul>
		</div>
	);
}
