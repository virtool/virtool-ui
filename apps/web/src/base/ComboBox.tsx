import { cn } from "@app/cn";
import { type UseComboboxReturnValue, useCombobox } from "downshift";
import { ChevronDown } from "lucide-react";
import type { ReactElement } from "react";
import WrapRow from "./ComboBoxItem";
import Icon from "./Icon";
import InputSearch from "./InputSearch";
import { inputHeightClass } from "./styles";

function ComboboxTriggerButton({
	TriggerButtonProps,
	selectedItem,
	renderRow,
	placeholder,
	id,
}) {
	return (
		<button
			className={cn(
				"flex justify-between items-center px-2.5 bg-white border border-gray-300 rounded font-medium capitalize w-full [&_svg]:ml-1",
				inputHeightClass,
			)}
			{...TriggerButtonProps}
			id={id}
			type="button"
		>
			{selectedItem ? renderRow(selectedItem) : placeholder}
			<Icon icon={ChevronDown} />
		</button>
	);
}

type ComboBoxSearchProps = {
	getInputProps: UseComboboxReturnValue<unknown>["getInputProps"];
};

function ComboBoxSearch({ getInputProps }: ComboBoxSearchProps) {
	return (
		<div className="mx-1 my-2.5">
			<InputSearch {...getInputProps()} aria-label="Search" />
		</div>
	);
}

type ComboBoxProps = {
	items: unknown[];
	selectedItem?: unknown;
	term: string;
	renderRow: (item: unknown) => ReactElement;
	onFilter: (term: string) => void;
	onChange: (item: unknown) => void;
	itemToString?: (item: unknown) => string;
	/** Text shown on the trigger when nothing is selected */
	placeholder?: string;
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
	placeholder = "Select…",
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
				placeholder={placeholder}
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
