import React from "react";
import styled from "styled-components";
import { BoxGroupSection, Button } from "../../../base";
import { TargetInfo } from "./TargetInfo";

const TargetAddButton = styled.div`
    display: flex;
    justify-content: center;
    padding-top: 15px;
`;

export const Target = props => {
    return (
        <BoxGroupSection>
            <TargetInfo {...props} />

            <TargetAddButton>
                <Button color="blue" onClick={props.onClick}>
                    Add
                </Button>
            </TargetAddButton>
        </BoxGroupSection>
    );
};
