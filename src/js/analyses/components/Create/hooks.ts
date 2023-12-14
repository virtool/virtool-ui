import { useEffect, useState } from "react";
import { ReferenceDataType } from "../../../references/types";

export type UseCreateAnalysisReturn = {
    errors: {
        indexes: boolean;
        workflow: boolean;
    };
    indexes: string[];
    subtractions: string[];
    workflow: string;
    setErrors: (errors: { indexes: boolean; workflow: boolean }) => void;
    setIndexes: (indexes: string[]) => void;
    setSubtractions: (subtractions: string[]) => void;
    setWorkflow: (workflow: string) => void;
};

export function useCreateAnalysis(dataType: ReferenceDataType, defaultSubtractions: string[]): UseCreateAnalysisReturn {
    const [errors, setErrors] = useState({ indexes: false, workflow: false });
    const [indexes, setIndexes] = useState([]);
    const [subtractions, setSubtractions] = useState(defaultSubtractions);
    const [workflow, setWorkflow] = useState("");

    const setIndexesAndError = indexes => {
        setIndexes(indexes);
        setErrors({
            ...errors,
            indexes: false,
        });
    };

    function setWorkflowAndError(workflow: string) {
        setWorkflow(workflow);
        setErrors({
            ...errors,
            workflow: false,
        });
    }

    function reset() {
        setWorkflow("");
        setIndexes([]);
        setSubtractions([]);
        setErrors({ indexes: false, workflow: false });
    }

    useEffect(() => {
        setErrors({ indexes: false, workflow: false });
        setIndexes([]);
        setWorkflow("");
    }, [dataType]);

    return {
        errors,
        indexes,
        subtractions,
        workflow,
        setErrors,
        setIndexes: setIndexesAndError,
        setSubtractions,
        setWorkflow: setWorkflowAndError,
        reset,
    };
}
