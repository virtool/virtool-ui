import Alert from "@base/Alert";
import Link from "@base/Link";
import { CircleAlert } from "lucide-react";

interface AnalysisHMMAlertProps {
    installed: boolean;
}

/** Banner informing the user when HMMs are not installed */
export default function AnalysisHMMAlert({ installed }: AnalysisHMMAlertProps) {
    if (installed) {
        return null;
    }

    return (
        <Alert color="orange">
            <div className="flex gap-2 items-center">
                <CircleAlert size={18} />
                <span>
                    <strong>HMM data is not installed. </strong>
                    <Link to="/hmm">Install HMMs</Link>
                    <span> to run NuV analyses.</span>
                </span>
            </div>
        </Alert>
    );
}
