import type { Meta, StoryObj } from "@storybook/react-vite";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Route, Router } from "wouter";
import { memoryLocation } from "wouter/memory-location";
import JobDetail from "../components/JobDetail";
import { jobQueryKeys } from "../queries";
import type { ServerJob, ServerWorkflow } from "../types";

const meta: Meta<typeof JobDetail> = {
    title: "jobs/Detail",
    component: JobDetail,
};

export default meta;

type Story = StoryObj<typeof meta>;

const user = {
    id: 1,
    handle: "bob",
};

type CreateServerJobOverrides = Partial<
    Omit<ServerJob, "status"> & { status?: ServerJob["status"] }
>;

function createServerJob(overrides: CreateServerJobOverrides = {}): ServerJob {
    const now = new Date();

    const status: ServerJob["status"] = [
        {
            state: "waiting",
            timestamp: new Date(now.getTime() - 120000).toISOString(),
        },
        {
            state: "running",
            stage: "mk_sample_dir",
            step_name: "Make sample directory",
            step_description: "Create the sample directory structure",
            timestamp: new Date(now.getTime() - 60000).toISOString(),
        },
        {
            state: "running",
            stage: "copy_files",
            step_name: "Copy files",
            step_description: "Copy read files to sample directory",
            timestamp: new Date(now.getTime() - 45000).toISOString(),
        },
        {
            state: "running",
            stage: "compute_quality",
            step_name: "Compute quality",
            step_description: "Calculate quality metrics for reads",
            timestamp: new Date(now.getTime() - 30000).toISOString(),
        },
    ];

    return {
        id: "abc123xy",
        acquired: true,
        args: { sample_id: "sample123" },
        created_at: new Date(now.getTime() - 120000).toISOString(),
        progress: 75,
        stage: "compute_quality",
        state: "running",
        status,
        user,
        workflow: "create_sample",
        ...overrides,
    };
}

function createStoryQueryClient(job: ServerJob) {
    const queryClient = new QueryClient({
        defaultOptions: {
            queries: {
                refetchOnWindowFocus: false,
                refetchOnMount: false,
                staleTime: Infinity,
                retry: false,
            },
        },
    });

    queryClient.setQueryData(jobQueryKeys.detail(job.id), job);

    return queryClient;
}

type JobDetailStoryProps = {
    job: ServerJob;
};

function JobDetailStory({ job }: JobDetailStoryProps) {
    const queryClient = createStoryQueryClient(job);
    const { hook } = memoryLocation({
        path: `/jobs/${job.id}`,
        static: true,
    });

    return (
        <QueryClientProvider client={queryClient}>
            <Router hook={hook}>
                <Route path="/jobs/:jobId">
                    <JobDetail />
                </Route>
            </Router>
        </QueryClientProvider>
    );
}

export const Running: Story = {
    render: () => <JobDetailStory job={createServerJob()} />,
};

export const Succeeded: Story = {
    render: () => {
        const now = new Date();
        return (
            <JobDetailStory
                job={createServerJob({
                    state: "complete",
                    progress: 100,
                    status: [
                        {
                            state: "waiting",
                            timestamp: new Date(
                                now.getTime() - 120000,
                            ).toISOString(),
                        },
                        {
                            state: "running",
                            stage: "mk_sample_dir",
                            step_name: "Make sample directory",
                            step_description:
                                "Create the sample directory structure",
                            timestamp: new Date(
                                now.getTime() - 60000,
                            ).toISOString(),
                        },
                        {
                            state: "running",
                            stage: "finalize",
                            step_name: "Finalize sample",
                            step_description: "Complete sample creation",
                            timestamp: new Date(
                                now.getTime() - 30000,
                            ).toISOString(),
                        },
                        {
                            state: "complete",
                            timestamp: now.toISOString(),
                        },
                    ],
                })}
            />
        );
    },
};

export const Failed: Story = {
    render: () => {
        const now = new Date();
        return (
            <JobDetailStory
                job={createServerJob({
                    state: "error",
                    status: [
                        {
                            state: "waiting",
                            timestamp: new Date(
                                now.getTime() - 120000,
                            ).toISOString(),
                        },
                        {
                            state: "running",
                            stage: "mk_sample_dir",
                            step_name: "Make sample directory",
                            step_description:
                                "Create the sample directory structure",
                            timestamp: new Date(
                                now.getTime() - 60000,
                            ).toISOString(),
                        },
                        {
                            state: "error",
                            timestamp: now.toISOString(),
                        },
                    ],
                })}
            />
        );
    },
};

export const Pending: Story = {
    render: () => {
        const now = new Date();
        return (
            <JobDetailStory
                job={createServerJob({
                    state: "waiting",
                    stage: null,
                    progress: 0,
                    status: [
                        {
                            state: "waiting",
                            timestamp: now.toISOString(),
                        },
                    ],
                })}
            />
        );
    },
};

export const PathoscopeAnalysis: Story = {
    render: () => (
        <JobDetailStory
            job={createServerJob({
                workflow: "pathoscope_bowtie" as ServerWorkflow,
                args: {
                    sample_id: "sample456",
                    analysis_id: "analysis789",
                },
            })}
        />
    ),
};

export const BuildIndex: Story = {
    render: () => (
        <JobDetailStory
            job={createServerJob({
                workflow: "build_index" as ServerWorkflow,
                args: {
                    ref_id: "ref123",
                    index_id: "index456",
                },
            })}
        />
    ),
};
