import { useCheckAdminRoleOrPermission } from "@administration/hooks";
import { Box, Button, ExternalLink } from "@base";
import { Permission } from "@groups/types";
import { useRemoteReference } from "@references/queries";
import React from "react";
import styled from "styled-components";

const StyledReferenceOfficial = styled(Box)`
    align-items: center;
    display: flex;

    h5 {
        font-size: ${props => props.theme.fontSize.lg};
        font-weight: ${props => props.theme.fontWeight.thick};
    }

    button {
        margin-left: auto;
        min-width: 83px;
    }
`;

type ReferenceOfficialProps = {
    officialInstalled: boolean;
};

/**
 * Displays a component to install the official reference from Virtool's repository
 */
export default function ReferenceOfficial({ officialInstalled }: ReferenceOfficialProps) {
    const { hasPermission } = useCheckAdminRoleOrPermission(Permission.create_ref);
    const mutation = useRemoteReference();
    const show = !officialInstalled && hasPermission;

    return show ? (
        <StyledReferenceOfficial>
            <div>
                <h5>Official Reference</h5>
                <p>
                    <span>We have published an official </span>
                    <ExternalLink href="https://github.com/virtool/ref-plant-viruses">
                        plant virus reference
                    </ExternalLink>
                    <span> that can be installed automatically. Once installed, it can easily be kept up-to-date.</span>
                </p>
            </div>
            <Button
                color="blue"
                icon="cloud-download-alt"
                onClick={() => mutation.mutate({ remotes_from: "virtool/ref-plant-viruses" })}
            >
                Install
            </Button>
        </StyledReferenceOfficial>
    ) : null;
}
