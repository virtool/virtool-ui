import React from "react";
import styled from "styled-components";
import { getBorder, getColor, getFontWeight } from "../../app/theme";
import { AffixedProgressBar, Icon, Loader } from "../../base";
import { byteSize } from "../../utils/utils";
import { connect } from "react-redux";
import { removeUpload } from "../actions";

const StyledUploadItem = styled.div`
    padding: 0;
    position: relative;

    &:not(:last-child) {
        border-bottom: ${getBorder};
    }
`;

const UploadItemTitle = styled.div`
    align-items: center;
    display: flex;
    padding: 15px 15px 10px;

    i.fas {
        margin-right: 5px;
    }
    span:last-child {
        margin-left: auto;
        color: ${props => (props.failed ? getColor({ theme: props.theme, color: "red" }) : "inherit")};
    }
    i.fa-times {
        font-size: 20px;
    }
    i.fa-trash {
        margin-left: 5px;
        font-size: 14px;
    }
`;

const StyledFilename = styled.span`
    font-weight: ${getFontWeight("thick")};
`;

export const UploadItem = ({ name, progress, size, failed, localId, onRemove }) => {
    let uploadIcon = progress === 100 ? <Loader size="14px" /> : <Icon name="upload" />;
    let uploadBookend = byteSize(size);

    if (failed) {
        uploadIcon = <Icon name="times" color={"red"} hoverable={false} />;
        uploadBookend = (
            <>
                Failed <Icon aria-label={`delete ${name}`} name="trash" color="red" onClick={() => onRemove(localId)} />
            </>
        );
    }

    return (
        <StyledUploadItem>
            <AffixedProgressBar now={failed ? 100 : progress} color={failed ? "red" : "blue"} />
            <UploadItemTitle failed={failed}>
                {uploadIcon}
                <StyledFilename>{name}</StyledFilename>
                <span>{uploadBookend}</span>
            </UploadItemTitle>
        </StyledUploadItem>
    );
};

const mapDispatchToProps = dispatch => ({
    onRemove: localId => {
        dispatch(removeUpload(localId));
    }
});

export default connect(null, mapDispatchToProps)(UploadItem);
