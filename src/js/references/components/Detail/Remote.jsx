import React from "react";
import styled from "styled-components";
import { BoxGroup, BoxGroupHeader, BoxGroupSection, Button, Icon, Loader, RelativeTime } from "../../../base";
import { ProgressCircle } from "../../../base/ProgressCircle";
import { useCheckReferenceUpdates, useUpdateRemoteReference } from "../../queries";

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
                    <Button color="blue" disabled={updating} onClick={onUpdate}>
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
        <ProgressCircle progress={progress} state={"running"} />
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

export default function Remote({ detail }) {
    const { id, installed, release, remotes_from, updating, task } = detail;
    const slug = remotes_from.slug;
    const { mutate: checkReferenceUpdate, isLoading: isLoadingReferenceUpdate } = useCheckReferenceUpdates(id);
    const { mutate: updateRemoteReference } = useUpdateRemoteReference(id);

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
                <Upgrade progress={task.progress} />
            ) : (
                <Release
                    release={release}
                    checking={isLoadingReferenceUpdate}
                    updating={updating}
                    onCheckUpdates={checkReferenceUpdate}
                    onUpdate={updateRemoteReference}
                />
            )}
        </BoxGroup>
    );
}
