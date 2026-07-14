import { Search } from "lucide-react";
import Input, { type InputProps } from "./Input";
import InputContainer from "./InputContainer";
import InputIcon from "./InputIcon";

export default function InputSearch(props: InputProps) {
	return (
		<InputContainer align="left" className="flex-grow">
			<Input {...props} />
			<InputIcon size={18} icon={Search} />
		</InputContainer>
	);
}
