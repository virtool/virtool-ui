import React from "react";
import styled from "styled-components";
import { map, reject, reverse } from "lodash-es";
import { connect } from "react-redux";
import { Badge, BoxGroup, BoxGroupHeader, BoxGroupSection } from "../../base";
import UploadItem from "./UploadItem";
import { getFontWeight, getFontSize } from "../../app/theme";

const StyledUploadOverlay = styled.div`
    bottom: 0;
    ${props => (props.show ? "" : "display: none;")};
    max-width: 500px;
    padding: 0 15px 15px 0;
    position: fixed;
    right: 0;
    width: 35%;
    z-index: 90;
`;

const UploadOverlayContent = styled(BoxGroup)`
    background-color: ${props => props.theme.color.white};
    box-shadow: ${props => props.theme.boxShadow.lg};
    margin: 0;

    ${BoxGroupHeader} {
        display: block;
        font-weight: ${getFontWeight("thick")};
        font-size: ${getFontSize("lg")};
    }
`;

const UploadOverlayList = styled(BoxGroupSection)`
    height: auto;
    max-height: 200px;
    overflow-x: hidden;
    padding: 0;
`;

export const UploadOverlay = ({ uploads }) => {
    if (uploads.length) {
        const uploadComponents = map(uploads, upload => <UploadItem key={upload.localId} {...upload} />);

        return (
            <StyledUploadOverlay show={uploads.length}>
                <UploadOverlayContent>
                    <BoxGroupHeader>
                        Uploads <Badge>{uploadComponents.length}</Badge>
                    </BoxGroupHeader>
                    <UploadOverlayList>{uploadComponents}</UploadOverlayList>
                </UploadOverlayContent>
            </StyledUploadOverlay>
        );
    }

    return null;
};

export const mapStateToProps = state => {
    return { uploads: reverse(reject(state.files.uploads, { fileType: "reference" })) };
};

export default connect(mapStateToProps)(UploadOverlay);
