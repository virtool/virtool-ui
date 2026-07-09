import { DropdownMenu } from "radix-ui";
import type { ComponentPropsWithoutRef } from "react";

/**
 * The root of a dropdown menu.
 *
 * Non-modal by default: a menu button should not lock body scroll or
 * `aria-hidden` the rest of the page. Pass `modal` to opt back in.
 */
export default function Dropdown({
	modal = false,
	...props
}: ComponentPropsWithoutRef<typeof DropdownMenu.Root>) {
	return <DropdownMenu.Root modal={modal} {...props} />;
}
