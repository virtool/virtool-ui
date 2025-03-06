import React from "react";
import styled from "styled-components";
import { getFontSize, getFontWeight } from "../../app/theme";
import { Attribution, Box } from "@base/index";
import { MLModelRelease } from "../types";

const StyledMLModel = styled(Box)`
    display: flex;
    flex-direction: column;
`;

const MLModelHeader = styled.div`
    font-size: ${getFontSize("lg")};
    font-weight: ${getFontWeight("thick")};
    display: flex;
    justify-content: space-between;

    &:last-child {
        margin-left: auto;
    }
`;

type MLModelProps = {
    created_at: string;
    latest_release: MLModelRelease;
    name: string;
};

/**
 * A condensed MLModel for use in a list of MLModels
 *
 * @param created_at - The date the MLModel was created
 * @param latest_release - The latest release of the MLModel
 * @param name - The name of the MLModel
 * @returns A condensed MLModel
 */
export function MLModel({ created_at, latest_release, name }: MLModelProps) {
    const version = latest_release ? (
        <a href={latest_release.github_url}> {latest_release.name} </a>
    ) : (
        "No releases"
    );

    return (
        <StyledMLModel>
            <MLModelHeader>
                <span>{name}</span>
                {version}
            </MLModelHeader>
            <Attribution time={created_at} />
        </StyledMLModel>
    );
}
