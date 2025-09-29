import type { Meta, StoryObj } from "@storybook/react-vite";
import { map } from "lodash";
import BoxGroupSection from "../BoxGroupSection";
import ScrollArea from "../ScrollArea";

const meta: Meta<typeof ScrollArea> = {
    title: "base/ScrollArea",
    component: ScrollArea,
};

export default meta;

type Story = StoryObj<typeof meta>;

function Template(args) {
    const items = Array.from({ length: 10 }, (_, i) => `Item ${i + 1}`);

    return (
        <ScrollArea className={args.className}>
            {map(items, (item, index) => (
                <BoxGroupSection key={index}>{item}</BoxGroupSection>
            ))}
        </ScrollArea>
    );
}

export const Default: Story = {
    render: Template,
    args: {
        className: "h-52",
    },
};
