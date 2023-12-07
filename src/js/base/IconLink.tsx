import React from "react";
import { Link } from "react-router-dom";
import { Icon } from "./Icon";

type IconLinkProps = {
    color?: VTColor;
    name: string;
    replace?: boolean;
    tip?: string;
    to: string | object;
};

export const IconLink = ({ color, name, replace, tip, to }: IconLinkProps) => (
    <Link replace={replace} to={to} aria-label={name}>
        <Icon color={color} name={name} tip={tip} hoverable />
    </Link>
);
