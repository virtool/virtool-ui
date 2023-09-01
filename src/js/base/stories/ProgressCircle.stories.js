import { ProgressCircle } from "../ProgressCircle";

export default {
    title: "base/ProgressCircle",
    component: ProgressCircle,
};

function Template(args) {
    return <ProgressCircle {...args} />;
}

export const waiting = Template.bind();
waiting.args = { progress: 0 };

export const running = Template.bind();
running.args = { progress: 50, state: "running" };

export const failed = Template.bind();
failed.args = { progress: 50, state: "failed" };

export const complete = Template.bind({ progress: 100 });
complete.args = { progress: 100, state: "complete" };
