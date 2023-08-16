import { ProgressCircle } from "../ProgressCircle";

export default {
    title: "base/ProgressCircle",
    component: ProgressCircle,
};

function Template(args) {
    return <ProgressCircle {...args} />;
}

export const noProgress = Template.bind({ progress: 0 });

noProgress.args = { progress: 0 };

export const halfProgress = Template.bind({ progress: 50 });
halfProgress.args = { progress: 50 };

export const fullProgress = Template.bind({ progress: 100 });
fullProgress.args = { progress: 100 };
