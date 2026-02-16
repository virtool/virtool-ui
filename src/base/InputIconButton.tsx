import { cn } from "@app/utils";
import IconButton, { IconButtonProps } from "./IconButton";

export default function InputIconButton({
    className,
    size = 16,
    ...props
}: IconButtonProps) {
    return (
        <IconButton
            className={cn(
                "absolute mx-[6px] flex items-center justify-center",
                className,
            )}
            size={size}
            {...props}
        />
    );
}
