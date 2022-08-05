import { useEffect, useState } from "react";

export const useCreateAnalysis = (dataType, defaultSubtractions) => {
    const [errors, setErrors] = useState({});
    const [indexes, setIndexes] = useState([]);
    const [subtractions, setSubtractions] = useState(defaultSubtractions);
    const [workflows, setWorkflows] = useState([]);

    const setIndexesAndError = indexes => {
        setIndexes(indexes);
        setErrors({
            ...errors,
            indexes: false
        });
    };

    const setWorkflowsAndError = workflows => {
        setWorkflows(workflows);
        setErrors({
            ...errors,
            workflows: false
        });
    };

    useEffect(() => {
        setErrors({});
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
        setWorkflows: setWorkflowsAndError
    };
};
