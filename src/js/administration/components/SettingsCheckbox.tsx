import React, { useCallback } from "react";
import styled from "styled-components";
import { getFontSize } from "../../app/theme";
import { Box, Checkbox } from "../../base";

const SettingsCheckboxContainer = styled.div`
    padding: 10px;
`;

const SettingsCheckboxChildren = styled.div`
    padding-right: 20px;
`;

const StyledSettingsCheckbox = styled(Box)`
    align-items: center;
    display: flex;
    justify-content: space-between;
    padding: 15px 20px 12px 15px;

    h2 {
        font-size: ${props => props.theme.fontSize.lg};
        font-weight: ${props => props.theme.fontWeight.thick};
        margin: 0 0 3px;
        padding-bottom: 5px;
    }

    small {
        color: ${props => props.theme.color.greyDarkest};
        font-size: ${getFontSize("md")};
    }
`;

type SettingsCheckboxProps = {
    /** Content to be rendered within the checkbox */
    children: React.ReactNode;
    /** Whether the external API access is enabled */
    enabled: boolean;
    /** A callback function to handle checkbox toggling */
    onToggle: () => void;
};

/**
 * A checkbox allowing users to toggle API access for clients
 */
export function SettingsCheckbox({ children, enabled, onToggle }: SettingsCheckboxProps) {
    const handleClick = useCallback(() => onToggle(), [enabled, onToggle]);

    return (
        <StyledSettingsCheckbox>
            <SettingsCheckboxChildren>{children}</SettingsCheckboxChildren>
            <SettingsCheckboxContainer>
                <Checkbox checked={enabled} onClick={handleClick} />
            </SettingsCheckboxContainer>
        </StyledSettingsCheckbox>
    );
}
