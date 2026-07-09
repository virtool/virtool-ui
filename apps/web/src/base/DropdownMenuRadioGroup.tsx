import { DropdownMenu } from "radix-ui";
import { type ComponentPropsWithoutRef, forwardRef } from "react";

const DropdownMenuRadioGroup = forwardRef<
	HTMLDivElement,
	ComponentPropsWithoutRef<typeof DropdownMenu.RadioGroup>
>(function DropdownMenuRadioGroup(props, ref) {
	return <DropdownMenu.RadioGroup ref={ref} {...props} />;
});

export default DropdownMenuRadioGroup;
