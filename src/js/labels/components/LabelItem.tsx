import React from "react";
import styled from "styled-components";
import { BoxGroupSection } from "../../base";
import { SampleLabel } from "../../samples/components/Label/SampleLabel";
import { EditLabel } from "./EditLabel";
import { RemoveLabel } from "./RemoveLabel";

const LabelItemBox = styled(BoxGroupSection)`
    align-items: center;
    display: flex;
`;

const LabelItemExampleContainer = styled.div`
    min-width: 30%;
`;

const LabelItemButtons = styled.div`
    align-items: center;
    background-color: transparent;
    display: flex;
    font-size: 17px;
    padding-right: 15px;
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;

    *:not(:first-child) {
        margin-left: 5px;
    }
`;

type ItemProps = {
    name: string;
    color: string;
    description: string;
    id: number;
};

/**
 * A condensed label item for use in a list of labels
 */
export function LabelItem({ name, color, description, id }: ItemProps) {
    return (
        <LabelItemBox>
            <LabelItemExampleContainer>
                <SampleLabel name={name} color={color} />
            </LabelItemExampleContainer>
            {description}
            <LabelItemButtons>
                <EditLabel id={id} color={color} description={description} name={name} />
                <RemoveLabel id={id} name={name} />
            </LabelItemButtons>
        </LabelItemBox>
    );
}
