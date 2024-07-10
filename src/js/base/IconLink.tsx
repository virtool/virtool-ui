import React from "react";
import { Link } from "react-router-dom";
import { Icon } from "./Icon";

type IconLinkProps = {
    "aria-label"?: string;
    className?: string;
    color?: VTColor;
    name: string;
    onClick?: () => void;
    replace?: boolean;
    tip?: string;
    to?: string | object;
};

export function IconLink({ className, color, name, onClick, replace, tip, to, ...props }: IconLinkProps) {
    return (
        <Link className={className} replace={replace} to={to} onClick={onClick} aria-label={props["aria-label"]}>
            <Icon color={color} name={name} tip={tip} hoverable />
        </Link>
    );
}
