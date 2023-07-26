import React from "react";
import { connect } from "react-redux";
import styled from "styled-components";
import {
    BoxGroup,
    BoxGroupHeader,
    BoxGroupSection,
    Button,
    Icon,
    Loader,
    ProgressBarAffixed,
    RelativeTime,
} from "../../../base";
import { checkUpdates, updateRemoteReference } from "../../actions";
import { checkReferenceRight, getProgress } from "../../selectors";

const ReleaseButtonContainer = styled.div`
    margin: 0;
    padding-top: 15px;
`;

const ReleaseHeader = styled.div`
    align-items: center;
    display: flex;
    gap: ${props => props.theme.gap.text};

    > i,
    > strong {
        color: ${props => props.theme.color[props.newer ? "blue" : "greenDark"]};
    }
`;

const ReleaseLastChecked = styled.span`
    align-items: center;
    display: flex;
    margin-left: auto;

    span {
        padding-right: 3px;
    }
`;

const StyledRelease = styled(BoxGroupSection)``;

const Release = ({ release, checking, updating, onCheckUpdates, onUpdate }) => {
    const hasUpdate = !updating && release.newer;

    return (
        <StyledRelease newer={release.newer}>
            <ReleaseHeader>
                <Icon name={release.newer ? "arrow-alt-circle-up" : "check"} />
                <strong>{release.newer ? "Update Available" : "Up-to-date"}</strong>

                {hasUpdate && (
                    <>
                        <span>/</span>
                        <span>{release.name}</span>
                        <span>/</span>
                        <span>
                            Published <RelativeTime time={release.published_at} />
                        </span>
                    </>
                )}

                <ReleaseLastChecked>
                    {release.retrieved_at && (
                        <span>
                            Last checked <RelativeTime time={release.retrieved_at} />
                        </span>
                    )}
                    {checking ? <Loader size="14px" /> : <Icon name="sync" onClick={onCheckUpdates} />}
                </ReleaseLastChecked>
            </ReleaseHeader>

            {hasUpdate && (
                <ReleaseButtonContainer>
                    <Button icon="download" color="blue" onClick={onUpdate} disabled={updating}>
                        Install
                    </Button>
                </ReleaseButtonContainer>
            )}
        </StyledRelease>
    );
};

const StyledUpgrade = styled(BoxGroupSection)`
    align-items: center;
    color: ${props => props.theme.color.blue};
    display: flex;

    strong {
        margin-left: 3px;
    }
`;

const Upgrade = ({ progress }) => (
    <StyledUpgrade>
        <ProgressBarAffixed color="green" now={progress} />
        <Icon name="arrow-alt-circle-up" />
        <strong>Updating</strong>
    </StyledUpgrade>
);

const RemoteHeader = styled(BoxGroupHeader)`
    align-items: center;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
`;

const InstalledHeader = styled(BoxGroupSection)`
    align-items: center;
    display: flex;
    gap: ${props => props.theme.gap.text};
`;

const Remote = ({ detail, onCheckUpdates, onUpdate, checking, progress }) => {
    const { id, installed, release, remotes_from, updating } = detail;

    const slug = remotes_from.slug;

    return (
        <BoxGroup>
            <RemoteHeader>
                <h2>Remote Reference</h2>
                <a href={`https://github.com/${slug}`} target="_blank" rel="noopener noreferrer">
                    <Icon faStyle="fab" name="github" /> {slug}
                </a>
            </RemoteHeader>

            {installed && (
                <InstalledHeader>
                    <Icon name="hdd" />
                    <strong>Installed Version</strong>
                    <span>/</span>
                    <span>{installed.name}</span>
                    <span>/</span>
                    <span>Published</span>
                    <RelativeTime time={installed.published_at} />
                </InstalledHeader>
            )}

            {updating ? (
                <Upgrade progress={progress} />
            ) : (
                <Release
                    release={release}
                    checking={checking}
                    updating={updating}
                    onCheckUpdates={() => onCheckUpdates(id)}
                    onUpdate={() => onUpdate(id)}
                />
            )}
        </BoxGroup>
    );
};

const mapStateToProps = state => ({
    detail: state.references.detail,
    checking: state.references.checking,
    canRemove: checkReferenceRight(state, "remove"),
    progress: getProgress(state),
});

const mapDispatchToProps = dispatch => ({
    onCheckUpdates: refId => {
        dispatch(checkUpdates(refId));
    },

    onUpdate: refId => {
        dispatch(updateRemoteReference(refId));
    },
});

export default connect(mapStateToProps, mapDispatchToProps)(Remote);
