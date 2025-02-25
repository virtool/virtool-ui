import React from "react";
import styled from "styled-components";
import { AlertInner } from "./AlertInner";
import { AlertOuter } from "./AlertOuter";
import { Icon } from "./Icon";

type AlertProps = {
    block?: boolean;
    children: React.ReactNode;
    className?: string;
    color?: string;
    icon?: string;
    level?: boolean;
};

export const Alert = styled(
    ({ block, children, className, color, icon, level }: AlertProps) => (
        <AlertOuter color={color}>
            <AlertInner
                className={className}
                block={block}
                color={color}
                level={level}
            >
                {icon ? <Icon name={icon} /> : null}
                {children}
            </AlertInner>
        </AlertOuter>
    ),
)``;

Alert.displayName = "Alert";
