import { getFontSize, getFontWeight } from "../../app/theme";
import Attribution from "../../base/Attribution";
import Box from "../../base/Box";
import React from "react";
import styled from "styled-components";
import { MLModelRelease } from "../types";

const MlModelHeader = styled.div`
    font-size: ${getFontSize("lg")};
    font-weight: ${getFontWeight("thick")};
    display: flex;
    justify-content: space-between;

    &:last-child {
        margin-left: auto;
    }
`;

type MlModelProps = {
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
export function MlModel({ created_at, latest_release, name }: MlModelProps) {
    const version = latest_release ? (
        <a href={latest_release.github_url}> {latest_release.name} </a>
    ) : (
        "No releases"
    );

    return (
        <Box className="flex flex-col">
            <MlModelHeader>
                <span>{name}</span>
                {version}
            </MlModelHeader>
            <Attribution time={created_at} />
        </Box>
    );
}
