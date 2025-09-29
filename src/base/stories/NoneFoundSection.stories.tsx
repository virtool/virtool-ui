import type { Meta, StoryObj } from "@storybook/react-vite";
import Link from "../Link";
import NoneFoundSection from "../NoneFoundSection";

const meta: Meta<typeof NoneFoundSection> = {
    title: "base/NoneFound/NoneFoundSection",
    component: NoneFoundSection,
    args: {
        noun: "items",
    },
    tags: ["autodocs"],
};

export default meta;

type Story = StoryObj<typeof meta>;

function Template(args) {
    return (
        <NoneFoundSection {...args}>
            {args.displayLink && <Link to="#">Click here to create one</Link>}
        </NoneFoundSection>
    );
}

export const TestNoneFoundSection: Story = {
    render: Template,
};

export const NoneFoundSectionWithChild: Story = {
    render: () => <Template displayLink />,
};
