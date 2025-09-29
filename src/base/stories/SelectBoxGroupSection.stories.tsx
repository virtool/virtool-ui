import type { Meta, StoryObj } from "@storybook/react-vite";
import { useArgs } from "storybook/preview-api";
import BoxGroup from "../BoxGroup";
import SelectBoxGroupSection from "../SelectBoxGroupSection";

const meta: Meta<typeof SelectBoxGroupSection> = {
    title: "base/Box/SelectBoxGroupSection",
    component: SelectBoxGroupSection,
    args: {
        active: false,
    },
    parameters: {
        docs: {
            description: {
                component:
                    "Similar to a BoxGroupSection but contains additional styling for handling select functionality. Usually accompanied by a checkbox.",
            },
        },
    },
};

export default meta;

type Story = StoryObj<typeof meta>;

function Template({ children }) {
    const [{ active }, updateArgs] = useArgs();
    return (
        <BoxGroup>
            <SelectBoxGroupSection
                active={active}
                onClick={() => updateArgs({ active: !active })}
            >
                {children}
            </SelectBoxGroupSection>
        </BoxGroup>
    );
}

export const Example: Story = {
    args: {
        children: "This is a SelectBoxGroupSection!",
    },
    render: Template,
};
