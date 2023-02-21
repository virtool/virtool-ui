import React from "react";
import styled from "styled-components";
import { BoxGroupSection, IconLink } from "../../base";
import { SampleLabel } from "../../samples/components/Label";

const LabelItemBox = styled(BoxGroupSection)`
    align-items: center;
    display: flex;
`;
const LabelItemContainer = styled.div`
    position: relative;
`;

const LabelItemExampleContainer = styled.div`
    min-width: 30%;
`;

const LabelItemIcons = styled.div`
    align-items: center;
    background-color: transparent;
    display: flex;
    font-size: 17px;
    padding-right: 15px;
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    z-index: 20;

    *:not(:first-child) {
        margin-left: 5px;
    }
`;

export function Item({ name, color, description, id }) {
    return (
        <LabelItemContainer>
            <LabelItemBox>
                <LabelItemExampleContainer>
                    <SampleLabel name={name} color={color} />
                </LabelItemExampleContainer>
                {description}
            </LabelItemBox>
            <LabelItemIcons>
                <IconLink to={{ state: { editLabel: id } }} color="orange" name="pencil-alt" tip="Edit" />
                <IconLink to={{ state: { removeLabel: id } }} color="red" name="fas fa-trash" tip="Remove" />
            </LabelItemIcons>
        </LabelItemContainer>
    );
}
