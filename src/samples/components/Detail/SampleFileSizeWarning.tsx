import Alert from "@base/Alert";
import Link from "@base/Link";
import { Read } from "@samples/types";
import { AlertTriangle } from "lucide-react";
import { Route, useLocation } from "wouter";

type SampleFileSizeWarningProps = {
    reads: Read[];
    sampleId: string;
};

/**
 * Displays a warning if any sample uploads are under 10 megabytes
 */
export default function SampleFileSizeWarning({
    reads,
    sampleId,
}: SampleFileSizeWarningProps) {
    const [location] = useLocation();
    const show = reads.some((file) => file.size < 10000000);

    if (show) {
        const showLink = !location.endsWith("/uploads");

        const link = showLink ? (
            <Link to={`/samples/${sampleId}/files`}>Check the file sizes</Link>
        ) : (
            "Check the file sizes"
        );

        return (
            <Alert color="orange" level icon={AlertTriangle}>
                <Route path="~/samples/:sampleId/files"> test route</Route>
                <span>
                    <strong>
                        The read files in this sample are smaller than
                        expected.{" "}
                    </strong>
                    <span>{link} and ensure they are correct.</span>
                </span>
            </Alert>
        );
    }

    return null;
}
