import { xor } from "lodash-es";
import React, { useContext } from "react";
import styled from "styled-components";
import { BoxGroup, SelectBoxGroupSection } from "./Box";
import { Checkbox } from "./Checkbox";
import { InputError } from "./Input";
import { NoneFoundBox } from "./NoneFound";

export const MultiSelectorContext = React.createContext([]);

const MultiSelectorError = styled(InputError)`
    margin: -5px 0 15px;
`;

const StyledMultiSelectorItem = styled(SelectBoxGroupSection)`
    align-items: center;
    display: flex;
    user-select: none;
`;

export const MultiSelectorItem = ({ children, className, name, value, displayCheckbox }) => {
    const { selected, onSelect } = useContext(MultiSelectorContext);
    const active = selected.includes(value);

    return (
        <StyledMultiSelectorItem
            as="button"
            active={active}
            className={className}
            name={name}
            type="button"
            onClick={() => onSelect(value)}
        >
            {displayCheckbox && <Checkbox checked={active} />} {children}
        </StyledMultiSelectorItem>
    );
};

export const MultiSelectorList = styled(BoxGroup)`
    ${props => (props.error ? `border-color: ${props.theme.color.red};` : "")};
    ${props => (props.noOverflow ? "" : "max-height: 160px")};
    ${props => (props.noOverflow ? "" : "overflow-y: auto")};
`;

export const MultiSelector = ({ children, error, noun, selected, onChange, noOverflow }) => {
    const handleSelect = value => {
        onChange(xor(selected, [value]));
    };

    const content = <NoneFoundBox noun={noun} />;

    return (
        <MultiSelectorContext.Provider
            value={{
                selected,
                onSelect: handleSelect
            }}
        >
            {children ? (
                <MultiSelectorList noOverflow={noOverflow} error={error}>
                    {children}
                </MultiSelectorList>
            ) : (
                content
            )}
            {error && <MultiSelectorError>{error}</MultiSelectorError>}
        </MultiSelectorContext.Provider>
    );
};
