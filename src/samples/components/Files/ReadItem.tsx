import { fontWeight } from "@app/theme";
import { byteSize } from "@app/utils";
import BoxGroupSection from "@base/BoxGroupSection";
import styled from "styled-components";

const ReadItemMain = styled.div`
    align-items: center;
    display: flex;
`;

const StyledReadItem = styled(BoxGroupSection)`
    align-items: flex-start;
    display: flex;
    font-weight: ${fontWeight.thick};
    justify-content: space-between;
`;

/**
 * Sanitize a string for use as a filename by replacing invalid characters
 * with underscores.
 */
function sanitizeFileName(name: string): string {
    return name.replace(/[/\\:*?"<>|\s]/g, "_");
}

type ReadItemProps = {
    download_url: string;
    sampleName: string;
    side: number;
    /** The size of the read file in bytes */
    size: number;
};

/**
 * A condensed read item for use in a list of reads
 */
export default function ReadItem({
    download_url,
    sampleName,
    side,
    size,
}: ReadItemProps) {
    const downloadName = `${sanitizeFileName(sampleName)}_${side}.fq.gz`;

    return (
        <StyledReadItem>
            <ReadItemMain>
                <div>
                    <a href={`/api/${download_url}`} download={downloadName}>
                        {downloadName}
                    </a>
                </div>
            </ReadItemMain>
            {byteSize(size, true)}
        </StyledReadItem>
    );
}
