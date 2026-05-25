import type { ReactNode } from "react";

type InputLabelProps = {
	children: ReactNode;
	htmlFor?: string;
	id?: string;
};

export default function InputLabel({ children, htmlFor, id }: InputLabelProps) {
	return (
		<label htmlFor={htmlFor} id={id} className="font-medium mb-2 inline-block">
			{children}
		</label>
	);
}
