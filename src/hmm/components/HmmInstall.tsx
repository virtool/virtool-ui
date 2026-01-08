import { useCheckAdminRoleOrPermission } from "@administration/hooks";
import Alert from "@base/Alert";
import Box from "@base/Box";
import Button from "@base/Button";
import Icon from "@base/Icon";
import LoadingPlaceholder from "@base/LoadingPlaceholder";
import ProgressBarAffixed from "@base/ProgressBarAffixed";
import { Permission } from "@groups/types";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { hmmQueryKeys, useInstallHmm, useListHmms } from "../queries";

/**
 * Displays the installation progress information or provides the option to install HMMs
 */
export function HmmInstall() {
    const { data, isPending } = useListHmms(1, 25);
    const queryClient = useQueryClient();
    const { hasPermission: canInstall } = useCheckAdminRoleOrPermission(
        Permission.modify_hmm,
    );
    const installMutation = useInstallHmm();

    const taskComplete = data?.status?.task?.complete;

    useEffect(() => {
        if (taskComplete) {
            queryClient.invalidateQueries({ queryKey: hmmQueryKeys.lists() });
        }
    }, [taskComplete, queryClient]);

    if (isPending) {
        return <LoadingPlaceholder />;
    }

    const {
        status: { installed, task },
    } = data;

    if (task && !installed) {
        const progress = task.progress;
        const step = task.step.replace("_", " ");

        return (
            <Box className="flex justify-center py-9">
                <ProgressBarAffixed color="blue" now={progress} />
                <div>
                    <h3 className="text-xl">Installing</h3>
                    <p className="text-center capitalize">{step}</p>
                </div>
            </Box>
        );
    }

    return (
        <Box className="flex justify-center py-9">
            <Icon
                name="info-circle"
                className="text-3xl text-blue-500 mt-0.5 mx-2.5"
            />
            <div>
                <h3 className="text-xl font-medium mb-0.5">
                    HMM profiles not installed.
                </h3>
                <p>
                    HMM profiles are required for NuVs analysis. Click below to
                    install the official profiles.
                </p>
                {canInstall ? (
                    <Button
                        className="mt-4"
                        color="blue"
                        onClick={() => installMutation.mutate()}
                    >
                        Install
                    </Button>
                ) : (
                    <Alert block className="m-0 mt-4" color="orange">
                        Contact an administrator to install HMMs.
                    </Alert>
                )}
            </div>
        </Box>
    );
}
