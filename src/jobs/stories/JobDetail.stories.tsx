import type { Meta, StoryObj } from "@storybook/react-vite";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Route, Router } from "wouter";
import { memoryLocation } from "wouter/memory-location";
import JobDetail from "../components/JobDetail";
import { jobQueryKeys } from "../queries";
import type { ServerJob, ServerJobStep, ServerWorkflow } from "../types";

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

type CreateServerJobOverrides = Partial<ServerJob>;

function createServerJob(overrides: CreateServerJobOverrides = {}): ServerJob {
    const now = new Date();

    const steps: ServerJobStep[] = [
        {
            id: "mk_sample_dir",
            name: "Make sample directory",
            description: "Create the sample directory structure",
            started_at: new Date(now.getTime() - 60000).toISOString(),
        },
        {
            id: "copy_files",
            name: "Copy files",
            description: "Copy read files to sample directory",
            started_at: new Date(now.getTime() - 45000).toISOString(),
        },
        {
            id: "compute_quality",
            name: "Compute quality",
            description: "Calculate quality metrics for reads",
            started_at: new Date(now.getTime() - 30000).toISOString(),
        },
    ];

    return {
        id: "13",
        args: { sample_id: "sample123" },
        claim: {
            cpu: 4,
            image: "virtool/workflow:latest",
            mem: 8,
            runner_id: "runner-1",
            runtime_version: "1.0.0",
            workflow_version: "1.0.0",
        },
        claimed_at: new Date(now.getTime() - 115000).toISOString(),
        created_at: new Date(now.getTime() - 120000).toISOString(),
        finished_at: null,
        progress: 75,
        state: "running",
        steps,
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
                    state: "succeeded",
                    progress: 100,
                    finished_at: now.toISOString(),
                    steps: [
                        {
                            id: "mk_sample_dir",
                            name: "Make sample directory",
                            description:
                                "Create the sample directory structure",
                            started_at: new Date(
                                now.getTime() - 60000,
                            ).toISOString(),
                        },
                        {
                            id: "finalize",
                            name: "Finalize sample",
                            description: "Complete sample creation",
                            started_at: new Date(
                                now.getTime() - 30000,
                            ).toISOString(),
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
                    state: "failed",
                    finished_at: now.toISOString(),
                    steps: [
                        {
                            id: "mk_sample_dir",
                            name: "Make sample directory",
                            description:
                                "Create the sample directory structure",
                            started_at: new Date(
                                now.getTime() - 60000,
                            ).toISOString(),
                        },
                    ],
                })}
            />
        );
    },
};

export const Pending: Story = {
    render: () => {
        return (
            <JobDetailStory
                job={createServerJob({
                    state: "pending",
                    claim: null,
                    claimed_at: null,
                    progress: 0,
                    steps: null,
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
