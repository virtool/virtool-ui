import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import { Badge, InputContainer, InputError, InputGroup, InputLabel, TextArea } from "../../base";
export const SequenceFieldTextArea = styled(TextArea)`
    font-family: ${props => props.theme.fontFamily.monospace};
    transform-text: uppercase;
`;

const SequenceField = ({ value, readOnly = false, error, onChange, onBlur }) => (
    <InputGroup>
        <InputLabel htmlFor="sequence">
            Sequence <Badge>{value.length}</Badge>
        </InputLabel>
        <InputContainer>
            <SequenceFieldTextArea
                name="sequence"
                readOnly={readOnly}
                onChange={onChange}
                value={value}
                error={error}
                onBlur={onBlur}
                id="sequence"
            />
            <InputError>{error}</InputError>
        </InputContainer>
    </InputGroup>
);

SequenceField.propTypes = {
    value: PropTypes.string,
    readOnly: PropTypes.bool,
    error: PropTypes.string,
    onChange: PropTypes.func,
    onBlur: PropTypes.func
};

SequenceField.defaultProps = {
    value: "",
    readOnly: false,
    error: "",
    onChange: null,
    onBlur: null
};

export default SequenceField;
