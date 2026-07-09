import { DropdownMenu } from "radix-ui";
import { type ComponentPropsWithoutRef, forwardRef } from "react";

/**
 * Groups related menu items under `role="group"`. Pair with a
 * `DropdownMenuLabel` referenced by `aria-labelledby` so the section is
 * announced rather than only shown.
 */
const DropdownMenuGroup = forwardRef<
	HTMLDivElement,
	ComponentPropsWithoutRef<typeof DropdownMenu.Group>
>(function DropdownMenuGroup(props, ref) {
	return <DropdownMenu.Group ref={ref} {...props} />;
});

export default DropdownMenuGroup;
