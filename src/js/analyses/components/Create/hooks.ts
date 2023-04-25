import { useEffect, useState } from "react";
import { ReferenceDataType } from "../../../references/types";

export type UseCreateAnalysisReturn = {
    errors: {
        indexes: boolean;
        workflows: boolean;
    };
    indexes: string[];
    subtractions: string[];
    workflows: string[];
    setErrors: (errors: { indexes: boolean; workflows: boolean }) => void;
    setIndexes: (indexes: string[]) => void;
    setSubtractions: (subtractions: string[]) => void;
    setWorkflows: (workflows: string[]) => void;
};

export function useCreateAnalysis(dataType: ReferenceDataType, defaultSubtractions: string[]): UseCreateAnalysisReturn {
    const [errors, setErrors] = useState({ indexes: false, workflows: false });
    const [indexes, setIndexes] = useState([]);
    const [subtractions, setSubtractions] = useState(defaultSubtractions);
    const [workflows, setWorkflows] = useState([]);

    const setIndexesAndError = indexes => {
        setIndexes(indexes);
        setErrors({
            ...errors,
            indexes: false,
        });
    };

    const setWorkflowsAndError = workflows => {
        setWorkflows(workflows);
        setErrors({
            ...errors,
            workflows: false,
        });
    };

    useEffect(() => {
        setErrors({ indexes: false, workflows: false });
        setIndexes([]);
        setWorkflows([]);
    }, [dataType]);

    return {
        errors,
        indexes,
        subtractions,
        workflows,
        setErrors,
        setIndexes: setIndexesAndError,
        setSubtractions,
        setWorkflows: setWorkflowsAndError,
    };
}
