import React from "react";
import styled from "styled-components";
import { getFontSize, getFontWeight } from "../../app/theme";
import { Attribution, Box } from "../../base";
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

    :last-child {
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
    latest_release = { name: "1.1.1.2", github_url: "https://github.com" };

    const version = latest_release ? (
        <ModelVersion name={latest_release.name} github_url={latest_release.github_url} />
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

/**
 * Version tag for a MLModel
 *
 * @param name - The name of the version
 * @param github_url - URL to the model on github
 * @returns A version tag
 */

function ModelVersion({ name, github_url }: { name: string; github_url: string }) {
    return (
        <div>
            Version: <a href={github_url}> {name} </a>
        </div>
    );
}
