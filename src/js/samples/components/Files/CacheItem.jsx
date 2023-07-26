import { sumBy } from "lodash-es";
import React from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import styled from "styled-components";
import { Badge, BoxGroupSection, Icon, RelativeTime } from "../../../base";
import { byteSize } from "../../../utils/utils";

const calculateSize = files => byteSize(sumBy(files, "size"));

const CacheItemLink = styled(Link)`
    display: block;
    font-weight: bold;
`;

CacheItemLink.displayName = "CacheItemLink";

const CacheItemLinkContainer = styled.div`
    margin-left: 10px;
`;

CacheItemLinkContainer.displayName = "CacheItemLinkContainer";

const CacheItemHeader = styled.div`
    align-items: center;
`;

CacheItemHeader.displayName = "CacheItemHeader";

const CacheItemRight = styled.div`
    display: flex;
    font-weight: bold;
    width: 180px;
    justify-content: space-between;
`;

CacheItemRight.displayName = "CacheItemRight";

const StyledSampleCacheItem = styled(BoxGroupSection)`
    align-items: flex-start;
    display: flex;
    justify-content: space-between;
`;

export function SampleCacheItem({ createdAt, files, hash, id, missing, sampleId }) {
    return (
        <StyledSampleCacheItem>
            <CacheItemHeader>
                <i className="fas fa-archive fa-fw" style={{ fontSize: "24px" }} />
                <CacheItemLinkContainer>
                    <CacheItemLink to={`/samples/${sampleId}/files/${id}`}>{hash}</CacheItemLink>
                    <small>
                        Created <RelativeTime time={createdAt} />
                    </small>
                </CacheItemLinkContainer>
            </CacheItemHeader>
            <CacheItemRight>
                <div>
                    {missing && (
                        <Badge color="red">
                            <Icon name="exclamation-circle" /> Files Missing
                        </Badge>
                    )}
                </div>
                <div>{calculateSize(files)}</div>
            </CacheItemRight>
        </StyledSampleCacheItem>
    );
}

export function mapStateToProps(state) {
    return {
        sampleId: state.samples.detail.id,
    };
}

export default connect(mapStateToProps)(SampleCacheItem);
