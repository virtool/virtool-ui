import { cn } from "@app/utils";
import { ElementType, ReactNode } from "react";
import Icon, { IconProps } from "./Icon";

export interface InputIconProps extends Partial<IconProps> {
    as?: ElementType;
    children?: ReactNode;
}

export default function InputIcon({
    as: Component = "div",
    children,
    className,
    icon,
    ...props
}: InputIconProps) {
    return (
        <Component
            className={cn(
                "absolute top-0 bottom-0 flex items-center justify-center mx-2",
                className,
            )}
        >
            {icon && <Icon icon={icon} {...props} />}
            {children}
        </Component>
    );
}
