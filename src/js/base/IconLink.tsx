import React from "react";
import { Link } from "react-router-dom";
import { Icon } from "./Icon";

type IconLinkProps = {
    "aria-label"?: string;
    color?: VTColor;
    name: string;
    replace?: boolean;
    tip?: string;
    to: string | object;
};

export function IconLink({ color, name, replace, tip, to, ...props }: IconLinkProps) {
    return (
        <Link replace={replace} to={to} aria-label={props["aria-label"]}>
            <Icon color={color} name={name} tip={tip} hoverable />
        </Link>
    );
}
