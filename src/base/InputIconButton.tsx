import { cn } from "@app/utils";
import IconButton, { IconButtonProps } from "./IconButton";

export default function InputIconButton({
    className,
    ...props
}: IconButtonProps) {
    return (
        <IconButton
            className={cn(
                "absolute top-[6px] mx-[6px] flex items-center justify-center",
                className,
            )}
            {...props}
        />
    );
}
