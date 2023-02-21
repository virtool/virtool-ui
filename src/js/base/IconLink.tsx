import { Link } from "react-router-dom";
import React from "react";
import { Icon } from "./Icon";

type IconLinkProps = {
    color?: VTColor;
    name: string;
    replace?: boolean;
    tip?: string;
    to: string | object;
};

export const IconLink = ({ color, name, replace, tip, to }: IconLinkProps) => (
    <Link replace={replace} to={to}>
        <Icon color={color} name={name} tip={tip} hoverable />
    </Link>
);
